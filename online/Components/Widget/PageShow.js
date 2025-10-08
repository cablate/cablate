/**
 * PageShow.js
 * 顯示當前頁碼的元件，放置在每頁中間下方位置
 */

class PageShow {
    constructor(options = {}) {
        this.options = Object.assign({
            container: 'body',
            revealInstance: null  // 不再接收 Reveal 建構函式
        }, options);
        
        this.$container = $(this.options.container);
        this.$pageShowContainer = null;
        
        // 等待 Reveal 初始化
        this.waitForReveal().then(() => {
            this.init();
        }).catch(error => {
            console.error('Reveal 初始化失敗:', error);
        });
    }
    
    // 等待 Reveal 初始化
    waitForReveal() {
        return new Promise((resolve, reject) => {
            // 如果 Reveal 已經初始化
            if (window.Reveal && typeof window.Reveal.isReady === 'function' && window.Reveal.isReady()) {
                resolve();
                return;
            }

            // 如果 Reveal 存在但未初始化，等待 ready 事件
            if (window.Reveal) {
                window.Reveal.addEventListener('ready', () => {
                    resolve();
                });
            } else {
                // 如果 Reveal 不存在，定期檢查
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (window.Reveal && typeof window.Reveal.isReady === 'function' && window.Reveal.isReady()) {
                        clearInterval(checkInterval);
                        resolve();
                    } else if (attempts >= 10) {  // 最多等待 5 秒
                        clearInterval(checkInterval);
                        reject(new Error('Reveal 未能在指定時間內初始化'));
                    }
                }, 500);
            }
        });
    }
    
    init() {
        // 注入樣式
        this.injectStyles();
        
        // 創建頁碼顯示元素
        this.createPageShow();
        
        // 監聽幻燈片切換事件
        if (window.Reveal) {
            window.Reveal.addEventListener('slidechanged', this.handleSlideChange.bind(this));
        }
        
        // 初始化時更新頁碼
        this.updatePageNumber();
        
        // 檢查使用者登入狀態
        this.checkLoginStatus();
        
        // 監聽登入狀態變化
        this.setupLoginStateListener();
    }
    
    injectStyles() {
        // 檢查是否已載入 Font Awesome，若否則自動插入 CDN
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
            document.head.appendChild(faLink);
        }
        const styles = `
            .page-show-container {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                z-index: 1000;
            }
            .page-show, .page-switch-btn {
                width: 50px;
                height: 50px;
                background-color: var(--background-primary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                font-size: 20px;
                font-family: 'IBM Plex Sans JP', 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                opacity: 1;
                margin: 0 10px;
                border: none;
                cursor: pointer;
                transition: background 0.2s;
            }
            .page-switch-btn:hover {
                background: #007bff !important;
                color: white !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2) !important;
            }
            .page-switch-btn i {
                pointer-events: none;
            }
        `;

        // 創建 style 元素並添加到 head
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
    
    // 處理幻燈片切換事件
    handleSlideChange() {
        this.updatePageNumber();
        
        if (this.isUserLoggedIn()) {
            this.show();
        }
    }
    
    createPageShow() {
        try {
            // 先移除已存在的頁碼容器
            $('.page-show-container').remove();
            // 創建外層容器
            this.$pageShowContainer = $('<div>', {
                'class': 'page-show-container'
            });
            // 左按鈕
            const $leftBtn = $('<button>', {
                'class': 'page-switch-btn',
                'aria-label': '上一頁',
                'html': '<i class="fa fa-chevron-left"></i>'
            });
            // 頁碼圓圈
            const $pageShow = $('<div>', {
                'class': 'page-show'
            });
            // 右按鈕
            const $rightBtn = $('<button>', {
                'class': 'page-switch-btn',
                'aria-label': '下一頁',
                'html': '<i class="fa fa-chevron-right"></i>'
            });
            
            // 綁定事件，使用箭頭函式保持 this 上下文
            const handlePrevClick = () => {
                if (window.Reveal && typeof window.Reveal.isReady === 'function' && window.Reveal.isReady()) {
                    window.Reveal.prev();  // 使用 prev() 而不是 slidePrev()
                }
            };
            
            const handleNextClick = () => {
                if (window.Reveal && typeof window.Reveal.isReady === 'function' && window.Reveal.isReady()) {
                    window.Reveal.next();  // 使用 next() 而不是 slideNext()
                }
            };
            
            $leftBtn.on('click', handlePrevClick);
            $rightBtn.on('click', handleNextClick);
            
            // 組合
            this.$pageShowContainer.append($leftBtn, $pageShow, $rightBtn);
            // 加到頁面
            this.$container.append(this.$pageShowContainer);
            // 更新頁碼
            this.updatePageNumber();
            // 初始時根據登入狀態決定是否顯示
            if (!this.isUserLoggedIn()) {
                this.hide();
            }
        } catch (error) {
            console.error('Error creating page show:', error);
        }
    }
    
    updatePageNumber() {
        if (window.Reveal && typeof window.Reveal.getIndices === 'function') {
            const indices = window.Reveal.getIndices();
            if (indices && typeof indices.h !== 'undefined') {
                const currentIndex = indices.h;
                if (this.$pageShowContainer) {
                    this.$pageShowContainer.find('.page-show').text(`${currentIndex + 1}`);
                }
            }
        }
    }
    
    // 檢查使用者是否已登入
    isUserLoggedIn() {
        return localStorage.getItem('hasEnteredCourse') === 'true' && localStorage.getItem('userName');
    }
    
    // 檢查登入狀態並更新頁碼顯示
    checkLoginStatus() {
        if (this.isUserLoggedIn()) {
            this.show();
        } else {
            this.hide();
        }
    }
    
    // 監聽登入狀態變化
    setupLoginStateListener() {
        // 使用 localStorage 事件監聽器
        window.addEventListener('storage', (event) => {
            if (event.key === 'hasEnteredCourse' || event.key === 'userName') {
                this.checkLoginStatus();
            }
        });
        
        // 定期檢查登入狀態（備用方案）
        setInterval(() => {
            this.checkLoginStatus();
        }, 1000);
    }
    
    // 顯示頁碼
    show() {
        if (this.$pageShowContainer) {
            this.$pageShowContainer.show();
        }
    }
    
    // 隱藏頁碼
    hide() {
        if (this.$pageShowContainer) {
            this.$pageShowContainer.hide();
        }
    }
    
    // 銷毀元件
    destroy() {
        // 移除事件監聽器
        if (window.Reveal) {
            window.Reveal.removeEventListener('slidechanged', this.handleSlideChange);
        }
        
        // 移除頁碼容器
        if (this.$pageShowContainer) {
            this.$pageShowContainer.remove();
        }
    }
}

// 導出元件
window.PageShow = PageShow; 