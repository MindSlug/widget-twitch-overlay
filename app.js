class ChatOverlay {
    constructor() {
        this.settings = this.initSettings();
        this.container = document.getElementById('chat-container');
        this.applyDynamicStyles();
        this.connect();
    }

    initSettings() {
        const urlParams = new URLSearchParams(window.location.search);
        const settings = { ...DEFAULT_SETTINGS };

        Object.keys(DEFAULT_SETTINGS).forEach(key => {
            if (urlParams.has(key)) {
                let val = urlParams.get(key);
                if (key === 'blacklistedUsers') {
                    settings[key] = val.split(',').map(u => u.trim().toLowerCase());
                    return;
                }

                // todo: refactor later, don't like it
                if (val === 'true') val = true;
                else if (val === 'false') val = false;
                else if (!isNaN(val) && val !== "") val = parseFloat(val);
                settings[key] = val;
            }
        });
        return settings;
    }

    applyDynamicStyles() {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', this.settings.backgroundColor);
        root.style.setProperty('--text-color', this.settings.textColor);
        root.style.setProperty('--font-size', this.settings.fontSize.includes('px') ? this.settings.fontSize : `${this.settings.fontSize}px`);
        root.style.setProperty('--twitch-color', this.settings.twitchColor);
        root.style.setProperty('--youtube-color', this.settings.youtubeColor);
    }

    connect() {
        this.ws = new WebSocket(this.settings.websocketUrl);
        this.ws.onopen = () => this.subscribe();
        this.ws.onmessage = (e) => this.handleEvent(JSON.parse(e.data));
        this.ws.onclose = () => setTimeout(() => this.connect(), 5000);
    }

    subscribe() {
        this.ws.send(JSON.stringify({
            request: "Subscribe",
            events: { Twitch: ["ChatMessage"], YouTube: ["Message"] },
            id: "chat-overlay-id"
        }));
    }

    handleEvent(payload) {
        if (!payload.event || !payload.data) return;
        const source = payload.event.source;
        const type = payload.event.type;
        const messageData = payload.data.message;

        const username = (messageData.username || messageData.user || "").toLowerCase();
        if (this.settings.blacklistedUsers.includes(username)) return;

        if ((source === 'Twitch' && type === 'ChatMessage') || (source === 'YouTube' && type === 'Message')) {
            this.renderMessage(source, messageData);
        }
    }

    parseContent(message, emotes) {
        if (!emotes || emotes.length === 0) return this.escapeHTML(message);

        const emoteMap = new Map();
        emotes.forEach(e => emoteMap.set(e.name, e.imageUrl));

        const words = message.split(/(\s+)/);

        return words.map(word => {
            if (emoteMap.has(word)) {
                const url = emoteMap.get(word);
                return `<img src="${url}" class="emote" alt="${this.escapeHTML(word)}">`;
            }
            return this.escapeHTML(word);
        }).join('');
    }

    renderMessage(source, data) {
        const messageEl = document.createElement('div');
        const platformClass = source === 'Twitch' ? 'platform-twitch' : 'platform-youtube';
        messageEl.className = `chat-message ${platformClass}`;

        const badgesHtml = this.settings.showBadges && data.badges
            ? `<span class="badges">${data.badges.map(b => `<img src="${b.imageUrl}" />`).join('')}</span>`
            : '';

        const parsedContent = this.parseContent(data.message, data.emotes);

        messageEl.innerHTML = `
            <div class="chat-header">
                ${badgesHtml}
                <span style="color: ${data.color || '#fff'}">${this.escapeHTML(data.displayName)}</span>
            </div>
            <div class="message-content">${parsedContent}</div>
        `;

        this.container.appendChild(messageEl);

        while (this.container.childNodes.length > this.settings.maxMessages) {
            this.container.removeChild(this.container.firstChild);
        }

        if (this.settings.messageTimeOut > 0) {
            setTimeout(() => {
                messageEl.style.animation = 'fadeOut 0.5s forwards';
                setTimeout(() => messageEl.remove(), 500);
            }, this.settings.messageTimeOut);
        }
    }

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => new ChatOverlay());