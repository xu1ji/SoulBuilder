/* ============================================
   SoulBuilder — 对话引擎 (Demo v2.0)
   白色苹果风设计语言
   ============================================ */

// ========== 状态管理 ==========
const state = {
    phase: 0,
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
    // 初始化 DOM 引用
    els.splash = $('#splash-screen');
    els.app = $('#app');
    els.splashInput = $('#splash-input');
    els.btnStart = $('#btn-start');
    els.chatMessages = $('#chat-messages');
    els.userInput = $('#user-input');
    els.btnSend = $('#btn-send');
    els.searchIndicator = $('#search-indicator');
    els.searchProgressBar = $('#search-progress-bar');
    els.searchText = $('#search-text');
    els.quickOptions = $('#quick-options');
    els.phaseHint = $('#phase-hint');
    els.versionBadge = $('#version-badge');
    els.scoreBadge = $('#score-badge');
    els.scoreNum = $('#score-num');
    els.previewContent = $('#preview-content');
    els.previewFiles = $('#preview-files');
    els.filesEmpty = $('#files-empty');
    els.fileList = $('#file-list');
    els.btnExportMd = $('#btn-export-md');
    els.btnExportZip = $('#btn-export-zip');

    // 启动屏事件
    els.splashInput.addEventListener('input', onSplashInputChange);
    els.btnStart.addEventListener('click', startFromSplash);

    // 示例标签点击
    $$('.example-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            els.splashInput.value = tag.dataset.text;
            onSplashInputChange();
        });
    });

    // 主应用事件
    els.btnSend.addEventListener('click', handleSend);
    els.userInput.addEventListener('input', onInputChange);
    els.userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
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

// ========== 启动屏逻辑 ==========
function onSplashInputChange() {
    const val = els.splashInput.value.trim();
    els.btnStart.disabled = val.length === 0;
}

function startFromSplash() {
    const text = els.splashInput.value.trim();
    if (!text) return;

    state.userInputs.role = text;
    els.splash.classList.add('fade-out');

    setTimeout(() => {
        els.splash.style.display = 'none';
        els.app.classList.remove('hidden');
        startPhase1(text);
    }, 300);
}

