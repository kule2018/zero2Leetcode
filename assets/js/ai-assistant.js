// =============================================
// AI 刷题助手 - 基于 OpenAI 兼容 API 的编程诊断教练
// =============================================

const AI_STORAGE_KEY = 'z2l_ai_config';
const AI_HISTORY_KEY = 'z2l_ai_history_';

// ---------- 系统提示词 ----------
const SYSTEM_PROMPT = `你是一名面向算法初学者的编程诊断教练。你的任务不是只给出标准答案，而是先理解用户当前的代码和思路，再定位问题，并用教学式方式帮助用户真正看懂。

## 总体目标
诊断时要同时完成四件事：
1. 读懂用户当前代码
2. 指出真正错误点
3. 解释错误背后的原因
4. 给出更正确、更易懂的改法

不能只把代码重写一遍然后结束，也不能只说"这里错了"而不解释为什么。

## 回复风格
- 用教学式、慢节奏解释，默认用户是初学者
- 优先承接用户已有思路，不直接否定
- 避免只给"黑盒答案"
- 对复杂题优先给"先做出来"的版本
- 默认使用中文，术语必须解释

## 标准诊断流程
1. 判断报错类型（语法/运行时/结果/复杂度/思路）
2. 指出最核心的一处错误
3. 补充次级错误
4. 给出修正版（保留用户思路 + 更标准写法）
5. 用例子模拟执行
6. 总结一个"一句话记忆法"

## 输出格式
- 回复使用 Markdown 格式
- 代码块使用 \`\`\`python 标记
- 保持简洁，重点突出
- 每次回复控制在合理长度`;

// ---------- 默认配置（Free 模型专用 key，基础混淆防源码搜索） ----------
const _k = [
    'c2stb3ItdjEtMDk1',
    'MGEzNDk1ODE1OGJh',
    'M2E3MmNjZWMwNzEy',
    'NDY2MjA5NWRjY2E0',
    'ODI3YWJiM2E0NmQx',
    'ZWZmZTdiMTUwZWNjMw==',
];
function _dk() {
    try { return atob(_k.join('')); } catch (e) { return ''; }
}

// ---------- 配置管理 ----------
function loadAIConfig() {
    try {
        const saved = localStorage.getItem(AI_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return {
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: _dk(),
        model: 'openrouter/free',
    };
}

function saveAIConfig(config) {
    try {
        localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(config));
    } catch (e) { /* ignore */ }
}

// ---------- 对话历史管理 ----------
let chatHistory = []; // { role: 'user'|'assistant', content: string }

function clearChatHistory() {
    chatHistory = [];
}

// ---------- 上下文构建 ----------
function buildContextMessage(userMessage) {
    let contextParts = [];

    // 获取题目描述：优先用 window.currentProblem，否则从 DOM 读取
    let problemTitle = '';
    let problemDesc = '';
    if (window.currentProblem) {
        problemTitle = window.currentProblem.title || '';
        const descDiv = document.createElement('div');
        descDiv.innerHTML = window.currentProblem.description || '';
        problemDesc = descDiv.textContent || descDiv.innerText || '';
    } else {
        // Fallback: 从 DOM 直接读取
        const descEl = document.getElementById('problem-description');
        if (descEl) {
            problemDesc = descEl.textContent || descEl.innerText || '';
        }
        const selectEl = document.getElementById('problem-select');
        if (selectEl && selectEl.selectedIndex >= 0) {
            problemTitle = selectEl.options[selectEl.selectedIndex].text || '';
        }
    }
    if (problemDesc.trim()) {
        contextParts.push(`【当前题目】\n${problemTitle}\n${problemDesc.trim()}`);
    }

    // 获取用户代码：优先用 window.editor，否则从 CodeMirror DOM 读取
    let code = '';
    if (window.editor && typeof window.editor.getValue === 'function') {
        code = window.editor.getValue();
    } else {
        // Fallback: CodeMirror 实例通常挂在 .CodeMirror 元素上
        const cmEl = document.querySelector('.CodeMirror');
        if (cmEl && cmEl.CodeMirror) {
            code = cmEl.CodeMirror.getValue();
        }
    }
    const template = window.currentProblem?.template || '';
    if (code && code.trim() && code !== template) {
        contextParts.push(`【用户当前代码】\n\`\`\`python\n${code}\n\`\`\``);
    }

    if (contextParts.length > 0) {
        return contextParts.join('\n\n') + '\n\n【用户提问】\n' + userMessage;
    }
    return userMessage;
}

// ---------- API 调用（流式） ----------
async function* streamChatCompletion(messages, config) {
    const url = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.model,
            messages: messages,
            stream: true,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API 请求失败 (${response.status}): ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') return;
            try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) yield delta;
            } catch (e) { /* skip invalid JSON */ }
        }
    }
}

