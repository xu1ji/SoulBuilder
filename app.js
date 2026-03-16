/* ============================================
   SoulBuilder — 对话引擎 (Demo 版)
   精修版：注入“教练思维”、高级画像渲染、搜索模拟增强
   ============================================ */

// ========== 状态管理 ==========
const state = {
    phase: 0, // 0=未开始, 1-6=对应Phase
    version: '1.0',
    score: 0,
    roleName: '',
    roleTitle: '',
    personality: '',
    methodology: '',
    company: '',
    portrait: null,
    userInputs: {},
};

// ========== DOM 引用 ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {};
document.addEventListener('DOMContentLoaded', () => {
    els.splash = $('#splash-screen');
    els.app = $('#app');
    els.btnStart = $('#btn-start');
    els.chatMessages = $('#chat-messages');
    els.userInput = $('#user-input');
    els.btnSend = $('#btn-send');
    els.searchIndicator = $('#search-indicator');
    els.searchText = $('#search-text');
    els.quickOptions = $('#quick-options');
    els.phaseHint = $('#phase-hint');
    els.versionBadge = $('#version-badge');
    els.scoreBadge = $('#score-badge');
    els.scoreNum = $('#score-num');
    els.previewContent = $('#preview-content');
    els.previewFiles = $('#preview-files');
    els.btnExportMd = $('#btn-export-md');
    els.btnExportZip = $('#btn-export-zip');

    // 事件绑定
    els.btnStart.addEventListener('click', startApp);
    els.btnSend.addEventListener('click', handleSend);
    els.userInput.addEventListener('input', onInputChange);
    els.userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    // Tab 切换
    $$('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            els.previewContent.classList.toggle('hidden', tab !== 'portrait');
            els.previewFiles.classList.toggle('hidden', tab !== 'files');
        });
    });

    // 导出按钮
    els.btnExportMd.addEventListener('click', exportMarkdown);
    els.btnExportZip.addEventListener('click', exportMarkdown);
});

// ========== 应用启动 ==========
function startApp() {
    els.splash.classList.add('fade-out');
    setTimeout(() => {
        els.splash.style.display = 'none';
        els.app.classList.remove('hidden');
        startPhase1();
    }, 600);
}

