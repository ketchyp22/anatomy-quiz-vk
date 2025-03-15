// animated-pulse.js
(function() {
    // Добавляем стили для анимированного пульса
    function addPulseStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pulse-container {
                position: absolute;
                bottom: 20px;
                right: 20px;
                width: 150px;
                height: 60px;
                z-index: 5;
                cursor: pointer;
                overflow: hidden;
            }
            
            .pulse-line {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .pulse-svg {
                position: absolute;
                height: 40px;
                width: 500px;
                left: 0;
                animation: pulse-move 6s linear infinite;
            }
            
            .pulse-path {
                stroke: #FF5A5A;
                stroke-width: 2;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            
            .pulse-glow {
                stroke: #FF5A5A;
                stroke-width: 1;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                filter: blur(4px);
                opacity: 0.6;
            }
            
            /* Круги пульса при R-зубце ЭКГ */
            .pulse-highlight {
                position: absolute;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: rgba(255, 90, 90, 0.4);
                box-shadow: 0 0 10px rgba(255, 90, 90, 0.6);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: pulse-highlight 2s infinite;
            }
            
            /* Сердечко в центре */
            .pulse-heart {
                position: absolute;
                width: 20px;
                height: 20px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg) scale(1);
                background-color: rgba(255, 90, 90, 0.85);
                animation: heart-beat 2s infinite;
                z-index: 3;
                box-shadow: 0 0 8px rgba(255, 90, 90, 0.5);
            }
            
            .pulse-heart:before,
            .pulse-heart:after {
                content: "";
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: rgba(255, 90, 90, 0.85);
                border-radius: 50%;
            }
            
            .pulse-heart:before {
                top: -10px;
                left: 0;
            }
            
            .pulse-heart:after {
                top: 0;
                left: -10px;
            }
            
            /* Затухающий след пульса */
            .pulse-fade {
                position: absolute;
                height: 40px;
                width: 80px;
                right: 0;
                background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9));
                z-index: 2;
            }
            
            /* Анимации */
            @keyframes pulse-move {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-350px);
                }
            }
            
            @keyframes pulse-highlight {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                10% {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 1;
                }
                30% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
            }
            
            @keyframes heart-beat {
                0%, 100% {
                    transform: translate(-50%, -50%) rotate(45deg) scale(1);
                }
                15% {
                    transform: translate(-50%, -50%) rotate(45deg) scale(1.3);
                }
                30% {
                    transform: translate(-50%, -50%) rotate(45deg) scale(1);
                }
                45% {
                    transform: translate(-50%, -50%) rotate(45deg) scale(1.2);
                }
                60% {
                    transform: translate(-50%, -50%) rotate(45deg) scale(1);
                }
            }
            
            /* Темная тема */
            .vk-dark-theme .pulse-fade {
                background: linear-gradient(to right, rgba(40, 40, 40, 0), rgba(40, 40, 40, 0.9));
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем анимированный пульс
    function createAnimatedPulse() {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) return;
        
        // Создаем контейнер для пульса
        const pulseContainer = document.createElement('div');
        pulseContainer.className = 'pulse-container';
        
        // Создаем SVG пульс (повторяющаяся ЭКГ)
        const pulseSvgContent = `
            <svg class="pulse-svg" viewBox="0 0 500 60" preserveAspectRatio="none">
                <!-- Путь ЭКГ с эффектом свечения -->
                <path class="pulse-glow" d="M0,30 L30,30 L35,30 L40,10 L45,50 L50,30 L55,30 L70,30 L75,30 L80,30 L85,10 L90,50 L95,30 L100,30 L130,30 L135,30 L140,10 L145,50 L150,30 L155,30 L170,30 L175,30 L180,30 L185,10 L190,50 L195,30 L200,30 L230,30 L235,30 L240,10 L245,50 L250,30 L255,30 L270,30 L275,30 L280,30 L285,10 L290,50 L295,30 L300,30 L330,30 L335,30 L340,10 L345,50 L350,30 L355,30 L370,30 L375,30 L380,30 L385,10 L390,50 L395,30 L400,30 L430,30 L435,30 L440,10 L445,50 L450,30 L455,30 L470,30 L475,30 L480,30 L485,10 L490,50 L495,30 L500,30"></path>
                
                <!-- Основной путь ЭКГ -->
                <path class="pulse-path" d="M0,30 L30,30 L35,30 L40,10 L45,50 L50,30 L55,30 L70,30 L75,30 L80,30 L85,10 L90,50 L95,30 L100,30 L130,30 L135,30 L140,10 L145,50 L150,30 L155,30 L170,30 L175,30 L180,30 L185,10 L190,50 L195,30 L200,30 L230,30 L235,30 L240,10 L245,50 L250,30 L255,30 L270,30 L275,30 L280,30 L285,10 L290,50 L295,30 L300,30 L330,30 L335,30 L340,10 L345,50 L350,30 L355,30 L370,30 L375,30 L380,30 L385,10 L390,50 L395,30 L400,30 L430,30 L435,30 L440,10 L445,50 L450,30 L455,30 L470,30 L475,30 L480,30 L485,10 L490,50 L495,30 L500,30"></path>
            </svg>
        `;
        
        // Создаем разметку пульса
        pulseContainer.innerHTML = `
            <div class="pulse-line">
                ${pulseSvgContent}
                <div class="pulse-heart"></div>
                <div class="pulse-highlight"></div>
                <div class="pulse-fade"></div>
            </div>
        `;
        
        // Добавляем пульс на страницу
        startScreen.appendChild(pulseContainer);
        
        // Добавляем интерактивность
        pulseContainer.addEventListener('mouseenter', () => {
            const pulseSvg = pulseContainer.querySelector('.pulse-svg');
            pulseSvg.style.animationDuration = '3s';
            
            const pulseHeart = pulseContainer.querySelector('.pulse-heart');
            pulseHeart.style.animationDuration = '1s';
        });
        
        pulseContainer.addEventListener('mouseleave', () => {
            const pulseSvg = pulseContainer.querySelector('.pulse-svg');
            pulseSvg.style.animationDuration = '6s';
            
            const pulseHeart = pulseContainer.querySelector('.pulse-heart');
            pulseHeart.style.animationDuration = '2s';
        });
        
        // Добавляем ускорение анимации при клике
        pulseContainer.addEventListener('click', () => {
            console.log('💓 Ускорение пульса!');
            
            const pulseSvg = pulseContainer.querySelector('.pulse-svg');
            pulseSvg.style.animationDuration = '1.5s';
            
            const pulseHeart = pulseContainer.querySelector('.pulse-heart');
            pulseHeart.style.animationDuration = '0.6s';
            
            setTimeout(() => {
                pulseSvg.style.animationDuration = '6s';
                pulseHeart.style.animationDuration = '2s';
            }, 3000);
        });
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addPulseStyles();
        createAnimatedPulse();
        console.log('💓 Анимированный пульс добавлен на начальный экран');
    });
})();
