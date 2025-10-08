/**
 * ===== CopyButton 組件庫 =====
 * 處理所有複製按鈕的功能
 */

// 添加组件样式
(function() {
    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
    /* 修改複製按鈕樣式 - 使用品牌顏色 */
    .textarea-copy-button {
        position: relative;
        margin: 0 0 0 auto;
        background-color: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-small);
        padding: 5px 12px;
        font-size: 0.8em;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        width: 68px;
        min-width: 68px;
        text-align: center;
        box-shadow: none;
        font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
    }

    .textarea-copy-button:hover {
        background-color: var(--primary-blue) !important;
        color: white !important;
        border-color: var(--primary-blue);
        outline: none;
        transform: none;
        box-shadow: var(--shadow-light);
        transition: all 0.2s ease;
    }

    .textarea-copy-button:active {
        background-color: var(--background-tertiary) !important;
        transform: none;
    }

    .textarea-copy-button i {
        font-size: 11px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        transition: color 0.2s ease;
        color: var(--text-secondary);
    }

    .textarea-copy-button:hover i {
        transform: none;
        color: white;
    }
    `;
    
    // 将样式添加到文档头部
    if (document.head) {
        document.head.appendChild(style);
    } else {
        // 如果 document.head 還不存在，等待 DOM 載入
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
        });
    }
})();

/**
 * CopyButton 類
 * 處理複製按鈕的功能
 */
class CopyButton {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {string|HTMLElement} options.selector - 按钮选择器或按钮元素
     * @param {Function} options.getTextCallback - 获取要复制文本的回调函数
     */
    constructor(options = {}) {
        this.options = Object.assign({
            selector: '.textarea-copy-button',
            getTextCallback: null
        }, options);
        
        this.init();
    }
    
    /**
     * 初始化复制按钮
     */
    init() {
        // 获取所有复制按钮
        const buttons = typeof this.options.selector === 'string' 
            ? document.querySelectorAll(this.options.selector)
            : [this.options.selector];
        
        // 为每个按钮添加点击事件
        buttons.forEach(button => {
            if (button) {
                // 检查按钮是否已经有图标，如果没有则添加
                if (!button.querySelector('i')) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-copy';
                    button.prepend(icon);
                }
                button.addEventListener('click', this.handleClick.bind(this));
            }
        });
    }
    
    /**
     * 处理按钮点击事件
     * @param {Event} event - 点击事件
     */
    handleClick(event) {
        const button = event.currentTarget;
        
        // 获取要复制的文本
        let text = '';
        
        // 如果提供了回调函数，则使用回调函数获取文本
        if (typeof this.options.getTextCallback === 'function') {
            text = this.options.getTextCallback(button);
        } else {
            // 默认行为：查找最近的textarea元素
            const textarea = button.closest('.prompt-box')?.querySelector('textarea');
            if (textarea) {
                text = textarea.value;
            }
        }
        
        // 复制文本
        if (text) {
            this.copyToClipboard(text, button);
        }
    }
    
    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @param {HTMLElement} button - 触发复制的按钮
     * @returns {Promise<boolean>} - 复制是否成功
     */
    async copyToClipboard(text, button) {
        const originalButtonHTML = button.innerHTML;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                this.showSuccess(button, originalButtonHTML);
                return true;
            } else {
                const success = this.fallbackCopy(text);
                if (success) {
                    this.showSuccess(button, originalButtonHTML);
                } else {
                    this.showError(button, originalButtonHTML);
                }
                return success;
            }
        } catch (err) {
            console.error('复制失败:', err);
            this.showError(button, originalButtonHTML);
            return false;
        }
    }

    /**
     * 显示成功状态
     * @private
     */
    showSuccess(button, originalHTML) {
        button.innerHTML = '已複製';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }

    /**
     * 显示错误状态
     * @private
     */
    showError(button, originalHTML) {
        button.innerHTML = '<i class="fas fa-times"></i>失敗';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }

    /**
     * 回退复制方法
     * @private
     */
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
    
    /**
     * 静态方法：创建复制按钮
     * @param {Object} options - 按钮配置
     * @param {string} options.text - 按钮文本
     * @param {string} options.className - 按钮类名，默认为 'textarea-copy-button'
     * @param {HTMLElement} options.container - 按钮容器
     * @param {Function} options.getTextCallback - 获取要复制文本的回调函数
     * @returns {HTMLElement} - 创建的按钮元素
     */
    static createButton(options = {}) {
        const defaults = {
            text: '複製',
            className: 'textarea-copy-button',
            container: document.body,
            getTextCallback: null
        };
        
        const settings = Object.assign({}, defaults, options);
        
        // 创建按钮元素
        const button = document.createElement('button');
        button.className = settings.className;
        button.innerHTML = `<i class="fas fa-copy"></i>${settings.text}`;
        
        // 添加到容器
        if (settings.container) {
            if (settings.container instanceof jQuery) {
                settings.container.append(button);
            } else {
                settings.container.appendChild(button);
            }
        }
        
        // 初始化复制功能
        new CopyButton({
            selector: button,
            getTextCallback: settings.getTextCallback
        });
        
        return button;
    }

    /**
     * 顯示複製成功訊息
     * @param {HTMLElement} button - 觸發複製的按鈕
     */
    showCopyMessage(button) {
        const messageElement = button.parentElement.querySelector('.copy-message');
        
        // 顯示複製成功訊息
        if (messageElement) {
            messageElement.textContent = '已複製！';
            
            // 添加按鈕動畫
            if (typeof gsap !== 'undefined') {
                gsap.to(button, {
                    scale: 1.1,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
                
                // 添加訊息動畫
                gsap.fromTo(messageElement,
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.3 }
                );
                
                // 2秒後清除訊息
                setTimeout(() => {
                    gsap.to(messageElement, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            messageElement.textContent = '';
                            messageElement.style.opacity = '';
                        }
                    });
                }, 2000);
            }
        }
    }

    /**
     * 複製文本到剪貼板的靜態方法
     * @param {string} text - 要複製的文本
     * @param {HTMLElement} button - 觸發複製的按鈕
     */
    static copyPrompt(text, button) {
        // 使用CopyButton.js中的功能
        if (window.CopyButton) {
            const copyButton = new CopyButton();
            copyButton.copyToClipboard(text, button);
        } else if (window.PromptBox && window.PromptBox.copyToClipboard) {
            // 如果CopyButton未加載但PromptBox可用，則使用PromptBox
            window.PromptBox.copyToClipboard(text, button);
        } else {
            // 如果都未加載，則顯示控制台錯誤
            console.error('複製功能未初始化');
            
            // 直接更新按鈕文本
            if (button) {
                const originalButtonHTML = button.innerHTML;
                button.innerHTML = '<i class="fa-solid fa-xmark"></i> 失敗';
                setTimeout(() => {
                    button.innerHTML = originalButtonHTML;
                }, 2000);
            }
        }
    }
}

// 立即导出组件到 window 对象，不等待 DOMContentLoaded
window.CopyButton = CopyButton;

// 初始化所有现有的复制按钮（等待 DOM 載入）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        new CopyButton();
    });
} else {
    // DOM 已經載入完成
    new CopyButton();
} 