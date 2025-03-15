// animated-pulse-line.js
(function() {
    // Добавляем стили для анимированной линии пульса
    function addPulseLineStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pulse-line-container {
                position: absolute;
                bottom: 20px;
                right: 20px;
                width: 150px;
                height: 40px;
                z-index: 5;
            }
            
            .pulse-line-svg {
                width: 100%;
                height: 100%;
                overflow: visible;
            }
            
            .pulse-line-path {
                stroke: #FF5A5A;
                stroke-width: 2.5;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 300;
                stroke-dashoffset: 300;
                animation: pulse-line-draw 2s forwards infinite;
            }
            
            @keyframes pulse-line-draw {
                0% {
                    stroke-dashoffset: 300;
                }
                100% {
                    stroke-dashoffset: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем анимированную линию пульса
    function createPulseLine() {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) return;
        
        // Создаем контейнер для линии пульса
        const pulseLineContainer = document.createElement('div');
        pulseLineContainer.className = 'pulse-line-container';
        
        // Создаем SVG линию пульса
        pulseLineContainer.innerHTML = `
            <svg class="pulse-line-svg" viewBox="0 0 150 40" preserveAspectRatio="none">
                <path class="pulse-line-path" d="M0,20 L10,20 L15,20 L20,10 L25,30 L30,20 L35,20 L40,20 L45,20 L50,20 L55,10 L60,30 L65,20 L70,20 L75,20 L80,20 L85,20 L90,10 L95,30 L100,20 L105,20 L110,20 L115,20 L120,20 L125,10 L130,30 L135,20 L140,20 L150,20">
                </path>
            </svg>
        `;
        
        // Добавляем линию пульса на страницу
        startScreen.appendChild(pulseLineContainer);
        
        // Добавляем интерактивность при клике
        pulseLineContainer.addEventListener('click', () => {
            console.log('Пульс ускорился!');
            
            const pulsePath = pulseLineContainer.querySelector('.pulse-line-path');
            pulsePath.style.animationDuration = '1s';
            
            setTimeout(() => {
                pulsePath.style.animationDuration = '2s';
            }, 2000);
        });
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addPulseLineStyles();
        createPulseLine();
        console.log('Анимированная линия пульса добавлена на экран');
    });
})();
