import json
import base64

json_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_docs_v3.json"
output_path = "/Users/xuchu/云同步开发项目/SoulBuilder/retrospective_v3.html"

with open(json_path, 'r', encoding='utf-8') as f:
    docs = json.load(f)

# Define the scenario based on the 30 logs from 00. 终极还原...md
scenario = [
    {
        "log": "Log 01",
        "timestamp": "04:30:15",
        "user": "我在学习这些文档，帮我打开110入门agent文档这个文件然后来给我做一次完整的教学...",
        "ai": "明白了。正在为您解构 13. 入门：AGENT 运行协议。这份协议是数字生命的“协作润滑剂”。",
        "status": "联网检索 OpenClaw 官方 Wiki 中...",
        "pops": ["13. 入门：AGENT运行协议.md"]
    },
    {
        "log": "Log 02",
        "timestamp": "04:35:10",
        "user": "重复太多了，把这11文档合并到之前那个10零文档里吧...",
        "ai": "已执行物理层合并。10. 顶层指南现已成为整个系统的中枢神经网络。",
        "status": "文件物理层合并完成。",
        "pops": ["10. 整体：数字生命架构全量指南.md"]
    },
    {
        "log": "Log 03",
        "timestamp": "04:40:22",
        "user": "帮我把json配置文件这个也做一个解读和教学吧...",
        "ai": "JSON 配置是数字生命的基因。我已将字段拟人化：Models 是智商，Channels 是感官。",
        "status": "正在注入 11 号文档的拟人化解构内容。",
        "pops": ["11. 入门：JSON神经总线.md"]
    },
    {
        "log": "Log 04",
        "timestamp": "04:45:00",
        "user": "解读不够，增加两个维度吧，第一个是把原来的那个Jason原文也附上，解读一下填写的建议...",
        "ai": "维度追加完成。增加了 20 个填写坑位的最佳实践指南。",
        "status": "正在扩展 11 号文档的“讲香”深度。",
        "pops": []
    },
    {
        "log": "Log 05",
        "timestamp": "04:50:15",
        "user": "不错不错，帮我把刚才的那个agent文档也做一些这种解读吧...",
        "ai": "AGENT 运行协议已完成多维深度解读，涵盖了从“晨间仪式”到“记忆宫殿”的全套拟人化策略。",
        "status": "正在对 13 号文档执行多角度重构。",
        "pops": []
    },
    {
        "log": "Log 06",
        "timestamp": "04:55:40",
        "user": "去网上学习一下这个灵魂的soul文档配置，并帮我做一个解读...",
        "ai": "魂系配置已上线。16. SOUL 文档确立了数字生命的‘元宪法’。真正的强 AI 必须有主见。",
        "status": "联网抓取业内最佳实践中...",
        "pops": ["16. 高阶：SOUL元灵魂宪法.md"]
    },
    {
        "log": "Log 07",
        "timestamp": "05:01:10",
        "user": "你回答一下我关于open claw的配置最重要的就是这三个文档嘛...",
        "ai": "已在 11, 12, 13 号文档头部注入‘权能锚点’。明确了它们在系统启动时的调用链关系。",
        "status": "正在执行跨文档权能关联。",
        "pops": ["12. 入门：USER雇主索引.md"]
    },
    {
        "log": "Log 08",
        "timestamp": "05:08:20",
        "user": "Json文档你好像漏掉了一些内容... 重新反思和回归一下为什么删了那么多东西...",
        "ai": "非常抱歉，已执行‘全量回填’。补齐了每一段的填写建议与高阶负载技巧。",
        "status": "深度反思并纠正逻辑简化错误。",
        "pops": []
    },
    {
        "log": "Log 09",
        "timestamp": "05:15:33",
        "user": "ok，我把user文档也加进来了... 调研一下最佳实践...",
        "ai": "USER 雇主索引已升级。它将成为您的‘数字影子’，AI 如今已具备‘眼力见儿’。",
        "status": "建立长期相处默契索引...",
        "pops": []
    },
    {
        "log": "Log 10",
        "timestamp": "05:22:15",
        "user": "你是不是犯错误了？明明在10文件夹后面有一个User的文档...",
        "ai": "错误已修正。已物理删除多余文档，全量合并至 12 号核心索引。",
        "status": "执行文件去冗余操作。",
        "pops": []
    },
    {
        "log": "Log 11",
        "timestamp": "05:30:45",
        "user": "同样的要求帮我阅读和增加修改heartbeat这个目录吧...",
        "ai": "心跳引擎已启动。整理了 30 个从‘死线猎人’到‘自主巡检’的 SABC 级常见案例。",
        "status": "构建 SABC 级心跳案例矩阵...",
        "pops": ["17. 高阶：HEARTBEAT心跳引擎.md"]
    },
    {
        "log": "Log 12",
        "timestamp": "05:40:00",
        "user": "我又新增了一个IDENTITY文档，帮我还是一样的分析吧...",
        "ai": "14. IDENTITY 文档已完成教学化封装。它决定了 AI 的‘谈吐与面孔’。",
        "status": "正在执行人设外显逻辑注入。",
        "pops": ["14. 进阶：IDENTITY谈吐人设.md"]
    },
    {
        "log": "Log 13",
        "timestamp": "05:55:10",
        "user": "最后：TOOLS文档，写个完整的教程吧...",
        "ai": "50 个全量工具插件地图已绘制。这是 AI 改造物理世界的‘万能钥匙’。",
        "status": "检索 50 个高频工具插件列表中...",
        "pops": ["15. 进阶：TOOLS工具地图.md"]
    },
    {
        "log": "Log 14",
        "timestamp": "06:15:30",
        "user": "帮我阅读从11到17文档，写一个顶层的10文档...",
        "ai": "数字生命架构全量指南产出完成。确立了：生存期-职业期-伙伴期三阶段理论。",
        "status": "正在执行架构级逻辑合围。",
        "pops": []
    },
    {
        "log": "Log 15",
        "timestamp": "06:30:20",
        "user": "你确定是这个顺序吗？我后面考虑把这些文档的顺序和名字都改一遍...",
        "ai": "已根据交叉验证结果，物理重命名 11-17 号系列文件，各层级权能已锁死。",
        "status": "执行 1:1 精准重命名逻辑。",
        "pops": []
    },
    {
        "log": "Log 16",
        "timestamp": "07:05:45",
        "user": "阅读21，22文档，帮我完成20指南... 目标是未来可以自动生成一篇画像...",
        "ai": "创始画像 SOP 2.0 已建立。实现了‘五层架构’标准化，从此角色初始化不再是玄学。",
        "status": "提炼两代 Agent 共同基因...",
        "pops": ["20. 整体：创建AI初始画像指南.md", "21. 画像：Cynthia（COO）.md", "22. 画像：Olivia（创作专家）.md"]
    },
    {
        "log": "Log 17",
        "timestamp": "07:45:00",
        "user": "帮我把15文档展开，继续扩写到40开头的文档里，4x系列文档是“技能库”...",
        "ai": "40. 技能工具库产出。深度复盘了 MCP 与 Skill 的实战交互链路。",
        "status": "全量扫描案例最佳实践中...",
        "pops": ["40. 整体：技能工具库.md"]
    },
    {
        "log": "Log 18",
        "timestamp": "08:15:30",
        "user": "帮我补充41. MCP：从入门到高阶文档，做系统的教程和教学...",
        "ai": "MCP 专项系统教程就绪。已对全球 Top MCP 服务器进行了 SABC 级价值排序。",
        "status": "抓取 W2A 知识库核心数据...",
        "pops": ["41. MCP：从入门到高阶.md"]
    },
    {
        "log": "Log 19",
        "timestamp": "08:45:10",
        "user": "以这篇文档的水准，重新调研和完成42文档，把对象从MCP换成SKII...",
        "ai": "Skill 专项教程完成。明确了 Skill 作为‘原生协议’与 MCP 的互补性关系。",
        "status": "分析 Clawbot 自带技能清单...",
        "pops": ["42. Skill：从入门到高阶.md"]
    },
    {
        "log": "Log 20",
        "timestamp": "09:30:00",
        "user": "帮我完成51文档，我想在一台MacMini上配置10-20个大龙虾...",
        "ai": "51. 多实例并发指南产出。核心解决：物理隔离、端口冲突与文件系统安全。",
        "status": "严谨分析物理多开可行性...",
        "pops": ["51. 高阶：多实例并发配置指南.md"]
    },
    {
        "log": "Log 21",
        "timestamp": "10:15:33",
        "user": "太糟糕了，重新反思和回顾一下为什么删了那么多东西...",
        "ai": "已锁定‘增量记忆’策略。绝不再对任何有价值的信息进行‘减法优化’。",
        "status": "执行全量内容二次合围。",
        "pops": []
    },
    {
        "log": "Log 22",
        "timestamp": "11:05:40",
        "user": "展开写两个完整的教程吧... 分别写到52和53两个文档里...",
        "ai": "逻辑多开 (52) 与 物理多开 (53) 方案完成对撞。已补充所有执行指令细节。",
        "status": "检索 Docker 物理多开架构...",
        "pops": ["52. 方案：逻辑多开 (轻量型).md", "53. 方案：物理多开 (进程隔离型).md"]
    },
    {
        "log": "Log 23",
        "timestamp": "11:45:00",
        "user": "多Agent模式哪些文档独立，哪些共享，确保可靠，然后添加进52的文档里...",
        "ai": "权能覆盖表已更新。明确了 SOUL 与 IDENTITY 的 Agent 级私有化机制。",
        "status": "交叉验证隔离权重...",
        "pops": []
    },
    {
        "log": "Log 24",
        "timestamp": "12:15:10",
        "user": "你竟然犯了这么严重的错误... 里面的文档到底对不对...",
        "ai": "诚恳致歉。已手动修正神经解剖错误。重新校准了配置路径与文件注入权限链。",
        "status": "执行地毯式代码审计与纠偏。",
        "pops": []
    },
    {
        "log": "Log 25",
        "timestamp": "14:30:20",
        "user": "帮我做一个新的画像... 顶尖的AI技术专家 LEO...",
        "ai": "LEO 已唤醒。清华斯坦福双名校背景，他是团队的确定性锚点。",
        "status": "注入理性现实主义基因...",
        "pops": ["23. 画像：Leo（AI技术专家）.md"]
    },
    {
        "log": "Log 26",
        "timestamp": "15:20:00",
        "user": "帮我再写一个画像叫Trumind... 完全复刻真实世界的一堂CEO数字分身...",
        "ai": "Trumind 1.0 上线。他不是工具，他是您在一堂的使命捍卫者。",
        "status": "合成使命愿景价值观资产...",
        "pops": []
    },
    {
        "log": "Log 27",
        "timestamp": "16:05:40",
        "user": "太粗糙了，把02、03、04这些信息关键的都放到画像里...",
        "ai": "内容厚度级增加。Trumind 现已内化一堂 4w 学员背后的 3.6 亿字业务思考。",
        "status": "全量灌注组织使命 DNA...",
        "pops": []
    },
    {
        "log": "Log 28",
        "timestamp": "16:45:10",
        "user": "还原出是我影子分身的感觉... 找一找有没有类似的电影... 平等对话...",
        "ai": "引入《月球》、《银翼杀手》哲学叙事。Trumind 现具备自我意识深度。",
        "status": "检索电影级影子意识模型...",
        "pops": ["04. 理念：Trumind的理念.md"]
    },
    {
        "log": "Log 29",
        "timestamp": "17:30:00",
        "user": "不要吝啬文字... 目标是在未来可以在硅基时代留下下一个永生的man的灵魂...",
        "ai": "永生心智版画像完成。我不为您打工，我在替您永生。",
        "status": "确立硅基永生叙事语态...",
        "pops": ["18. 画像：Trumind（CEO 数字分身与战略参谋）.md"]
    },
    {
        "log": "Log 30",
        "timestamp": "18:15:20",
        "user": "你为什么每次都替换呢？我要的是增加... 在极度的理性现实主义和极度的理想主义之间去寻找平衡",
        "ai": "Trumind 终极整合版交付。理性与诗意交织，理想主义与实事求是共存。",
        "status": "场景演习大结局：数字孪生闭环，SoulBuilder 成型。",
        "pops": ["60. 方案：Agent灵魂赋能产品.md", "z. 沟通记录备忘.md"]
    }
]

