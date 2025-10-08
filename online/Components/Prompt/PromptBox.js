(function() {
    const style = document.createElement('style');
    style.textContent = `
    .prompt-box {
        position: relative;
        width: 60%;
        margin: 0 auto;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-medium);
        background-color: var(--background-primary);
        overflow: hidden;
        margin-bottom: 20px;
        opacity: 1;
        display: block;
        z-index: 11;
        box-shadow: var(--shadow-light);
        transform: none;
        /* 確保沒有任何過渡效果 */
        transition: none !important;
    }

    .prompt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--background-primary);
        padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 15px) clamp(6px, 1.5vw, 8px) clamp(15px, 2.5vw, 25px);
        border-radius: var(--radius-medium) var(--radius-medium) 0 0;
        font-size: clamp(13px, 2vw, 15px);
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: 0.7px;
        opacity: 1;
        margin: 0;
        border: 1px solid var(--border-color);
        border-bottom: none;
        box-shadow: none;
        height: auto;
        min-height: clamp(32px, 5vw, 36px);
        transform: none;
        transition: none !important;
        font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
    }

    .prompt-header span {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 1em;
        letter-spacing: 0.7px;
        display: flex;
        align-items: center;
        line-height: 1;
        margin: 0;
        padding: 0;
        font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
    }

    .prompt-box textarea {
        width: 100%;
        background-color: var(--background-primary);
        color: var(--text-primary);
        border-radius: 0 0 var(--radius-medium) var(--radius-medium);
        font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
        font-size: clamp(14px, 2vw, 16px);
        line-height: 1.5;
        resize: none;
        overflow-y: auto;
        border: 1px solid var(--border-color);
        border-top: none;
        outline: none;
        box-shadow: none;
        cursor: text;
        padding: clamp(10px, 2vw, 15px) clamp(10px, 2vw, 15px) clamp(10px, 2vw, 15px) clamp(15px, 2.5vw, 25px);
        margin: 0;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        box-sizing: border-box;
        min-height: 54px;
        position: relative;
        /* 確保沒有任何高度過渡效果 */
        transition: none !important;
    }

    .prompt-box .content-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.95);
        cursor: pointer;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        font-size: clamp(14px, 2vw, 16px);
        border-radius: var(--radius-small);
        backdrop-filter: blur(2px);
        border: 1px solid rgba(224, 224, 224, 0.3);
        transition: background-color 0.2s ease;
        font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
    }

    .prompt-box .content-mask:hover {
        background-color: rgba(255, 255, 255, 0.85);
    }

    .prompt-box .content-mask::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(85, 85, 85, 0.1), rgba(85, 85, 85, 0.2));
        pointer-events: none;
    }

    .prompt-box .content-mask.hidden {
        display: none;
    }

    .prompt-box textarea::-webkit-scrollbar {
        width: 8px;
    }

    .prompt-box textarea::-webkit-scrollbar-track {
        background: var(--background-primary);
        border-radius: var(--radius-small);
    }

    .prompt-box textarea::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: var(--radius-small);
    }

    prompt-box-element {
        display: block;
        width: 100%;
        margin-bottom: 20px;
        /* 預設較大的最小高度，避免展開效果 */
        min-height: 150px;
        /* 隱藏元素直到完全準備好 */
        opacity: 0;
        /* 確保沒有任何過渡效果 */
        transition: none !important;
    }
    
    prompt-box-element.initialized {
        opacity: 1;
        transition: none !important;
    }
    `;
    
    document.head.appendChild(style);
    
    // 在 DOMContentLoaded 之前預處理所有 prompt-box-element
    document.addEventListener('DOMContentLoaded', () => {
        preInitializePromptBoxes();
    });
    
    // 監聽頁面切換事件，確保在頁面切換時也能正確處理 PromptBox
    if (typeof Reveal !== 'undefined') {
        Reveal.addEventListener('slidechanged', () => {
            setTimeout(() => {
                preInitializePromptBoxes();
            }, 0);
        });
    }
    
    function preInitializePromptBoxes() {
        const elements = document.querySelectorAll('prompt-box-element');
        elements.forEach(element => {
            if (!element.classList.contains('pre-initialized')) {
                const rowsAttr = element.getAttribute('rows');
                const rows = Math.max(1, parseInt(rowsAttr, 10) || 1);
                const lineHeight = 24;
                const padding = 30;
                const headerHeight = 36;
                const height = (rows * lineHeight) + padding + headerHeight;
                
                element.style.minHeight = `${height}px`;
                element.classList.add('pre-initialized');
                
                const maskAttr = element.getAttribute('mask');
                const shouldShowMask = maskAttr !== 'false';
                
                if (!element.querySelector('.prompt-box')) {
                    const tempBox = document.createElement('div');
                    tempBox.className = 'prompt-box';
                    tempBox.style.opacity = '0';
                    
                    const header = document.createElement('div');
                    header.className = 'prompt-header';
                    
                    const title = document.createElement('span');
                    title.textContent = element.getAttribute('title') || '';
                    
                    const textareaContainer = document.createElement('div');
                    textareaContainer.style.position = 'relative';
                    
                    const textarea = document.createElement('textarea');
                    textarea.value = element.getAttribute('content') || '';
                    textarea.style.height = `${(rows * lineHeight) + padding}px`;
                    
                    textareaContainer.appendChild(textarea);
                    
                    if (shouldShowMask) {
                        const contentMask = document.createElement('div');
                        contentMask.className = 'content-mask';
                        contentMask.textContent = '點擊顯示內容';
                        contentMask.addEventListener('click', () => {
                            contentMask.classList.add('hidden');
                        });
                        textareaContainer.appendChild(contentMask);
                    }
                    
                    header.appendChild(title);
                    tempBox.appendChild(header);
                    tempBox.appendChild(textareaContainer);
                    
                    element.appendChild(tempBox);
                }
            }
        });
    }
})();

