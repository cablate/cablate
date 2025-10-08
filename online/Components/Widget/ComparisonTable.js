class ComparisonTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['data', 'data-source'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ((name === 'data' || name === 'data-source') && newValue !== oldValue) {
            this.render();
        }
    }

    async render() {
        const data = await this.getTableData();
        
        this.shadowRoot.innerHTML = `
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 20%;"></th>
                            ${data.products.map(product => `
                                <th style="width: ${80 / data.products.length}%;">
                                    ${product.name}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.rows.map(row => `
                            <tr>
                                <td class="analysis-type">${row.type}</td>
                                ${row.cells.map(cell => `
                                    <td class="${row.type.toLowerCase().replace(/\s+/g, '-')}">
                                        <div class="section-content">${this.renderCellContent(cell)}</div>
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <style>
                /* 比較表格樣式 */
                .comparison-table {
                    max-width: 1200px;
                    margin: 3rem auto;
                    padding: 0 2rem;
                }

                .comparison-table table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e9ecef;
                }

                .comparison-table th {
                    background: #0184ff !important;
                    color: white !important;
                    padding: 2rem 1.5rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                    text-align: center;
                    border: none;
                    border-right: 1px solid white;
                    position: relative;
                }

                .comparison-table th:first-child {
                    background: #0184ff !important;
                    color: white !important;
                    font-size: 1.1rem;
                    padding: 2rem 1.5rem;
                }

                .comparison-table th:last-child {
                    border-right: none;
                }

                .comparison-table th {
                    border-bottom: 1px solid #e9ecef;
                }

                .comparison-table td {
                    padding: 2rem 1.5rem;
                    border-bottom: 1px solid #e9ecef;
                    border-right: 1px solid white;
                    vertical-align: middle;
                    background: white;
                }

                .comparison-table td:last-child {
                    border-right: none;
                }

                .comparison-table tr:last-child td {
                    border-bottom: none;
                }

                .analysis-type {
                    font-weight: 600;
                    font-size: 1.2rem;
                    background: #0184ff !important;
                    color: white !important;
                    text-align: center;
                    position: relative;
                }


                .section-content {
                    font-size: 1rem;
                    line-height: 1.8;
                    color: #555555;
                    margin: 0;
                    text-align: justify;
                }

                .section-content a {
                    color: #0184ff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .section-content a:hover {
                    color: #0056b3;
                    text-decoration: underline;
                }

                .star-display {
                    font-size: 1.2rem;
                    line-height: 1;
                    text-align: center;
                    color: #FAD75A;
                    text-shadow: 0 1px 2px rgba(250, 215, 90, 0.3);
                }

                /* 響應式設計 */
                @media (max-width: 768px) {
                    .comparison-table {
                        padding: 0 1rem;
                        margin: 2rem auto;
                    }
                    
                    .comparison-table th,
                    .comparison-table td {
                        padding: 1.5rem 1rem;
                        font-size: 0.9rem;
                    }
                    
                    .analysis-type {
                        font-size: 1rem;
                    }
                    
                    .section-content {
                        font-size: 0.9rem;
                        line-height: 1.6;
                    }
                }
            </style>
        `;
    }

    renderCellContent(cell) {
        // 檢查是否為星星評分格式 (⭐⭐⭐☆☆)
        if (typeof cell === 'string' && /^[⭐☆]+$/.test(cell)) {
            // 直接顯示星星符號，不依賴 StarRating 組件
            return `<div class="star-display">${cell}</div>`;
        }
        
        // 檢查是否為純文字內容
        return cell;
    }

    async getTableData() {
        // 檢查是否有 data-source 屬性（JSON 檔案路徑）
        const dataSource = this.getAttribute('data-source');
        if (dataSource) {
            try {
                const response = await fetch(dataSource);
                if (response.ok) {
                    return await response.json();
                } else {
                    console.warn(`無法載入數據檔案: ${dataSource}`);
                }
            } catch (e) {
                console.warn(`載入數據檔案時發生錯誤: ${dataSource}`, e);
            }
        }

        // 檢查是否有 data 屬性（內嵌 JSON 數據）
        const dataAttr = this.getAttribute('data');
        if (dataAttr) {
            try {
                return JSON.parse(dataAttr);
            } catch (e) {
                console.warn('無法解析 data 屬性:', e);
            }
        }

        // 預設數據
        return {
            products: [
                {
                    name: "社群排版工具",
                    url: "https://socialformat.brickverse.com.tw/"
                },
                {
                    name: "信用卡扣款紀錄",
                    url: "https://subscriptionchecker.brickverse.com.tw/"
                }
            ],
            rows: [
                {
                    type: "市場觀察",
                    cells: [
                        "大家都在使用社群，如 Threads、Fb、IG，在社群上，如果有好的文字排版，更容易有流量。",
                        "現代人常常利用信用卡定期定額訂閱各種產品。"
                    ]
                },
                {
                    type: "痛點",
                    cells: [
                        "目前市場上現有工具過於簡單，沒有個人常用符號，以及模板設定功能。",
                        "不知道現在到底有哪些再扣款，很難紀錄扣款日。"
                    ]
                }
            ]
        };
    }
}

// 註冊自定義元素
customElements.define('comparison-table', ComparisonTable);
