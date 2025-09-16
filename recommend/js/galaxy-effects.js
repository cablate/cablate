// Galaxy Theme Interactive Effects

document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect on mouse move
    const heroSection = document.querySelector('.hero-section');
    const productCards = document.querySelectorAll('.product-card');
    const categoryCards = document.querySelectorAll('.category-card');

    // Mouse parallax for hero section
    if (heroSection) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            heroSection.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
        });
    }

    // Subtle hover effect - removed aggressive 3D tilt
    function addHoverEffect(cards) {
        cards.forEach(card => {
            // Simply use CSS hover effects, no JavaScript 3D tilt needed
            card.addEventListener('mouseenter', function(e) {
                this.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('mouseleave', function(e) {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }

    addHoverEffect(productCards);
    addHoverEffect(categoryCards);

    // Dynamic stars generation
    function createStars() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'dynamic-stars';
        starsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: twinkle ${2 + Math.random() * 3}s infinite;
                opacity: ${Math.random()};
            `;
            starsContainer.appendChild(star);
        }

        document.body.appendChild(starsContainer);
    }

    // Add twinkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }

        @keyframes shootingStar {
            0% {
                transform: translateX(0) translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateX(300px) translateY(300px);
                opacity: 0;
            }
        }

        .shooting-star {
            position: fixed;
            width: 3px;
            height: 3px;
            background: linear-gradient(45deg, transparent, white, transparent);
            border-radius: 50%;
            animation: shootingStar 1s linear;
            pointer-events: none;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    createStars();

    // Shooting star effect
    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.top = Math.random() * window.innerHeight * 0.5 + 'px';
        star.style.left = Math.random() * window.innerWidth + 'px';

        document.body.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 1000);
    }

    // Create shooting stars periodically
    setInterval(createShootingStar, 3000);

    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Subtle cursor glow effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(88, 166, 255, 0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.2s ease, opacity 0.2s ease;
        transform: translate(-50%, -50%);
        opacity: 0.5;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Subtle hover effect for buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
            cursor.style.opacity = '0.8';
        });

        button.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity = '0.5';
        });
    });

    // Number animation for stats
    function animateNumbers() {
        const numbers = document.querySelectorAll('.product-price, .rating-score');

        numbers.forEach(num => {
            const finalText = num.textContent;
            const numberMatch = finalText.match(/[\d,]+/);

            if (numberMatch) {
                const finalNumber = parseInt(numberMatch[0].replace(/,/g, ''));
                let currentNumber = 0;
                const increment = finalNumber / 30;
                const prefix = finalText.substring(0, finalText.indexOf(numberMatch[0]));
                const suffix = finalText.substring(finalText.indexOf(numberMatch[0]) + numberMatch[0].length);

                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        currentNumber = finalNumber;
                        clearInterval(timer);
                    }
                    num.textContent = prefix + Math.floor(currentNumber).toLocaleString() + suffix;
                }, 50);
            }
        });
    }

    // Trigger number animation when visible
    const priceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                priceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const priceSection = document.querySelector('.price-section');
    if (priceSection) {
        priceObserver.observe(priceSection);
    }

    // Theme Switcher - 主題切換器
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
        <button class="theme-btn" data-theme="theme-ocean" title="深海主題">🌊</button>
        <button class="theme-btn" data-theme="theme-mars" title="火星主題">🪐</button>
    `;
    themeSwitcher.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 10000;
        background: rgba(31, 41, 55, 0.9);
        padding: 10px;
        border-radius: 50px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(88, 166, 255, 0.2);
    `;

    const themeStyles = document.createElement('style');
    themeStyles.textContent = `
        .theme-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid transparent;
            background: rgba(255, 255, 255, 0.1);
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s ease;
        }
        .theme-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        .theme-btn.active {
            border-color: var(--galaxy-cyan);
            background: rgba(88, 166, 255, 0.2);
        }
    `;
    document.head.appendChild(themeStyles);
    document.body.appendChild(themeSwitcher);

    // Theme switching functionality
    const themeButtons = document.querySelectorAll('.theme-btn');
    const currentTheme = document.body.className || 'theme-ocean';

    // Set active button
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', function() {
            const newTheme = this.dataset.theme;
            document.body.className = newTheme;

            // Update active button
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Save preference
            localStorage.setItem('selectedTheme', newTheme);
        });
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.className = savedTheme;
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === savedTheme);
        });
    }
});