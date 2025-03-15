// animations.js

// Функция для добавления анимации при правильном ответе
function showScoreAnimation() {
    const scoreAnimation = document.createElement('div');
    scoreAnimation.className = 'score-animation';
    scoreAnimation.textContent = '+1';
    document.body.appendChild(scoreAnimation);
    
    // Удаление элемента после анимации
    setTimeout(() => {
        document.body.removeChild(scoreAnimation);
    }, 1000);
}

// Функция для анимации появления элементов
function animateElement(element, animationClass) {
    if (element) {
        element.classList.add(animationClass);
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }
}

// Модуль для добавления анимаций к существующим элементам
const AnimationEnhancer = {
    init: function() {
        // Улучшенный вид для кнопки "Далее"
        const nextButton = document.getElementById('next-question');
        if (nextButton) {
            nextButton.addEventListener('mouseenter', () => {
                nextButton.style.transform = 'translateY(-2px)';
                nextButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            });
            
            nextButton.addEventListener('mouseleave', () => {
                nextButton.style.transform = '';
                nextButton.style.boxShadow = '';
            });
        }
        
        // Наблюдаем за изменениями в DOM для добавления анимаций
        // к новым элементам, которые появляются динамически
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('option')) {
                            animateElement(node, 'fadeIn');
                        }
                    });
                }
            });
        });
        
        // Наблюдаем за контейнером с вариантами ответов
        const optionsContainer = document.getElementById('options');
        if (optionsContainer) {
            observer.observe(optionsContainer, { childList: true });
        }
    }
};

// Экспортируем функции для использования в основном приложении
window.QuizAnimations = {
    showScoreAnimation: showScoreAnimation,
    animateElement: animateElement,
    enhancer: AnimationEnhancer
};