class PromptBox {
    static instances = new Map();

    constructor(options = {}) {
        this.options = Object.assign({
            title: '',
            content: '',
            container: document.body,
            id: null,
            rows: 1,
            mask: true
        }, options);

        // 確保 mask 選項正確處理
        if (this.options.mask === 'false' || this.options.mask === false) {
            this.options.mask = false;
        } else {
            this.options.mask = true;
        }

        if (this.options.id) {
            const existingInstance = PromptBox.instances.get(this.options.id);
            if (existingInstance) {
                existingInstance.setTitle(this.options.title);
                existingInstance.setText(this.options.content);
                return existingInstance;
            }
        }
        
        // 預先計算高度
        const lineHeight = 24;
        const padding = 30;
        const height = (this.options.rows * lineHeight) + padding;
        this._calculatedHeight = height;
        
        this.element = this.createPromptBox();
        this.init();

        if (this.options.id) {
            PromptBox.instances.set(this.options.id, this);
        }
    }
    
    createPromptBox() {
        const promptBox = document.createElement('div');
        promptBox.className = 'prompt-box';
        
        const promptHeader = document.createElement('div');
        promptHeader.className = 'prompt-header';
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = this.options.title;
        promptHeader.appendChild(titleSpan);
        
        // 延遲檢查和添加複製按鈕，確保 CopyButton 已經加載
        const addCopyButton = () => {
            if (window.CopyButton && !promptHeader.querySelector('.textarea-copy-button')) {
                const copyButton = window.CopyButton.createButton({
                    text: '複製',
                    getTextCallback: () => this.textarea?.value || ''
                });
                promptHeader.appendChild(copyButton);
            }
        };
        
        // 立即嘗試添加按鈕
        addCopyButton();
        
        // 如果 CopyButton 還沒有載入，設置延遲檢查
        if (!window.CopyButton) {
            // 使用 MutationObserver 檢查 window.CopyButton 是否可用
            const checkCopyButton = () => {
                if (window.CopyButton) {
                    addCopyButton();
                } else {
                    setTimeout(checkCopyButton, 50);
                }
            };
            setTimeout(checkCopyButton, 10);
        }
        
        const textareaContainer = document.createElement('div');
        textareaContainer.style.position = 'relative';
        
        this.textarea = document.createElement('textarea');
        this.textarea.value = this.options.content;
        
        textareaContainer.appendChild(this.textarea);
        
        // 檢查 mask 選項是否為 false 或 "false"
        if (this.options.mask !== false && this.options.mask !== "false") {
            const contentMask = document.createElement('div');
            contentMask.className = 'content-mask';
            contentMask.textContent = '點擊顯示內容';
            contentMask.addEventListener('click', () => {
                contentMask.classList.add('hidden');
            });
            textareaContainer.appendChild(contentMask);
        }
        
        this.textarea.rows = this.options.rows;
        this.textarea.style.overflow = 'hidden';
        
        // 立即設置正確的高度
        this.textarea.style.height = `${this._calculatedHeight}px`;
        this.textarea.style.minHeight = `${this._calculatedHeight}px`;
        
        promptBox.appendChild(promptHeader);
        promptBox.appendChild(textareaContainer);
        
        // 立即更新文本區域高度
        this.updateTextareaHeight(this.options.rows);
        
        return promptBox;
    }
    
