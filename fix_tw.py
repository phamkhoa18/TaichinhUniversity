"""
Revert: Remove @import tailwindcss and @layer base wrapper from globals.css
"""
content = open('app/globals.css', encoding='utf-8', errors='replace').read()

# Remove @import "tailwindcss";
content = content.replace('@import "tailwindcss";\r\n\r\n', '')
content = content.replace('@import "tailwindcss";\n\n', '')
content = content.replace('@import "tailwindcss";\n', '')

# Remove @layer base { wrapper (first occurrence)
content = content.replace('@layer base {\r\n', '', 1)
content = content.replace('@layer base {\n', '', 1)

# Remove closing } at the very end
if content.rstrip().endswith('}'):
    # Find the last } and remove it
    idx = content.rstrip().rfind('}')
    content = content[:idx] + content[idx+1:]

open('app/globals.css', 'w', encoding='utf-8').write(content)

# Verify
c = open('app/globals.css', encoding='utf-8', errors='replace').read()
print(f"Lines: {len(c.splitlines())}")
print(f"Has tailwindcss import: {'tailwindcss' in c}")
print(f"Has @layer base: {'@layer base' in c}")
print(f"Has :root: {':root' in c}")
print(f"Has .header-container: {'.header-container' in c}")