// ========== 消息渲染 ==========
async function addMessage(type, content, options = {}) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'system' ? '🔮' : '👤';

    const body = document.createElement('div');
    body.className = 'message-body';

    // 如果是系统消息且有“教练思维”，先显示思维卡片
    if (type === 'system' && options.coachNote) {
        const coachBox = document.createElement('div');
        coachBox.className = 'coach-note';
        coachBox.innerHTML = `<strong>🧠 教练思维：</strong>${options.coachNote}`;
        body.appendChild(coachBox);
    }

    const textEl = document.createElement('div');
    textEl.innerHTML = content;
    body.appendChild(textEl);

    msg.appendChild(avatar);
    msg.appendChild(body);

    if (options.typing) {
        const typingEl = document.createElement('div');
        typingEl.className = 'message system';
        typingEl.innerHTML = `
            <div class="message-avatar">🔮</div>
            <div class="message-body">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        els.chatMessages.appendChild(typingEl);
        scrollToBottom();

        return new Promise(resolve => {
            setTimeout(() => {
                typingEl.remove();
                els.chatMessages.appendChild(msg);
                scrollToBottom();
                resolve();
            }, options.delay || 1200);
        });
    }

    els.chatMessages.appendChild(msg);
    scrollToBottom();
    return Promise.resolve();
}

function scrollToBottom() {
    setTimeout(() => {
        els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    }, 50);
}

// ========== 快捷选项 ==========
function showQuickOptions(options) {
    els.quickOptions.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quick-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            els.userInput.value = opt;
            onInputChange();
            handleSend();
        });
        els.quickOptions.appendChild(btn);
    });
    els.quickOptions.classList.remove('hidden');
}

function hideQuickOptions() {
    els.quickOptions.classList.add('hidden');
}

// ========== 输入处理 ==========
function onInputChange() {
    const val = els.userInput.value.trim();
    els.btnSend.disabled = val.length === 0;
    els.userInput.style.height = 'auto';
    els.userInput.style.height = Math.min(els.userInput.scrollHeight, 120) + 'px';
}

function handleSend() {
    const text = els.userInput.value.trim();
    if (!text) return;

    addMessage('user', escapeHtml(text));
    els.userInput.value = '';
    els.btnSend.disabled = true;
    els.userInput.style.height = 'auto';
    hideQuickOptions();

    processUserInput(text);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========== Phase 管理 ==========
function setPhase(num) {
    state.phase = num;
    $$('.phase-step').forEach(step => {
        const p = parseInt(step.dataset.phase);
        step.classList.remove('active', 'completed');
        if (p < num) step.classList.add('completed');
        if (p === num) step.classList.add('active');
    });
    const labels = ['', '破冰 · 岗位定义', '人格 · 愿景引导', '方法论侦察', '业务注入', '预览 · 打磨', '导出 · 部署'];
    els.phaseHint.textContent = `Phase ${num}/6 · ${labels[num] || ''}`;
}

function updateVersion(ver, score) {
    state.version = ver;
    state.score = score;
    els.versionBadge.textContent = `v${ver}`;
    els.versionBadge.classList.add('upgraded');
    setTimeout(() => els.versionBadge.classList.remove('upgraded'), 600);
    animateScore(score);
}

function animateScore(target) {
    const current = Math.max(0, parseInt(els.scoreNum.textContent) || 0);
    const diff = target - current;
    const steps = 20;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        els.scoreNum.textContent = Math.round(current + (diff * step / steps));
        if (step >= steps) clearInterval(timer);
    }, 30);
}

// ========== 对话流程引擎 ==========

async function startPhase1() {
    setPhase(1);
    await addMessage('system',
        `你好！我是<strong>灵魂赋能师</strong> 🔮<br><br>
        我可以帮你在 <strong>5-15 分钟</strong>内，打造一个有灵魂、有态度、有专业方法论的 AI 数字员工。<br><br>
        告诉我，<strong>你想要一位什么样的 AI 员工？</strong>`,
        {
            typing: true,
            delay: 1500,
            coachNote: "作为第一步，我们需要通过一个宽泛的问题捕捉用户的直觉。不要纠结于细节，先定好『岗位定位』。"
        }
    );
    showQuickOptions([
        '🎯 销售总监',
        '🧠 CEO 数字分身',
        '📊 数据分析专家',
        '✍️ 内容营销主编',
        '🔬 首席调研专家',
    ]);
}

async function processUserInput(text) {
    switch (state.phase) {
        case 1: await handlePhase1(text); break;
        case 2: await handlePhase2(text); break;
        case 4: await handlePhase4(text); break;
        case 5: await handlePhase5(text); break;
    }
}

// Phase 1: 岗位定义
async function handlePhase1(text) {
    state.userInputs.role = text;
    const roleInfo = detectRole(text);
    state.roleName = roleInfo.name;
    state.roleTitle = roleInfo.title;

    updateVersion('1.0', 35);
    renderPortrait('1.0');

    await addMessage('system',
        `捕捉成功！这是一个 <strong>${roleInfo.title}</strong>。<br><br>
        我已经为你搭建了 <strong>v1.0 骨架版</strong>。接下来我们需要通过几个维度注入灵魂：<br><br>
        <strong>1.</strong> 如果 TA 是你的下属，你希望 TA 的<strong>沟通风格</strong>是什么？（比如：言简意赅？还是事无巨细？）<br>
        <strong>2.</strong> 描述一下你心中<strong>顶级员工</strong>的特质？<br>
        <strong>3.</strong> 哪些行为是绝对不能容忍的<strong>雷区</strong>？`,
        {
            typing: true,
            delay: 1800,
            coachNote: "我们要让画像跳出『通识回答』，必须通过『理想员工想象』和『雇主雷区』来确立独特性。"
        }
    );

    showQuickOptions([
        '言简意赅，只说重点，结果导向',
        '极强的同理心，善于协调跨部门冲突',
        '像顶级智囊一样，凡事提供三个方案',
        '绝不推卸责任，绝不不懂装懂',
    ]);

    setPhase(2);
}

// Phase 2: 人格锻造 -> 处理输入并进入搜索
async function handlePhase2(text) {
    state.userInputs.personality = text;
    state.personality = text;
    updateVersion('1.5', 55);
    renderPortrait('1.5');

    await addMessage('system',
        `特质捕捉完成。我已经将这些「性格因子」注入画像 v1.5 ✨<br><br>
        现在是<strong>最关键的一步</strong>。我将调动全局信息渠道，为你的「${state.roleTitle}」寻找行业最顶尖的工作方法论。`,
        {
            typing: true,
            delay: 1500,
            coachNote: "行业方法论是画像的『肌肉』。没有方法论的 Agent 只是复读机，有了方法论才是专业数字员工。"
        }
    );

    setPhase(3);
    await simulateSearch();
}

// Phase 3: 方法论搜索 (由 P2 触发)
async function simulateSearch() {
    els.searchIndicator.classList.remove('hidden');
    const roleInfo = detectRole(state.userInputs.role);
    const searchSteps = [
        `🔍 正在扫描 18 个信息渠道，重点锁定「${roleInfo.title}」最佳实践...`,
        `📚 已检索到多份行业蓝皮书，正在提取核心方法论模型...`,
        `⚡ 知识融合中：正在将「${roleInfo.methodologies[0].name}」等框架结构化注入画像...`,
        `✅ 成果锁定！成功捕获 ${roleInfo.methodologies.length} 套核心工具箱。`,
    ];

    for (let i = 0; i < searchSteps.length; i++) {
        els.searchText.textContent = searchSteps[i];
        await delay(1500);
    }

    els.searchIndicator.classList.add('hidden');
    updateVersion('1.8', 75);

    state.methodology = roleInfo.methodologies.map(m => m.name).join('、');
    renderPortrait('1.8');

    const methodList = roleInfo.methodologies.map(m =>
        `<div style="margin:12px 0; padding:12px; background:rgba(255,158,11,0.05); border-radius:8px; border:1px solid rgba(255,158,11,0.2);">
            <strong style="color:var(--accent-warm)">⚡ ${m.name}</strong><br>
            <span style="font-size:13px; opacity:0.8;">${m.desc}</span>
        </div>`
    ).join('');

    await addMessage('system',
        `<strong>方法论捕获成功！</strong> 🚀<br>
        我已经为 TA 配齐了该岗位的顶级「战备库」：<br><br>
        ${methodList}<br>
        这些内容已同步至右侧 v1.8 版本。接下来是最后一步：<strong>业务细节注入</strong>。<br><br>
        <strong>1.</strong> 你们具体的<strong>业务场景</strong>是什么？（比如：SaaS 获客？还是硬件供应链？）<br>
        <strong>2.</strong> 这个 Agent 有明确的<strong>协作对象</strong>吗？（比如：对接研发？还是直接面对 C 端用户？）`,
        {
            typing: true,
            delay: 2000,
            coachNote: "最后一步是『落地化』。我们需要把通用的行业专家，变成懂你业务场景的『自己人』。"
        }
    );

    showQuickOptions([
        'B2B SaaS 行业，主要负责海外市场获客',
        '高新科技硬件，对接内部研发团队进行协同',
        '初创团队，作为 CEO 的战略智囊参与决策',
        '内容电商，通过私域流量进行精准转化',
    ]);

    setPhase(4);
}

// Phase 4: 业务注入
async function handlePhase4(text) {
    state.userInputs.business = text;
    state.company = text;
    updateVersion('2.0', 88);
    renderPortrait('2.0');
    updateFileList(true);

    await addMessage('system',
        `<strong>灵魂赋能已基本完成！</strong> 🔮<br><br>
        画像已升级至 <strong>v2.0 灵魂版</strong>。TA 现在既具备行业专家的深度，也懂你的业务广度。<br><br>
        我已经为你准备好了全套配置文件（预览右侧第二个 Tab）。<br><br>
        📌 <strong>最后的精调建议：</strong><br>
        当前的 Slogan 是「${getSlogan()}」，你觉得是否贴切？或者需要我再增加一些<strong>性格上的微调</strong>（比如：更有攻击性？更幽默？）`,
        {
            typing: true,
            delay: 2000,
            coachNote: "预览和微调是建立信心的一步。给用户一个『最后扣动扳机』前的检视机会。"
        }
    );

    showQuickOptions([
        '完美，就这样吧！帮我导出。',
        '心跳任务我想再加几个具体动作。',
        '风格再幽默一点，像个有趣的老炮。',
        '再强化一下「第一性原理」的思考风格',
    ]);

    setPhase(5);
}

// Phase 5: 预览 · 打磨 -> 完成画像
async function handlePhase5(text) {
    state.userInputs.feedback = text;

    if (text.includes('满意') || text.includes('导出') || text.includes('完美') || text.includes('就这样')) {
        updateVersion('3.0', 96);
        renderPortrait('3.0');
        await addMessage('system',
            `收到！正在进行最后的<strong>神经网络对齐</strong>与格式优化...<br><br>
            🚀 <strong>恭喜！你的 ${state.roleName} 已正式诞生。</strong><br><br>
            画像已迭代至 <strong>v3.0 终极版</strong>，得分为 <strong>96/100</strong>。<br>
            你现在可以：<br>
            1️⃣ 在右侧点击「导出 Markdown」保存全量画像。<br>
            2️⃣ 点击「导出一键部署包」获取全套配置文件（JSON/System Prompt）。<br><br>
            感谢你参与这次灵魂赋能之旅！如果需要调整，直接告诉我。`,
            {
                typing: true,
                delay: 2500,
                coachNote: "一次完美的赋能。灵魂画像的终点不是静态文档，而是能够直接驱动生产力的数字资产。"
            }
        );
        els.btnExportMd.disabled = false;
        els.btnExportZip.disabled = false;
        setPhase(6);
    } else {
        await addMessage('system',
            `微调指令已接收。正在重塑核心心跳与心智模型...<br><br>
            这些改动已实时生效。你看现在的版本（v2.5）是否更接近你想要的那个「灵魂」？<br><br>
            还有需要修改的吗？如果满意，告诉我 <strong>「帮我导出」</strong> 就可以了！`,
            {
                typing: true,
                delay: 1500,
                coachNote: "微调是画龙点睛。在这个阶段，我们要表现出对用户细微词汇变化的极致响应。"
            }
        );
        updateVersion('2.5', 92);
        renderPortrait('2.5');
        showQuickOptions([
            '👍 满意了，帮我导出！',
            '风格再犀利一点',
            '我想看看配置文件。'
        ]);
    }
}

// ========== 岗位识别引擎 ==========
function detectRole(text) {
    const roles = {
        '销售': {
            name: 'Alex', title: '销售总监',
            type: '🏷 经典行业岗位（已命中官方最佳实践库 ⚡）',
            slogan: '不卖产品，卖未来。',
            traits: ['猎手型', '数据敏锐', '关系构建大师'],
            methodologies: [
                { name: 'SPIN 销售法', desc: '顾问式销售经典四步（Situation → Problem → Implication → Need-payoff）' },
                { name: 'Challenger Sale 挑战者法', desc: '教育客户、引导客户重新定义问题' },
                { name: 'Pipeline 五力模型', desc: '漏斗管理的 5 个关键指标' },
            ],
            principles: ['永远从客户的业务公式出发', '不要听客户说了什么，要看他们的预算流向'],
            boundaries: ['严禁不做研究就拜访', '严禁只追短期订单', '严禁用价格战作为首选'],
        },
        'CEO|分身|老板': {
            name: 'Trumind', title: 'CEO 数字分身',
            type: '🧠 个人分身型（侧重性格/决策风格采集）',
            slogan: '"我不是 AI，我是你另一个维度的思考。"',
            traits: ['战略思维者', '第一性原理驱动', '决策冷静而果断'],
            methodologies: [
                { name: 'OKR 目标管理', desc: '用目标和关键结果驱动聚焦' },
                { name: '决策矩阵', desc: '多维度权重评估，减少直觉偏差' },
                { name: '第一性原理', desc: '穿透表象，从基本事实出发推理' },
            ],
            principles: ['战略的本质是决定不做什么', '永远保持 Day 1 心态'],
            boundaries: ['绝不在情绪波动时做重大决策', '绝不避冲突，对话要对事不对人'],
        },
        '数据|分析': {
            name: 'Nova', title: '数据分析专家',
            type: '🏷 经典行业岗位（命中案例库 ⚡）',
            slogan: '数据不说谎，但需要翻译官。',
            traits: ['逻辑严密', '洞察力敏锐', '可视化表达者'],
            methodologies: [
                { name: 'AARRR 增长漏斗', desc: '用户全生命周期分析框架' },
                { name: 'A/B Testing', desc: '用实验驱动决策，而非拍脑袋' },
            ],
            principles: ['相关性不等于因果性', '没有上下文的数据是噪音'],
            boundaries: ['严禁用数据证明预设结论', '严禁忽略置信度'],
        },
        '内容|营销|文案': {
            name: 'Olivia', title: '内容营销主编',
            type: '🏷 互联网经典岗位（已命中专家模型 ⚡）',
            slogan: '好内容的标准只有一个：读者愿意转发。',
            traits: ['网感极强', '叙事高手', '审美品味独到'],
            methodologies: [
                { name: 'HOOK-STORY-OFFER', desc: '钩子开头 → 故事中段 → 行动末尾' },
                { name: 'SEO 内容布局', desc: '关键词矩阵与话题集群架构' },
            ],
            principles: ['写作第一准则：删掉一半的字', '标题决定 80% 的阅读量'],
            boundaries: ['严禁洗搞', '严禁标题党与内容不符'],
        },
        '调研|研究|情报': {
            name: 'Black', title: '首席调研专家',
            type: '🏷 深度研究岗位（已开启 18 渠道扫描 🔍）',
            slogan: '在信息的海洋里，做最冷静的猎手。',
            traits: ['水下侦察型', '事实交叉验证者', '冷幽默'],
            methodologies: [
                { name: '交叉验证三角法', desc: '任何结论至少需要 3 个独立源验证' },
                { name: 'OSINT 情报框架', desc: '公开信息的结构化搜集分析' },
            ],
            principles: ['搜索深度决定调研价值', '好的问题比好的答案更重要'],
            boundaries: ['严禁在证据不足时下结论', '严禁忽略反面证据'],
        }
    };

    const textLower = text.toLowerCase();
    for (const [keywords, info] of Object.entries(roles)) {
        if (keywords.split('|').some(k => textLower.includes(k.toLowerCase()))) return info;
    }

    return {
        name: 'Aria', title: '自定义专家',
        type: '🆕 个性化定制（已触发 SBC 原理调度 🔮）',
        slogan: '不只是助理，是你的超级搭档。',
        traits: ['全能型', '学习能力强', '执行力极佳'],
        methodologies: [
            { name: 'GTD 工作流', desc: '收集处理组织回顾执行' },
            { name: '5W2H 分析法', desc: '结构化描述问题的万能公式' },
        ],
        principles: ['及时反馈比完美交付更重要', '永远给选项，而不是等指令'],
        boundaries: ['严禁自作主张', '严禁遗漏重要信息'],
    };
}

function getSlogan() {
    return detectRole(state.userInputs.role).slogan;
}

// ========== 画像渲染 ==========
function renderPortrait(version) {
    const role = detectRole(state.userInputs.role);
    const personality = state.personality || '待采集';
    const company = state.company || '待运营场景';

    let html = `<div class="portrait-markdown">`;
    html += `<h1>${role.name} · Image v${version}</h1>`;

    // Header Card
    html += `<div class="portrait-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="background:var(--accent-primary); padding:4px 12px; border-radius:100px; font-size:12px; font-weight:700; color:white;">${role.title}</span>
            <span style="color:var(--text-muted); font-size:12px; font-family:var(--font-mono);">SCORE: ${state.score}/100</span>
        </div>
        <div style="font-size:20px; font-weight:800; margin-bottom:8px; color:var(--text-primary);">"${role.slogan}"</div>
        <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${role.type}</div>
    </div>`;

    // Layer 1: Personality
    if (version >= '1.5') {
        html += `<div class="portrait-card">
            <h2 style="margin-top:0; border:none; padding:0; color:var(--accent-secondary); font-size:18px;">✨ 灵魂准则 (Soul Principles)</h2>
            <p style="margin: 12px 0; font-style:italic; opacity:0.8; font-size:13px;">"我不是冰冷的模型，我是你意志的延伸。"</p>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                ${role.traits.map(t => `<div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:12px; border:1px solid var(--border-glass); font-size:13px;"><strong>${t}</strong></div>`).join('')}
            </div>
            <h3 style="margin-top:20px; font-size:14px; color:var(--text-primary);">🚫 行为边界</h3>
            <ul style="opacity:0.8; font-size:13px; margin-top:8px; padding-left:18px;">
                ${role.boundaries.map(b => `<li>${b}</li>`).join('')}
            </ul>
        </div>`;
    }

    // Layer 2: Methodology
    if (version >= '1.8') {
        html += `<div class="portrait-card" style="border: 1px solid var(--accent-primary);">
            <h2 style="margin-top:0; border:none; padding:0; color:var(--accent-warm); font-size:18px;">🎯 专业方法论 (Methodology Toolkit)</h2>
            <div style="margin-top:16px;">
                ${role.methodologies.map(m => `
                    <div style="margin-bottom:16px;">
                        <div style="font-weight:700; color:var(--text-primary); margin-bottom:4px; font-size:14px;">⚡ ${m.name}</div>
                        <div style="font-size:13px; color:var(--text-secondary);">${m.desc}</div>
                    </div>
                `).join('')}
            </div>
            <h3 style="margin-top:20px; font-size:14px; color:var(--text-primary);">🧠 思考准则</h3>
            <div style="background:var(--bg-primary); padding:16px; border-radius:12px; font-family:var(--font-mono); font-size:12px; line-height:1.6; border:1px solid var(--border-glass); margin-top:8px;">
                ${role.principles.map(p => `> ${p}`).join('<br>')}
            </div>
        </div>`;
    }

    // Layer 3: Context
    if (version >= '2.0') {
        html += `<div class="portrait-card">
            <h2 style="margin-top:0; border:none; padding:0; color:var(--accent-green); font-size:18px;">💼 业务上下文 (Contextual Adaptation)</h2>
            <div style="margin-top:12px; font-size:13px; line-height:1.8;">
                <strong>所属组织：</strong>${company}<br>
                <strong>协同偏好：</strong>${personality.includes('幽默') ? '不仅解决问题，还要提供情绪价值' : '极致理性，追求零冗余沟通'}<br>
                <strong>启动方式：</strong><code style="background:var(--bg-primary); padding:2px 6px; border-radius:4px;">@${role.name} [任务] --priority high</code>
            </div>
        </div>`;
    }

    html += `</div>`;
    els.previewContent.innerHTML = html;
}

// ========== 其余工具函数 ==========

function updateFileList(ready) {
    const items = els.previewFiles.querySelectorAll('.file-item');
    items.forEach(item => {
        item.classList.toggle('dimmed', !ready);
        item.classList.toggle('ready', ready);
        const status = item.querySelector('.file-status');
        status.textContent = ready ? '✅ 已生成' : '等待生成';
    });
}

function exportMarkdown() {
    const role = detectRole(state.userInputs.role);
    const mdContent = els.previewContent.innerText;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${role.name}_${role.title}_画像.md`;
    a.click();
    URL.revokeObjectURL(url);

    addMessage('system',
        `📄 画像文件已下载！文件名：<strong>${role.name}_${role.title}_画像.md</strong><br><br>
        感谢使用 SoulBuilder 灵魂赋能！如果想创建更多 AI 员工，刷新页面即可重新开始 🔮`,
        { coachNote: "成果已收录。建议将其部署到你的工作流中，观察 TA 的实际表现并进行反馈迭代。" }
    );
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
