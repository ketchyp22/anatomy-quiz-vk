// animated-pulse-line.js
(function() {
    // Добавляем стили для анимированной линии пульса
    function addPulseLineStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pulse-line-container {
                position: relative;
                width: 220px;
                height: 50px;
                margin: 0 auto 25px;
                display: block;
                z-index: 5;
            }
            
            .pulse-line-svg {
                width: 100%;
                height: 100%;
                overflow: visible;
            }
            
            .pulse-line-path {
                stroke: #FF1493; /* Ярко-розовый цвет (Deep Pink) */
                stroke-width: 3;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 300;
                stroke-dashoffset: 300;
                filter: drop-shadow(0 0 3px rgba(255, 20, 147, 0.7));
                animation: pulse-line-draw 1.5s linear infinite;
            }
            
            @keyframes pulse-line-draw {
                0% {
                    stroke-dashoffset: 300;
                    stroke-width: 2.5;
                }
                50% {
                    stroke-width: 3.5;
                }
                100% {
                    stroke-dashoffset: 0;
                    stroke-width: 2.5;
                }
            }
            
            /* Эффект пульсации для контейнера */
            @keyframes pulse-glow {
                0%, 100% {
                    filter: drop-shadow(0 0 2px rgba(255, 20, 147, 0.4));
                }
                50% {
                    filter: drop-shadow(0 0 8px rgba(255, 20, 147, 0.8));
                }
            }
            
            .pulse-line-svg {
                animation: pulse-glow 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем анимированную линию пульса
    function createPulseLine() {
        // Проверяем, существует ли уже контейнер
        let pulseLineContainer = document.querySelector('.pulse-line-container');
        if (!pulseLineContainer) {
            // Если нет, создаем новый
            pulseLineContainer = document.createElement('div');
            pulseLineContainer.className = 'pulse-line-container';
            
            // Ищем нужный элемент, после которого добавлять пульс
            const userInfo = document.getElementById('user-info');
            const startScreen = document.getElementById('start-screen');
            const difficultySelector = document.querySelector('.difficulty-selector');
            
            if (userInfo && difficultySelector && startScreen) {
                // Вставляем после информации о пользователе и перед селектором сложности
                startScreen.insertBefore(pulseLineContainer, difficultySelector);
            } else if (startScreen) {
                // Если не нашли нужные элементы, добавляем в начало
                const firstChild = startScreen.firstChild;
                startScreen.insertBefore(pulseLineContainer, firstChild.nextSibling.nextSibling);
            }
        }
        
        // Более реалистичная кривая пульса (электрокардиограмма ЭКГ)
        pulseLineContainer.innerHTML = `
            <svg class="pulse-line-svg" viewBox="0 0 300 60" preserveAspectRatio="none">
                <path class="pulse-line-path" d="M0,30 
                L30,30 
                L40,30 
                L50,10 
                L55,50 
                L60,10 
                L65,30 
                L90,30 
                L100,30 
                L110,30 
                L120,10 
                L125,50 
                L130,10 
                L135,30 
                L160,30 
                L170,30 
                L180,30 
                L190,10 
                L195,50 
                L200,10 
                L205,30 
                L230,30 
                L240,30 
                L250,30 
                L260,10 
                L265,50 
                L270,10 
                L275,30 
                L300,30">
                </path>
            </svg>
        `;
        
        // Добавляем интерактивность при клике
        pulseLineContainer.addEventListener('click', () => {
            const pulsePath = pulseLineContainer.querySelector('.pulse-line-path');
            if (pulsePath) {
                // Ускоряем пульс при клике
                pulsePath.style.animation = 'pulse-line-draw 0.8s linear infinite';
                pulsePath.style.stroke = '#FF69B4'; // Изменяем цвет
                
                // Возвращаем нормальную скорость через 3 секунды
                setTimeout(() => {
                    pulsePath.style.animation = 'pulse-line-draw 1.5s linear infinite';
                    pulsePath.style.stroke = '#FF1493';
                }, 3000);
            }
        });
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addPulseLineStyles();
        // Задержка для обеспечения корректного порядка элементов
        setTimeout(createPulseLine, 100);
    });
    
    // Запускаем повторно после полной загрузки страницы
    window.addEventListener('load', () => {
        setTimeout(createPulseLine, 300);
    });
})();
