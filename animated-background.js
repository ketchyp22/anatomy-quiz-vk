// animated-background.js
(function() {
    // Создаем анатомический фон
    function createAnatomyBackground() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        // Создаем обертку для анимированного фона
        const backgroundWrapper = document.createElement('div');
        backgroundWrapper.className = 'anatomy-background-wrapper';
        
        // Добавляем анатомические элементы
        const anatomyIcons = [
            // Сердце
            '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(74, 118, 168, 0.1)"/></svg>',
            // Мозг
            '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.26A6.979 6.979 0 0 1 5 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 1.86 1.08 3.5 2.65 4.3L10 13.67V16h4v-2.33l.35-.37c1.57-.8 2.65-2.44 2.65-4.3a5 5 0 0 0-5-5z" fill="rgba(74, 118, 168, 0.08)"/></svg>',
            // Кость
            '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5a1 1 0 0 1 1 1 1 1 0 0 0 1 1h4a1 1 0 0 0 1-1 1 1 0 0 1 1-1h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a1 1 0 0 1-1-1 1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1 1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2z" fill="rgba(74, 118, 168, 0.1)"/></svg>'
        ];
        
        // Создаем случайное количество элементов (15-25)
        const count = Math.floor(Math.random() * 10) + 15;
        
        for (let i = 0; i < count; i++) {
            const iconIndex = Math.floor(Math.random() * anatomyIcons.length);
            const element = document.createElement('div');
            element.className = 'floating-anatomy-icon';
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.animationDelay = `${Math.random() * 5}s`;
            element.style.animationDuration = `${Math.random() * 10 + 10}s`;
            element.innerHTML = anatomyIcons[iconIndex];
            backgroundWrapper.appendChild(element);
        }
        
        // Вставляем фон как первый элемент контейнера
        if (container.firstChild) {
            container.insertBefore(backgroundWrapper, container.firstChild);
        } else {
            container.appendChild(backgroundWrapper);
        }
    }
    
    // Добавление стилей для анимированного фона
    function addBackgroundStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .anatomy-background-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            }
            
            .floating-anatomy-icon {
                position: absolute;
                animation: float linear infinite;
                opacity: 0.6;
                transform: scale(1);
            }
            
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translate(100px, -100px) rotate(360deg) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        addBackgroundStyles();
        createAnatomyBackground();
    });
})();
