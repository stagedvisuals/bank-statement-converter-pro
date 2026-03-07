with open('components/CategoriesTab.tsx', 'r') as f:
    content = f.read()

# Verwijder de ADMIN_SECRET constante
content = content.replace("const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'BSCPro2025!';\n", '')

# Verwijder de eerste headers sectie
content = content.replace("""      const response = await fetch('/api/admin/corrections', {
        headers: {
          'x-admin-secret': ADMIN_SECRET
        }
      });""", """      const response = await fetch('/api/admin/corrections');""")

# Verwijder de tweede headers sectie
content = content.replace("""      const response = await fetch(`/api/admin/corrections?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': ADMIN_SECRET
        }
      });""", """      const response = await fetch(`/api/admin/corrections?id=${id}`, {
        method: 'DELETE'
      });""")

with open('components/CategoriesTab.tsx', 'w') as f:
    f.write(content)

print('Bestand bijgewerkt')
