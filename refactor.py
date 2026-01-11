import re

file_path = "c:/Users/VBC VISSION/Downloads/brandlift folder copy/brandlift 3/index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Helper to find nth occurrence
def find_nth_occurrence(substring, text, n):
    start = -1
    for i in range(n):
        start = text.find(substring, start + 1)
        if start == -1: return -1
    return start

# --- Handle Styles ---
# Find start of 1st style tag
style1_start = find_nth_occurrence("<style>", content, 1)
style1_end = content.find("</style>", style1_start) + 8

# Find start of 2nd style tag (searching from after first)
style2_start = content.find("<style>", style1_end)
style2_end = content.find("</style>", style2_start) + 8

# We want to replace style1 with the link, and remove style2.
# Construct new content part 1
new_content = content[:style1_start] + '<link rel="stylesheet" href="style.css">'

# Add content between style1 and style2
new_content += content[style1_end:style2_start]

# Skip style2, add content after style2
# Note: Check if style2 exists (it should based on analysis)
if style2_start != -1:
    remainder = content[style2_end:]
else:
    remainder = content[style1_end:]
    print("Warning: 2nd style tag not found")

# --- Handle Scripts ---
# We are working with 'remainder' now, but indices are tricky if we modify.
# Let's reconstruct the process to use regex or careful splitting on the original content? 
# OR just process 'remainder' which starts after the styles.
# BUT script tags are typically BEFORE style tags or interspersed?
# 1st style is at line 14 (head). 2nd is line 775 (body/head boundary?).
# Scripts 1,2,3 are in head, BEFORE style 1. 
# Scripts 4,5,6 are at bottom of body.

# Let's simple use regex for specific signatures to be safe.

# Remove Style Blocks
# Regex for <style>...</style> (dotall)
# We will match them all and handle appropriately.
styles = list(re.finditer(r'<style>.*?</style>', content, re.DOTALL))

if len(styles) >= 2:
    print(f"Found {len(styles)} style blocks. Proceeding to replace 1st and delete 2nd.")
else:
    print(f"Warning: Found {len(styles)} style blocks. Proceeding cautiously.")

# Re-read content to be clean
# Strategy: Build the string from chunks.

# 1. Before Style 1
chunk1 = content[:styles[0].start()]
# 2. Link
chunk_link = '<link rel="stylesheet" href="style.css">'
# 3. Between Style 1 and Style 2
chunk2 = content[styles[0].end():styles[1].start()]
# 4. After Style 2 (Delete Style 2)
chunk_rest = content[styles[1].end():]

combined_html = chunk1 + chunk_link + chunk2 + chunk_rest

# Now handle Scripts in 'combined_html'
# We want to remove the ones that look like our logic scripts.
# Script 4 signature: "lucide.createIcons()" inside.
# Script 6 signature: "Preloader Logic" inside.

# Regex for scripts
script_pattern = r'<script.*?>.*?</script>'
# Find all scripts in current combined_html
scripts = list(re.finditer(script_pattern, combined_html, re.DOTALL))

# Identify which ones to remove based on content
indices_to_remove = []

for match in scripts:
    script_content = match.group(0)
    if "lucide.createIcons()" in script_content and "cdn.tailwindcss.com" not in script_content:
        # This is likely Script 4 or similar logic script
        # Check it's not the CDN link (which doesn't have content inside usually)
        print("Found Logic Script (Lucide init) - Marking for deletion")
        indices_to_remove.append((match.start(), match.end()))
    
    if "Preloader Logic" in script_content:
        print("Found Preloader Script - Marking for deletion")
        indices_to_remove.append((match.start(), match.end()))

# Sort indices descending to delete without shifting
indices_to_remove.sort(key=lambda x: x[0], reverse=True)

final_html = combined_html
for start, end in indices_to_remove:
    final_html = final_html[:start] + final_html[end:]

# Add script.js link before </body>
if "</body>" in final_html:
    final_html = final_html.replace("</body>", '<script src="script.js"></script>\n</body>')
else:
    final_html += '<script src="script.js"></script>'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Refactor complete.")
