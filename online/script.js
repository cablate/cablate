

/**
 * 共用工具函數
 */
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    checkScriptLoaded(scriptPath) {
        return Array.from(document.querySelectorAll('script')).some(script => 
            script.src.includes(scriptPath)
        );
    }
};



/**
 * 幻燈片管理器
 */
const SlideManager = {
    fixSlideVisibility() {
        // 只處理當前幻燈片中的 textarea，不干預 Reveal.js 的顯示邏輯
        const currentSlide = Reveal.getCurrentSlide();
        if (currentSlide) {
            const textareas = currentSlide.querySelectorAll('textarea');
            if (textareas.length > 0 && window.PromptBox) {
                textareas.forEach(textarea => {
                    window.PromptBox.autoResizeTextarea(textarea);
                });
            }
        }
    },
    
    forceSlideCleanup() {
        // 移除強制清理邏輯，讓 Reveal.js 自己處理幻燈片狀態
        // 只處理當前幻燈片中的 textarea，不干預 Reveal.js 的顯示邏輯
        const currentSlide = Reveal.getCurrentSlide();
        if (currentSlide) {
            const textareas = currentSlide.querySelectorAll('textarea');
            if (textareas.length > 0 && window.PromptBox) {
                textareas.forEach(textarea => {
                    window.PromptBox.autoResizeTextarea(textarea);
                });
            }
        }
    },
    
    handleSlideChange(event) {
        requestAnimationFrame(() => {
            // 只處理必要的功能，不干預 Reveal.js 的顯示邏輯
            this.forceSlideCleanup();
            this.updateCourseNavigation();
        });
    },
    
    updateCourseNavigation() {
        if (window.slideChangedDebounce) {
            clearTimeout(window.slideChangedDebounce);
        }
        
        window.slideChangedDebounce = setTimeout(() => {
            const currentPage = Reveal.getIndices().h + 1;
            
            if (typeof window.updateCurrentPage === 'function') {
                try {
                    window.updateCurrentPage(currentPage);
                } catch (error) {
                    console.error('調用 updateCurrentPage 時出錯:', error);
                }
            } else {
                // 已移除自動載入 CourseProgressManager.js
            }
            
            const courseUnitsElements = document.querySelectorAll('course-units');
            if (courseUnitsElements.length > 0) {
                courseUnitsElements.forEach(element => {
                    element.setAttribute('current-page', currentPage);
                });
            }
        }, 100);
    }
};

/**
 * 提示框管理器
 */
const PromptBoxManager = {
    initializePromptBoxElements() {
        try {
            const promptBoxElements = document.querySelectorAll('prompt-box-element');
            if (promptBoxElements.length > 0 && window.PromptBox) {
                promptBoxElements.forEach(element => {
                    const textarea = element.querySelector('textarea');
                    if (textarea) {
                        window.PromptBox.autoResizeTextarea(textarea);
                    }
                });
            }
        } catch (error) {
            console.error('初始化prompt-box-element元素失敗:', error);
        }
    }
};






/**
 * 應用程式初始化
 */
async function initializeApp() {
    try {
        // PromptBox 和 CopyButton 已經在 index.html 中直接引入
        
        // 初始化 PageShow 組件
        if (typeof PageShow !== 'undefined') {
            window.pageShow = new PageShow({
                container: 'body',
                revealInstance: Reveal
            });
        }
        
        // 移除重複的幻燈片顯示管理，讓 Reveal.js 自己處理
        
        PromptBoxManager.initializePromptBoxElements();
    } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
    }
}

/**
 * 初始化 Reveal.js
 */
function initReveal() {
    if (typeof Reveal !== 'undefined') {
        // 檢查 URL 參數決定是否啟用 fragment 功能
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const enableFragments = mode == 'presenter'; // 只有非 review 模式才啟用 fragments

        Reveal.initialize({
            controls: false,
            progress: false,
            history: true,
            center: true,
            transition: 'fade',
            a11y: {
                preventAriaHiddenFocus: true
            },
            keyboard: true,
            focusBodyOnPageVisibilityChange: false,
            display: 'flex',
            viewDistance: 1,
            hideInactiveCursor: true,
            touch: true,
            help: false,
            disableLayout: false,
            fragments: enableFragments, // 根據模式啟用或關閉 fragments
            embedded: false
        });
    } else {
        console.error('Reveal.js 尚未載入');
    }
}

/**
 * 設置事件監聽器
 */
function setupEventListeners() {
    // DOMContentLoaded 事件 - 合併初始化邏輯
    document.addEventListener('DOMContentLoaded', function() {
        // 檢查 URL 參數並設定 review 模式
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        if (mode === 'review') {
            document.body.classList.add('review-mode');
        }

        // 先初始化 Reveal.js
        initReveal();

        // GSAP 初始化
        if (typeof gsap !== 'undefined') {
            gsap.config({ force3D: true });
            gsap.to('body', { duration: 0.1, opacity: 1, ease: 'none' });
        }

        // 延遲初始化應用
        setTimeout(() => {
            initializeApp();
            SlideManager.fixSlideVisibility();
            SlideManager.forceSlideCleanup();

            // 啟用鍵盤控制
            if (typeof Reveal !== 'undefined') {
                Reveal.configure({ keyboard: true });
            }
        }, 100);
    });
    
    // Load 事件
    window.addEventListener('load', function() {
        setTimeout(function() {
            const pageLoader = document.getElementById('page-loader');
            if (pageLoader && typeof pageLoader.hide === 'function') {
                pageLoader.hide();
            }
            
            if (window.PromptBox && typeof window.PromptBox.resizeAllTextareas === 'function') {
                window.PromptBox.resizeAllTextareas();
            }
        }, 300);

    });
    

    
    // Slidechanged 事件
    Reveal.addEventListener('slidechanged', function(event) {
        SlideManager.handleSlideChange(event);
    });
}

/**
 * 註冊自定義元素
 */
function registerCustomElements() {
    // 已移除 people-check 元素註冊
}

/**
 * 主要初始化函數
 */
function init() {
    registerCustomElements();
    setupEventListeners();
}



// 執行主初始化
init();