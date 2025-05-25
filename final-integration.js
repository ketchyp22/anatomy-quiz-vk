// final-integration.js - Финальное решение всех проблем
(function() {
    'use strict';
    
    let isQuizActive = false;
    let originalShareFunction = null;
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(finalIntegration, 2000);
    });
    
    function finalIntegration() {
        console.log('🔧 Финальная интеграция геймификации');
        
        if (!window.Gamification) {
            console.warn('Геймификация не найдена');
            return;
        }
        
        // Настраиваем отслеживание квиза
        setupQuizTracking();
        
        // Настраиваем отслеживание ответов
        setupAnswerTracking();
        
        // НЕ трогаем кнопку "Поделиться" - она уже работает из app.js
        // Просто добавляем к ней нашу функциональность
        enhanceExistingShare();
        
        console.log('✅ Финальная интеграция завершена');
    }
    
    // Отслеживание состояния квиза
    function setupQuizTracking() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    handleScreenChange(mutation.target);
                }
            });
        });
        
        const screens = ['start-screen', 'quiz-container', 'results-container'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                observer.observe(screen, { attributes: true, attributeFilter: ['style'] });
            }
        });
    }
    
    function handleScreenChange(target) {
        const isVisible = target.style.display !== 'none';
        
        if (target.id === 'quiz-container' && isVisible && !isQuizActive) {
            startQuiz();
        } else if (target.id === 'results-container' && isVisible && isQuizActive) {
            setTimeout(finishQuiz, 300);
        } else if (target.id === 'start-screen' && isVisible) {
            resetQuiz();
        }
    }
    
    function startQuiz() {
        isQuizActive = true;
        console.log('🎮 [Final] Квиз начат');
    }
    
    function finishQuiz() {
        if (!isQuizActive) return;
        
        isQuizActive = false;
        
        // Получаем результаты
        const results = getResults();
        if (results) {
            console.log('🏁 [Final] Квиз завершен:', results);
            
            // Уведомляем геймификацию
            window.Gamification.onQuizComplete(results);
            
            // Добавляем мотивационное сообщение
            setTimeout(addMotivationalMessage, 500);
        }
    }
    
    function resetQuiz() {
        isQuizActive = false;
        setTimeout(() => {
            window.Gamification.updateStatsDisplay();
        }, 100);
    }
    
    function getResults() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (!percentageEl || !correctEl || !totalEl) {
                console.warn('[Final] Элементы результатов не готовы, попробуем позже');
                return null;
            }
            
            return {
                percentage: parseInt(percentageEl.textContent) || 0,
                correct: parseInt(correctEl.textContent) || 0,
                total: parseInt(totalEl.textContent) || 0
            };
        } catch (e) {
            console.error('[Final] Ошибка получения результатов:', e);
            return null;
        }
    }
    
    // Отслеживание ответов
    function setupAnswerTracking() {
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('option') || !isQuizActive) return;
            
            setTimeout(() => {
                if (e.target.classList.contains('correct')) {
                    console.log('✅ [Final] Правильный ответ зафиксирован');
                    window.Gamification.onCorrectAnswer();
                } else if (e.target.classList.contains('wrong')) {
                    console.log('❌ [Final] Неправильный ответ зафиксирован');
                    window.Gamification.onWrongAnswer();
                }
            }, 500);
        });
    }
    
    // Добавление мотивационного сообщения
    function addMotivationalMessage() {
        const container = document.getElementById('results-container');
        if (!container) return;
        
        // Проверяем, не добавлено ли уже
        if (container.querySelector('.motivational-message')) {
            console.log('[Final] Мотивационное сообщение уже добавлено');
            return;
        }
        
        const results = getResults();
        if (!results) {
            console.warn('[Final] Не удалось получить результаты для мотивационного сообщения');
            return;
        }
        
        const motivation = window.Gamification.addMotivationalMessage(results.percentage);
        const messageEl = document.createElement('div');
        messageEl.className = 'motivational-message';
        messageEl.innerHTML = `
            <span class="message-icon">${motivation.icon}</span>
            <div class="message-text">${motivation.message}</div>
        `;
        
        // Вставляем после блока с оценкой
        const scoreEl = container.querySelector('.score');
        if (scoreEl) {
            scoreEl.parentNode.insertBefore(messageEl, scoreEl.nextSibling);
            console.log('✅ [Final] Мотивационное сообщение добавлено');
        }
    }
    
    // Улучшаем существующую функцию шеринга из app.js
    function enhanceExistingShare() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('[Final] Кнопка "Поделиться" не найдена');
            return;
        }
        
        // Сохраняем оригинальную функцию
        originalShareFunction = shareButton.onclick;
        
        // Заменяем на улучшенную версию
        shareButton.onclick = function(e) {
            console.log('📤 [Final] Клик по улучшенной кнопке "Поделиться"');
            
            // Сначала запускаем оригинальную функцию (она работает!)
            if (originalShareFunction) {
                try {
                    originalShareFunction.call(this, e);
                    console.log('✅ [Final] Оригинальная функция шеринга выполнена');
                    
                    // Добавляем награду за шеринг
                    setTimeout(giveShareReward, 1000);
                } catch (error) {
                    console.error('[Final] Ошибка в оригинальной функции:', error);
                    
                    // Если оригинальная не сработала, используем запасной вариант
                    fallbackShare();
                }
            } else {
                console.warn('[Final] Оригинальная функция не найдена, используем запасной вариант');
                fallbackShare();
            }
        };
        
        console.log('✅ [Final] Кнопка "Поделиться" улучшена');
    }
    
    // Запасной вариант шеринга
    function fallbackShare() {
        console.log('🔄 [Final] Запасной шеринг');
        
        const results = getResults();
        if (!results) {
            alert('❌ Не удалось получить результаты теста');
            return;
        }
        
        const message = createShareMessage(results);
        
        // Пробуем прямую ссылку VK
        try {
            const encodedMessage = encodeURIComponent(message);
            const currentUrl = encodeURIComponent(window.location.href);
            const vkUrl = `https://vk.com/share.php?url=${currentUrl}&title=${encodeURIComponent('Медицинский квиз')}&description=${encodedMessage}`;
            
            const newWindow = window.open(vkUrl, 'vk_share', 'width=600,height=400');
            if (newWindow) {
                console.log('✅ [Final] Запасной шеринг через VK успешен');
                giveShareReward();
            } else {
                // Если не получилось открыть окно, копируем в буфер
                copyToClipboard(message);
            }
        } catch (e) {
            console.error('[Final] Ошибка запасного шеринга:', e);
            copyToClipboard(message);
        }
    }
    
    function createShareMessage(results) {
        const modeBtn = document.querySelector('.quiz-mode-btn.active');
        const diffBtn = document.querySelector('.difficulty-btn.active');
        
        const mode = modeBtn ? modeBtn.textContent.trim() : 'Медицинский квиз';
        const difficulty = diffBtn ? diffBtn.textContent.trim() : 'обычный';
        
        let emoji = '📊';
        if (results.percentage >= 90) emoji = '🏆';
        else if (results.percentage >= 80) emoji = '🌟';
        else if (results.percentage >= 70) emoji = '👍';
        
        let message = `${emoji} Прошел "${mode}"`;
        if (difficulty.toLowerCase() !== 'обычный') {
            message += ` (${difficulty.toLowerCase()})`;
        }
        message += ` - ${results.percentage}%!\n`;
        message += `✅ Правильно: ${results.correct}/${results.total}\n`;
        
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            if (stats.currentStreak > 2) {
                message += `🔥 Серия: ${stats.currentStreak}\n`;
            }
            if (stats.totalQuizzes > 1) {
                message += `📈 Тестов: ${stats.totalQuizzes}\n`;
            }
        }
        
        message += '\n🩺 Проверь свои знания!';
        return message;
    }
    
    function copyToClipboard(message) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(message)
                .then(() => {
                    showToast('✅ Текст скопирован! Можете вставить в пост ВК', 'success');
                    giveShareReward();
                })
                .catch(() => fallbackCopy(message));
        } else {
            fallbackCopy(message);
        }
    }
    
    function fallbackCopy(message) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = message;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showToast('✅ Текст скопирован!', 'success');
                giveShareReward();
            } else {
                alert(`Скопируйте текст:\n\n${message}`);
                giveShareReward();
            }
        } catch (e) {
            alert(`Скопируйте текст:\n\n${message}`);
            giveShareReward();
        }
    }
    
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                if (style.parentNode) style.parentNode.removeChild(style);
            }, 300);
        }, 3000);
    }
    
    function giveShareReward() {
        console.log('🏆 [Final] Даем награду за шеринг');
        
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (!stats.achievements.includes('social')) {
                stats.achievements.push('social');
                setTimeout(() => {
                    window.Gamification.showAchievement('Социальный: поделился результатом! 📱');
                }, 500);
                window.Gamification.saveStats();
            }
        }
    }
    
    // Функция для тестирования
    window.testFinalIntegration = function() {
        console.log('🧪 [Final] Тестирование интеграции');
        
        // Тестируем геймификацию
        if (window.Gamification) {
            window.Gamification.onCorrectAnswer();
            setTimeout(() => window.Gamification.onCorrectAnswer(), 500);
            setTimeout(() => window.Gamification.onCorrectAnswer(), 1000);
            
            setTimeout(() => {
                window.Gamification.onQuizComplete({
                    percentage: 90,
                    correct: 9,
                    total: 10
                });
            }, 1500);
        }
        
        // Тестируем шеринг
        setTimeout(() => {
            const testMessage = "🏆 Тест - прошел квиз на 90%!";
            copyToClipboard(testMessage);
        }, 2000);
    };
    
})();
