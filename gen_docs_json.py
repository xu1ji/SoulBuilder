import os
import json
import re

source_dir = "/Users/xuchu/Documents/我的个人笔记/0. 配置：我的AI团队/"
output_file = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_docs_v3.json"

docs = {}

# Sort files to maintain some order, though the dict keys will be IDs
files = sorted([f for f in os.listdir(source_dir) if f.endswith(".md")])

for filename in files:
    # Use the leading digits as the simplified ID, e.g., "11" from "11. 入门..."
    match = re.match(r"^(\d+)", filename)
    if match:
        doc_id = match.group(1)
    else:
        # Fallback for meta docs like "z. 沟通记录"
        doc_id = filename.split('.')[0]
    
    # Tag mapping based on filename keywords
    tag = "Asset"
    if "画像" in filename: tag = "Persona"
    elif "入门" in filename: tag = "Intro"
    elif "进阶" in filename: tag = "Inter"
    elif "高阶" in filename: tag = "Adv"
    elif "方案" in filename: tag = "Plan"
    elif "实战" in filename: tag = "Action"
    elif "教程" in filename: tag = "Tutorial"
    elif "复盘" in filename or "终极还原" in filename: tag = "Meta"

    filepath = os.path.join(source_dir, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            docs[doc_id] = {
                "id": doc_id,
                "name": filename,
                "tag": tag,
                "content": content
            }
    except Exception as e:
        print(f"Error reading {filename}: {e}")

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(docs, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(docs)} documents in {output_file}")
