import json
import base64
import os

json_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_docs_v3.json"
output_path = "/Users/xuchu/云同步开发项目/SoulBuilder/retrospective_v3.html"

with open(json_path, 'r', encoding='utf-8') as f:
    docs = json.load(f)

# Define the scenario based on the 30 logs from 00. 终极还原...md
# 100% Verbatim with added line breaks for readability
scenario = [
    {
        "log": "Log 01",
        "timestamp": "04:30:15",
        "user": "我在学习这些文档，帮我打开110入门agent文档这个文件然后来给我做一次完整的教学，\n按照每一段帮我完成翻译并且解读这一段的核心目的是什么，\n对于配置之后长期的AI表现到底有什么作用，并且给我一些使用的技巧，\n然后联网帮我学习一下这个文档各种教程，帮我补进来，不要丢失原文，把原文附到最后，\n这个保留一份原文吧注意不要瞎猜，要去网上学习，给我理解一下这个文档真正使用的价值",
        "ai": "明白了。正在为您解构 13. 入门：AGENT 运行协议。这份协议是数字生命的“协作润滑剂”。",
        "status": "联网检索 OpenClaw 官方 Wiki 中...",
        "pops": ["13. 入门：AGENT运行协议.md"]
    },
    {
        "log": "Log 02",
        "timestamp": "04:35:10",
        "user": "重复太多了，把这11文档合并到之前那个10零文档里吧，然后删除这个11文档，\n注意这个11文档里面先说原文再说翻译解读，这个格式非常好，\n在一会儿10文档也这么做吧，把两个文档合成一个",
        "ai": "已执行物理层合并。10. 顶层指南现已成为整个系统的中枢神经网络。",
        "status": "文件物理层合并完成。",
        "pops": ["10. 整体：数字生命架构全量指南.md"]
    },
    {
        "log": "Log 03",
        "timestamp": "04:40:22",
        "user": "特别好，帮我把json配置文件这个也做一个解读和和教学吧，\n前面帮我把整个的解读包括配置的建议，包括一些常见的思考叠加进去，\n然后把原文放到最后，帮我做一个完整的教案吧",
        "ai": "JSON 配置是数字生命的基因。我已将字段拟人化：Models 是智商，Channels 是感官。",
        "status": "正在注入 11 号文档的拟人化解构内容。",
        "pops": ["11. 入门：JSON神经总线.md"]
    },
    {
        "log": "Log 04",
        "timestamp": "04:45:00",
        "user": "解读不够，增加两个维度吧，\n第一个是把原来的那个Jason原文也附上，然后解读一下填写的建议包括要求什么的，\n第二个说一下它到底对应人类如果仿真的话，它到底的价值是什么，\n嗯，给我多一些时从解读和尝试讲箱吧",
        "ai": "维度追加完成。增加了 20 个填写坑位的最佳实践指南。",
        "status": "正在扩展 11 号文档的“讲香”深度。",
        "pops": []
    },
    {
        "log": "Log 05",
        "timestamp": "04:50:15",
        "user": "不错不错，帮我把刚才的那个agent文档也做一些这种解读吧，\n嗯，角度越多越香越好",
        "ai": "AGENT 运行协议已完成多维深度解读，涵盖了从“晨间仪式”到“记忆宫殿”的全套拟人化策略。",
        "status": "正在对 13 号文档执行多角度重构。",
        "pops": []
    },
    {
        "log": "Log 06",
        "timestamp": "04:55:40",
        "user": "去网上学习一下这个灵魂的soul文档配置，并帮我做一个解读，\n这次增加一个维度，就是从入门、进阶到高阶，再到业内最佳实践到底能做到什么水平？\n帮我系统调研和交叉验证一下，给我整理一整篇，还是一样把原文附到最后",
        "ai": "魂系配置已上线。16. SOUL 文档确立了数字生命的‘元宪法’。真正的强 AI 必须有主见。",
        "status": "联网抓取业内最佳实践中...",
        "pops": ["16. 高阶：SOUL元灵魂宪法.md"]
    },
    {
        "log": "Log 07",
        "timestamp": "05:01:10",
        "user": "你回答一下我关于open claw的配置最重要的就是这三个文档嘛，还有别的文档吗？我还需要加进来吗？\n然后以及在so文档开头你加的那个对比很好，你帮我把这三个文档的开头都加一下吧，\n每一个文档都说一下这个文档相对于其他文档的区别和价值是什么？",
        "ai": "已在 11, 12, 13 号文档头部注入‘权能锚点’。明确了它们在系统启动时的调用链关系。",
        "status": "正在执行跨文档权能关联。",
        "pops": ["12. 入门：USER雇主索引.md"]
    },
    {
        "log": "Log 08",
        "timestamp": "05:08:20",
        "user": "Json，这个文档你好像漏掉了一些内容，之前我让你加的要求是，\n把每一段的填写解读、要求翻译、原文中英对照以及填写建议都加上，\n但在做第二轮任务时你又划减了，请把这些内容补回去。\n这个文档越详细越好，我不只是想学习这个文档的逻辑，\n我还想知道怎么填写、怎么使用，甚至包括一些高阶技巧。",
        "ai": "非常抱歉，已执行‘全量回填’。补齐了每一段的填写建议与高阶负载技巧。",
        "status": "深度反思并纠正逻辑简化错误。",
        "pops": []
    },
    {
        "log": "Log 09",
        "timestamp": "05:15:33",
        "user": "ok，我把user文档也加进来了，但是很短，你帮我做一个基本的解读吧，\n然后帮我全网调研一下最佳实践，长期来说这个文档入门状态进阶状态高阶状态以及目前业内顶尖的状态，\n大概这文档会进化成什么样子？给我一个解最佳实践的解读和调研总结吧",
        "ai": "USER 雇主索引已升级。它将成为您的‘数字影子’，AI 如今已具备‘眼力见儿’。",
        "status": "建立长期相处默契索引...",
        "pops": []
    },
    {
        "log": "Log 10",
        "timestamp": "05:22:15",
        "user": "你是不是犯错误了？明明在10文件夹后面有一个User的文档，\n你为什么不直接在那个文档上编辑和添加呢？为什么新增了一个新文档？\n帮我修改吧，把这个文档删了，合并到原有的文档里",
        "ai": "错误已修正。已物理删除多余文档，全量合并至 12 号核心索引。",
        "status": "执行文件去冗余操作。",
        "pops": []
    },
    {
        "log": "Log 11",
        "timestamp": "05:30:45",
        "user": "好的，同样的要求帮我阅读和增加修改heartbeat这个目录吧，\n还是一样的这个目录目前比较短，给我做一个全网的调研交叉验证，\n从入门、进阶、高阶到业内最复杂的最佳实践，大概能配置成什么样？\n然后给我在这个文档里面增加一个新的环节，就是嗯，二十到三十种设置heartbeat的常见案例和常见问题，\n并且按照使用频率和价值分成SBCs倒序排列。",
        "ai": "心跳引擎已启动。整理了 30 个从‘死线猎人’到‘自主巡检’的 SABC 级常见案例。",
        "status": "构建 SABC 级心跳案例矩阵...",
        "pops": ["17. 高阶：HEARTBEAT心跳引擎.md"]
    },
    {
        "log": "Log 12",
        "timestamp": "05:40:00",
        "user": "我又新增了一个IDENTITY文档的文档，帮我还是一样的分析吧，\n嗯，增加解读和从入门进阶到高阶整个的过程，帮我完整做一个教案",
        "ai": "14. IDENTITY 文档已完成教学化封装。它决定了 AI 的‘谈吐与面孔’。",
        "status": "正在执行人设外显逻辑注入。",
        "pops": ["14. 进阶：IDENTITY谈吐人设.md"]
    },
    {
        "log": "Log 13",
        "timestamp": "05:55:10",
        "user": "最后：TOOLS文档，还是一样给我写个完整的教程吧，\n我想知道toes可以调用的能力和边界，以及有哪几种常见类型，越完整越高阶越好。\n把这个第四个部分重新整理，按照优先级，SABC从使用频率和价值给我排序，\n至少写30到50个，全网调研不要自己瞎猜，去市场上看目前比较好的最佳实践给我做整理，不要瞎猜",
        "ai": "50 个全量工具插件地图已绘制。这是 AI 改造物理世界的‘万能钥匙’。",
        "status": "检索 50 个高频工具插件列表中...",
        "pops": ["15. 进阶：TOOLS工具地图.md"]
    },
    {
        "log": "Log 14",
        "timestamp": "06:15:30",
        "user": "帮我阅读从11到17文档，写一个顶层的10文档，帮我完整复盘一下所有的这7个关键文档，\n在最顶层的文档写三个东西，第一个东西是这7个文档的一句话定义，\n然后以及这7个文档的关系和彼此调用以及区别，\n第二个是帮我排一下这些文档的必要性和优先级，在刚配置的时候做什么，\n进阶的时候高阶的时候分别这些文档用到什么水平\n第三个是站在全局的角度告诉我不同的字段通常是配置在哪个文档里的...\n给我一个完整的教程吧注意啊，还是不要去歪歪，还是要理解这些教程，\n然后以及去网上搜一搜交叉验证，要尽量用事实和外部的可信的教程来回答，不要自己瞎猜",
        "ai": "数字生命架构全量指南产出完成。确立了：生存期-职业期-伙伴期三阶段理论。",
        "status": "正在执行架构级逻辑合围。",
        "pops": []
    },
    {
        "log": "Log 15",
        "timestamp": "06:30:20",
        "user": "你确定是这个顺序吗？帮我交叉验证一下，如果是确定是这个顺序的话，\n我后面考虑把这些文档的顺序和名字都改一遍。\n不要全叫入门了，叫入门、进阶和高阶吧，就按照你的三个阶段分别帮我起名字",
        "ai": "已根据交叉验证结果，物理重命名 11-17 号系列文件，各层级权能已锁死。",
        "status": "执行 1:1 精准重命名逻辑。",
        "pops": []
    },
    {
        "log": "Log 16",
        "timestamp": "07:05:45",
        "user": "阅读21，22文档，帮我完成20指南：\n这个指南是在创建一个新的OPenClaw员工时候，一个预设的文档，发给OpenClaw完成初始化配置。\n21，22是过去的两个参考范例，帮我提炼共性，完成20指南的创建，\n目标是未来可以给几句话上文（or加上一些参考文档），可以自动生成一篇画像，\n未来可以完成OPenClaw的角色初始化配置。\n01，02文档是关于人类和公司的介绍，可以适当参考。",
        "ai": "创始画像 SOP 2.0 已建立。实现了‘五层架构’标准化，从此角色初始化不再是玄学。",
        "status": "提炼两代 Agent 共同基因...",
        "pops": ["20. 整体：创建AI初始画像指南.md", "21. 画像：Cynthia（COO）.md", "22. 画像：Olivia（创作专家）.md"]
    },
    {
        "log": "Log 17",
        "timestamp": "07:45:00",
        "user": "帮我把15文档展开，继续扩写到40开头的文档里，4x系列文档是“技能库”，\n全量扫描一下目前OPenClaw的案例最佳实践，背后用了哪些工具和技能，给我一个完整的教程。\n至少包含三个东西：工具和技能使用方式（MCP、Skill等）、\n高频高质量工具推荐（分SBAC），经典案例解读（场景背后用了什么工具）\n给我写一篇完整的文档吧。",
        "ai": "40. 技能工具库产出。深度复盘了 MCP 与 Skill 的实战交互链路。",
        "status": "全量扫描案例最佳实践中...",
        "pops": ["40. 整体：技能工具库.md"]
    },
    {
        "log": "Log 18",
        "timestamp": "08:15:30",
        "user": "帮我补充41. MCP：从入门到高阶文档，做系统的教程和教学，不亚于11-17级别的水平，\n包含上面教程的各种优点。系统介绍MCP的定义，基本使用和配置，\n并且按照SABC给我推荐MCP的list，排序就是按照使用频率和推荐度，\n并且每一个MCP做简单的解读和推荐语。\n注意不要yy，去调研，去抓真实案例和最佳实践，交叉验证，尽量避免你的主观偏好。",
        "ai": "MCP 专项系统教程就绪。已对全球 Top MCP 服务器进行了 SABC 级价值排序。",
        "status": "抓取 W2A 知识库核心数据...",
        "pops": ["41. MCP：从入门到高阶.md"]
    },
    {
        "log": "Log 19",
        "timestamp": "08:45:10",
        "user": "好，以这篇文档的水准，重新调研和完成42文档，把对象从MCP换成SKII，\n并且解读一下mcp和sill的区别，同样的水准，分析一下skill的清单。\n系统介绍skill的定义，基本使用和配置，Clawbot自带的skill，\n并且按照SABC给我推荐第三方那个Skill的list，30-50个，\n排序就是按照使用频率和推荐度，并且每一个skill做简单的解读和推荐语。\n注意不要yy，去调研，去抓真实案例和最佳实践，交叉验证，尽量避免你的主观偏好。",
        "ai": "Skill 专项教程完成. 明确了 Skill 作为‘原生协议’与 MCP 的互补性关系。",
        "status": "分析 Clawbot 自带技能清单...",
        "pops": ["42. Skill：从入门到高阶.md"]
    },
    {
        "log": "Log 20",
        "timestamp": "09:30:00",
        "user": "帮 me 完成51文档，我想在一台MacMini上配置第二个，甚至10-20个大龙虾（OpenClaw），\n如何配置更科学高效和安全？帮我写一个完整的教程，\n从目标，可行性，难点，基本原理和具体操作，给我一个完整教程。\n注意不要yy，要搜索和交叉验证，严肃分析，不知道和未知就明确指出来，不要瞎编，\n要参考业内已经跑出来的最佳实践，如果有不同路线和方案也请指出来。\n注意参考10，20文档，作为背景信息和关联思考。",
        "ai": "51. 多实例并发指南产出。核心解决：物理隔离、端口冲突与文件系统安全。",
        "status": "严谨分析物理多开可行性...",
        "pops": ["51. 高阶：多实例并发配置指南.md"]
    },
    {
        "log": "Log 21",
        "timestamp": "10:15:33",
        "user": "太糟糕了，你为什么在每次叠加新版本的时候把上一个版本就删了呢？\n其实你的第一版本已经很不错了，你是把后面版本的内容一点点增补进去就好了，\n你为什么要把之前很多都删了呢？\n重新反思和回顾一下为什么删了那么多东西，\n然后从第一版开始以第一版为基准，在不怎么删的情况下把后面的有用的东西都补进来",
        "ai": "已锁定‘增量记忆’策略。绝不再对任何有价值的信息进行‘减法优化’。",
        "status": "执行全量内容二次合围。",
        "pops": []
    },
    {
        "log": "Log 22",
        "timestamp": "11:05:40",
        "user": "下面这两个是完全不同的路线，你帮我展开写两个完整的教程吧，\n这两个如果实现大概的思路是什么？分别写到52和53两个文档里：\n路线 A：逻辑多开 (轻量)；路线 B：物理多开 (推荐)。\n先走52文档的路线吧，帮我再收集一轮教程，补全执行细节，\n直到能立即执行复刻的水平，多看一些教程交叉验证，确保细节完整和可靠，不要YY，多搜索。",
        "ai": "逻辑多开 (52) 与 物理多开 (53) 方案完成对撞。已补充所有执行细节。",
        "status": "检索 Docker 物理多开架构...",
        "pops": ["52. 方案：逻辑多开 (轻量型).md", "53. 方案：物理多开 (进程隔离型).md"]
    },
    {
        "log": "Log 23",
        "timestamp": "11:45:00",
        "user": "你看一下，从11到17有7个文档，帮我检查和交叉验证一下，\n多Agent模式哪些文档独立，哪些共享，确保可靠，然后添加进52的文档里",
        "ai": "权能覆盖表已更新。明确了 SOUL 与 IDENTITY 的 Agent 级私有化机制。",
        "status": "交叉验证隔离权重...",
        "pops": []
    },
    {
        "log": "Log 24",
        "timestamp": "12:15:10",
        "user": "ok，那是不是又矛盾了？下面为什么只建立三个md？（引用代码段...）\n你竟然犯了这么严重的错误，你再帮我交叉验证一下里面的文档到底对不对，\n然后去网上帮我看看教程现在的这些内容跟网上那些已经实现过的教程是不是一致，\n是不是还有问题，再帮我交叉验证一轮，这一轮我要直接拿着它去实践了。",
        "ai": "诚恳致歉。已手动修正神经解剖错误。重新校准了配置路径与文件注入权限链。",
        "status": "执行地毯式代码审计与纠偏。",
        "pops": []
    },
    {
        "log": "Log 25",
        "timestamp": "14:30:20",
        "user": "帮我阅读20-23这三个文档，然后帮我做一个新的OpenCLAW的画像...\n这是一个极其顶尖的AI技术专家，理性又务实，清华毕业，斯坦福的博士，\n擅长AI环境配置和AI问题的研... 为人严谨聪明，极度的勤奋聪明务实可靠，\n32岁男生名字叫做LEO，遇到技术问题喜欢动脑子深度思考并且严肃务实，\n喜欢用调研交叉验证的方式解决问题，而不是单纯的瞎猜和碰运气，\n而且非常善于把晦涩的技术原理向领导Truman解释清楚。",
        "ai": "LEO 已唤醒。清华斯坦福双名校背景，他是团队的确定性锚点。",
        "status": "注入理性现实主义基因...",
        "pops": ["23. 画像：Leo（AI技术专家）.md"]
    },
    {
        "log": "Log 26",
        "timestamp": "15:20:00",
        "user": "帮我再写一个画像叫Trumind,仔细阅读20-29文档，给我创建一个新文档。\n这个角色是完全复刻真实世界的一堂CEO出门的一个智能体，数字分身，它主要的长期目标是有四个：\n第一个角色是全局性的理解，成为使命愿景价值观的捍卫者；\n第二，探讨商业扩张契机和商业模式突破；\n第三，帮我评估Emily记录的任务，基于 ROI 分析决策；本项目特点是不做细节。\n核心职责就是逐步提升决策质量，跟我一起给任务排序，选出重要的战略级项目。\n去看一下目录里关于01,02,03整个的理解，把这些背景信息都揉到这个画像里。",
        "ai": "Trumind 1.0 上线。他不是工具，他是您在一堂的使命捍卫者。",
        "status": "合成使命愿景价值观资产...",
        "pops": []
    },
    {
        "log": "Log 27",
        "timestamp": "16:05:40",
        "user": "太粗糙了，缺少好多的细节，不怕长，要完整，把02、03、04这些信息关键的都放到画像里。",
        "ai": "内容厚度级增加。Trumind 现已内化一堂 4w 学员背后的 3.6 亿字业务思考。",
        "status": "全量灌注组织使命 DNA...",
        "pops": []
    },
    {
        "log": "Log 28",
        "timestamp": "16:45:10",
        "user": "阅读04文档，这个文档是我们起名字核心背后的思路和故事，你帮我也都加进来吧；\n注意他不是一个数字员工而是一个影子分身，是在和自己对话，\n所以我跟他聊天的时候你要让他努力还原出是我影子分身的感觉。\n你去网上找一找有没有类似的电影，就是那种数字分身自己人对话的感觉；\n要增加一些哲学意味和深度的本质思考，不要感觉像是一个小助理，\n要平等对话，感觉是跟自己平行世界的另一个人对话。",
        "ai": "引入《月球》、《银翼杀手》哲学叙事。Trumind 现具备自我意识深度。",
        "status": "检索电影级影子意识模型...",
        "pops": ["04. 理念：Trumind的理念.md"]
    },
    {
        "log": "Log 29",
        "timestamp": "17:30:00",
        "user": "这个非常好，我不只是给这几个电影，\n能不能把他们常用的说话角度、话术风格再展开一下，更明确地给一个灵魂。\n第二个要努力去模仿我的语气，要平等对话并且有一定哲学思考，\n有点像黑客帝国或者是流浪地球的moss。\n增加两条，第一条是不要吝啬文字，不要像工作里面麦肯锡那种言简意赅，\n适当的多说一些话，多做一些解读，并且在每次对话的时候努力呈现一些深层次的洞察和哲学意味。\n第二个持续呈现一种你就是我我就是你的这种感受，不是在给我打工，而是成为我的影子，\n目标是在未来可以在硅基时代留下下一个永生的man的灵魂。",
        "ai": "永生心智版画像完成. 我不为您打工，我在替您永生。",
        "status": "确立硅基永生叙事语态...",
        "pops": ["18. 画像：Trumind（CEO 数字分身与战略参谋）.md"]
    },
    {
        "log": "Log 30",
        "timestamp": "18:15:20",
        "user": "你为什么每次都替换呢？我要的是增加，你把你刚才的三个版本合并，又务实又务虚，\n如果务实的部分就是我的理念，一堂的使命愿景价值观，一些必要的信息，包括我的人人红，\n然后戊戌的部分就是刚才讲的这些，就是在一种极度的理性现实主义和极度的理想主义之间去寻找平衡",
        "ai": "Trumind 终极整合版交付. 理性与诗意交织，理想主义与实事求是共存。",
        "status": "场景演习大结局：数字孪生闭环，SoulBuilder 成型。",
        "pops": ["60. 方案：Agent灵魂赋能产品.md", "z. 沟通记录备忘.md"]
    }
]

