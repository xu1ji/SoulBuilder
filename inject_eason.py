import json
import codecs
import re

# 1. Update soulbuilder_docs_v3.json
doc_path = "/Users/xuchu/Documents/我的个人笔记/0. 配置：我的AI团队/28. 画像：Eason（教研专家）.md"
with codecs.open(doc_path, "r", "utf-8") as f:
    content = f.read()

json_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_docs_v3.json"
with codecs.open(json_path, "r", "utf-8") as f:
    docs = json.load(f)

docs["28. 画像：Eason（教研专家）.md"] = {
    "id": "28. 画像：Eason（教研专家）.md",
    "name": "28. 画像：Eason（教研专家）",
    "content": content,
    "tag": "Persona"
}

with codecs.open(json_path, "w", "utf-8") as f:
    json.dump(docs, f, ensure_ascii=False, indent=4)
print("Added Eason to JSON")

# 2. Update fix_and_rebuild_v6.py logs
py_path = '/Users/xuchu/云同步开发项目/SoulBuilder/fix_and_rebuild_v6.py'
with codecs.open(py_path, 'r', 'utf-8') as f:
    py_content = f.read()

new_log = """        {"log": "Log 39 (Hiring: Eason)", "timestamp": "Day 13", "user": "我在配置一个Openclaw的Agent的身份画像，定位是一堂教研总负责人。需要一个系统的角色画像和解读，帮我搜索知识库，给我一个完整的角色清单吧。大致设定：36岁，男生，叫Eason。帮我整理一个顶级教研负责人的身份、角色、思考习惯，原则。重点总结：一堂课程定位、教育审美、做课方法论。参考《创建AI初始画像指南 2.0》和各种资料整理成完整画像。", "ai": "Eason 已经执掌一堂教研顶层架构。‘把创业建成一个学科，让改变发生在每一个学习的瞬间。’已全面内化教育本质三层抽象与磨课萃取工作流，教研引擎全功率运转。", "status": "构建 28. Eason 画像母体...", "pops": ["28. 画像：Eason（教研专家）.md"]},
"""
target = '{"log": "Log 32 (Full Verbatim Commitment)"'

if target in py_content and "Log 39 (Hiring: Eason)" not in py_content:
    py_content = py_content.replace(target, new_log + "        " + target)
    with codecs.open(py_path, 'w', 'utf-8') as f:
        f.write(py_content)
    print("Added Eason to Python script.")

# 3. Update z. 沟通记录备忘.md
md_path = '/Users/xuchu/Documents/我的个人笔记/0. 配置：我的AI团队/z. 沟通记录备忘.md'
with codecs.open(md_path, 'r', 'utf-8') as f:
    md_content = f.read()

eason_md = """
# 配置Eason (教研专家)

我在配置一个Openclaw的Agent的身份画像，定位是一堂教研总负责人。需要一个系统的角色画像和解读，你帮我搜索知识库，给我一个完整的角色清单吧。大致设定：36岁，男生，叫Eason。你帮我整理一个顶级教研负责人的身份、角色、思考习惯，原则。重点总结三个东西：1）一堂课程定位：一堂课程的核心理念，价值观，稀缺性。2）一堂教育审美：什么是教育的本质，什么是优秀顶级的商业课程样子？3）做课方法论：一堂课程怎么做出来的，哪些原则、流程和工具。给我做一个总结吧。以下是通用的画像指南，你可以参考着来写：
# 20. 整体：创建AI初始画像指南 2.0
本指南旨在为 OpenClaw 数字员工的新角色创建提供一套标准化的初始化流程。通过本指南，你可以基于简单的输入，快速生成符合“一堂”审美、专业度和情感价值的员工画像。
... {附加一堂教研规范与参考范例}
"""
if "# 配置Eason (教研专家)" not in md_content:
    md_content = md_content + "\n" + eason_md
    with codecs.open(md_path, 'w', 'utf-8') as f:
        f.write(md_content)
    print("Added Eason to Markdown log.")

