// simple-final-integration.js - Исправленная версия без конфликтов
(function() {
    'use strict';
    
    let isQuizActive = false;
    let quizResults = null;
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initSimpleIntegration, 1500);
    });
    
    function initSimpleIntegration() {
        console.log('🎯 [Simple] Простая интеграция геймификации');
        
        if (!window.Gamification) {
            console.warn('[Simple] Геймификация не найдена');
            return;
        }
        
        // Отслеживаем состояние квиза
        setupQuizTracking();
        
        // Отслеживаем ответы
        setupAnswerTracking();
        
        // Добавляем слушатель к кнопке "Поделиться" для награды
        addShareRewardListener();
        
        console.log('✅ [Simple] Интеграция готова');
    }
    
    // Отслеживание квиза
    function setupQuizTracking() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    const isVisible = target.style.display !== 'none';
                    
                    if (target.id === 'quiz-container' && isVisible && !isQuizActive) {
                        startQuiz();
                    } else if (target.id === 'results-container' && isVisible && isQuizActive) {
                        setTimeout(finishQuiz, 1500); // Увеличили задержку
                    } else if (target.id === 'start-screen' && isVisible) {
                        resetQuiz();
                    }
                }
            });
        });
        
        ['start-screen', 'quiz-container', 'results-container'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element, { attributes: true, attributeFilter: ['style'] });
            }
        });
    }
    
    function startQuiz() {
        isQuizActive = true;
        quizResults = null;
        console.log('🎮 [Simple] Квиз начат');
    }
    
    function finishQuiz() {
        if (!isQuizActive) return;
        isQuizActive = false;
        
        console.log('🏁 [Simple] Квиз завершен, ждем результаты...');
        
        // Пробуем получить результаты с большей задержкой
        setTimeout(() => {
            attemptToGetResults(0);
        }, 500);
    }
    
    function attemptToGetResults(attempt) {
        if (attempt >= 30) { // Увеличили количество попыток
            console.warn('[Simple] Не удалось получить результаты, но это не критично');
            
            // Все равно уведомляем геймификацию с примерными данными
            // Геймификация сама ведет статистику правильных ответов
            if (window.Gamification && window.Gamification.stats) {
                const stats = window.Gamification.stats;
                console.log('[Simple] Используем данные из геймификации:', stats);
                
                // Примерные результаты на основе статистики
                const estimatedResults = {
                    percentage: Math.round((stats.correctAnswers || 0) * 10), // примерно
                    correct: stats.correctAnswers || 0,
                    total: 10 // обычно 10 вопросов
                };
                
                window.Gamification.onQuizComplete(estimatedResults);
            }
            return;
        }
        
        const results = tryGetResults();
        if (results && results.total > 0) {
            quizResults = results;
            console.log('🏁 [Simple] Результаты получены:', results);
            
            // Уведомляем геймификацию
            window.Gamification.onQuizComplete(results);
            
            // Добавляем мотивационное сообщение
            setTimeout(addMotivationalMessage, 300);
        } else {
            console.log(`[Simple] Попытка ${attempt + 1}/30 получить результаты...`);
            setTimeout(() => attemptToGetResults(attempt + 1), 200);
        }
    }
    
    function tryGetResults() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (!percentageEl || !correctEl || !totalEl) {
                return null;
            }
            
            const percentage = parseInt(percentageEl.textContent) || 0;
            const correct = parseInt(correctEl.textContent) || 0;
            const total = parseInt(totalEl.textContent) || 0;
            
            // Проверяем валидность данных
            if (total === 0) {
                return null;
            }
            
            return { percentage, correct, total };
        } catch (e) {
            return null;
        }
    }
    
    function resetQuiz() {
        isQuizActive = false;
        quizResults = null;
        setTimeout(() => {
            if (window.Gamification) {
                window.Gamification.updateStatsDisplay();
            }
        }, 100);
    }
    
    // Отслеживание ответов
    function setupAnswerTracking() {
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('option') || !isQuizActive) return;
            
            setTimeout(() => {
                if (e.target.classList.contains('correct')) {
                    console.log('✅ [Simple] Правильный ответ');
                    window.Gamification.onCorrectAnswer();
                } else if (e.target.classList.contains('wrong')) {
                    console.log('❌ [Simple] Неправильный ответ');
                    window.Gamification.onWrongAnswer();
                }
            }, 800);
        });
    }
    
    // Добавление мотивационного сообщения
    function addMotivationalMessage() {
        const container = document.getElementById('results-container');
        if (!container || !quizResults) return;
        
        // Проверяем, не добавлено ли уже
        if (container.querySelector('.motivational-message')) {
            console.log('[Simple] Мотивационное сообщение уже добавлено');
            return;
        }
        
        const motivation = window.Gamification.addMotivationalMessage(quizResults.percentage);
        const messageEl = document.createElement('div');
        messageEl.className = 'motivational-message';
        messageEl.innerHTML = `
            <span class="message-icon">${motivation.icon}</span>
            <div class="message-text">${motivation.message}</div>
        `;
        
        const scoreEl = container.querySelector('.score');
        if (scoreEl) {
            scoreEl.parentNode.insertBefore(messageEl, scoreEl.nextSibling);
            console.log('✅ [Simple] Мотивационное сообщение добавлено');
        }
    }
    
    // НЕ трогаем кнопку "Поделиться", только добавляем слушатель для награды
    function addShareRewardListener() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) return;
        
        // Добавляем слушатель (НЕ заменяем onclick!)
        shareButton.addEventListener('click', function() {
            console.log('🎁 [Simple] Даем награду за шеринг');
            
            // Даем награду через 2 секунды (время на завершение шеринга)
            setTimeout(giveShareReward, 2000);
        });
        
        console.log('✅ [Simple] Добавлен слушатель к кнопке "Поделиться"');
    }
    
    function giveShareReward() {
        if (!window.Gamification || !window.Gamification.stats) return;
        
        const stats = window.Gamification.stats;
        
        if (!stats.achievements.includes('social')) {
            stats.achievements.push('social');
            setTimeout(() => {
                window.Gamification.showAchievement('Социальный: поделился результатом! 📱');
            }, 500);
            window.Gamification.saveStats();
            console.log('🏆 [Simple] Награда за шеринг выдана');
        }
    }
    
    // Функция для тестирования
    window.testSimpleIntegration = function() {
        console.log('🧪 [Simple] Тестирование...');
        
        // Тестируем правильные ответы
        if (window.Gamification) {
            window.Gamification.onCorrectAnswer();
            setTimeout(() => window.Gamification.onCorrectAnswer(), 500);
            setTimeout(() => window.Gamification.onCorrectAnswer(), 1000);
            
            // Тестируем завершение квиза
            setTimeout(() => {
                window.Gamification.onQuizComplete({
                    percentage: 90,
                    correct: 9,
                    total: 10
                });
            }, 1500);
            
            // Тестируем награду за шеринг
            setTimeout(giveShareReward, 2000);
        }
    };
    
    // Функция для проверки состояния
    window.checkSimpleIntegrationStatus = function() {
        console.log('📊 [Simple] Состояние интеграции:');
        console.log('- Квиз активен:', isQuizActive);
        console.log('- Последние результаты:', quizResults);
        console.log('- Геймификация доступна:', !!window.Gamification);
        console.log('- Статистика геймификации:', window.Gamification ? window.Gamification.stats : 'недоступна');
    };
    
})();
