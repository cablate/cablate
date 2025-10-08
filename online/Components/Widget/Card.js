/**
 * 通用卡片組件 - 重新設計版
 * 顯示各種內容的卡片，具有更好的響應式支援和佈局適應性
 *
 * 支援的屬性：
 * - title: 卡片標題
 * - description: 卡片描述
 * - topic: 主題標籤（用於高亮）
 * - highlight: 高亮狀態 ('overview' 或特定主題)
 * - width: 自訂寬度 (預設: auto)
 * - height: 自訂高度 (預設: auto)
 * - padding: 自訂內邊距 (預設: 1rem)
 * - layout: 佈局模式 ('vertical', 'horizontal') (預設: vertical)
 * - size: 卡片大小 ('small', 'medium', 'large') (預設: medium)
 *
 * CSS 變量支援：
 * --card-min-width: 最小寬度
 * --card-max-width: 最大寬度
 * --card-min-height: 最小高度
 * --card-max-height: 最大高度
 * --card-padding: 內邊距
 * --card-border-radius: 圓角
 * --primary-color: 主色調
 */

class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'description', 'topic', 'highlight', 'width', 'height', 'padding', 'layout', 'size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            // 所有屬性改變都重新渲染以確保一致性
            this.render();
        }
    }

    get title() { return this.getAttribute('title') || ''; }
    get description() { return this.getAttribute('description') || ''; }
    get topic() { return this.getAttribute('topic') || ''; }
    get highlight() { return this.getAttribute('highlight') || ''; }
    get width() { return this.getAttribute('width') || 'auto'; }
    get height() { return this.getAttribute('height') || 'auto'; }
    get padding() { return this.getAttribute('padding') || '1.5rem'; }
    get layout() { return this.getAttribute('layout') || 'vertical'; }
    get size() { return this.getAttribute('size') || 'medium'; }

    getHighlightClass() {
        const highlight = this.highlight;
        if (highlight === 'overview') {
            return 'overview-card';
        } else if (highlight === this.topic && this.topic) {
            return 'highlight-card';
        }
        return '';
    }

    getSizeClass() {
        const size = this.size;
        return `card-size-${size}`;
    }

    render() {
        const highlightClass = this.getHighlightClass();
        const sizeClass = this.getSizeClass();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    /* 預設 CSS 變量 - 使用 Brickverse 品牌顏色 */
                    --card-default-min-width: 200px;
                    --card-default-max-width: 100%;
                    --card-default-min-height: auto;
                    --card-default-max-height: none;
                    --card-default-padding: 1rem;
                    --card-default-border-radius: var(--radius-medium);
                    --card-default-background: var(--background-primary);
                    --card-default-border: 1px solid var(--border-color);

                    /* 外部可配置的變量 (向後相容) */
                    --card-min-width: var(--card-min-width, var(--card-default-min-width));
                    --card-max-width: var(--card-max-width, var(--card-default-max-width));
                    --card-min-height: var(--card-min-height, var(--card-default-min-height));
                    --card-max-height: var(--card-max-height, var(--card-default-max-height));
                    --card-padding: var(--card-padding, var(--card-default-padding));
                    --card-border-radius: var(--card-border-radius, var(--card-default-border-radius));
                    --card-background: var(--card-background, var(--card-default-background));
                    --card-border: var(--card-border, var(--card-default-border));

                    /* 顯示設定 */
                    display: block;
                    height: 100%; /* 讓 host 填滿父容器高度 */
                }

                .course-topic {
                    /* 基礎樣式 - 使用 Brickverse 品牌顏色 */
                    background: var(--card-background);
                    border: var(--card-border);
                    border-radius: var(--radius-medium);
                    padding: ${this.padding};
                    width: ${this.width === 'auto' ? '100%' : this.width};
                    height: ${this.height === 'auto' ? '100%' : this.height};
                    min-width: 200px;
                    max-width: 100%;
                    min-height: 120px; /* 確保最小高度一致 */
                    box-shadow: var(--shadow-light);

                    /* Flex 佈局 - 更好的內容適應性 */
                    display: flex;
                    flex-direction: ${this.layout === 'horizontal' ? 'row' : 'column'};
                    justify-content: ${this.layout === 'horizontal' ? 'flex-start' : 'center'};
                    align-items: ${this.layout === 'horizontal' ? 'center' : 'center'};
                    gap: ${this.layout === 'horizontal' ? '1rem' : '0.5rem'};

                    /* 互動效果 */
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    will-change: box-shadow;

                    /* 文字對齊 */
                    text-align: ${this.layout === 'horizontal' ? 'left' : 'center'};
                    
                    /* 確保填滿父容器高度 */
                    box-sizing: border-box;
                }

                .course-topic:hover {
                    box-shadow: var(--shadow-medium);
                }

                /* 大小變體 */
                .card-size-small {
                    min-width: 150px !important;
                    padding: 1rem !important;
                }

                .card-size-medium {
                    min-width: 200px !important;
                    padding: 1.5rem !important;
                }

                .card-size-large {
                    min-width: 300px !important;
                    padding: 2rem !important;
                }

                /* 高亮狀態 */
                .overview-card {
                    border: 2px solid var(--primary-blue) !important;
                    background: var(--primary-blue) !important;
                    border-radius: var(--radius-medium) !important;
                    box-shadow: var(--shadow-blue) !important;
                }

                .overview-card .topic-title {
                    color: white !important;
                }

                .overview-card .topic-description {
                    color: rgba(255, 255, 255, 0.9) !important;
                }

                .highlight-card {
                    border: 2px solid var(--primary-blue) !important;
                    background: var(--primary-blue) !important;
                    border-radius: var(--radius-medium) !important;
                    box-shadow: var(--shadow-blue) !important;
                }

                .highlight-card .topic-title {
                    color: white !important;
                }

                .highlight-card .topic-description {
                    color: rgba(255, 255, 255, 0.9) !important;
                }



                /* 標題樣式 - 使用黑色而非藍色 */
                .topic-title {
                    font-size: clamp(15px, 2vw, 17px);
                    font-weight: 600;
                    color: #000000;
                    margin: 0;
                    padding: 0;
                    line-height: 1.2;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    flex-shrink: 0;
                    letter-spacing: 0.7px;
                    font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;

                    /* 根據佈局調整 */
                    ${this.layout === 'horizontal' ? 'flex: 0 0 auto;' : ''}
                }

                /* 描述樣式 - 使用品牌顏色 */
                .topic-description {
                    font-size: clamp(14px, 2vw, 16px);
                    color: var(--text-secondary);
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                    opacity: 0.9;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;

                    /* 根據佈局調整 */
                    ${this.layout === 'horizontal' ? 'flex: 1 1 auto;' : 'text-align: center;'}
                }

                /* 響應式調整 */
                @media (max-width: 768px) {
                    .course-topic {
                        padding: 1.2rem;
                        gap: ${this.layout === 'horizontal' ? '0.75rem' : '0.25rem'};
                    }

                    .card-size-small {
                        padding: 0.8rem !important;
                    }

                    .card-size-large {
                        padding: 1.6rem !important;
                    }


                }

                @media (max-width: 480px) {
                    .course-topic {
                        padding: 0.9rem;
                        gap: ${this.layout === 'horizontal' ? '0.5rem' : '0.25rem'};
                    }

                    .card-size-small {
                        padding: 0.6rem !important;
                    }

                    .card-size-large {
                        padding: 1.2rem !important;
                    }


                }
            </style>

            <div class="course-topic ${highlightClass} ${sizeClass}">
                <h2 class="topic-title">${this.title}</h2>
                <p class="topic-description">${this.description}</p>
            </div>
        `;
    }
}

// 註冊自定義元素
customElements.define('app-card', Card);

export default Card;
