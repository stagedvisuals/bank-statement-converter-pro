import re

with open('components/CategoriesTab.tsx', 'r') as f:
    content = f.read()

# Verwijder de ADMIN_SECRET constante
content = re.sub(r'const ADMIN_SECRET = process\.env\.NEXT_PUBLIC_ADMIN_SECRET \|\| \'BSCPro2025!\';\s*\n', '', content)

# Verwijder headers objecten die ADMIN_SECRET gebruiken
content = re.sub(r",\s*\n\s*headers: {\s*\n\s*'x-admin-secret': ADMIN_SECRET\s*\n\s*}", '', content)

with open('components/CategoriesTab.tsx', 'w') as f:
    f.write(content)

print('Bestand bijgewerkt')
