// beautiful-fullwidth-pulse.js
(function() {
    // Добавляем стили для анимированного пульса
    function addFullWidthPulseStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fullwidth-pulse-container {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 60px;
                z-index: 5;
                overflow: hidden;
                background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1));
            }
            
            .pulse-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .pulse-line-background {
                position: absolute;
                bottom: 10px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: rgba(255, 90, 90, 0.2);
            }
            
            .pulse-line-svg {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 200%;
                height: 60px;
                animation: pulse-scroll 8s linear infinite;
            }
            
            .pulse-line-path {
                stroke: #ff5a5a;
                stroke-width: 2;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                filter: drop-shadow(0 0 2px rgba(255, 90, 90, 0.8));
            }
            
            .pulse-glow {
                position: absolute;
                width: 100%;
                height: 30px;
                bottom: 0;
                left: 0;
                background: radial-gradient(ellipse at center, rgba(255, 90, 90, 0.15) 0%, transparent 70%);
                transform: scaleX(2) translateY(15px);
                opacity: 0;
                animation: glow-pulse 2s ease-in-out infinite;
            }
            
            .highlight-points {
                position: absolute;
                bottom: 10px;
                left: 0;
                width: 100%;
                height: 40px;
                pointer-events: none;
            }
            
            .pulse-highlight {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: rgba(255, 90, 90, 0.9);
                bottom: 0;
                opacity: 0;
                transform: translateY(0) scale(1);
                box-shadow: 0 0 8px rgba(255, 90, 90, 0.8);
            }
            
            .pulse-highlight-1 {
                left: calc(20% - 3px);
                animation: highlight-appear 8s linear infinite;
                animation-delay: 1.6s;
            }
            
            .pulse-highlight-2 {
                left: calc(40% - 3px);
                animation: highlight-appear 8s linear infinite;
                animation-delay: 3.2s;
            }
            
            .pulse-highlight-3 {
                left: calc(60% - 3px);
                animation: highlight-appear 8s linear infinite;
                animation-delay: 4.8s;
            }
            
            .pulse-highlight-4 {
                left: calc(80% - 3px);
                animation: highlight-appear 8s linear infinite;
                animation-delay: 6.4s;
            }
            
            @keyframes pulse-scroll {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-50%);
                }
            }
            
            @keyframes glow-pulse {
                0%, 100% {
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
            }
            
            @keyframes highlight-appear {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(1);
                }
                5% {
                    opacity: 1;
                    transform: translateY(-20px) scale(1.5);
                }
                10% {
                    opacity: 0;
                    transform: translateY(-25px) scale(1);
                }
                100% {
                    opacity: 0;
                }
            }
            
            /* Adapting to dark themes */
            .dark-theme .pulse-line-background,
            .vk-dark-theme .pulse-line-background {
                background-color: rgba(255, 90, 90, 0.15);
            }
            
            .dark-theme .fullwidth-pulse-container,
            .vk-dark-theme .fullwidth-pulse-container {
                background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));
            }
            
            /* Make pulse more visible on hover */
            .fullwidth-pulse-container:hover .pulse-line-path {
                stroke-width: 3;
                stroke: #ff3a3a;
            }
            
            .fullwidth-pulse-container:hover .pulse-glow {
                animation-duration: 1s;
            }
            
            /* Active state with faster animation */
            .fullwidth-pulse-container.active .pulse-line-svg {
                animation-duration: 4s;
            }
            
            .fullwidth-pulse-container.active .pulse-glow {
                animation-duration: 0.8s;
            }
            
            /* Media queries for responsive design */
            @media (max-width: 768px) {
                .fullwidth-pulse-container {
                    height: 40px;
                }
                
                .pulse-line-svg {
                    height: 40px;
                }
                
                .pulse-highlight {
                    width: 4px;
                    height: 4px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем анимированный пульс
    function createFullWidthPulse() {
        // Создаем контейнер
        const pulseContainer = document.createElement('div');
        pulseContainer.className = 'fullwidth-pulse-container';
        
        // Создаем путь сердечного ритма, повторяющийся несколько раз
        // Базовый паттерн сердечного ритма из точки (0,20)
        const heartbeatPattern = `
            M0,20 
            L30,20 
            L40,20 
            L45,5 
            L50,35 
            L55,20 
            L65,20 
            L70,20 
            L80,20 
            L90,20 
            L95,5 
            L100,35 
            L105,20 
            L115,20 
            L125,20
        `;
        
        // Повторяем этот паттерн 8 раз для создания длинной линии
        let fullPath = '';
        for (let i = 0; i < 8; i++) {
            // Смещаем каждое повторение
            fullPath += heartbeatPattern.replace(/M0,20/, `M${i * 125},20`);
        }
        
        // Создаем SVG для линии пульса
        const svgContent = `
            <svg class="pulse-line-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
                <path class="pulse-line-path" d="${fullPath}"></path>
            </svg>
        `;
        
        // Создаем полную разметку для пульса
        pulseContainer.innerHTML = `
            <div class="pulse-wrapper">
                <div class="pulse-line-background"></div>
                ${svgContent}
                <div class="pulse-glow"></div>
                <div class="highlight-points">
                    <div class="pulse-highlight pulse-highlight-1"></div>
                    <div class="pulse-highlight pulse-highlight-2"></div>
                    <div class="pulse-highlight pulse-highlight-3"></div>
                    <div class="pulse-highlight pulse-highlight-4"></div>
                </div>
            </div>
        `;
        
        // Добавляем в DOM
        document.body.appendChild(pulseContainer);
        
        // Добавляем интерактивность при клике
        pulseContainer.addEventListener('click', () => {
            pulseContainer.classList.toggle('active');
            
            // Если включен активный режим, добавляем немного случайности в движение
            if (pulseContainer.classList.contains('active')) {
                const highlights = pulseContainer.querySelectorAll('.pulse-highlight');
                highlights.forEach(highlight => {
                    const randomDelay = Math.random() * 2;
                    highlight.style.animationDelay = `${randomDelay}s`;
                });
            } else {
                // Возвращаем исходные значения
                const highlights = pulseContainer.querySelectorAll('.pulse-highlight');
                const originalDelays = [1.6, 3.2, 4.8, 6.4];
                highlights.forEach((highlight, index) => {
                    highlight.style.animationDelay = `${originalDelays[index]}s`;
                });
            }
        });
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addFullWidthPulseStyles();
        createFullWidthPulse();
        console.log('💓 Красивый пульс на всю ширину страницы добавлен');
    });
    
    // Если DOM уже загружен, инициализируем сразу
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addFullWidthPulseStyles();
            createFullWidthPulse();
        });
    } else {
        addFullWidthPulseStyles();
        createFullWidthPulse();
    }
})();
