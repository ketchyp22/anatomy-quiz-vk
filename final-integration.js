// final-integration.js - Полностью исправленное решение
(function() {
    'use strict';
    
    let isQuizActive = false;
    let currentResults = null;
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(finalIntegration, 2500); // Увеличили задержку
    });
    
    function finalIntegration() {
        console.log('🔧 [Final] Финальная интеграция геймификации');
        
        if (!window.Gamification) {
            console.warn('[Final] Геймификация не найдена');
            return;
        }
        
        // Настраиваем отслеживание квиза
        setupQuizTracking();
        
        // Настраиваем отслеживание ответов
        setupAnswerTracking();
        
        // Заменяем кнопку "Поделиться" на рабочую версию
        replaceShareButton();
        
        console.log('✅ [Final] Финальная интеграция завершена');
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
            setTimeout(finishQuiz, 500); // Даем больше времени DOM
        } else if (target.id === 'start-screen' && isVisible) {
            resetQuiz();
        }
    }
    
    function startQuiz() {
        isQuizActive = true;
        currentResults = null;
        console.log('🎮 [Final] Квиз начат');
    }
    
    function finishQuiz() {
        if (!isQuizActive) return;
        
        isQuizActive = false;
        
        // Пробуем получить результаты несколько раз
        attemptToGetResults(0);
    }
    
    function attemptToGetResults(attempt) {
        if (attempt >= 10) {
            console.error('[Final] Не удалось получить результаты после 10 попыток');
            return;
        }
        
        const results = getResults();
        if (results) {
            currentResults = results;
            console.log('🏁 [Final] Квиз завершен:', results);
            
            // Уведомляем геймификацию
            window.Gamification.onQuizComplete(results);
            
            // Добавляем мотивационное сообщение
            setTimeout(addMotivationalMessage, 200);
        } else {
            // Пробуем еще раз через 200мс
            setTimeout(() => attemptToGetResults(attempt + 1), 200);
        }
    }
    
    function resetQuiz() {
        isQuizActive = false;
        currentResults = null;
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
                return null;
            }
            
            const percentage = parseInt(percentageEl.textContent) || 0;
            const correct = parseInt(correctEl.textContent) || 0;
            const total = parseInt(totalEl.textContent) || 0;
            
            // Проверяем, что данные валидны
            if (percentage === 0 && correct === 0 && total === 0) {
                return null;
            }
            
            return { percentage, correct, total };
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
            }, 600); // Увеличили задержку
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
        
        if (!currentResults) {
            console.warn('[Final] Нет результатов для мотивационного сообщения');
            return;
        }
        
        const motivation = window.Gamification.addMotivationalMessage(currentResults.percentage);
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
    
    // ПОЛНАЯ ЗАМЕНА кнопки "Поделиться"
    function replaceShareButton() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('[Final] Кнопка "Поделиться" не найдена');
            return;
        }
        
        // Полностью заменяем обработчик
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📤 [Final] Клик по кнопке "Поделиться"');
            handleShare();
        };
        
        console.log('✅ [Final] Кнопка "Поделиться" заменена');
    }
    
    function handleShare() {
        // Получаем результаты (используем сохраненные или пытаемся получить заново)
        let results = currentResults;
        if (!results) {
            results = getResults();
        }
        
        if (!results) {
            console.error('[Final] Не удалось получить результаты для шеринга');
            showErrorMessage('Не удалось получить результаты теста. Попробуйте еще раз.');
            return;
        }
        
        console.log('[Final] Результаты для шеринга:', results);
        
        // Создаем сообщение
        const message = createShareMessage(results);
        console.log('[Final] Сообщение для шеринга готово');
        
        // Пробуем различные способы шеринга
        tryShareMethods(message);
    }
    
    function tryShareMethods(message) {
        console.log('[Final] Пробуем способы шеринга...');
        
        // Способ 1: VK Bridge (пробуем, но не полагаемся на него)
        if (tryVKBridge(message)) {
            return; // Если сработал, выходим
        }
        
        // Способ 2: Прямая ссылка VK (надежный)
        if (tryVKDirectLink(message)) {
            return;
        }
        
        // Способ 3: Буфер обмена (всегда работает)
        copyToClipboard(message);
    }
    
    function tryVKBridge(message) {
        try {
            let bridge = null;
            
            if (window.vkBridgeInstance) {
                bridge = window.vkBridgeInstance;
            } else if (window.vkBridge) {
                bridge = window.vkBridge;
            } else if (typeof vkBridge !== 'undefined') {
                bridge = vkBridge;
            }
            
            if (!bridge) {
                console.log('[Final] VK Bridge не найден');
                return false;
            }
            
            console.log('[Final] Пробуем VK Bridge...');
            
            // Отправляем с обработкой ошибок
            bridge.send('VKWebAppShare', { message: message })
                .then(data => {
                    console.log('✅ [Final] VK Bridge успешно:', data);
                    giveShareReward();
                    showSuccessMessage('Результат опубликован!');
                })
                .catch(error => {
                    console.warn('[Final] VK Bridge ошибка:', error);
                    // Не показываем ошибку пользователю, просто переходим к следующему способу
                    setTimeout(() => tryVKDirectLink(message), 100);
                });
            
            return true; // Попытка была сделана
        } catch (e) {
            console.error('[Final] VK Bridge исключение:', e);
            return false;
        }
    }
    
    function tryVKDirectLink(message) {
        try {
            console.log('[Final] Пробуем прямую ссылку VK...');
            
            const encodedMessage = encodeURIComponent(message);
            const currentUrl = encodeURIComponent(window.location.href);
            const title = encodeURIComponent('Медицинский квиз - мои результаты');
            
            const vkUrl = `https://vk.com/share.php?url=${currentUrl}&title=${title}&description=${encodedMessage}&noparse=1`;
            
            const newWindow = window.open(vkUrl, 'vk_share', 'width=650,height=500,scrollbars=yes,resizable=yes');
            
            if (newWindow) {
                console.log('✅ [Final] VK окно открыто');
                giveShareReward();
                showSuccessMessage('Окно ВКонтакте открыто!');
                return true;
            } else {
                console.warn('[Final] Не удалось открыть VK окно (блокировщик попапов)');
                return false;
            }
        } catch (e) {
            console.error('[Final] Ошибка прямой ссылки VK:', e);
            return false;
        }
    }
    
    function copyToClipboard(message) {
        console.log('[Final] Копируем в буфер обмена...');
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(message)
                .then(() => {
                    console.log('✅ [Final] Скопировано через Clipboard API');
                    showSuccessMessage('✅ Текст скопирован! Вставьте его в пост ВКонтакте');
                    giveShareReward();
                })
                .catch(err => {
                    console.warn('[Final] Clipboard API не сработал:', err);
                    fallbackCopy(message);
                });
        } else {
            fallbackCopy(message);
        }
    }
    
    function fallbackCopy(message) {
        try {
            console.log('[Final] Используем старый способ копирования...');
            
            const textArea = document.createElement('textarea');
            textArea.value = message;
            textArea.style.cssText = 'position: fixed; left: -9999px; top: -9999px;';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                console.log('✅ [Final] Скопировано старым способом');
                showSuccessMessage('✅ Текст скопирован! Вставьте его в пост ВКонтакте');
                giveShareReward();
            } else {
                throw new Error('execCommand не сработал');
            }
        } catch (e) {
            console.error('[Final] Все способы копирования не сработали:', e);
            
            // Последний резерв - показать текст в alert
            alert(`📋 Скопируйте этот текст и вставьте в пост ВКонтакте:\n\n${message}`);
            giveShareReward();
        }
    }
    
    function createShareMessage(results) {
        const modeBtn = document.querySelector('.quiz-mode-btn.active');
        const diffBtn = document.querySelector('.difficulty-btn.active');
        
        const mode = modeBtn ? modeBtn.textContent.trim() : 'Медицинский квиз';
        const difficulty = diffBtn ? diffBtn.textContent.trim() : 'обычный';
        
        let emoji = '📊';
        if (results.percentage >= 95) emoji = '🏆';
        else if (results.percentage >= 85) emoji = '🌟';
        else if (results.percentage >= 75) emoji = '👍';
        else if (results.percentage >= 60) emoji = '📚';
        
        let message = `${emoji} Прошел медицинский тест "${mode}"`;
        
        if (difficulty.toLowerCase() !== 'обычный') {
            message += ` (${difficulty.toLowerCase()} уровень)`;
        }
        
        message += ` и набрал ${results.percentage}%!\n\n`;
        message += `✅ Правильных ответов: ${results.correct} из ${results.total}\n`;
        
        // Добавляем статистику геймификации
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (stats.currentStreak > 2) {
                message += `🔥 Серия правильных ответов: ${stats.currentStreak}\n`;
            }
            
            if (stats.totalQuizzes > 1) {
                message += `📈 Всего пройдено тестов: ${stats.totalQuizzes}\n`;
            }
            
            if (stats.achievements && stats.achievements.length > 0) {
                message += `🏅 Получено достижений: ${stats.achievements.length}\n`;
            }
        }
        
        message += '\n🩺 А ты сможешь лучше? Проверь свои медицинские знания!';
        
        return message;
    }
    
    function showSuccessMessage(text) {
        showMessage(text, '#28a745');
    }
    
    function showErrorMessage(text) {
        showMessage(text, '#dc3545');
    }
    
    function showMessage(text, color) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            font-weight: 500;
            z-index: 10000;
            max-width: 350px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        
        toast.textContent = text;
        document.body.appendChild(toast);
        
        // Показываем
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Скрываем через 4 секунды
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
    
    function giveShareReward() {
        console.log('🏆 [Final] Даем награду за шеринг');
        
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (!stats.achievements.includes('social')) {
                stats.achievements.push('social');
                setTimeout(() => {
                    window.Gamification.showAchievement('Социальный: поделился результатом! 📱');
                }, 1000);
                window.Gamification.saveStats();
            }
        }
    }
    
    // Функция для тестирования
    window.testFinalIntegration = function() {
        console.log('🧪 [Final] Тестирование интеграции');
        
        // Симулируем результаты для тестирования шеринга
        currentResults = {
            percentage: 85,
            correct: 8,
            total: 10
        };
        
        const message = createShareMessage(currentResults);
        console.log('Тестовое сообщение:', message);
        
        tryShareMethods(message);
    };
    
})();