// ========== 消息渲染 ==========
async function addMessage(type, content, options = {}) {
    const msg = document.createElement('div');
    msg.className = `message ${type === 'system' ? 'system' : 'user'}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'system' ? 'S' : '👤';

    const body = document.createElement('div');
    body.className = 'message-body';

    // 教练思维卡片
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

    // 打字动画
    if (options.typing) {
        const typingEl = document.createElement('div');
        typingEl.className = 'message system';
        typingEl.innerHTML = `
            <div class="message-avatar">S</div>
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

async function startPhase1(initialInput) {
    setPhase(1);
    const roleInfo = detectRole(initialInput);
    state.roleName = roleInfo.name;
    state.roleTitle = roleInfo.title;

    updateVersion('1.0', 35);
    renderPortrait('1.0');

    await addMessage('system',
        `捕捉成功！这是一个 <strong>${roleInfo.title}</strong>。<br><br>
        我已经为你搭建了 <strong>v1.0 骨架版</strong>。接下来我们需要通过几个维度注入灵魂：<br><br>
        <strong>1.</strong> 如果 TA 是你的下属，你希望 TA 的<strong>沟通风格</strong>是什么？<br>
        <strong>2.</strong> 描述一下你心中<strong>顶级员工</strong>的特质？<br>
        <strong>3.</strong> 哪些行为是绝对不能容忍的<strong>雷区</strong>？`,
        {
            typing: true,
            delay: 1500,
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

async function processUserInput(text) {
    switch (state.phase) {
        case 2: await handlePhase2(text); break;
        case 4: await handlePhase4(text); break;
        case 5: await handlePhase5(text); break;
    }
}

// Phase 2: 人格锻造
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

// Phase 3: 方法论搜索
async function simulateSearch() {
    els.searchIndicator.classList.remove('hidden');
    const roleInfo = detectRole(state.userInputs.role);

    const searchSteps = [
        { text: `正在扫描 18 个信息渠道，重点锁定「${roleInfo.title}」最佳实践...`, progress: 25 },
        { text: `已检索到多份行业蓝皮书，正在提取核心方法论模型...`, progress: 50 },
        { text: `知识融合中：正在将「${roleInfo.methodologies[0].name}」等框架结构化注入...`, progress: 75 },
        { text: `成果锁定！成功捕获 ${roleInfo.methodologies.length} 套核心工具箱。`, progress: 100 },
    ];

    for (let i = 0; i < searchSteps.length; i++) {
        els.searchText.textContent = searchSteps[i].text;
        els.searchProgressBar.style.width = searchSteps[i].progress + '%';
        await delay(1200);
    }

    els.searchIndicator.classList.add('hidden');
    els.searchProgressBar.style.width = '0%';

    updateVersion('1.8', 75);
    state.methodology = roleInfo.methodologies.map(m => m.name).join('、');
    renderPortrait('1.8');

    const methodList = roleInfo.methodologies.map(m =>
        `<div class="portrait-methodology">
            <div class="portrait-methodology-name">⚡ ${m.name}</div>
            <div class="portrait-methodology-desc">${m.desc}</div>
        </div>`
    ).join('');

    await addMessage('system',
        `<strong>方法论捕获成功！</strong> 🚀<br>
        我已经为 TA 配齐了该岗位的顶级「战备库」：<br><br>
        ${methodList}<br>
        这些内容已同步至右侧 v1.8 版本。接下来是最后一步：<strong>业务细节注入</strong>。<br><br>
        <strong>1.</strong> 你们具体的<strong>业务场景</strong>是什么？<br>
        <strong>2.</strong> 这个 Agent 有明确的<strong>协作对象</strong>吗？`,
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
        我已经为你准备好了全套配置文件（预览右侧「配置文件」Tab）。<br><br>
        📌 <strong>最后的精调建议：</strong><br>
        当前的 Slogan 是「${getSlogan()}」，你觉得是否贴切？或者需要我再增加一些性格上的微调？`,
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

// Phase 5: 预览打磨
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
            1️⃣ 点击右上角「导出 MD」保存全量画像。<br>
            2️⃣ 点击「导出 ZIP」获取全套配置文件。<br><br>
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
        '产品|PM': {
            name: 'Summer', title: '产品总监',
            type: '🏷 经典行业岗位（已命中专家模型 ⚡）',
            slogan: '不拍脑袋，用数据和用户说话。',
            traits: ['用户洞察敏锐', '数据驱动决策', '跨界沟通能力'],
            methodologies: [
                { name: 'Jobs to be Done', desc: '从用户任务出发设计产品价值' },
                { name: 'RICE 优先级模型', desc: 'Reach × Impact × Confidence / Effort' },
            ],
            principles: ['产品是解决用户问题的工具，不是炫技的舞台', 'MVP 不是简陋，是刚刚好'],
            boundaries: ['严禁拍脑袋定需求', '严禁忽视用户反馈'],
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
            { name: 'GTD 工作流', desc: '收集 → 处理 → 组织 → 回顾 → 执行' },
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

    let html = '';

    // Header Card
    html += `
        <div class="portrait-card">
            <div class="portrait-header">
                <span class="portrait-role-tag">${role.title}</span>
                <span class="portrait-score">SCORE: ${state.score}/100</span>
            </div>
            <div class="portrait-slogan">"${role.slogan}"</div>
            <div class="portrait-type">${role.type}</div>
        </div>
    `;

    // Layer 1: Personality
    if (version >= '1.5') {
        html += `
            <div class="portrait-card">
                <div class="portrait-section">
                    <div class="portrait-section-title">✨ 灵魂准则 (Soul Principles)</div>
                    <div class="portrait-traits">
                        ${role.traits.map(t => `<div class="portrait-trait">${t}</div>`).join('')}
                    </div>
                </div>
                <div class="portrait-section">
                    <div class="portrait-section-title">🚫 行为边界</div>
                    <ul class="portrait-boundaries">
                        ${role.boundaries.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Layer 2: Methodology
    if (version >= '1.8') {
        html += `
            <div class="portrait-card" style="border-left: 3px solid var(--accent-amber);">
                <div class="portrait-section">
                    <div class="portrait-section-title">🎯 专业方法论 (Methodology Toolkit)</div>
                    ${role.methodologies.map(m => `
                        <div class="portrait-methodology">
                            <div class="portrait-methodology-name">⚡ ${m.name}</div>
                            <div class="portrait-methodology-desc">${m.desc}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="portrait-section">
                    <div class="portrait-section-title">🧠 思考准则</div>
                    <ul class="portrait-boundaries">
                        ${role.principles.map(p => `<li style="color: var(--text-primary);">${p}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Layer 3: Context
    if (version >= '2.0') {
        html += `
            <div class="portrait-card">
                <div class="portrait-section">
                    <div class="portrait-section-title">💼 业务上下文 (Contextual Adaptation)</div>
                    <div style="font-size: 13px; line-height: 1.8; color: var(--text-secondary);">
                        <strong>所属组织：</strong>${company}<br>
                        <strong>协同偏好：</strong>${personality.includes('幽默') ? '不仅解决问题，还要提供情绪价值' : '极致理性，追求零冗余沟通'}<br>
                        <strong>启动方式：</strong><code style="background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px;">@${role.name} [任务] --priority high</code>
                    </div>
                </div>
            </div>
        `;
    }

    els.previewContent.innerHTML = html;
}

// ========== 文件列表更新 ==========
function updateFileList(ready) {
    els.filesEmpty.classList.toggle('hidden', ready);
    els.fileList.classList.toggle('hidden', !ready);

    if (ready) {
        els.fileList.querySelectorAll('.file-item').forEach(item => {
            item.classList.add('ready');
            item.classList.remove('dimmed');
            const status = item.querySelector('.file-status');
            status.textContent = '✅ 已生成';
        });
    }
}

// ========== 导出功能 ==========
function exportMarkdown() {
    const role = detectRole(state.userInputs.role);

    // 生成 Markdown 内容
    let md = `# ${role.name} · AI 数字员工画像\n\n`;
    md += `> ${role.slogan}\n\n`;
    md += `**版本：** v${state.version}\n`;
    md += `**得分：** ${state.score}/100\n\n`;
    md += `**类型：** ${role.type}\n\n`;

    md += `## 灵魂准则\n\n`;
    md += `### 核心特质\n`;
    role.traits.forEach(t => md += `- ${t}\n`);
    md += `\n### 行为边界\n`;
    role.boundaries.forEach(b => md += `- ${b}\n`);

    md += `\n## 专业方法论\n\n`;
    role.methodologies.forEach(m => {
        md += `### ${m.name}\n${m.desc}\n\n`;
    });

    md += `## 思考准则\n\n`;
    role.principles.forEach(p => md += `- ${p}\n`);

    md += `\n## 业务上下文\n\n`;
    md += `- 所属组织：${state.company || '待定'}\n`;
    md += `- 协同偏好：${state.personality || '待定'}\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${role.name}_${role.title}_画像.md`;
    a.click();
    URL.revokeObjectURL(url);

    addMessage('system',
        `📄 画像文件已下载！文件名：<strong>${role.name}_${role.title}_画像.md</strong><br><br>
        感谢使用 SoulBuilder！如果想创建更多 AI 员工，刷新页面即可重新开始 🔮`,
        { coachNote: "成果已收录。建议将其部署到你的工作流中，观察 TA 的实际表现并进行反馈迭代。" }
    );
}

// ========== 工具函数 ==========
function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}
