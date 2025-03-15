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
            
            .stethoscope-earpiece {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 20px;
                background-color: var(--btn-primary-bg, #4a76a8);
                border-radius: 10px;
            }
            
            .stethoscope-tube-left,
            .stethoscope-tube-right {
                position: absolute;
                top: 18px;
                width: 5px;
                height: 40px;
                background-color: var(--btn-primary-bg, #4a76a8);
                border-radius: 5px;
            }
            
            .stethoscope-tube-left {
                left: calc(50% - 25px);
                transform-origin: top;
                transform: rotate(10deg);
                animation: tube-wave-left 2s infinite ease-in-out;
            }
            
            .stethoscope-tube-right {
                right: calc(50% - 25px);
                transform-origin: top;
                transform: rotate(-10deg);
                animation: tube-wave-right 2s infinite ease-in-out;
            }
            
            .stethoscope-tube-main {
                position: absolute;
                top: 57px;
                left: 50%;
                transform: translateX(-50%);
                width: 5px;
                height: 40px;
                background-color: var(--btn-primary-bg, #4a76a8);
                border-radius: 5px;
            }
            
            .stethoscope-heart {
                position: absolute;
                top: 95px;
                left: 50%;
                transform: translateX(-50%) rotate(45deg);
                width: 30px;
                height: 30px;
                background-color: #ff5a5a;
                animation: heart-pulse 1s infinite;
            }
            
            .stethoscope-heart:before,
            .stethoscope-heart:after {
                content: "";
                position: absolute;
                width: 30px;
                height: 30px;
                background-color: #ff5a5a;
                border-radius: 50%;
            }
            
            .stethoscope-heart:before {
                top: -15px;
                left: 0;
            }
            
            .stethoscope-heart:after {
                top: 0;
                left: -15px;
            }
            
            .pulse-rings {
                position: absolute;
                top: 95px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 60px;
                z-index: -1;
            }
            
            .pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                border: 2px solid #ff5a5a;
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
            
            .symbol-1 { top: 60px; left: 10px; animation-delay: 0s; }
            .symbol-2 { top: 40px; right: 10px; animation-delay: 0.7s; }
            .symbol-3 { top: 90px; left: 5px; animation-delay: 1.4s; }
            
            @keyframes stethoscope-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            
            @keyframes tube-wave-left {
                0%, 100% { transform: rotate(10deg); }
                50% { transform: rotate(20deg); }
            }
            
            @keyframes tube-wave-right {
                0%, 100% { transform: rotate(-10deg); }
                50% { transform: rotate(-20deg); }
            }
            
            @keyframes heart-pulse {
                0%, 100% { transform: translateX(-50%) rotate(45deg) scale(1); }
                50% { transform: translateX(-50%) rotate(45deg) scale(1.15); }
            }
            
            @keyframes pulse-ring {
                0% { width: 30px; height: 30px; opacity: 0.8; }
                100% { width: 60px; height: 60px; opacity: 0; }
            }
            
            @keyframes float-symbol {
                0% { transform: translate(0, 0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(-10px, -20px); opacity: 0; }
            }
            
            .vk-dark-theme .stethoscope-earpiece,
            .vk-dark-theme .stethoscope-tube-left,
            .vk-dark-theme .stethoscope-tube-right,
            .vk-dark-theme .stethoscope-tube-main {
                background-color: var(--btn-primary-bg, #5181b8);
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
                <div class="stethoscope-tube-left"></div>
                <div class="stethoscope-tube-right"></div>
                <div class="stethoscope-tube-main"></div>
                <div class="stethoscope-heart"></div>
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