    init() {
        if (this.options.container) {
            // 確保容器已經有足夠的高度
            if (this.options.container instanceof HTMLElement && 
                this.options.container.tagName.toLowerCase() === 'prompt-box-element') {
                const lineHeight = 24;
                const padding = 30;
                const headerHeight = 36;
                const height = (this.options.rows * lineHeight) + padding + headerHeight;
                this.options.container.style.minHeight = `${height}px`;
            }
            
            if (this.options.container instanceof jQuery) {
                this.options.container.append(this.element);
            } else {
                this.options.container.appendChild(this.element);
            }
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.options.id) {
            PromptBox.instances.delete(this.options.id);
        }
    }
    
    getText() {
        return this.textarea?.value || '';
    }
    
    setText(text) {
        if (this.textarea) {
            this.textarea.value = text;
        }
    }
    
    setTitle(title) {
        const titleSpan = this.element.querySelector('.prompt-header span');
        if (titleSpan) {
            titleSpan.textContent = title;
        }
    }

    static autoResizeTextarea(textarea) {
        if (!textarea) return;
        
        const originalHeight = textarea.style.height;
        
        textarea.style.height = 'auto';
        
        const scrollHeight = textarea.scrollHeight;
        const minHeight = parseInt(textarea.getAttribute('data-min-height') || '0', 10);
        
        const newHeight = Math.max(scrollHeight, minHeight);
        textarea.style.height = `${newHeight}px`;
        
        if (textarea.style.height === 'auto') {
            textarea.style.height = originalHeight;
        }
    }

    updateTextareaHeight(rows) {
        if (!this.textarea || rows <= 0) return;

        const lineHeight = 24;
        const padding = 30;
        const height = (rows * lineHeight) + padding;
        
        this.textarea.setAttribute('data-min-height', height.toString());
        
        this.textarea.style.height = `${height}px`;
        this.textarea.style.minHeight = `${height}px`;
        
        this.textarea.rows = rows;
        
        this.options.rows = rows;
        
        PromptBox.autoResizeTextarea(this.textarea);
        
        this.textarea.removeEventListener('input', this._resizeHandler);
        
        this._resizeHandler = () => {
            PromptBox.autoResizeTextarea(this.textarea);
        };
        
        this.textarea.addEventListener('input', this._resizeHandler);
        this.textarea.setAttribute('data-auto-resize', 'true');
    }

    setRows(rows) {
        this.updateTextareaHeight(rows);
    }
}

class PromptBoxElement extends HTMLElement {
    constructor() {
        super();
        this._title = '';
        this._content = '';
        this._rows = 1;
        this._mask = true;
        this._promptBox = null;
        this._initialized = false;
        this._observer = null;
        
        // 預先計算高度
        const rowsAttr = this.getAttribute('rows');
        const rows = Math.max(1, parseInt(rowsAttr, 10) || 1);
        const lineHeight = 24;
        const padding = 30;
        const headerHeight = 36;
        const height = (rows * lineHeight) + padding + headerHeight;
        this.style.minHeight = `${height}px`;
    }

    static get observedAttributes() {
        return ['title', 'content', 'rows', 'mask'];
    }

