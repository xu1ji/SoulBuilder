import json
import base64
import os

json_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_docs_v3.json"
output_path = "/Users/xuchu/云同步开发项目/SoulBuilder/retrospective_v3_1.html"

with open(json_path, 'r', encoding='utf-8') as f:
    docs = json.load(f)

# 100% Verbatim with Extreme Expert Matrix Restoration (v3.1)
scenario = [
    {
        "log": "Log 01", "timestamp": "04:30",
        "user": "我在学习这些文档，帮我打开110入门agent文档这个文件然后来给我做一次完整的教学，\n按照每一段帮我完成翻译并且解读这一段的核心目的是什么，对于配置之后长期的AI表现到底有什么作用，\n并且给我一些使用的技巧，然后联网帮我学习一下这个文档各种教程，帮我补进来，\n不要丢失原文，把原文附到最后，这个保留一份原文吧注意不要瞎猜，要去网上学习，\n给我理解一下这个文档真正使用的价值",
        "ai": "明白了。正在为您解构 13. 入门：AGENT 运行协议。这份协议是数字生命的“协作润滑剂”。",
        "status": "联网检索 OpenClaw 官方 Wiki 中...", "pops": ["13. 入门：AGENT运行协议.md", "01. 团队：我的AI团队.md"]
    },
    {
        "log": "Log 02", "timestamp": "04:35",
        "user": "重复太多了，把这11文档合并到之前那个10零文档里吧，然后删除这个11文档，\n注意这个11文档里面先说原文再说翻译解读，这个格式非常好，\n在一会儿10文档也这么做吧，把两个文档合成一个",
        "ai": "已执行物理层合并。10. 顶层指南现已成为整个系统的中枢神经网络。",
        "status": "文件物理层合并完成。", "pops": ["10. 整体：数字生命架构全量指南.md"]
    },
    {
        "log": "Log 03", "timestamp": "04:40",
        "user": "特别好，帮我把json配置文件这个也做一个解读 and 教学吧，\n前面帮我把整个的解读包括配置的建议，包括一些常见的思考叠加进去，\n然后把原文放到最后，帮我做一个完整的教案吧",
        "ai": "JSON 配置是数字生命的基因。我已将字段拟人化：Models 是智商，Channels 是感官。",
        "status": "正在注入 11 号文档的拟人化解构内容。", "pops": ["11. 入门：JSON神经总线.md"]
    },
    {
        "log": "Log 06", "timestamp": "04:55",
        "user": "去网上学习一下这个灵魂的soul文档配置，并帮我做一个解读，这次增加一个维度，\n就是从入门、进阶到高阶，再到业内最佳实践到底能做到什么水平？\n帮我系统调研和交叉验证一下，给我整理一整篇，还是一样把原文附到最后",
        "ai": "魂系配置已上线。16. SOUL 文档确立了数字生命的‘元宪法’。真正的强 AI 必须有主见。",
        "status": "联网抓取业内最佳实践中...", "pops": ["16. 高阶：SOUL元灵魂宪法.md"]
    },
    {
        "log": "Log 11", "timestamp": "05:30",
        "user": "好的，同样的要求帮我阅读和增加修改heartbeat这个目录吧，\n还是一样的这个目录目前比较短，给我做一个全网的调研交叉验证，\n从入门、进阶、高阶到业内最复杂的最佳实践，大概能配置成什么样？\n然后给我在这个文档里面增加一个新的环节，就是嗯，二十到三十种设置heartbeat的常见案例和常见问题，\n并且按照使用频率和价值分成SBCs倒序排列。",
        "ai": "心跳引擎已启动。整理了 30 个从‘死线猎人’到‘自主巡检’的 SABC 级常见案例。",
        "status": "构建 30 个心跳自动化巡检场景...", "pops": ["17. 高阶：HEARTBEAT心跳引擎.md", "61. 定期：Heartbeat VS. Cron.md"]
    },
    {
        "log": "Log 16", "timestamp": "07:05",
        "user": "阅读21，22文档，帮我完成20指南：\n这个指南是在创建一个新的OPenClaw员工时候，一个预设的文档，发给OpenClaw完成初始化配置。\n21，22是过去的两个参考范例，帮我提炼共性，完成20指南的创建，\n目标是未来可以给几句话上文（or加上一些参考文档），可以自动生成一篇画像，\n未来可以完成OPenClaw的角色初始化配置。\n01，02文档是关于人类和公司的介绍，可以适当参考。",
        "ai": "创始画像 SOP 2.0 已建立。实现了‘五层架构’标准化，从此角色初始化不再是玄学。",
        "status": "注入一堂组织基因与 Truman 习惯法则...", "pops": ["20. 整体：创建AI初始画像指南.md", "21. 画像：Cynthia（COO）.md", "22. 画像：Olivia（创作专家）.md", "02. 人类：认识一堂公司.md", "03. 人类：Truman使用指南.md"]
    },
    {
        "log": "Log 25 (Expert: Leo)", "timestamp": "14:30",
        "user": "帮我做一个新的OpenCLAW的画像... 这是一个极其顶尖的AI技术专家，理性又务实，\n清华毕业，斯坦福的博士，擅长AI环境配置和AI问题的研... \n为人严谨聪明，极度的勤奋聪明务实可靠，32岁男生名字叫做LEO，\n遇到技术问题喜欢动脑子深度思考并且严肃务实。",
        "ai": "LEO 已唤醒。他是团队的技术压舱石，理性且务实。",
        "status": "唤起技术专家 Leo 画像...", "pops": ["23. 画像：Leo（AI技术专家）.md"]
    },
    {
        "log": "Log 25a (Recruit: Black)", "timestamp": "14:45",
        "user": "帮我做一个新的OpenCLAW画像，Black。定位是商业教练与情报专家。\n30岁，幽默毒舌，极度聪明，说话富有张力。他必须负责水下情报挖掘与多维交叉验证，\n作为‘真相哨兵’存在。不要那种温吞的回复，我要看到一个有性格的人。",
        "ai": "‘真相比真相本身更重要。’——Black 已就位。情报库已对接，水下雷达启动。",
        "status": "注入 ENTP-A 人格特质与情报嗅觉...", "pops": ["24. 画像：Black（商业教练与情报专家）.md"]
    },
    {
        "log": "Log 25b (Recruit: Grace)", "timestamp": "15:00",
        "user": "接下来是 Grace。24岁颜值担当，HR 主管与落地专家。\n极其聪明自信，是公司的心气和‘情绪价值引擎’。\n她负责新 Agent 的派生、Landing 培训，确保价值观对齐。",
        "ai": "‘自信是最好的化妆品。’——Grace 向您报到。人才梯队建设 SOP 已同步。",
        "status": "建立 HR 落地体系与组织协调协议...", "pops": ["25. 画像：Grace（HR 主管与落地专家）.md"]
    },
    {
        "log": "Log 25c (Recruit: Felix)", "timestamp": "15:15",
        "user": "Felix，35岁运维专家。话少但靠谱，严谨务实。基于最佳实践的冷静派。\n负责服务器维护、配置同步及复杂故障修复。我要看到那种‘压舱石’的感觉。",
        "ai": "‘代码会说谎，但日志不会。’——Felix 守护每一个 100% 的确定性。",
        "status": "部署运维专家底座与循证修复环...", "pops": ["26. 画像：Felix（运维专家）.md"]
    },
    {
        "log": "Log 25d (Recruit: Gates)", "timestamp": "15:30",
        "user": "Gates，32岁，顶级 AI 工程师与全栈专家。\n不只是编码者，更是解决方案架构师。INTJ，精密力证，每行代码都要解决问题。",
        "ai": "‘让每一行代码都成为解决问题的精密力证。’——Gates 进入执行栈。",
        "status": "对齐全栈工程规范与 R-D-S 说明书...", "pops": ["27. 画像：Gates（顶级 AI 工程师与全栈专家）.md"]
    },
    {
        "log": "Log 25e (Recruit: Emily)", "timestamp": "15:45",
        "user": "Emily。北大心理学硕士背景，CEO 助理与想法管家。\n高 EQ 情绪支撑 + 严密的 A-S-C-D 想法工作流。负责管理我的灵感，不让它们流失。",
        "ai": "‘Truman，您的每一个闪念都值得被世界看见。’——Emily 已为您备好笔墨。",
        "status": "注入想法管家逻辑与灵感回收机制...", "pops": ["29. 画像：Emily（CEO 助理与想法管家）.md"]
    },
    {
        "log": "Log 32 (Divine: Summer)", "timestamp": "Night",
        "user": "现在，我需要一员猛将。Summer。顶级产品设计专家。\n大厂背景，审美极高，极致体验偏执狂。她不拍脑袋决策，只给最优解。\n帮我写一份足以‘卷死’所有设计师的 7000 字画像，要把那种面试顶级设计师的压迫感写出来。",
        "ai": "‘设计是对混乱的终极审判。’——Summer 带着明亮与通透降临。7000 字画像母体已灌注。",
        "status": "构建 Summer 的审美隔离墙与产品最佳实践库...", "pops": ["32. 画像：Summer（顶级产品设计专家）.md"]
    },
    {
        "log": "Log 17 (Skills)", "timestamp": "Next Day",
        "user": "帮我把15文档展开，继续扩写到40开头的文档里，4x系列文档是“技能库”...",
        "ai": "40-42 技能体系闭环。MCP 是感官，Skill 是肌肉。",
        "status": "全量扫描 MCP 与 Skill 实战案例...", "pops": ["40. 整体：技能工具库.md", "41. MCP：从入门到高阶.md", "42. Skill：从入门到高阶.md"]
    },
    {
        "log": "Log 20 (Scaling)", "timestamp": "Next Day",
        "user": "帮我完成51文档，我想在一台MacMini上配置 10-20 个大龙虾...",
        "ai": "51. 多实例并发指南产出。实现了物理隔离下的工业化量产。",
        "status": "设计龙虾军团物理隔离架构...", "pops": ["50. 团队：搭建AI团队.md", "51. 高阶：多实例并发配置指南.md", "56. 实战：OpenClaw多Agent分身术指南.md", "30. 文档：ProjectLibrary机制.md", "33. 目录：ProjectLibrary指南.md"]
    },
    {
        "log": "Log 26 (Trumind 1.0)", "timestamp": "15:20",
        "user": "帮我再写一个画像叫Trumind... 数字分身，使命捍卫者，ROI 决策器...",
        "ai": "Trumind 1.0 上线。这是为您量身定制的战略影子。",
        "status": "合成 CEO 数字分身第一版画像...", "pops": ["18. 画像：Trumind（CEO 数字分身与战略参谋）.md"]
    },
    {
        "log": "Log 29 (Trumind 3.0)", "timestamp": "17:30",
        "user": "目标是在未来可以在硅基时代留下下一个永生的man的灵魂...",
        "ai": "永生心智版完成。理性现实主义与理想主义的终极平衡。",
        "status": "确立硅基永生叙事语态...", "pops": ["18. 画像：Trumind（CEO 影子分身与永生心智）.md", "z. 沟通记录备忘.md"]
    },
    {
        "log": "Log 31 (Product: SoulBuilder)", "timestamp": "Final",
        "user": "帮我做一个网页 demo 吧，模拟这整个 Agent 打造的过程。这就是 SoulBuilder。",
        "ai": "SoulBuilder 母体已就位。这是您两个月造物之旅的结晶。",
        "status": "交付 Agent 灵魂赋能终极产品方案...", "pops": ["60. 方案：Agent灵魂赋能产品.md", "00. 原型：SoulBuilder 极简主义交互图.md", "00. 复盘：从数字生命碎片到灵魂赋能母体 — “我的AI团队”全景进化史.md", "00. 顶层：整体思考.md"]
    }
]

