/**
 * AnimatedLink.js
 * 带图标的动画链接组件
 */

class AnimatedLink extends HTMLElement {
    // 定义观察的属性
    static get observedAttributes() {
        return ['text', 'url', 'target', 'size', 'show-icon'];
    }

    constructor() {
        super();
        
        // 设置默认属性
        this._text = '';
        this._url = '#';
        this._target = '_blank';
        this._size = '1em';
        this._showIcon = 'true'; // 默认显示图标
        
        // 默认样式设置
        this._fontSize = 'clamp(14px, 2vw, 16px)';
        this._opacity = '1';
        this._margin = '0 8px';
        this._padding = '2px 0';
        this._iconSize = 'clamp(14px, 2vw, 16px)';
        this._iconMargin = '10px';
        this._letterSpacing = '0.02em';
    }

    // 当自定义元素第一次被连接到文档DOM时被调用
    connectedCallback() {
        this.render();
        this.initStyles();
    }

    // 当自定义元素的一个属性被增加、移除或更改时被调用
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'text':
                this._text = newValue;
                break;
            case 'url':
                this._url = newValue;
                break;
            case 'target':
                this._target = newValue;
                break;
            case 'size':
                this._size = newValue;
                break;
            case 'show-icon':
                this._showIcon = newValue;
                break;
        }
        
        this.render();
    }

    render() {
        // 清空內容
        this.innerHTML = '';

        // 创建链接元素
        const link = document.createElement('a');
        link.className = 'animated-link';
        link.href = this._url;
        link.target = this._target;
        link.rel = 'noopener noreferrer';

        // 添加文本
        const text = document.createTextNode(this._text);
        link.appendChild(text);

        this.appendChild(link);
    }

    // 初始化樣式
    initStyles() {
        // 強制更新樣式，移除舊的樣式元素
        const existingStyle = document.getElementById('animated-link-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // 檢查是否在 Shadow DOM 中
        const isInShadowDOM = this.getRootNode() !== document;
        
        if (isInShadowDOM) {
            // 在 Shadow DOM 中，需要直接添加 Font Awesome 和樣式
            this.addFontAwesomeToShadow();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'animated-link-styles';

        const styles = `
            animated-link {
                display: inline-block;
            }

            .animated-link {
                color: #000000 !important;
                text-decoration: none;
                position: relative;
                transition: all 0.3s ease;
                padding-bottom: ${this._padding};
                display: inline-flex;
                align-items: center;
                margin: ${this._margin};
                font-size: ${this._size};
                opacity: ${this._opacity};
                letter-spacing: ${this._letterSpacing};
                font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
                font-weight: 600;
                will-change: opacity, transform;
            }

            .animated-link::after {
                content: '';
                position: absolute;
                width: 100%;
                transform: scaleX(0);
                height: 2px;
                bottom: -4px;
                left: 0;
                background-color: #000000;
                transform-origin: bottom right;
                transition: transform 0.3s ease-out;
            }

            .animated-link:hover {
                opacity: 1;
            }

            .animated-link:hover::after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }

            .animated-link::before {
                content: '\\f35d'; /* Font Awesome 外部链接图标 */
                font-family: 'Font Awesome 6 Free', 'Font Awesome 7 Free';
                font-weight: 900;
                font-size: ${this._iconSize};
                margin-right: ${this._iconMargin};
                opacity: ${this._showIcon === 'true' ? '1' : '0'};
                vertical-align: text-top;
                transform: translateY(0.05em);
                display: ${this._showIcon === 'true' ? 'inline-block' : 'none'};
            }
        `;

        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // 在 Shadow DOM 中添加 Font Awesome
    addFontAwesomeToShadow() {
        const shadowRoot = this.getRootNode();
        
        // 檢查是否已經添加過 Font Awesome
        if (shadowRoot.querySelector('link[href*="font-awesome"]')) {
            return;
        }

        // 添加 Font Awesome CSS
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        fontAwesomeLink.crossOrigin = 'anonymous';
        
        // 插入到 Shadow DOM 的開始
        shadowRoot.insertBefore(fontAwesomeLink, shadowRoot.firstChild);
    }

    // 静态方法用于创建链接
    static create(text, url, target = '_blank', container = document.body) {
        // 检查是否已存在相同的链接
        const existingLinks = Array.from(container.querySelectorAll('animated-link'));
        const isDuplicate = existingLinks.some(link => 
            link.getAttribute('text') === text && 
            link.getAttribute('url') === url
        );
        
        if (!isDuplicate) {
            const link = document.createElement('animated-link');
            link.setAttribute('text', text);
            link.setAttribute('url', url);
            link.setAttribute('target', target);
            container.appendChild(link);
            return link;
        }
        
        return null;
    }
}

// 注册自定义元素
customElements.define('animated-link', AnimatedLink);

// 为了向后兼容，保留静态方法
window.AnimatedLink = {
    create: function(text, url, container = null, target = '_blank', size = 'small', opacity = 0.75) {
        const link = document.createElement('animated-link');
        link.setAttribute('text', text);
        link.setAttribute('url', url);
        link.setAttribute('target', target);
        link.setAttribute('size', size);
        link.setAttribute('opacity', opacity);
        
        if (container) {
            const containerElement = document.querySelector(container);
            if (containerElement) {
                containerElement.appendChild(link);
            }
        } else {
            document.body.appendChild(link);
        }
        
        return link;
    }
}; 