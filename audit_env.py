#!/usr/bin/env python3
"""
Environment Variable Audit Script
Checks for hidden characters in Stripe keys
"""

import os

def audit_env_var(name):
    """Audit an environment variable for hidden characters"""
    value = os.environ.get(name)
    
    if not value:
        print(f"\n❌ {name}: NOT SET")
        return
    
    print(f"\n🔍 Auditing: {name}")
    print(f"   Type: {type(value)}")
    print(f"   Length: {len(value)}")
    print(f"   Starts with: {repr(value[:20])}")
    print(f"   Ends with: {repr(value[-20:])}")
    
    # Check for problematic characters
    issues = []
    if '\n' in value:
        issues.append("Contains newline (\\n)")
    if '\r' in value:
        issues.append("Contains carriage return (\\r)")
    if ' ' in value:
        issues.append("Contains spaces")
    if value.startswith("b'") or value.startswith('b"'):
        issues.append("Contains bytes prefix (b'...')")
    if "'" in value:
        issues.append("Contains single quotes")
    
    if issues:
        print(f"   ⚠️  Issues found:")
        for issue in issues:
            print(f"      - {issue}")
        
        # Clean version
        clean = str(value).strip().replace('\n', '').replace('\r', '').replace(' ', '').replace("b'", "").replace("'", "")
        print(f"\n   ✅ Cleaned value: {repr(clean[:30])}...")
        print(f"   Cleaned length: {len(clean)}")
    else:
        print(f"   ✅ No issues found")

# Audit Stripe keys
print("=" * 60)
print("STRIPE ENVIRONMENT VARIABLE AUDIT")
print("=" * 60)

audit_env_var('STRIPE_SECRET_KEY')
audit_env_var('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
audit_env_var('STRIPE_PUBLISHABLE_KEY')

print("\n" + "=" * 60)
print("CLEANED VALUES FOR VERCEL:")
print("=" * 60)

for var_name in ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_PUBLISHABLE_KEY']:
    value = os.environ.get(var_name)
    if value:
        clean = str(value).strip().replace('\n', '').replace('\r', '').replace(' ', '').replace("b'", "").replace("'", "")
        print(f"\n{var_name}:")
        print(f"  {clean}")
