#!/usr/bin/env python3
"""
SaaS Factory - Bank Statement Converter
Micro-SaaS tool for converting PDF bank statements to CSV/Excel
"""

import os
import re
import csv
import io
from datetime import datetime
from typing import List, Dict, Optional
import json

class BankStatementConverter:
    """Convert PDF bank statements to structured formats"""
    
    def __init__(self):
        self.transactions = []
        self.bank_patterns = {
            'ing': {
                'date_pattern': r'(\d{2}-\d{2}-\d{4})',
                'amount_pattern': r'([\d.,]+)\s*([+-])',
                'description_pattern': r'\d{2}-\d{2}\s+(.+?)\s+\d',
            },
            'rabobank': {
                'date_pattern': r'(\d{4}-\d{2}-\d{2})',
                'amount_pattern': r'([\d.,]+)',
                'description_pattern': r'\d{4}-\d{2}-\d{2}\s+(.+?)\s+EUR',
            },
            'abn': {
                'date_pattern': r'(\d{2}-\d{2}-\d{4})',
                'amount_pattern': r'([\d.,]+)',
                'description_pattern': r'\d{2}-\d{2}-\d{4}\s+(.+?)\s+\d',
            }
        }
    
    def detect_bank(self, text: str) -> str:
        """Detect which bank the statement is from"""
        text_lower = text.lower()
        
        if 'ing bank' in text_lower or 'ing.nl' in text_lower:
            return 'ing'
        elif 'rabobank' in text_lower:
            return 'rabobank'
        elif 'abn amro' in text_lower:
            return 'abn'
        elif 'bunq' in text_lower:
            return 'bunq'
        else:
            return 'generic'
    
    def parse_transaction(self, line: str, bank_type: str) -> Optional[Dict]:
        """Parse a single transaction line"""
        patterns = self.bank_patterns.get(bank_type, self.bank_patterns['ing'])
        
        # Try to extract date
        date_match = re.search(patterns['date_pattern'], line)
        if not date_match:
            return None
        
        date_str = date_match.group(1)
        
        # Try to extract amount
        amount_match = re.search(patterns['amount_pattern'], line)
        if not amount_match:
            return None
        
        amount_str = amount_match.group(1).replace('.', '').replace(',', '.')
        try:
            amount = float(amount_str)
        except ValueError:
            amount = 0.0
        
        # Try to extract description
        desc_match = re.search(patterns['description_pattern'], line)
        description = desc_match.group(1).strip() if desc_match else 'Unknown'
        
        # Determine if it's income or expense
        transaction_type = 'expense'
        if '+' in line or 'credit' in line.lower() or amount < 0:
            transaction_type = 'income'
            amount = abs(amount)
        
        return {
            'date': date_str,
            'description': description,
            'amount': amount,
            'type': transaction_type,
            'raw_line': line.strip()
        }
    
    def convert_text(self, text: str) -> List[Dict]:
        """Convert raw text to transactions"""
        bank_type = self.detect_bank(text)
        transactions = []
        
        for line in text.split('\n'):
            transaction = self.parse_transaction(line, bank_type)
            if transaction:
                transactions.append(transaction)
        
        self.transactions = transactions
        return transactions
    
    def to_csv(self, transactions: List[Dict] = None) -> str:
        """Convert transactions to CSV format"""
        if transactions is None:
            transactions = self.transactions
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Date', 'Description', 'Amount', 'Type'])
        
        # Write transactions
        for t in transactions:
            writer.writerow([
                t['date'],
                t['description'],
                f"{t['amount']:.2f}",
                t['type']
            ])
        
        return output.getvalue()
    
    def to_json(self, transactions: List[Dict] = None) -> str:
        """Convert transactions to JSON format"""
        if transactions is None:
            transactions = self.transactions
        
        return json.dumps({
            'converted_at': datetime.now().isoformat(),
            'transaction_count': len(transactions),
            'transactions': transactions
        }, indent=2)
    
    def get_summary(self) -> Dict:
        """Get summary statistics"""
        if not self.transactions:
            return {}
        
        total_income = sum(t['amount'] for t in self.transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in self.transactions if t['type'] == 'expense')
        
        return {
            'total_transactions': len(self.transactions),
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_balance': total_income - total_expenses,
            'date_range': {
                'first': self.transactions[0]['date'] if self.transactions else None,
                'last': self.transactions[-1]['date'] if self.transactions else None
            }
        }

# Simple test
def demo():
    """Demo the converter with sample data"""
    sample_text = """
    ING Bank Statement - January 2025
    
    01-01-2025  Salary Payment      +2,500.00
    02-01-2025  Grocery Store       -85.50
    03-01-2025  Gas Station         -65.00
    05-01-2025  Netflix Subscription  -15.99
    10-01-2025  Freelance Payment   +850.00
    15-01-2025  Restaurant          -45.00
    """
    
    converter = BankStatementConverter()
    transactions = converter.convert_text(sample_text)
    
    print(f"Found {len(transactions)} transactions")
    print("\nSummary:")
    summary = converter.get_summary()
    for key, value in summary.items():
        print(f"  {key}: {value}")
    
    print("\nCSV Output:")
    print(converter.to_csv())

if __name__ == '__main__':
    demo()