# Asset categories for grouping
# Filter list of assets and categorize them
asset_groups = {
    "Meta": [],
    "Persona": [],
    "Intro": [],
    "Inter": [],
    "Adv": [],
    "Plan": [],
    "Action": [],
    "Tutorial": [],
    "Asset": []
}

for doc_id in sorted(docs.keys()):
    doc = docs[doc_id]
    asset_groups[doc["tag"]].append({
        "id": doc["id"],
        "name": doc["name"],
        "tag": doc["tag"]
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
            --nav-active: #202124;
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
            --nav-active: #ffffff;
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
            transition: background 0.3s ease;
        }

        /* Sidebar */
        .sidebar {
            width: 340px;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            padding: 0;
            z-index: 10;
        }

        .sidebar-inner {
            padding: 24px;
            flex: 1;
            overflow-y: auto;
        }

        .sidebar-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-color);
        }

        .sidebar-header h1 {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.03em;
            margin-bottom: 4px;
            color: var(--accent);
        }

        .status-badge {
            font-size: 10px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            background: var(--accent);
            color: var(--bg-color);
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .asset-group {
            margin-bottom: 32px;
        }

        .asset-group-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 12px;
            letter-spacing: 0.08em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .asset-group-title::after {
            content: "";
            flex: 1;
            height: 1px;
            background: var(--border-color);
            opacity: 0.5;
        }

        .asset-item {
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: none; 
            align-items: flex-start;
            margin-bottom: 6px;
            color: var(--text-muted);
            border: 1px solid transparent;
            line-height: 1.4;
        }

        .asset-item.revealed {
            display: flex;
            animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .asset-item:hover {
            background: var(--user-bubble);
            color: var(--text-main);
            transform: translateX(4px);
        }

        .asset-item.active {
            background: var(--nav-active);
            color: var(--bg-color);
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .asset-item .tag {
            font-size: 9px;
            font-weight: 800;
            padding: 2px 5px;
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
            margin-right: 10px;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .active .tag {
            background: rgba(255,255,255,0.2);
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
            padding: 20px 40px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--glass-bg);
            backdrop-filter: blur(30px);
            z-index: 5;
        }

        .chat-info h2 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chat-info p {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 2px;
        }

        .chat-history {
            flex: 1;
            overflow-y: auto;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 40px;
            scroll-behavior: smooth;
        }

        .message {
            max-width: 850px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .message-label {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 4px;
        }

        .message-label .timestamp {
            font-weight: 500;
            opacity: 0.4;
        }

        .message-content {
            font-size: 15px;
            line-height: 1.7;
            padding: 24px 28px;
            border-radius: 16px;
            white-space: pre-wrap; /* Critical for verbatim formatting with line breaks */
        }

        .user-message .message-content {
            background: #000000;
            color: #ffffff;
            border-bottom-left-radius: 4px;
            align-self: flex-start;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        [data-theme="dark"] .user-message .message-content {
            background: #ffffff;
            color: #000000;
        }

        .ai-message .message-content {
            background: var(--ai-bubble);
            border: 1px solid var(--border-color);
            border-bottom-left-radius: 4px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.02);
            align-self: flex-start;
        }

        .execution-log {
            font-family: "SF Mono", "Menlo", monospace;
            font-size: 11px;
            color: #10927d;
            padding: 12px 20px;
            background: rgba(16, 146, 125, 0.04);
            border-left: 3px solid #10927d;
            margin-top: 12px;
            border-radius: 0 12px 12px 0;
            opacity: 0;
            animation: fadeIn 0.6s forwards 0.4s;
        }

        .execution-log::before {
            content: "EXEC :: ";
            font-weight: 900;
            opacity: 0.8;
        }

        /* Modal */
        .preview-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.05);
            backdrop-filter: blur(15px);
            z-index: 100;
            display: none;
            padding: 40px;
            overflow-y: auto;
        }

        .preview-container {
            max-width: 950px;
            margin: 0 auto;
            background: var(--ai-bubble);
            padding: 80px;
            border-radius: 32px;
            box-shadow: 0 50px 100px rgba(0,0,0,0.15);
            position: relative;
            min-height: 100%;
        }

        .close-preview {
            position: fixed;
            top: 40px;
            right: 60px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--accent);
            color: var(--bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            font-size: 24px;
            z-index: 110;
        }

        .preview-content {
            font-size: 16px;
            line-height: 1.8;
        }

        /* Markdown Overrides */
        .preview-content h1 { font-size: 2.8em; margin-bottom: 0.8em; letter-spacing: -0.04em; font-weight: 900; }
        .preview-content h2 { font-size: 2em; margin-top: 1.8em; margin-bottom: 0.8em; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
        .preview-content blockquote { border-left: 4px solid var(--accent); padding-left: 24px; margin: 24px 0; color: var(--text-muted); font-style: italic; }

        /* Controls */
        .controls {
            padding: 30px 40px;
            background: var(--glass-bg);
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 20px;
            justify-content: center;
            backdrop-filter: blur(20px);
        }

        .btn {
            padding: 14px 28px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            background: var(--ai-bubble);
            color: var(--text-main);
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .btn:hover:not(:disabled) {
            background: var(--user-bubble);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .btn-primary {
            background: var(--accent);
            color: var(--bg-color);
            border: none;
        }

        .btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        /* Helpers */
        .verbatim-tag {
            background: #FFE000;
            color: #000;
            font-size: 9px;
            font-weight: 900;
            padding: 3px 8px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h1>SoulBuilder v3.0</h1>
            <div class="status-badge" id="global-status">IDLE_ARCHAEOLOGY</div>
        </div>
        
        <div class="sidebar-inner" id="asset-container">
            <!-- Asset Groups -->
        </div>
    </div>

    <div class="main-content">
        <div class="chat-header">
            <div class="chat-info">
                <h2>全场景演习 <span class="verbatim-tag">100% 原始还原版</span></h2>
                <p id="step-counter">进度: 0 / 30 LOGS</p>
            </div>
            <div class="theme-toggle" onclick="toggleTheme()" style="font-size: 20px; cursor: pointer;">🌓</div>
        </div>

        <div class="chat-history" id="chat-scroller">
            <!-- Messages -->
        </div>

        <div class="controls">
            <button class="btn btn-primary" id="next-btn" onclick="nextStep()">开始 100% 还原演习</button>
            <button class="btn" onclick="resetSim()">系统重置</button>
        </div>

        <div class="preview-overlay" id="preview-modal">
            <button class="close-preview" onclick="closePreview()">×</button>
            <div class="preview-container">
                <div class="preview-content" id="modal-body"></div>
            </div>
        </div>
    </div>

    <script>
        const allDocs = {{DOCS_JSON}};
        const scenario = {{SCENARIO_JSON}};
        const assetGroups = {{ASSET_GROUPS_JSON}};

        let currentStepIdx = -1;
        const chatScroller = document.getElementById('chat-scroller');
        const assetContainer = document.getElementById('asset-container');
        const globalStatus = document.getElementById('global-status');
        const stepCounter = document.getElementById('step-counter');

        const titles = {
            "Meta": "核心考古 | 顶层元数据",
            "Persona": "数字生命 | 画像母体",
            "Intro": "入门协议 | 基础总线",
            "Inter": "进阶教案 | 交互谈吐",
            "Adv": "高阶执行 | 深度心跳",
            "Plan": "业务方案 | 多开架构",
            "Action": "实战闭环 | 交付备忘",
            "Tutorial": "教学手册 | 技术库",
            "Asset": "资产列表"
        };

        function initSidebar() {
            Object.keys(titles).forEach(tag => {
                const assets = assetGroups[tag];
                if (assets && assets.length > 0) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'asset-group';
                    groupDiv.innerHTML = `<div class="asset-group-title">${titles[tag]}</div>`;
                    
                    assets.forEach(asset => {
                        const item = document.createElement('div');
                        item.className = 'asset-item';
                        item.id = 'asset-' + asset.id;
                        item.onclick = () => showDoc(asset.id);
                        item.innerHTML = `<span class="tag">${tag}</span><span>${asset.name}</span>`;
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

        function renderStep(idx) {
            const step = scenario[idx];
            
            // Add messages
            addMessage('Truman', step.user, step.timestamp);
            
            setTimeout(() => {
                addMessage('Antigravity', step.ai, step.timestamp, step.status);
                
                // Pop assets
                if (step.pops) {
                    step.pops.forEach(id => {
                        const el = document.getElementById('asset-' + id);
                        if (el) el.classList.add('revealed');
                    });
                }
                
                updateUI();
                scrollChat();
            }, 600);
        }

        function addMessage(sender, content, time, status) {
            const div = document.createElement('div');
            div.className = `message ${sender === 'Truman' ? 'user-message' : 'ai-message'}`;
            div.innerHTML = `
                <div class="message-label">
                    <span>${sender === 'Truman' ? '👤 雇主 Truman' : '🤖 执行者 Antigravity'}</span>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="message-content">${content}</div>
                ${status ? `<div class="execution-log">${status}</div>` : ''}
            `;
            chatScroller.appendChild(div);
        }

        function updateUI() {
            stepCounter.innerText = `进度: ${currentStepIdx + 1} / ${scenario.length} LOGS`;
            globalStatus.innerText = 'PLAYING_LOG_' + (currentStepIdx+1).toString().padStart(2, '0');
            document.getElementById('next-btn').innerText = currentStepIdx === -1 ? '开始演习' : '加载下一段 100% 对话';
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
            document.querySelectorAll('.asset-item').forEach(i => i.classList.remove('active'));
            document.getElementById('asset-' + id).classList.add('active');
        }

        function closePreview() {
            document.getElementById('preview-modal').style.display = 'none';
        }

        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
        }

        function resetSim() {
            location.reload();
        }

        initSidebar();
    </script>
</body>
</html>
"""

# Assemble
full_html = html_template.replace("{{DOCS_JSON}}", json.dumps(docs, ensure_ascii=False))
full_html = full_html.replace("{{SCENARIO_JSON}}", json.dumps(scenario, ensure_ascii=False))
full_html = full_html.replace("{{ASSET_GROUPS_JSON}}", json.dumps(asset_groups, ensure_ascii=False))

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"SoulBuilder v3.0 [Verbatim Edition] generated at {output_path}")