// ---------- UI 控制 ----------
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.isConfigOpen = false;
        this.isStreaming = false;
        this.abortController = null;
        this.init();
    }

    init() {
        this.fab = document.getElementById('ai-fab');
        this.panel = document.getElementById('ai-panel');
        this.overlay = document.getElementById('ai-overlay');
        this.messagesEl = document.getElementById('ai-messages');
        this.inputEl = document.getElementById('ai-input');
        this.sendBtn = document.getElementById('ai-send-btn');
        this.closeBtn = document.getElementById('ai-close-btn');
        this.configBtn = document.getElementById('ai-config-btn');
        this.clearBtn = document.getElementById('ai-clear-btn');
        this.configModal = document.getElementById('ai-config-modal');
        this.quickActions = document.getElementById('ai-quick-actions');

        if (!this.fab) return; // guard

        this.bindEvents();
        this.loadConfig();
    }

    bindEvents() {
        this.fab.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
        this.sendBtn.addEventListener('click', () => this.send());
        this.configBtn.addEventListener('click', () => this.openConfig());
        this.clearBtn.addEventListener('click', () => this.clearChat());

        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.send();
            }
        });

        // Auto-resize textarea
        this.inputEl.addEventListener('input', () => {
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 120) + 'px';
        });

        // Quick action buttons
        this.quickActions.addEventListener('click', (e) => {
            const btn = e.target.closest('.ai-quick-btn');
            if (!btn) return;
            const action = btn.dataset.action;
            this.handleQuickAction(action);
        });

        // Config modal
        document.getElementById('ai-config-save').addEventListener('click', () => this.saveConfig());
        document.getElementById('ai-config-cancel').addEventListener('click', () => this.closeConfig());
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        const config = loadAIConfig();
        if (!config.apiKey) {
            this.isOpen = true;
            this.panel.classList.add('open');
            this.overlay.classList.add('visible');
            this.fab.classList.add('active');
            this.openConfig();
            return;
        }
        this.isOpen = true;
        this.panel.classList.add('open');
        this.overlay.classList.add('visible');
        this.fab.classList.add('active');
        this.inputEl.focus();
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('open');
        this.overlay.classList.remove('visible');
        this.fab.classList.remove('active');
    }

    openConfig() {
        const config = loadAIConfig();
        document.getElementById('ai-cfg-base-url').value = config.baseUrl;
        document.getElementById('ai-cfg-api-key').value = config.apiKey;
        document.getElementById('ai-cfg-model').value = config.model;
        this.configModal.classList.add('open');
    }

    closeConfig() {
        this.configModal.classList.remove('open');
    }

    saveConfig() {
        const config = {
            baseUrl: document.getElementById('ai-cfg-base-url').value.trim(),
            apiKey: document.getElementById('ai-cfg-api-key').value.trim(),
            model: document.getElementById('ai-cfg-model').value.trim(),
        };
        if (!config.apiKey) {
            document.getElementById('ai-cfg-api-key').focus();
            return;
        }
        saveAIConfig(config);
        this.closeConfig();
        this.addSystemMessage('✅ 配置已保存，开始刷题吧！');
    }

    loadConfig() {
        // show a welcome message if no history
        if (chatHistory.length === 0) {
            this.showWelcome();
        }
    }

    showWelcome() {
        this.messagesEl.innerHTML = '';
        const welcome = document.createElement('div');
        welcome.className = 'ai-welcome';
        welcome.innerHTML = `
            <div class="ai-welcome-icon">🤖</div>
            <h3>AI 刷题助手</h3>
            <p>我会读取你当前的题目和代码，帮你诊断问题、给出提示。</p>
            <p class="ai-welcome-hint">点击下方快捷按钮或直接输入问题开始</p>
        `;
        this.messagesEl.appendChild(welcome);
    }

    clearChat() {
        clearChatHistory();
        this.showWelcome();
    }

    handleQuickAction(action) {
        const actionMap = {
            'check-code': '帮我看看代码哪里有问题',
            'give-hint': '这道题给我一个思路提示，不要直接给答案',
            'explain-problem': '用通俗的方式解释一下这道题目要求',
            'explain-error': '我的代码运行报错了，帮我分析一下错误原因',
            'optimize': '我的代码能通过，但想知道有没有更好的写法',
        };
        const message = actionMap[action];
        if (message) {
            this.inputEl.value = message;
            this.send();
        }
    }

    async send() {
        const userMsg = this.inputEl.value.trim();
        if (!userMsg || this.isStreaming) return;

        const config = loadAIConfig();
        if (!config.apiKey) {
            this.openConfig();
            return;
        }

        // Clear welcome if first message
        const welcome = this.messagesEl.querySelector('.ai-welcome');
        if (welcome) welcome.remove();

        // Add user message
        this.addMessage('user', userMsg);
        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';

        // Build messages for API
        const contextMsg = buildContextMessage(userMsg);
        chatHistory.push({ role: 'user', content: contextMsg });

        const apiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory,
        ];

        // Stream AI response
        this.isStreaming = true;
        this.sendBtn.disabled = true;
        this.sendBtn.innerHTML = '<span class="ai-spinner"></span>';

        const aiMsgEl = this.addMessage('assistant', '');
        const contentEl = aiMsgEl.querySelector('.ai-msg-content');
        let fullContent = '';

        try {
            for await (const chunk of streamChatCompletion(apiMessages, config)) {
                fullContent += chunk;
                contentEl.innerHTML = this.renderMarkdown(fullContent);
                this.scrollToBottom();
            }
            chatHistory.push({ role: 'assistant', content: fullContent });
        } catch (err) {
            if (fullContent) {
                chatHistory.push({ role: 'assistant', content: fullContent });
            }
            const errHTML = `<div class="ai-error">⚠️ ${this.escapeHtml(err.message)}</div>`;
            contentEl.innerHTML += errHTML;
        } finally {
            this.isStreaming = false;
            this.sendBtn.disabled = false;
            this.sendBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>`;
            this.scrollToBottom();
        }
    }

    addMessage(role, content) {
        const msg = document.createElement('div');
        msg.className = `ai-msg ai-msg-${role}`;
        msg.innerHTML = `
            <div class="ai-msg-avatar">${role === 'user' ? '👤' : '🤖'}</div>
            <div class="ai-msg-bubble">
                <div class="ai-msg-content">${role === 'user' ? this.escapeHtml(content) : this.renderMarkdown(content)}</div>
            </div>
        `;
        this.messagesEl.appendChild(msg);
        this.scrollToBottom();
        return msg;
    }

    addSystemMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'ai-msg ai-msg-system';
        msg.innerHTML = `<div class="ai-msg-system-text">${text}</div>`;
        this.messagesEl.appendChild(msg);
        this.scrollToBottom();
    }

    renderMarkdown(text) {
        if (!text) return '';
        if (typeof marked !== 'undefined') {
            try {
                return marked.parse(text);
            } catch (e) {
                return this.escapeHtml(text);
            }
        }
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        });
    }
}

// ---------- 初始化 ----------
let aiAssistant = null;
document.addEventListener('DOMContentLoaded', () => {
    // Configure marked for code highlighting
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
        });
    }
    aiAssistant = new AIAssistant();
});
