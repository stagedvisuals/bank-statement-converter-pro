#!/usr/bin/env python3
"""
Bank Statement Converter Pro
Full SaaS with Auth, Stripe Payments, and User Dashboard
By Artur Bagdasarjan
"""

from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for, flash, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import io
import stripe
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///:memory:')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Stripe setup
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')
STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_PUBLIC_KEY', 'pk_test_placeholder')

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    credits = db.Column(db.Integer, default=0)
    subscription_status = db.Column(db.String(20), default='inactive')
    subscription_id = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    conversions = db.relationship('Conversion', backref='user', lazy=True)
    
    def get_id(self):
        return str(self.id)
    
    @property
    def is_active(self):
        return True
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_anonymous(self):
        return False
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def has_credits(self):
        return self.credits > 0 or self.subscription_status == 'active'

class Conversion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    bank_name = db.Column(db.String(50))
    transaction_count = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    return render_template('index.html', stripe_key=STRIPE_PUBLIC_KEY)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid email or password', 'error')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return redirect(url_for('register'))
        
        user = User(email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        return redirect(url_for('dashboard'))
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    conversions = Conversion.query.filter_by(user_id=current_user.id).order_by(Conversion.created_at.desc()).all()
    return render_template('dashboard.html', user=current_user, conversions=conversions)

@app.route('/convert', methods=['POST'])
@login_required
def convert():
    if not current_user.has_credits():
        return jsonify({'error': 'No credits available. Please purchase more.'}), 403
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        content = file.read().decode('utf-8')
        
        # Simple parsing (would be expanded in production)
        lines = content.strip().split('\n')
        transactions = []
        for line in lines:
            if line.strip() and not line.startswith('Datum'):
                parts = line.split('\t')
                if len(parts) >= 3:
                    transactions.append({
                        'date': parts[0],
                        'description': parts[1],
                        'amount': parts[2]
                    })
        
        if not transactions:
            return jsonify({'error': 'No transactions found'}), 400
        
        # Deduct credit
        if current_user.subscription_status != 'active':
            current_user.credits -= 1
            db.session.commit()
        
        # Log conversion
        conversion = Conversion(
            user_id=current_user.id,
            filename=file.filename,
            transaction_count=len(transactions)
        )
        db.session.add(conversion)
        db.session.commit()
        
        # Generate CSV
        output = io.StringIO()
        output.write('Date,Description,Amount\n')
        for t in transactions:
            output.write(f"{t['date']},{t['description']},{t['amount']}\n")
        
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

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        price_id = request.json.get('price_id', 'single')
        
        # Create or get user
        if current_user.is_authenticated:
            customer_email = current_user.email
        else:
            customer_email = None
        
        if price_id == 'single':
            session = stripe.checkout.Session.create(
                payment_method_types=['card', 'ideal'],
                customer_email=customer_email,
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': '5 Conversions Pack',
                            'description': 'Convert 5 bank statements',
                        },
                        'unit_amount': 500,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=request.host_url + 'success?session_id={CHECKOUT_SESSION_ID}&credits=5',
                cancel_url=request.host_url + 'cancel',
            )
        else:
            session = stripe.checkout.Session.create(
                payment_method_types=['card', 'ideal'],
                customer_email=customer_email,
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': 'Unlimited Monthly',
                            'description': 'Unlimited conversions per month',
                        },
                        'unit_amount': 2900,
                        'recurring': {'interval': 'month'},
                    },
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=request.host_url + 'success?session_id={CHECKOUT_SESSION_ID}&subscription=1',
                cancel_url=request.host_url + 'cancel',
            )
        
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/success')
def success():
    session_id = request.args.get('session_id')
    credits = request.args.get('credits')
    subscription = request.args.get('subscription')
    
    if current_user.is_authenticated:
        if credits:
            current_user.credits += int(credits)
        if subscription:
            current_user.subscription_status = 'active'
        db.session.commit()
    
    return render_template('success.html')

@app.route('/cancel')
def cancel():
    return render_template('cancel.html')

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ.get('STRIPE_WEBHOOK_SECRET', '')
        )
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Handle successful payment
            pass
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    return jsonify({'status': 'success'})

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0'
    })

# Create database tables
with app.app_context():
    try:
        db.create_all()
    except:
        pass  # Database might already exist or use in-memory for serverless

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
