// animated-background.js
(function() {
    // Создаем анатомический фон
    function createAnatomyBackground() {
        const container = document.getElementById('animated-background');
        if (!container) {
            console.error('Контейнер для анатомического фона не найден!');
            return;
        }
        
        // Создаем фоновые элементы для анатомической темы
        const anatomySymbols = ['🫀', '🧠', '🦴', '👁️', '👂', '🦷', '🫁', '🫓', '🩻'];
        const symbolCount = 15; // Количество символов
        
        for (let i = 0; i < symbolCount; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'anatomy-symbol';
            symbol.textContent = anatomySymbols[Math.floor(Math.random() * anatomySymbols.length)];
            
            // Случайное положение
            symbol.style.left = `${Math.random() * 100}%`;
            symbol.style.top = `${Math.random() * 100}%`;
            
            // Случайный размер
            const size = 20 + Math.random() * 30;
            symbol.style.fontSize = `${size}px`;
            
            // Случайная анимация
            const duration = 15 + Math.random() * 20;
            symbol.style.animation = `float ${duration}s ease-in-out infinite`;
            symbol.style.animationDelay = `${Math.random() * 10}s`;
            
            container.appendChild(symbol);
        }
    }
    
    // Добавляем стили для анимации
    function addBackgroundStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .anatomy-background-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: -1;
                opacity: 0.1;
            }
            
            .anatomy-symbol {
                position: absolute;
                user-select: none;
                opacity: 0.7;
            }
            
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                50% {
                    transform: translateY(-20px) rotate(10deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Инициализация анимированного фона...');
        addBackgroundStyles();
        createAnatomyBackground();
    });
})();
