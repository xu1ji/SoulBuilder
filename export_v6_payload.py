import sqlite3
import json
import base64

db_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder.db"
json_docs_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_docs_v3.json"
output_payload = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_payload_v6.js"
output_html = "/Users/xuchu/云同步开发项目/SoulBuilder/retrospective_v6.html"

def export_payload():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT log_id, timestamp, user_text, ai_text, status, pops FROM logs ORDER BY id ASC')
    rows = cursor.fetchall()
    
    scenario = []
    for r in rows:
        scenario.append({
            "log": r[0],
            "timestamp": r[1],
            "user": r[2],
            "ai": r[3],
            "status": r[4],
            "pops": r[5].split(",") if r[5] else []
        })
    
    with open(json_docs_path, 'r', encoding='utf-8') as f:
        docs = json.load(f)
        
    asset_groups = { "Meta": [], "Persona": [], "Intro": [], "Inter": [], "Adv": [], "Plan": [], "Action": [], "Tutorial": [], "Asset": [] }
    for doc_id in sorted(docs.keys()):
        doc = docs[doc_id]
        asset_groups[doc["tag"]].append({"id": doc["id"], "name": doc["name"], "tag": doc["tag"]})

    # Generate JS payload
    js_content = f"const SCENARIO_DATA = {json.dumps(scenario, ensure_ascii=False)};\n"
    js_content += f"const DOCS_DATA = {json.dumps(docs, ensure_ascii=False)};\n"
    js_content += f"const GROUPS_DATA = {json.dumps(asset_groups, ensure_ascii=False)};\n"
    
    with open(output_payload, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    conn.close()
    print(f"Payload exported to {output_payload}")

if __name__ == "__main__":
    export_payload()
