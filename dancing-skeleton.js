// dancing-skeleton.js
(function() {
    // Добавляем стили для анимированного скелета
    function addSkeletonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skeleton-container {
                position: absolute;
                bottom: 10px;
                right: 20px;
                width: 120px;
                height: 150px;
                z-index: 5;
                pointer-events: none;
            }
            
            .skeleton {
                width: 100%;
                height: 100%;
                position: relative;
                transform-origin: bottom center;
                animation: skeleton-dance 3s infinite;
            }
            
            .skeleton-head {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 40px;
                background-color: rgba(255, 255, 255, 0.9);
                border: 2px solid var(--btn-primary-bg);
                border-radius: 50% 50% 0 0;
            }
            
            .skeleton-eyes {
                position: absolute;
                top: 15px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 10px;
                display: flex;
                justify-content: space-between;
            }
            
            .skeleton-eye {
                width: 8px;
                height: 8px;
                background-color: var(--btn-primary-bg);
                border-radius: 50%;
                animation: skeleton-blink 2s infinite;
            }
            
            .skeleton-nose {
                position: absolute;
                top: 22px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-bottom: 6px solid var(--btn-primary-bg);
            }
            
            .skeleton-body {
                position: absolute;
                top: 38px;
                left: 50%;
                transform: translateX(-50%);
                width: 2px;
                height: 40px;
                background-color: var(--btn-primary-bg);
            }
            
            .skeleton-arms {
                position: absolute;
                top: 45px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 2px;
                background-color: var(--btn-primary-bg);
            }
            
            .skeleton-arm-left,
            .skeleton-arm-right {
                position: absolute;
                top: 0;
                width: 2px;
                height: 30px;
                background-color: var(--btn-primary-bg);
            }
            
            .skeleton-arm-left {
                left: 0;
                transform-origin: top left;
                animation: arm-wave-left 1s infinite;
            }
            
            .skeleton-arm-right {
                right: 0;
                transform-origin: top right;
                animation: arm-wave-right 1s infinite;
            }
            
            .skeleton-pelvis {
                position: absolute;
                top: 78px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 2px;
                background-color: var(--btn-primary-bg);
            }
            
            .skeleton-legs {
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 40px;
            }
            
            .skeleton-leg-left,
            .skeleton-leg-right {
                position: absolute;
                top: 0;
                width: 2px;
                height: 40px;
                background-color: var(--btn-primary-bg);
            }
            
            .skeleton-leg-left {
                left: 0;
                transform-origin: top left;
                animation: leg-dance-left 1s infinite;
            }
            
            .skeleton-leg-right {
                right: 0;
                transform-origin: top right;
                animation: leg-dance-right 1s infinite;
            }
            
            .skeleton-ribs {
                position: absolute;
                top: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 30px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
            
            .skeleton-rib {
                width: 100%;
                height: 1px;
                background-color: var(--btn-primary-bg);
            }
            
            @keyframes skeleton-dance {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px) rotate(3deg); }
            }
            
            @keyframes skeleton-blink {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
            }
            
            @keyframes arm-wave-left {
                0%, 100% { transform: rotate(-30deg); }
                50% { transform: rotate(-90deg); }
            }
            
            @keyframes arm-wave-right {
                0%, 100% { transform: rotate(30deg); }
                50% { transform: rotate(90deg); }
            }
            
            @keyframes leg-dance-left {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(-25deg); }
            }
            
            @keyframes leg-dance-right {
                0%, 100% { transform: rotate(5deg); }
                50% { transform: rotate(25deg); }
            }
            
            .vk-dark-theme .skeleton-head {
                background-color: rgba(45, 45, 46, 0.9);
            }
            
            /* Добавляем музыкальные ноты вокруг скелета */
            .music-notes {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
            
            .music-note {
                position: absolute;
                font-size: 16px;
                opacity: 0;
                color: var(--btn-primary-bg);
                animation: float-note 2s linear infinite;
            }
            
            .note-1 { top: 10px; left: 0; animation-delay: 0s; }
            .note-2 { top: 20px; right: 5px; animation-delay: 0.5s; }
            .note-3 { top: 50px; left: 5px; animation-delay: 1s; }
            .note-4 { top: 40px; right: 0; animation-delay: 1.5s; }
            
            @keyframes float-note {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(-15px, -30px) rotate(20deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем анимированного скелета
    function createDancingSkeleton() {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) return;
        
        // Создаем контейнер для скелета
        const skeletonContainer = document.createElement('div');
        skeletonContainer.className = 'skeleton-container';
        
        // Создаем разметку скелета
        skeletonContainer.innerHTML = `
            <div class="skeleton">
                <div class="skeleton-head">
                    <div class="skeleton-eyes">
                        <div class="skeleton-eye"></div>
                        <div class="skeleton-eye"></div>
                    </div>
                    <div class="skeleton-nose"></div>
                </div>
                <div class="skeleton-body"></div>
                <div class="skeleton-ribs">
                    <div class="skeleton-rib"></div>
                    <div class="skeleton-rib"></div>
                    <div class="skeleton-rib"></div>
                    <div class="skeleton-rib"></div>
                </div>
                <div class="skeleton-arms">
                    <div class="skeleton-arm-left"></div>
                    <div class="skeleton-arm-right"></div>
                </div>
                <div class="skeleton-pelvis"></div>
                <div class="skeleton-legs">
                    <div class="skeleton-leg-left"></div>
                    <div class="skeleton-leg-right"></div>
                </div>
                <div class="music-notes">
                    <div class="music-note note-1">♪</div>
                    <div class="music-note note-2">♫</div>
                    <div class="music-note note-3">♩</div>
                    <div class="music-note note-4">♬</div>
                </div>
            </div>
        `;
        
        // Добавляем скелет на страницу
        startScreen.appendChild(skeletonContainer);
        
        // Добавляем интерактивность - скелет реагирует на наведение
        skeletonContainer.addEventListener('mouseenter', () => {
            const skeleton = skeletonContainer.querySelector('.skeleton');
            skeleton.style.animationDuration = '0.7s';
            
            // Увеличиваем скорость движения рук и ног
            const arms = skeletonContainer.querySelectorAll('.skeleton-arm-left, .skeleton-arm-right');
            const legs = skeletonContainer.querySelectorAll('.skeleton-leg-left, .skeleton-leg-right');
            
            arms.forEach(arm => {
                arm.style.animationDuration = '0.5s';
            });
            
            legs.forEach(leg => {
                leg.style.animationDuration = '0.5s';
            });
        });
        
        skeletonContainer.addEventListener('mouseleave', () => {
            const skeleton = skeletonContainer.querySelector('.skeleton');
            skeleton.style.animationDuration = '3s';
            
            // Возвращаем нормальную скорость
            const arms = skeletonContainer.querySelectorAll('.skeleton-arm-left, .skeleton-arm-right');
            const legs = skeletonContainer.querySelectorAll('.skeleton-leg-left, .skeleton-leg-right');
            
            arms.forEach(arm => {
                arm.style.animationDuration = '1s';
            });
            
            legs.forEach(leg => {
                leg.style.animationDuration = '1s';
            });
        });
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addSkeletonStyles();
        createDancingSkeleton();
        console.log('🦴 Танцующий скелет добавлен на начальный экран');
    });
})();
