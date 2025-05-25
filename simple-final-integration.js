// simple-final-integration.js - Простое решение без конфликтов
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
        
        // НЕ ТРОГАЕМ кнопку "Поделиться"! Просто добавляем к ней слушатель
        enhanceExistingShare();
        
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
                        setTimeout(finishQuiz, 1000); // Даем время DOM обновиться
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
        
        // Ждем и получаем результаты
        waitForResults(0);
    }
    
    function waitForResults(attempt) {
        if (attempt >= 20) { // Увеличили попытки
            console.warn('[Simple] Не удалось дождаться результатов');
            return;
        }
        
        const results = tryGetResults();
        if (results && results.total > 0) {
            quizResults = results;
            console.log('🏁 [Simple] Квиз завершен:', results);
            
            // Уведомляем геймификацию
            window.Gamification.onQuizComplete(results);
            
            // Добавляем мотивационное сообщение
            setTimeout(addMotivationalMessage, 300);
        } else {
            // Пробуем еще раз
            setTimeout(() => waitForResults(attempt + 1), 100);
        }
    }
    
    function tryGetResults() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (!percentageEl || !correctEl || !totalEl) return null;
            
            const percentage = parseInt(percentageEl.textContent) || 0;
            const correct = parseInt(correctEl.textContent) || 0;
            const total = parseInt(totalEl.textContent) || 0;
            
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
            }, 800); // Увеличили задержку
        });
    }
    
    // Добавление мотивационного сообщения
    function addMotivationalMessage() {
        const container = document.getElementById('results-container');
        if (!container || !quizResults) return;
        
        // Проверяем, не добавлено ли уже
        if (container.querySelector('.motivational-message')) return;
        
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
    
    // НЕ заменяем кнопку, а просто добавляем к ней слушатель
    function enhanceExistingShare() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) return;
        
        // Добавляем слушатель события (НЕ заменяем onclick!)
        shareButton.addEventListener('click', function() {
            console.log('🎁 [Simple] Даем награду за шеринг');
            
            // Просто даем награду за шеринг через 2 секунды
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
    
})();
