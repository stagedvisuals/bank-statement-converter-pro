#!/usr/bin/env python3
"""
Bank Statement Converter Pro - v1.0 Production
Python Flask Edition - Stripe Payments Enabled
By Artur Bagdasarjan
"""

from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for, flash
from datetime import datetime
import os
import io
import stripe
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Stripe Configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_PUBLIC_KEY')

@app.route('/')
def index():
    """Landing page"""
    return render_template('index.html', stripe_key=STRIPE_PUBLIC_KEY)

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """Create Stripe checkout session"""
    try:
        price_id = request.json.get('price_id', 'single')
        
        if price_id == 'single':
            session = stripe.checkout.Session.create(
                payment_method_types=['card', 'ideal'],
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': '5 Conversions Pack',
                            'description': 'Convert 5 bank statements to CSV/Excel',
                        },
                        'unit_amount': 500,  # €5
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=request.host_url + 'success?session_id={CHECKOUT_SESSION_ID}&credits=5',
                cancel_url=request.host_url + 'cancel',
            )
        else:
            # Subscription
            session = stripe.checkout.Session.create(
                payment_method_types=['card', 'ideal'],
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': 'Unlimited Monthly',
                            'description': 'Unlimited conversions per month',
                        },
                        'unit_amount': 2900,  # €29
                        'recurring': {'interval': 'month'},
                    },
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=request.host_url + 'success?session_id={CHECKOUT_SESSION_ID}&subscription=1',
                cancel_url=request.host_url + 'cancel',
            )
        
        return jsonify({'id': session.id, 'url': session.url})
    except Exception as e:
        print(f"Stripe error: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/success')
def success():
    """Payment success page"""
    return render_template('success.html')

@app.route('/cancel')
def cancel():
    """Payment cancelled page"""
    return render_template('cancel.html')

@app.route('/convert', methods=['POST'])
def convert():
    """Handle file conversion"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read and parse file
        content = file.read().decode('utf-8')
        lines = content.strip().split('\n')
        
        # Simple parsing
        transactions = []
        for line in lines:
            parts = line.split('\t')
            if len(parts) >= 3:
                transactions.append({
                    'date': parts[0],
                    'description': parts[1],
                    'amount': parts[2]
                })
        
        if not transactions:
            return jsonify({'error': 'No transactions found'}), 400
        
        # Generate CSV
        output = io.StringIO()
        output.write('Date,Description,Amount\n')
        for t in transactions:
            output.write(f"{t['date']},\"{t['description']}\",{t['amount']}\n")
        
        mem_file = io.BytesIO()
        mem_file.write(output.getvalue().encode('utf-8'))
        mem_file.seek(0)
        
        return send_file(
            mem_file,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'converted_{datetime.now().strftime("%Y%m%d")}.csv'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health')
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'stripe_configured': bool(stripe.api_key)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
