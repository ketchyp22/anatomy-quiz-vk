// enhancements-loader.js

(function() {
    // Загрузка CSS
    function loadCSS(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            
            link.onload = () => {
                console.log(`CSS файл успешно загружен: ${url}`);
                resolve();
            };
            
            link.onerror = () => {
                console.error(`Ошибка при загрузке CSS файла: ${url}`);
                reject();
            };
            
            document.head.appendChild(link);
        });
    }
    
    // Загрузка JavaScript
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            
            script.onload = () => {
                console.log(`JavaScript файл успешно загружен: ${url}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`Ошибка при загрузке JavaScript файла: ${url}`);
                reject();
            };
            
            document.body.appendChild(script);
        });
    }
    
    // Загрузка всех улучшений
    async function loadEnhancements() {
        try {
            // Загружаем CSS
            await loadCSS('enhanced-styles.css');
            
            // Загружаем JavaScript файлы
            await loadScript('animations.js');
            await loadScript('enhanced-results.js');
            
            console.log('Все улучшения успешно загружены');
            
            // Инициализируем модули улучшений после загрузки DOM
            document.addEventListener('DOMContentLoaded', () => {
                // Инициализация анимаций
                if (window.QuizAnimations && window.QuizAnimations.enhancer) {
                    window.QuizAnimations.enhancer.init();
                }
                
                // Патчим функцию showResults для использования улучшенного отображения результатов
                patchShowResults();
                
                // Патчим функцию проверки ответов для добавления анимации
                patchAnswerChecking();
            });
        } catch (error) {
            console.error('Произошла ошибка при загрузке улучшений:', error);
        }
    }
    
    // Функция для патча отображения результатов
    function patchShowResults() {
        if (window.showResults && window.ResultsEnhancer) {
            // Сохраняем оригинальную функцию
            const originalShowResults = window.showResults;
            
            // Заменяем на улучшенную версию
            window.showResults = function() {
                // Вызываем оригинальную функцию
                originalShowResults.apply(this, arguments);
                
                // Добавляем улучшения к результатам
                if (window.ResultsEnhancer && typeof window.score !== 'undefined' && window.questionsForQuiz) {
                    window.ResultsEnhancer.enhanceResults(window.score, window.questionsForQuiz.length);
                }
            };
            
            console.log('Функция showResults успешно патчена');
        }
    }
    
    // Функция для патча проверки ответов
    function patchAnswerChecking() {
        if (document.getElementById('next-question') && window.QuizAnimations) {
            const nextButton = document.getElementById('next-question');
            
            // Создаем обертку для обработчика события
            const originalClickHandler = nextButton.onclick;
            
            if (originalClickHandler) {
                nextButton.onclick = function(event) {
                    // Сохраняем текущее значение score
                    const previousScore = window.score;
                    
                    // Вызываем оригинальный обработчик
                    originalClickHandler.call(this, event);
                    
                    // Если score увеличился, показываем анимацию
                    if (window.score > previousScore && window.QuizAnimations.showScoreAnimation) {
                        window.QuizAnimations.showScoreAnimation();
                    }
                };
                
                console.log('Обработчик событий кнопки "Далее" успешно патчен');
            }
        }
    }
    
    // Запускаем загрузку улучшений
    loadEnhancements();
})();
