// animated-heart-stethoscope.js
(function() {
    // Добавляем стили для анимированного фонендоскопа
    function addStethoscopeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stethoscope-container {
                position: absolute;
                bottom: 10px;
                right: 20px;
                width: 120px;
                height: 150px;
                z-index: 5;
                cursor: pointer;
            }
            
            .stethoscope {
                width: 100%;
                height: 100%;
                position: relative;
                transform-origin: center;
                animation: stethoscope-float 3s infinite ease-in-out;
            }
            
            /* Ушная дуга */
            .stethoscope-earpiece {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 10px;
                background-color: #C0C0C0;
                border-radius: 10px 10px 0 0;
                z-index: 2;
            }
            
            /* Ушные наконечники */
            .stethoscope-ear-tips {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 70px;
                height: 10px;
                display: flex;
                justify-content: space-between;
            }
            
            .stethoscope-ear-tip {
                width: 10px;
                height: 10px;
                background-color: #009688;
                border-radius: 50%;
            }
            
            /* Трубки от ушей */
            .stethoscope-tube-left,
            .stethoscope-tube-right {
                position: absolute;
                top: 10px;
                width: 6px;
                height: 40px;
                background-color: #009688;
                border-radius: 5px;
            }
            
            .stethoscope-tube-left {
                left: calc(50% - 25px);
                transform-origin: top;
                transform: rotate(20deg);
                animation: tube-wave-left 3s infinite ease-in-out;
            }
            
            .stethoscope-tube-right {
                right: calc(50% - 25px);
                transform-origin: top;
                transform: rotate(-20deg);
                animation: tube-wave-right 3s infinite ease-in-out;
            }
            
            /* Соединение Y-образное */
            .stethoscope-y-piece {
                position: absolute;
                top: 48px;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 15px;
                background-color: #C0C0C0;
                border-radius: 3px;
                z-index: 2;
            }
            
            /* Основная трубка */
            .stethoscope-tube-main {
                position: absolute;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 40px;
                background-color: #009688;
                border-radius: 5px;
            }
            
            /* Металлические кольца на трубке */
            .stethoscope-ring-1,
            .stethoscope-ring-2 {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 12px;
                height: 4px;
                background-color: #C0C0C0;
                border-radius: 2px;
                z-index: 2;
            }
            
            .stethoscope-ring-1 {
                top: 70px;
            }
            
            .stethoscope-ring-2 {
                top: 90px;
            }
            
            /* Сердце (головка фонендоскопа) */
            .stethoscope-heart {
                position: absolute;
                top: 105px;
                left: 50%;
                transform: translateX(-50%) rotate(45deg);
                width: 25px;
                height: 25px;
                background-color: #ff5a5a;
                animation: heart-pulse 1s infinite;
                z-index: 1;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .stethoscope-heart:before,
            .stethoscope-heart:after {
                content: "";
                position: absolute;
                width: 25px;
                height: 25px;
                background-color: #ff5a5a;
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .stethoscope-heart:before {
                top: -13px;
                left: 0;
            }
            
            .stethoscope-heart:after {
                top: 0;
                left: -13px;
            }
            
            /* Металлическое кольцо вокруг головки */
            .stethoscope-chest-piece-ring {
                position: absolute;
                top: 120px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 5px;
                background-color: #C0C0C0;
                border-radius: 5px;
                z-index: 2;
            }
            
            /* Круги пульса */
            .pulse-rings {
                position: absolute;
                top: 110px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 60px;
                z-index: 0;
            }
            
            .pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                border: 2px solid rgba(255, 90, 90, 0.6);
                border-radius: 50%;
                opacity: 0;
            }
            
            .pulse-ring-1 {
                animation: pulse-ring 2s infinite;
                animation-delay: 0s;
            }
            
            .pulse-ring-2 {
                animation: pulse-ring 2s infinite;
                animation-delay: 0.5s;
            }
            
            .pulse-ring-3 {
                animation: pulse-ring 2s infinite;
                animation-delay: 1s;
            }
            
            /* Символы сердцебиения */
            .heartbeat-symbols {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
            
            .heartbeat-symbol {
                position: absolute;
                font-size: 14px;
                opacity: 0;
                color: #ff5a5a;
                animation: float-symbol 2s linear infinite;
            }
            
            .symbol-1 { top: 60px; left: 15px; animation-delay: 0s; }
            .symbol-2 { top: 40px; right: 15px; animation-delay: 0.7s; }
            .symbol-3 { top: 90px; left: 10px; animation-delay: 1.4s; }
            
            /* Анимации */
            @keyframes stethoscope-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            @keyframes tube-wave-left {
                0%, 100% { transform: rotate(20deg); }
                50% { transform: rotate(25deg); }
            }
            
            @keyframes tube-wave-right {
                0%, 100% { transform: rotate(-20deg); }
                50% { transform: rotate(-25deg); }
            }
            
            @keyframes heart-pulse {
                0%, 100% { transform: translateX(-50%) rotate(45deg) scale(1); }
                50% { transform: translateX(-50%) rotate(45deg) scale(1.1); }
            }
            
            @keyframes pulse-ring {
                0% { width: 35px; height: 35px; opacity: 0.8; }
                100% { width: 60px; height: 60px; opacity: 0; }
            }
            
            @keyframes float-symbol {
                0% { transform: translate(0, 0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(-10px, -20px); opacity: 0; }
            }
            
            .vk-dark-theme .stethoscope-tube-left,
            .vk-dark-theme .stethoscope-tube-right,
            .vk-dark-theme .stethoscope-tube-main,
            .vk-dark-theme .stethoscope-ear-tip {
                background-color: #009688;
            }
            
            .vk-dark-theme .stethoscope-earpiece,
            .vk-dark-theme .stethoscope-y-piece,
            .vk-dark-theme .stethoscope-ring-1,
            .vk-dark-theme .stethoscope-ring-2,
            .vk-dark-theme .stethoscope-chest-piece-ring {
                background-color: #A0A0A0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем анимированный фонендоскоп
    function createAnimatedStethoscope() {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) return;
        
        // Создаем контейнер для фонендоскопа
        const stethoscopeContainer = document.createElement('div');
        stethoscopeContainer.className = 'stethoscope-container';
        
        // Создаем разметку фонендоскопа
        stethoscopeContainer.innerHTML = `
            <div class="stethoscope">
                <div class="stethoscope-earpiece"></div>
                <div class="stethoscope-ear-tips">
                    <div class="stethoscope-ear-tip"></div>
                    <div class="stethoscope-ear-tip"></div>
                </div>
                <div class="stethoscope-tube-left"></div>
                <div class="stethoscope-tube-right"></div>
                <div class="stethoscope-y-piece"></div>
                <div class="stethoscope-tube-main"></div>
                <div class="stethoscope-ring-1"></div>
                <div class="stethoscope-ring-2"></div>
                <div class="stethoscope-heart"></div>
                <div class="stethoscope-chest-piece-ring"></div>
                <div class="pulse-rings">
                    <div class="pulse-ring pulse-ring-1"></div>
                    <div class="pulse-ring pulse-ring-2"></div>
                    <div class="pulse-ring pulse-ring-3"></div>
                </div>
                <div class="heartbeat-symbols">
                    <div class="heartbeat-symbol symbol-1">❤</div>
                    <div class="heartbeat-symbol symbol-2">❤</div>
                    <div class="heartbeat-symbol symbol-3">❤</div>
                </div>
            </div>
        `;
        
        // Добавляем фонендоскоп на страницу
        startScreen.appendChild(stethoscopeContainer);
        
        // Добавляем интерактивность
        stethoscopeContainer.addEventListener('mouseenter', () => {
            const heart = stethoscopeContainer.querySelector('.stethoscope-heart');
            heart.style.animationDuration = '0.5s';
            
            const pulseRings = stethoscopeContainer.querySelectorAll('.pulse-ring');
            pulseRings.forEach(ring => {
                ring.style.animationDuration = '1.2s';
            });
        });
        
        stethoscopeContainer.addEventListener('mouseleave', () => {
            const heart = stethoscopeContainer.querySelector('.stethoscope-heart');
            heart.style.animationDuration = '1s';
            
            const pulseRings = stethoscopeContainer.querySelectorAll('.pulse-ring');
            pulseRings.forEach(ring => {
                ring.style.animationDuration = '2s';
            });
        });
        
        // Добавляем звук сердцебиения при клике
        stethoscopeContainer.addEventListener('click', () => {
            // Можно добавить звук сердцебиения, если есть аудио файл
            console.log('❤ Тук-тук! Звук сердцебиения');
            
            // Увеличиваем интенсивность пульсации при клике
            const heart = stethoscopeContainer.querySelector('.stethoscope-heart');
            heart.style.animationDuration = '0.3s';
            
            setTimeout(() => {
                heart.style.animationDuration = '1s';
            }, 1500);
        });
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addStethoscopeStyles();
        createAnimatedStethoscope();
        console.log('❤ Анимированный фонендоскоп в форме сердечка добавлен на начальный экран');
    });
})();
