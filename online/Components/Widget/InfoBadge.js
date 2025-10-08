/**
 * 資訊徽章組件
 * 用於顯示活動資訊，如分組人數、時間等
 * 
 * 支援的屬性：
 * - text: 顯示文字
 * - size: 大小 ('small', 'medium', 'large') (預設: medium)
 */

class InfoBadge extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['text', 'size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get text() { return this.getAttribute('text') || ''; }
    get size() { return this.getAttribute('size') || 'medium'; }

    initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                color: white;
                background: var(--primary-blue, #0184ff);
                padding: 8px 20px;
                border-radius: var(--radius-large, 16px);
                box-shadow: var(--shadow-blue, 0 2px 8px rgba(1, 132, 255, 0.2));
                font-weight: 600;
                transition: all 0.2s ease;
                height: auto;
                min-height: 36px;
            }

            :host(:hover) {
                background: var(--primary-blue-light, #33a1ff);
                box-shadow: var(--shadow-blue, 0 4px 16px rgba(1, 132, 255, 0.3));
            }

            .text {
                color: white;
                font-weight: 600;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }

            /* 大小變體 */
            :host([size="small"]) {
                font-size: 1.1rem;
                padding: 6px 14px;
                min-height: 28px;
            }

            :host([size="large"]) {
                font-size: 1.5rem;
                padding: 10px 24px;
                min-height: 44px;
            }

            /* 響應式設計 */
            @media (max-width: 768px) {
                :host {
                    font-size: 1.2rem;
                    padding: 8px 18px;
                    min-height: 32px;
                }

                :host([size="small"]) {
                    font-size: 1rem;
                    padding: 6px 12px;
                    min-height: 26px;
                }

                :host([size="large"]) {
                    font-size: 1.3rem;
                    padding: 10px 22px;
                    min-height: 40px;
                }
            }

            /* 無障礙設計 - 尊重動畫偏好設定 */
            @media (prefers-reduced-motion: reduce) {
                :host {
                    transition: none;
                }
            }
        `;
        return style;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.initStyles().outerHTML}
            <span class="text">${this.text}</span>
        `;
    }
}

// 註冊自定義元素
customElements.define('info-badge', InfoBadge);

export default InfoBadge;