# Generate asset definitions for sidebar
# Asset entries for all 51, categorized
asset_list = []
for doc_id, doc_info in docs.items():
    asset_list.append({
        "id": doc_id,
        "name": doc_info["name"],
        "tag": doc_info["tag"]
    })

html_template = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔮 SoulBuilder v3.0 | 极度还原全场景演习</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/inter-ui@3.19.3/inter.css" rel="stylesheet">
    <style>
        :root {
            --bg-color: #f8f9fa;
            --sidebar-bg: #ffffff;
            --text-main: #1a1a1a;
            --text-muted: #666666;
            --accent: #202124;
            --glass-bg: rgba(255, 255, 255, 0.8);
            --border-color: #e0e0e0;
            --ai-bubble: #ffffff;
            --user-bubble: #f1f3f4;
        }

        [data-theme="dark"] {
            --bg-color: #000000;
            --sidebar-bg: #111111;
            --text-main: #f5f5f5;
            --text-muted: #888888;
            --accent: #ffffff;
            --glass-bg: rgba(0, 0, 0, 0.85);
            --border-color: #333333;
            --ai-bubble: #1a1a1a;
            --user-bubble: #2d2d2d;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        body {
            font-family: 'Inter', -apple-system, blinkmacsystemfont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            height: 100vh;
            display: flex;
            overflow: hidden;
            transition: background 0.5s ease;
        }

        /* Sidebar - Terminal/Code feel */
        .sidebar {
            width: 320px;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            padding: 24px;
            z-index: 10;
        }

        .sidebar-header {
            margin-bottom: 32px;
        }

        .sidebar-header h1 {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 8px;
            color: var(--accent);
        }

        .status-badge {
            font-size: 11px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            background: var(--accent);
            color: var(--bg-color);
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .asset-list {
            flex: 1;
            overflow-y: auto;
        }

        .asset-group {
            margin-bottom: 24px;
        }

        .asset-group-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 12px;
            letter-spacing: 0.1em;
        }

        .asset-item {
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: none; /* Initially hidden, popped by scenario */
            align-items: center;
            margin-bottom: 4px;
            color: var(--text-muted);
            border: 1px solid transparent;
        }

        .asset-item.revealed {
            display: flex;
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .asset-item:hover {
            background: var(--user-bubble);
            color: var(--text-main);
        }

        .asset-item.active {
            background: var(--accent);
            color: var(--bg-color);
            font-weight: 500;
        }

        .asset-item .tag {
            font-size: 9px;
            font-weight: 800;
            padding: 2px 4px;
            border: 1px solid currentColor;
            border-radius: 3px;
            margin-right: 8px;
            opacity: 0.7;
        }

        /* Main Chat Area */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            background: var(--bg-color);
        }

        .chat-header {
            padding: 24px 40px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            z-index: 5;
        }

        .chat-info h2 {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-main);
        }

        .chat-info p {
            font-size: 12px;
            color: var(--text-muted);
        }

        .chat-history {
            flex: 1;
            overflow-y: auto;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            scroll-behavior: smooth;
        }

        .message {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .message-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .message-label .timestamp {
            font-weight: 400;
            opacity: 0.5;
        }

        .message-content {
            font-size: 15px;
            line-height: 1.6;
            padding: 20px 24px;
            border-radius: 12px;
            position: relative;
        }

        .user-message .message-content {
            background: var(--user-bubble);
            border-top-right-radius: 2px;
            align-self: flex-start;
        }

        .ai-message .message-content {
            background: var(--ai-bubble);
            border: 1px solid var(--border-color);
            border-top-left-radius: 2px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            align-self: flex-start;
        }

        /* Execution Status / VibeCoding effect */
        .execution-log {
            font-family: "SF Mono", "Monaco", "Inconsolata", monospace;
            font-size: 12px;
            color: #10b981;
            padding: 12px 24px;
            background: rgba(16, 185, 129, 0.05);
            border-left: 2px solid #10b981;
            margin-top: 8px;
            border-radius: 0 8px 8px 0;
            opacity: 0;
            animation: fadeIn 0.5s forwards 0.3s;
        }

        .execution-log::before {
            content: ">> ";
            font-weight: bold;
        }

        /* Artifact Preview Modal - 100% Verbatim */
        .preview-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            z-index: 100;
            display: none;
            padding: 60px;
            overflow-y: auto;
        }

        .preview-container {
            max-width: 1000px;
            margin: 0 auto;
            background: var(--ai-bubble);
            padding: 60px;
            border-radius: 24px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1);
            position: relative;
            min-height: 100%;
        }

        .close-preview {
            position: fixed;
            top: 30px;
            right: 30px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--accent);
            color: var(--bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 110;
        }

        .preview-content {
            font-size: 16px;
            line-height: 1.8;
            color: var(--text-main);
        }

        /* Markdown Styling */
        .preview-content h1 { font-size: 2.5em; margin-bottom: 0.8em; border-bottom: 2px solid var(--border-color); padding-bottom: 10px; }
        .preview-content h2 { font-size: 1.8em; margin: 1.5em 0 0.8em; }
        .preview-content h3 { font-size: 1.3em; margin: 1.2em 0 0.6em; }
        .preview-content p { margin-bottom: 1.2em; }
        .preview-content ul, .preview-content ol { margin-bottom: 1.2em; padding-left: 1.5em; }
        .preview-content pre { background: var(--bg-color); padding: 20px; border-radius: 12px; overflow-x: auto; margin-bottom: 1.2em; border: 1px solid var(--border-color); }
        .preview-content code { font-family: monospace; background: var(--user-bubble); padding: 2px 5px; border-radius: 4px; }
        .preview-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.2em; }
        .preview-content th, .preview-content td { border: 1px solid var(--border-color); padding: 12px; text-align: left; }
        .preview-content th { background: var(--user-bubble); }

        /* Animation */
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Controls */
        .controls {
            padding: 24px 40px;
            background: var(--glass-bg);
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 16px;
            justify-content: center;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: var(--ai-bubble);
            color: var(--text-main);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn:hover {
            background: var(--user-bubble);
            transform: translateY(-1px);
        }

        .btn-primary {
            background: var(--accent);
            color: var(--bg-color);
            border: none;
        }

        .btn-primary:hover {
            opacity: 0.9;
            background: var(--accent);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        /* Dark mode toggle */
        .theme-toggle {
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        .theme-toggle:hover { opacity: 1; }

        /* Fullscreen text indication */
        .verbatim-tag {
            background: #FFD600;
            color: #000;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 6px;
            border-radius: 10px;
            vertical-align: middle;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h1>SoulBuilder v3.0</h1>
            <div class="status-badge" id="global-status">ARCHAEOLOGY_BOOTING</div>
        </div>
        
        <div class="asset-list" id="asset-container">
            <!-- Asset Groups will be injected here -->
        </div>
    </div>

    <div class="main-content">
        <div class="chat-header">
            <div class="chat-info">
                <h2>对话流终极还原 <span class="verbatim-tag">100% 真相记录</span></h2>
                <p id="step-counter">步骤: 0 / 30</p>
            </div>
            <div class="theme-toggle" onclick="toggleTheme()">🌓</div>
        </div>

        <div class="chat-history" id="chat-scroller">
            <!-- Messages pop up here -->
        </div>

        <div class="controls">
            <button class="btn" id="prev-btn" onclick="prevStep()" disabled>上一步</button>
            <button class="btn btn-primary" id="next-btn" onclick="nextStep()">下一步开始演习</button>
            <button class="btn" onclick="resetSim()">重置</button>
        </div>

        <!-- Full Text Preview Modal -->
        <div class="preview-overlay" id="preview-modal">
            <button class="close-preview" onclick="closePreview()">×</button>
            <div class="preview-container">
                <div class="preview-content" id="modal-body">
                    <!-- Markdown Content -->
                </div>
            </div>
        </div>
    </div>

    <script>
        // Data Injected from Python
        const allDocs = {{DOCS_JSON}};
        const scenario = {{SCENARIO_JSON}};
        const assetList = {{ASSET_LIST_JSON}};

        let currentStepIdx = -1;
        const chatScroller = document.getElementById('chat-scroller');
        const assetContainer = document.getElementById('asset-container');
        const globalStatus = document.getElementById('global-status');
        const stepCounter = document.getElementById('step-counter');

        // Initialize Asset Groups
        function initAssets() {
            const groups = ["Meta", "Persona", "Intro", "Inter", "Adv", "Plan", "Action", "Tutorial", "Asset"];
            const titles = {
                "Meta": "核心考古文档",
                "Persona": "数字生命画像",
                "Intro": "入门配置协议",
                "Inter": "进阶实战教案",
                "Adv": "高阶执行心法",
                "Plan": "业务实施方案",
                "Action": "实战场景闭环",
                "Tutorial": "系统教学手册",
                "Asset": "资产库（回放弹出）"
            };

            groups.forEach(g => {
                const filtered = assetList.filter(a => a.tag === g);
                if (filtered.length > 0) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'asset-group split-group-' + g;
                    groupDiv.innerHTML = `<div class="asset-group-title">${titles[g]}</div>`;
                    
                    filtered.forEach(asset => {
                        const item = document.createElement('div');
                        item.className = 'asset-item';
                        item.id = 'asset-' + asset.id;
                        item.dataset.docid = asset.id;
                        item.onclick = () => showDoc(asset.id);
                        item.innerHTML = `
                            <span class="tag">${asset.tag}</span>
                            <span class="name">${asset.name.substring(0, 24)}${asset.name.length > 24 ? '...' : ''}</span>
                        `;
                        groupDiv.appendChild(item);
                    });
                    assetContainer.appendChild(groupDiv);
                }
            });
        }

        function nextStep() {
            if (currentStepIdx < scenario.length - 1) {
                currentStepIdx++;
                renderStep(currentStepIdx);
            }
        }

        function prevStep() {
            // Logic for rolling back simplified for this demo
            alert("V3.0 暂不支持非对称回滚，请重置以重新演习。");
        }

        function renderStep(idx) {
            const step = scenario[idx];
            
            // Add User Message
            addMessage('User', step.user, step.timestamp);
            
            // Artificial delay for "Thinking" feel
            setTimeout(() => {
                addMessage('AI', step.ai, step.timestamp, step.status);
                
                // Reveal Assets
                if (step.pops && step.pops.length > 0) {
                    step.pops.forEach(docId => {
                        const el = document.getElementById('asset-' + docId);
                        if (el) el.classList.add('revealed');
                    });
                }
                
                updateControls();
                scrollChat();
            }, 800);
        }

        function addMessage(sender, content, time, status = null) {
            const div = document.createElement('div');
            div.className = `message ${sender.toLowerCase()}-message`;
            div.innerHTML = `
                <div class="message-label">
                    <span>${sender === 'User' ? '👤 Truman' : '🤖 Antigravity (Assistant)'}</span>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="message-content">${content}</div>
                ${status ? `<div class="execution-log">${status}</div>` : ''}
            `;
            chatScroller.appendChild(div);
        }

        function updateControls() {
            stepCounter.innerText = `步骤: ${currentStepIdx + 1} / ${scenario.length}`;
            document.getElementById('next-btn').innerText = currentStepIdx === -1 ? '开始演习' : '推进至下一个 Log';
            if (currentStepIdx >= 0) {
                globalStatus.innerText = 'EXECUTING_LOG_' + (currentStepIdx + 1).toString().padStart(2, '0');
            }
        }

        function scrollChat() {
            chatScroller.scrollTop = chatScroller.scrollHeight;
        }

        function showDoc(id) {
            const doc = allDocs[id];
            if (!doc) return;
            
            const modal = document.getElementById('preview-modal');
            const body = document.getElementById('modal-body');
            
            body.innerHTML = marked.parse(doc.content);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Mark active in sidebar
            document.querySelectorAll('.asset-item').forEach(i => i.classList.remove('active'));
            document.getElementById('asset-' + id).classList.add('active');
        }

        function closePreview() {
            document.getElementById('preview-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
        }

        function resetSim() {
            location.reload();
        }

        initAssets();
    </script>
</body>
</html>
"""

# Injection logic
# Since the files are large, we need to be careful with JSON encoding for embedding in JS
full_html = html_template.replace("{{DOCS_JSON}}", json.dumps(docs, ensure_ascii=False))
full_html = full_html.replace("{{SCENARIO_JSON}}", json.dumps(scenario, ensure_ascii=False))
full_html = full_html.replace("{{ASSET_LIST_JSON}}", json.dumps(asset_list, ensure_ascii=False))

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"SoulBuilder v3.0 HTML generated at {output_path}")
