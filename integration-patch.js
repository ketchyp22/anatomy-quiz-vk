// integration-patch.js - Минимальный патч для интеграции геймификации
// НЕ ИЗМЕНЯЕТ основной код, только добавляет функциональность

(function() {
    'use strict';
    
    let quizStartTime = null;
    let isQuizActive = false;
    
    // Ждем полной загрузки приложения
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeGamificationIntegration, 1000);
    });
    
    function initializeGamificationIntegration() {
        if (typeof window.Gamification === 'undefined') {
            console.log('Геймификация не найдена, пропускаем интеграцию');
            return;
        }
        
        console.log('🔗 Запуск интеграции геймификации');
        
        // Отслеживаем переходы между экранами
        observeScreenChanges();
        
        // Отслеживаем клики по ответам
        observeAnswerClicks();
        
        // Патчим кнопку "Поделиться" для улучшенного сообщения
        enhanceShareButton();
    }
    
    // Наблюдение за сменой экранов
    function observeScreenChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    
                    // Квиз начался
                    if (target.id === 'quiz-container' && target.style.display !== 'none') {
                        onQuizStart();
                    }
                    
                    // Показались результаты
                    if (target.id === 'results-container' && target.style.display !== 'none') {
                        onQuizComplete();
                    }
                    
                    // Вернулись на главный экран
                    if (target.id === 'start-screen' && target.style.display !== 'none') {
                        onQuizReset();
                    }
                }
            });
        });
        
        // Наблюдаем за всеми тремя основными контейнерами
        const startScreen = document.getElementById('start-screen');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        
        if (startScreen) observer.observe(startScreen, { attributes: true });
        if (quizContainer) observer.observe(quizContainer, { attributes: true });
        if (resultsContainer) observer.observe(resultsContainer, { attributes: true });
    }
    
    // Отслеживание кликов по ответам
    function observeAnswerClicks() {
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('option') || !isQuizActive) return;
            
            // Ждем, пока основной код обработает клик и добавит классы
            setTimeout(function() {
                if (e.target.classList.contains('correct')) {
                    window.Gamification.onCorrectAnswer();
                } else if (e.target.classList.contains('wrong')) {
                    window.Gamification.onWrongAnswer();
                }
            }, 200);
        });
    }
    
    // Начало квиза
    function onQuizStart() {
        if (isQuizActive) return;
        
        isQuizActive = true;
        quizStartTime = Date.now();
        console.log('🎮 Квиз начат');
        
        // Обновляем статистику геймификации
        window.Gamification.updateStatsDisplay();
    }
    
    // Завершение квиза
    function onQuizComplete() {
        if (!isQuizActive) return;
        
        isQuizActive = false;
        
        // Небольшая задержка, чтобы DOM успел обновиться
        setTimeout(function() {
            const results = extractQuizResults();
            if (results) {
                // Добавляем мотивационное сообщение
                addMotivationalMessage(results.percentage);
                
                // Уведомляем геймификацию о завершении
                if (window.triggerQuizCompleted) {
                    window.triggerQuizCompleted(results.correct, results.total, results.percentage);
                }
                
                console.log('🎮 Квиз завершен:', results);
            }
        }, 100);
    }
    
    // Сброс квиза
    function onQuizReset() {
        isQuizActive = false;
        quizStartTime = null;
        
        // Обновляем статистику на главном экране
        setTimeout(function() {
            window.Gamification.updateStatsDisplay();
        }, 100);
    }
    
    // Извлечение результатов квиза из DOM
    function extractQuizResults() {
        const percentageEl = document.getElementById('percentage');
        const correctEl = document.getElementById('correct-answers');
        const totalEl = document.getElementById('total-questions-result');
        
        if (!percentageEl || !correctEl || !totalEl) {
            console.warn('Не удалось найти элементы результатов');
            return null;
        }
        
        return {
            percentage: parseInt(percentageEl.textContent) || 0,
            correct: parseInt(correctEl.textContent) || 0,
            total: parseInt(totalEl.textContent) || 0
        };
    }
    
    // Добавление мотивационного сообщения к результатам
    function addMotivationalMessage(percentage) {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) return;
        
        // Проверяем, не добавлено ли уже
        if (resultsContainer.querySelector('.motivational-message')) return;
        
        const motivation = window.Gamification.addMotivationalMessage(percentage);
        
        const messageEl = document.createElement('div');
        messageEl.className = 'motivational-message';
        messageEl.innerHTML = `
            <span class="message-icon">${motivation.icon}</span>
            <div class="message-text">${motivation.message}</div>
        `;
        
        // Вставляем после блока с результатами
        const scoreEl = resultsContainer.querySelector('.score');
        if (scoreEl && scoreEl.nextSibling) {
            resultsContainer.insertBefore(messageEl, scoreEl.nextSibling);
        } else if (scoreEl) {
            scoreEl.parentNode.appendChild(messageEl);
        }
    }
    
    // Улучшение кнопки "Поделиться"
    function enhanceShareButton() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) return;
        
        // Сохраняем оригинальный обработчик
        const originalHandler = shareButton.onclick;
        
        shareButton.onclick = function(e) {
            // Получаем результаты
            const results = extractQuizResults();
            if (!results) {
                // Если не можем получить результаты, используем оригинальный обработчик
                if (originalHandler) originalHandler.call(this, e);
                return;
            }
            
            // Создаем улучшенное сообщение с достижениями
            const stats = window.Gamification.stats;
            const motivation = window.Gamification.addMotivationalMessage(results.percentage);
            
            // Определяем режим и сложность
            const modeButton = document.querySelector('.quiz-mode-btn.active');
            const difficultyButton = document.querySelector('.difficulty-btn.active');
            
            const mode = modeButton ? modeButton.textContent : 'Медицинский квиз';
            const difficulty = difficultyButton ? difficultyButton.textContent : '';
            
            // Формируем сообщение
            let message = `${motivation.icon} Прошел "${mode}"`;
            if (difficulty) message += ` (${difficulty.toLowerCase()} уровень)`;
            message += ` и набрал ${results.percentage}%!\n\n`;
            
            // Добавляем статистику
            if (stats.currentStreak > 2) {
                message += `🔥 Серия правильных ответов: ${stats.currentStreak}\n`;
            }
            if (stats.totalQuizzes > 1) {
                message += `📊 Всего пройдено тестов: ${stats.totalQuizzes}\n`;
            }
            
            message += '\nПроверь свои знания тоже! 👨‍⚕️';
            
            // Используем VK Bridge для шеринга
            const bridge = window.vkBridgeInstance || window.vkBridge;
            if (bridge) {
                bridge.send('VKWebAppShare', { message })
                    .then(data => {
                        console.log('Результат успешно отправлен:', data);
                        
                        // Показываем достижение за шеринг
                        if (!stats.achievements.includes('social')) {
                            stats.achievements.push('social');
                            window.Gamification.showAchievement('Социальный: поделился результатом! 📤');
                            window.Gamification.saveStats();
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при шеринге:', error);
                        // Fallback - показываем alert с сообщением
                        alert(message);
                    });
            } else {
                // Fallback если VK Bridge недоступен
                alert(message);
            }
        };
    }
    
    // Добавляем глобальную функцию для ручного тестирования
    window.testGamification = function() {
        console.log('🧪 Тестирование геймификации');
        
        if (window.Gamification) {
            window.Gamification.onCorrectAnswer();
            setTimeout(() => window.Gamification.onCorrectAnswer(), 500);
            setTimeout(() => window.Gamification.onCorrectAnswer(), 1000);
            setTimeout(() => {
                window.triggerQuizCompleted(8, 10, 80);
            }, 1500);
        }
    };
    
})();
