import re

with open('components/CategoriesTab.tsx', 'r') as f:
    lines = f.readlines()

# Verwijder de ADMIN_SECRET constante
new_lines = []
skip_next_comma = False
for i, line in enumerate(lines):
    if 'const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET' in line:
        continue  # Skip deze regel
    elif 'headers: {' in line and i+2 < len(lines) and "'x-admin-secret': ADMIN_SECRET" in lines[i+1]:
        # Skip de headers sectie
        # We moeten ook de voorafgaande komma verwijderen
        for j in range(i-1, max(-1, i-5), -1):
            if lines[j].strip().endswith(','):
                lines[j] = lines[j].rstrip().rstrip(',') + '\n'
                break
        # Skip de headers lijnen
        skip_count = 3  # headers: {, 'x-admin-secret': ..., }
        continue
    elif skip_count > 0:
        skip_count -= 1
        continue
    else:
        new_lines.append(line)

with open('components/CategoriesTab.tsx', 'w') as f:
    f.writelines(new_lines)

print('Bestand bijgewerkt')
