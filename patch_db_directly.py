import sys
sys.path.append("/Users/xuchu/云同步开发项目/SoulBuilder")
import sqlite3
import json
import codecs

print("1. Loading raw JSON Data...")
with codecs.open('/Users/xuchu/云同步开发项目/SoulBuilder/long_prompts.json', 'r', 'utf-8') as f:
    prompts = json.load(f)

print(f"Loaded Olivia prompt: {len(prompts['olivia_prompt'])} chars")
print(f"Loaded Eason prompt: {len(prompts['eason_prompt'])} chars")

print("2. Connect to SQLite and UPDATE logs directly...")
db_path = '/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Olivia Update
cursor.execute("UPDATE logs SET user_text = ? WHERE log_id LIKE '%Olivia%'", (prompts['olivia_prompt'].strip(),))
# Eason Update
cursor.execute("UPDATE logs SET user_text = ? WHERE log_id LIKE '%Eason%'", (prompts['eason_prompt'].strip(),))

conn.commit()
conn.close()
print("SQLite updated.")

print("3. Regenerating Frontend Payload JS...")
import fix_and_rebuild_v6
fix_and_rebuild_v6.export_all()
print("Payload updated!")

print("4. Patching Documentation Markdown...")
md_path = '/Users/xuchu/Documents/我的个人笔记/0. 配置：我的AI团队/z. 沟通记录备忘.md'
with codecs.open(md_path, 'r', 'utf-8') as f:
    md_content = f.read()

def replace_section(text, start_marker, end_marker, new_content):
    if start_marker in text:
        start_idx = text.find(start_marker)
        if end_marker:
            end_idx = text.find(end_marker, start_idx)
            if end_idx != -1:
                return text[:start_idx] + new_content + text[end_idx:]
        return text[:start_idx] + new_content
    return text

olivia_replacement = "# 配置Olivia (创作专家)\n\n" + prompts['olivia_prompt'].strip() + "\n\n"
md_content = replace_section(md_content, "# 配置Olivia (创作专家)", "# 配置Black", olivia_replacement)

eason_replacement = "# 配置Eason (教研专家)\n\n" + prompts['eason_prompt'].strip() + "\n\n"
md_content = replace_section(md_content, "# 配置Eason (教研专家)", None, eason_replacement)

with codecs.open(md_path, 'w', 'utf-8') as f:
    f.write(md_content)

print("Documentation Patched successfully! Done.")
