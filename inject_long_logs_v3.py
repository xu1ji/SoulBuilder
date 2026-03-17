import codecs
import json
import os

with codecs.open('/Users/xuchu/云同步开发项目/SoulBuilder/long_prompts.json', 'r', 'utf-8') as f:
    prompts = json.load(f)

eason_long = prompts['eason_prompt']
olivia_long = prompts['olivia_prompt']

py_path = '/Users/xuchu/云同步开发项目/SoulBuilder/fix_and_rebuild_v6.py'
md_path = '/Users/xuchu/Documents/我的个人笔记/0. 配置：我的AI团队/z. 沟通记录备忘.md'

with codecs.open(py_path, 'r', 'utf-8') as f:
    py_content = f.read()

new_olivia_ai = "Olivia 已执掌网感主权。‘把深刻的体系，翻译成性感的常识。’我将统摄十指讲香与ABACC框架，乃至上万字的内部参考语料，让一堂的严肃课程在公域平台掀起流量狂潮。"
new_eason_ai = "Eason 已经执掌一堂教研顶层架构。‘把创业建成一个学科，让改变发生在每一个学习的瞬间。’已全面内化3000余字的教育本质三层抽象与磨课萃取工作流，教研引擎全功率运转。"

olivia_log = {
    "log": "Log 26 (Hiring: Olivia)", 
    "timestamp": "Day 8", 
    "user": olivia_long.strip(), 
    "ai": new_olivia_ai, 
    "status": "构建 22. Olivia 画像母体...", 
    "pops": ["22. 画像：Olivia（创作专家）.md"]
}
eason_log = {
    "log": "Log 39 (Hiring: Eason)", 
    "timestamp": "Day 13", 
    "user": eason_long.strip(), 
    "ai": new_eason_ai, 
    "status": "构建 28. Eason 画像母体...", 
    "pops": ["28. 画像：Eason（教研专家）.md"]
}

lines_py = py_content.split('\n')
for i, line in enumerate(lines_py):
    if '"log": "Log 26 (Hiring: Olivia)"' in line:
        lines_py[i] = "        " + json.dumps(olivia_log, ensure_ascii=False) + ","
    elif '"log": "Log 39 (Hiring: Eason)"' in line:
        lines_py[i] = "        " + json.dumps(eason_log, ensure_ascii=False) + ","

with codecs.open(py_path, 'w', 'utf-8') as f:
    f.write('\n'.join(lines_py))

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

olivia_replacement = "# 配置Olivia (创作专家)\n\n" + olivia_long.strip() + "\n\n"
new_md_content = replace_section(md_content, "# 配置Olivia (创作专家)", "# 配置Black", olivia_replacement)

eason_replacement = "# 配置Eason (教研专家)\n\n" + eason_long.strip() + "\n\n"
new_md_content = replace_section(new_md_content, "# 配置Eason (教研专家)", None, eason_replacement)

with codecs.open(md_path, 'w', 'utf-8') as f:
    f.write(new_md_content)

print('done')