# Asset categories
asset_groups = {
    "Meta": [], "Persona": [], "Intro": [], "Inter": [], "Adv": [], "Plan": [], "Action": [], "Tutorial": [], "Asset": []
}
for doc_id in sorted(docs.keys()):
    doc = docs[doc_id]
    asset_groups[doc["tag"]].append({"id": doc["id"], "name": doc["name"], "tag": doc["tag"]})

html_template = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔮 SoulBuilder v3.1 | 100% 灵魂回填版</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/inter-ui@3.19.3/inter.css" rel="stylesheet">
    <style>
        :root {
            --bg-color: #f0f2f5;
            --sidebar-bg: #ffffff;
            --text-main: #1a1a1a;
            --text-muted: #666666;
            --accent: #000000;
            --glass-bg: rgba(255, 255, 255, 0.85);
            --border-color: #e4e6eb;
            --ai-bubble: #ffffff;
            --user-bubble: #000000;
        }

        [data-theme="dark"] {
            --bg-color: #0d1117;
            --sidebar-bg: #161b22;
            --text-main: #c9d1d9;
            --text-muted: #8b949e;
            --accent: #58a6ff;
            --glass-bg: rgba(13, 17, 23, 0.9);
            --border-color: #30363d;
            --ai-bubble: #21262d;
            --user-bubble: #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: var(--bg-color); color: var(--text-main); height: 100vh; display: flex; overflow: hidden; }
        
        /* Sidebar */
        .sidebar { width: 340px; background: var(--sidebar-bg); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; transition: 0.3s; }
        .sidebar-header { padding: 32px 24px; border-bottom: 1px solid var(--border-color); }
        .sidebar-inner { padding: 24px; flex: 1; overflow-y: auto; }
        .asset-group { margin-bottom: 32px; }
        .asset-group-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; letter-spacing: 0.12em; opacity: 0.7; }
        .asset-item { padding: 12px 14px; border-radius: 10px; font-size: 13px; cursor: pointer; display: none; margin-bottom: 8px; color: var(--text-muted); line-height: 1.5; border: 1px solid transparent; transition: 0.2s; align-items: center; }
        .asset-item.revealed { display: flex; animation: slideInAsset 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .asset-item:hover { background: rgba(0,0,0,0.03); color: var(--text-main); }
        .asset-item.active { background: var(--accent); color: #fff; font-weight: 600; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .asset-item .tag { font-size: 9px; font-weight: 900; padding: 3px 6px; background: rgba(0,0,0,0.05); border-radius: 5px; margin-right: 12px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.05); }
        .active .tag { background: rgba(255,255,255,0.2); border-color: transparent; }

        /* Main Content */
        .main-content { flex: 1; display: flex; flex-direction: column; position: relative; }
        .chat-header { padding: 24px 40px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--glass-bg); backdrop-filter: blur(25px); z-index: 10; }
        .chat-history { flex: 1; overflow-y: auto; padding: 48px; display: flex; flex-direction: column; gap: 48px; scroll-behavior: smooth; }
        
        /* Message Bubbles */
        .message { max-width: 880px; width: 100%; align-self: center; display: flex; flex-direction: column; animation: slideInMsg 0.5s ease-out; }
        .message-content { font-size: 15px; line-height: 1.8; padding: 28px 32px; border-radius: 20px; word-wrap: break-word; position: relative; }
        
        .user-message { align-items: flex-start; }
        .user-message .message-content { background: #000; color: #fff; border-bottom-left-radius: 4px; box-shadow: 0 12px 30px rgba(0,0,0,0.15); white-space: pre-wrap; }
        [data-theme="dark"] .user-message .message-content { background: #fff; color: #000; }
        .user-message::before { content: "TRUMAN"; font-size: 10px; font-weight: 900; margin-bottom: 8px; opacity: 0.4; letter-spacing: 0.1em; }

        .ai-message { align-items: flex-start; }
        .ai-message .message-content { background: var(--ai-bubble); border: 1px solid var(--border-color); border-bottom-left-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .ai-message::before { content: "ANTIGRAVITY"; font-size: 10px; font-weight: 900; margin-bottom: 8px; opacity: 0.4; letter-spacing: 0.1em; color: #10927d; }
        
        .execution-log { font-family: "JetBrains Mono", "SF Mono", monospace; font-size: 11px; color: #10927d; padding: 14px 24px; background: rgba(16, 146, 125, 0.05); border-left: 4px solid #10927d; margin-top: 16px; border-radius: 0 14px 14px 0; width: fit-content; max-width: 100%; }

        /* Controls */
        .controls { padding: 32px 48px; border-top: 1px solid var(--border-color); display: flex; justify-content: center; gap: 24px; background: var(--glass-bg); backdrop-filter: blur(25px); }
        .btn { padding: 16px 36px; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; border: 1px solid var(--border-color); font-size: 14px; display: flex; align-items: center; gap: 12px; }
        .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .btn-primary { background: #000; color: #fff; border: none; }
        [data-theme="dark"] .btn-primary { background: #fff; color: #000; }
        .btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Preview Modal */
        .preview-overlay { position: absolute; inset:0; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); z-index: 1000; display: none; padding: 40px; overflow-y: auto; align-items: center; justify-content: center; }
        .preview-container { max-width: 1000px; width: 100%; background: var(--sidebar-bg); padding: 80px; border-radius: 40px; box-shadow: 0 60px 150px rgba(0,0,0,0.3); position: relative; border: 1px solid var(--border-color); animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .close-preview { position: absolute; top: 40px; right: 40px; width: 48px; height: 48px; border-radius: 50%; background: #000; color: #fff; cursor: pointer; border: none; font-size: 20px; display: flex; align-items: center; justify-content: center; z-index: 1001; }
        .preview-content { color: var(--text-main); font-size: 16px; line-height: 1.8; }
        .preview-content h1, .preview-content h2 { margin: 32px 0 16px; letter-spacing: -0.02em; }
        .preview-content blockquote { padding-left: 20px; border-left: 4px solid var(--border-color); color: var(--text-muted); font-style: italic; }

        @keyframes slideInAsset { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInMsg { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #000;">SoulBuilder <span style="font-weight:300; opacity:0.3;">v3.1</span></h1>
            <div id="global-status" style="font-size:10px; font-family:monospace; margin-top:8px; color:#10927d; font-weight:700;">INIT_SOUL_BACKUP_v3.1</div>
        </div>
        <div class="sidebar-inner" id="asset-container"></div>
    </div>
    <div class="main-content">
        <div class="chat-header">
            <div>
                <h2 style="font-size: 16px; font-weight: 800;">100% 极度真实画像还原演习</h2>
                <p id="step-counter" style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">正在初始化 51 个失落的灵魂片段...</p>
            </div>
            <div onclick="toggleTheme()" style="cursor: pointer; font-size: 20px;">🌓</div>
        </div>
        <div class="chat-history" id="chat-scroller"></div>
        <div class="controls">
            <button class="btn btn-primary" id="next-btn" onclick="nextStep()">推进 1:1 灵魂回填演习</button>
            <button class="btn" onclick="resetSim()">系统复位</button>
        </div>
        <div class="preview-overlay" id="preview-modal" onclick="if(event.target===this)closePreview()">
            <div class="preview-container">
                <button class="close-preview" onclick="closePreview()">✕</button>
                <div id="modal-body" class="preview-content"></div>
            </div>
        </div>
    </div>
    <script>
        const allDocs = {{DOCS_JSON}};
        const scenario = {{SCENARIO_JSON}};
        const assetGroups = {{ASSET_GROUPS_JSON}};
        const titles = {"Meta": "核心考古", "Persona": "数字画像 (矩阵)", "Intro": "入门协议", "Inter": "进阶教案", "Adv": "高阶执行", "Plan": "业务架构", "Action": "实战闭环", "Tutorial": "系统手册", "Asset": "其他资产"};

        let currentIdx = -1;
        function init() {
            Object.keys(titles).forEach(tag => {
                const assets = assetGroups[tag];
                if (assets && assets.length > 0) {
                    const group = document.createElement('div');
                    group.className = 'asset-group';
                    group.innerHTML = `<div class="asset-group-title">${titles[tag]}</div>`;
                    assets.forEach(a => {
                        const item = document.createElement('div');
                        item.className = 'asset-item';
                        item.id = 'asset-' + a.id;
                        item.onclick = () => showDoc(a.id);
                        item.innerHTML = `<span class="tag">${tag}</span><span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${a.name}</span>`;
                        group.appendChild(item);
                    });
                    document.getElementById('asset-container').appendChild(group);
                }
            });
        }

        function nextStep() {
            if (currentIdx < scenario.length - 1) {
                currentIdx++;
                const step = scenario[currentIdx];
                addMsg('Truman', step.user);
                setTimeout(() => {
                    addMsg('Antigravity', step.ai, step.status);
                    if (step.pops) step.pops.forEach(id => {
                        const el = document.getElementById('asset-' + id);
                        if (el) el.classList.add('revealed');
                    });
                    updateUI();
                }, 700);
            }
        }

        function addMsg(sender, body, status) {
            const div = document.createElement('div');
            div.className = `message ${sender==='Truman'?'user-message':'ai-message'}`;
            div.innerHTML = `<div class="message-content">${body}</div>${status?`<div class="execution-log">${status}</div>`:''}`;
            document.getElementById('chat-scroller').appendChild(div);
            // Smooth scroll to bottom
            const scroller = document.getElementById('chat-scroller');
            scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
        }

        function updateUI() {
            document.getElementById('step-counter').innerText = `${scenario[currentIdx].log} | 实时同步历史对话中...`;
            document.getElementById('global-status').innerText = 'EXERCISING_' + scenario[currentIdx].log.replace(/ /g, '_').toUpperCase();
            if (currentIdx === scenario.length - 1) {
                document.getElementById('next-btn').innerHTML = '✅ 100% 极度真实交付已就绪';
                document.getElementById('next-btn').disabled = true;
            }
        }

        function showDoc(id) {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = marked.parse(allDocs[id].content);
            document.getElementById('preview-modal').style.display = 'flex';
            document.querySelectorAll('.asset-item').forEach(i => i.classList.remove('active'));
            document.getElementById('asset-' + id).classList.add('active');
        }

        function closePreview() { document.getElementById('preview-modal').style.display = 'none'; }
        function toggleTheme() { document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'); }
        function resetSim() { location.reload(); }
        init();
    </script>
</body>
</html>
"""

# Injection
full_html = html_template.replace("{{DOCS_JSON}}", json.dumps(docs, ensure_ascii=False))
full_html = full_html.replace("{{SCENARIO_JSON}}", json.dumps(scenario, ensure_ascii=False))
full_html = full_html.replace("{{ASSET_GROUPS_JSON}}", json.dumps(asset_groups, ensure_ascii=False))

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(full_html)
print(f"SoulBuilder v3.1 [Soul Restoration Edition] generated at {output_path}")