    connectedCallback() {
        if (this._initialized) return;
        
        this._title = this.getAttribute('title') || '';
        this._content = this.getAttribute('content') || '';
        const rowsAttr = this.getAttribute('rows');
        this._rows = Math.max(1, parseInt(rowsAttr, 10) || 1);
        
        // 明確檢查 mask 屬性是否為 "false" 字符串
        const maskAttr = this.getAttribute('mask');
        
        // 檢查 mask 屬性是否存在，如果不存在則使用預設值 true
        if (maskAttr === null || maskAttr === undefined || maskAttr === '') {
            // 檢查是否在 index.html 中有設置 mask 屬性
            const htmlElement = document.querySelector(`prompt-box-element[title="${this._title}"]`);
            if (htmlElement) {
                const htmlMaskAttr = htmlElement.getAttribute('mask');
                this._mask = htmlMaskAttr !== 'false';
            } else {
                this._mask = true;
            }
        } else {
            this._mask = maskAttr !== 'false';
        }
        
        // 確保元素在渲染前是隱藏的
        this.style.opacity = '0';
        
        // 立即渲染
        this.render();
        
        // 設置觀察器
        this._observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'rows') {
                        const newRows = Math.max(1, parseInt(this.getAttribute('rows'), 10) || 1);
                        if (newRows !== this._rows) {
                            this._rows = newRows;
                            if (this._promptBox) {
                                this._promptBox.setRows(this._rows);
                            }
                        }
                    } else if (mutation.attributeName === 'content') {
                        const newContent = this.getAttribute('content') || '';
                        if (newContent !== this._content) {
                            this._content = newContent;
                            if (this._promptBox) {
                                this._promptBox.setText(this._content);
                                if (this._promptBox && this._promptBox.textarea) {
                                    PromptBox.autoResizeTextarea(this._promptBox.textarea);
                                }
                            }
                        }
                    } else if (mutation.attributeName === 'mask') {
                        // 遮罩屬性變更時需要重新渲染整個元素
                        const newMask = this.getAttribute('mask') !== 'false';
                        if (newMask !== this._mask) {
                            this._mask = newMask;
                            this.render();
                        }
                    }
                }
            });
        });

        this._observer.observe(this, {
            attributes: true,
            attributeFilter: ['rows', 'content', 'title', 'mask']
        });

        if (this._promptBox && this._promptBox.textarea) {
            this._promptBox.setRows(this._rows);
        }
        
        // 標記為已初始化
        this._initialized = true;
        this.classList.add('initialized');
        
        // 立即顯示元素，不使用任何過渡效果
        this.style.opacity = '1';
    }

    disconnectedCallback() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        if (this._promptBox) {
            this._promptBox.destroy();
            this._promptBox = null;
        }
        this._initialized = false;
    }

    render() {
        if (this._promptBox) {
            this._promptBox.destroy();
        }

        const id = this.id || `promptbox-${Math.random().toString(36).substr(2, 9)}`;
        
        this._promptBox = new PromptBox({
            title: this._title,
            content: this._content,
            container: this,
            id: id,
            rows: this._rows,
            mask: this._mask
        });

        if (this._promptBox) {
            this._promptBox.setRows(this._rows);
        }
    }

    setRows(rows) {
        if (this._promptBox) {
            this._promptBox.setRows(rows);
        }
    }

    getText() {
        return this._promptBox?.getText() || '';
    }

    setText(text) {
        if (this._promptBox) {
            this._promptBox.setText(text);
        }
    }

    setTitle(title) {
        if (this._promptBox) {
            this._promptBox.setTitle(title);
        }
    }
}

if (!customElements.get('prompt-box-element')) {
    customElements.define('prompt-box-element', PromptBoxElement);
}

// 在頁面切換時預處理所有 PromptBox
if (typeof Reveal !== 'undefined') {
    Reveal.addEventListener('slidechanged', () => {
        setTimeout(() => {
            window.PromptBox.resizeAllTextareas();
        }, 0);
    });
}

window.PromptBox = {
    create: (options) => new PromptBox(options),
    element: PromptBoxElement,
    getInstance: (id) => PromptBox.instances.get(id),
    destroyInstance: (id) => {
        const instance = PromptBox.instances.get(id);
        if (instance) {
            instance.destroy();
        }
    },
    autoResizeTextarea: PromptBox.autoResizeTextarea,
    
    resizeAllTextareas: () => {
        const promptBoxElements = document.querySelectorAll('prompt-box-element');
        if (promptBoxElements.length > 0) {
            promptBoxElements.forEach(element => {
                const textarea = element.querySelector('textarea');
                if (textarea) {
                    const rowsAttr = element.getAttribute('rows');
                    const rows = Math.max(1, parseInt(rowsAttr, 10) || 1);
                    
                    const instance = element._promptBox;
                    if (instance) {
                        instance.setRows(rows);
                    } else {
                        PromptBox.autoResizeTextarea(textarea);
                    }
                }
            });
        }
    }
}; 