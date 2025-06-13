// vk-share-fixed.js - ОКОНЧАТЕЛЬНОЕ ИСПРАВЛЕНИЕ шеринга для VK приложений
(function() {
    'use strict';
    
    console.log('📤 Загружается исправленный VK Share для мини-приложений...');

    // Определяем тип окружения
    function detectEnvironment() {
        const url = window.location.href;
        
        // Проверяем, запущено ли в VK
        if (url.includes('vk.com/app') || url.includes('vk.com/apps')) {
            return 'vk_app';
        }
        
        // Проверяем наличие VK Bridge
        const bridge = window.vkBridgeInstance || window.vkBridge || (typeof vkBridge !== 'undefined' ? vkBridge : null);
        if (bridge) {
            return 'vk_mobile';
        }
        
        // GitHub или другой хостинг
        if (url.includes('github.io') || url.includes('localhost')) {
            return 'external';
        }
        
        return 'unknown';
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initVKShare, 1000);
    });

    function initVKShare() {
        console.log('🎯 Инициализируем VK Share');
        
        const environment = detectEnvironment();
        console.log('🌍 Обнаружено окружение:', environment);
        
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('❌ Кнопка поделиться не найдена');
            return;
        }

        shareButton.innerHTML = '📤 Поделиться результатом';
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📤 Клик по кнопке - окружение:', environment);
            
            if (environment === 'external') {
                // Если запущено не в VK - показываем только копирование
                showCopyOnlyOption();
            } else {
                // Если в VK - показываем все варианты
                showVKShareOptions();
            }
        };
        
        console.log('✅ VK Share настроен для окружения:', environment);
    }

    function showVKShareOptions() {
        const results = getTestResults();
        if (!results) {
            console.error('❌ Не удалось получить результаты теста');
            showCopyOnlyOption();
            return;
        }

        console.log('📊 Результаты для VK шеринга:', results);
        showVKShareModal(results);
    }

    function showVKShareModal(results) {
        const modal = createModal(`
            <div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">
                    🎉 Поделиться в VK
                </h3>
                <div style="font-size: 48px; margin: 15px 0; color: #10B981;">
                    ${getEmoji(results.percentage)} ${results.percentage}%
                </div>
                <p style="color: #666; margin: 0;">
                    ${results.correct} из ${results.total} правильных ответов
                </p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                <button id="share-vk-post" style="
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #4267B2 0%, #365899 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    📝 Опубликовать запись
                </button>
                
                <button id="share-vk-message" style="
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    💬 Отправить сообщение
                </button>
                
                <button id="copy-text" style="
                    padding: 12px 20px;
                    background: #f8f9fa;
                    color: #333;
                    border: 1px solid #dee2e6;
                    border-radius: 12px;
                    font-size: 14px;
                    cursor: pointer;
                ">
                    📋 Скопировать текст
                </button>
            </div>
            
            <button id="close-modal" style="
                width: 100%;
                padding: 12px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
            ">
                Закрыть
            </button>
        `);
        
        // Обработчики
        modal.querySelector('#share-vk-post').onclick = () => {
            closeModal(modal);
            shareVKPost(results);
        };
        
        modal.querySelector('#share-vk-message').onclick = () => {
            closeModal(modal);
            shareVKMessage(results);
        };
        
        modal.querySelector('#copy-text').onclick = () => {
            copyResultText(results);
        };
        
        modal.querySelector('#close-modal').onclick = () => closeModal(modal);
    }

    function showCopyOnlyOption() {
        console.log('📋 Показываем только опцию копирования (внешнее окружение)');
        
        const results = getTestResults();
        if (!results) return;
        
        const text = createShareText(results, true);
        
        const modal = createModal(`
            <h3 style="margin: 0 0 20px 0; color: #333;">📤 Поделиться результатом</h3>
            <p style="color: #666; margin-bottom: 15px;">
                Скопируйте текст и поделитесь им в VK или других социальных сетях:
            </p>
            <textarea readonly id="share-text" style="
                width: 100%; 
                height: 120px; 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 10px; 
                font-size: 14px; 
                resize: none; 
                margin-bottom: 20px;
                font-family: inherit;
            ">${text}</textarea>
            <div style="display: flex; gap: 10px;">
                <button onclick="copyToClipboard('${text.replace(/'/g, "\\'")}');" style="
                    flex: 1;
                    background: #5a67d8; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 10px; 
                    cursor: pointer;
                ">📋 Скопировать</button>
                <button id="close-modal" style="
                    flex: 1;
                    background: #6c757d; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 10px; 
                    cursor: pointer;
                ">Закрыть</button>
            </div>
        `);
        
        modal.querySelector('#close-modal').onclick = () => closeModal(modal);
        
        // Автовыделение текста при клике на textarea
        modal.querySelector('#share-text').onclick = function() {
            this.select();
        };
    }

    // ИСПРАВЛЕННАЯ функция для публикации записи в VK
    async function shareVKPost(results) {
        console.log('📝 Публикуем запись в VK (БЕЗ ссылки на GitHub)');
        
        const bridge = getBridge();
        if (!bridge) {
            showCopyOnlyOption();
            return;
        }

        try {
            const shareText = createShareText(results, false);
            
            // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: используем VKWebAppShowWallPostBox вместо VKWebAppShare
            const response = await bridge.send('VKWebAppShowWallPostBox', {
                message: shareText
                // НЕ передаем никаких ссылок!
            });
            
            if (response.post_id) {
                console.log('✅ Запись опубликована:', response);
                showSuccessMessage('📝 Запись опубликована на стене!');
                rewardForSharing();
            }
            
        } catch (error) {
            console.error('❌ Ошибка при публикации записи:', error);
            
            if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
                showSuccessMessage('ℹ️ Публикация отменена');
            } else {
                showSuccessMessage('❌ Не удалось опубликовать запись');
                setTimeout(() => shareVKMessage(results), 1000);
            }
        }
    }

    // ИСПРАВЛЕННАЯ функция для отправки сообщения
    async function shareVKMessage(results) {
        console.log('💬 Отправляем сообщение в VK (БЕЗ ссылки)');
        
        const bridge = getBridge();
        if (!bridge) {
            showCopyOnlyOption();
            return;
        }

        try {
            const shareText = createShareText(results, false);
            
            // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: используем VKWebAppShare только с текстом
            const response = await bridge.send('VKWebAppShare', {
                text: shareText
                // НЕ добавляем параметр link!
            });
            
            if (response && response.type) {
                console.log('✅ Сообщение отправлено:', response);
                
                if (response.type === 'message' && response.users) {
                    showSuccessMessage(`💬 Сообщение отправлено ${response.users.length} пользователям!`);
                } else {
                    showSuccessMessage('💬 Сообщение отправлено!');
                }
                
                rewardForSharing();
            }
            
        } catch (error) {
            console.error('❌ Ошибка при отправке сообщения:', error);
            
            if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
                showSuccessMessage('ℹ️ Отправка отменена');
            } else {
                showSuccessMessage('❌ Не удалось отправить сообщение');
                setTimeout(() => showCopyOnlyOption(), 1000);
            }
        }
    }

    // Вспомогательные функции
    function createModal(content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            animation: slideIn 0.3s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
        `;
        
        dialog.innerHTML = content;
        
        // Добавляем стили анимации
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        // Закрытие по клику на фон
        modal.onclick = (e) => {
            if (e.target === modal) closeModal(modal);
        };
        
        return dialog;
    }

    function closeModal(modal) {
        const modalElement = modal.closest ? modal.closest('[style*="position: fixed"]') : modal.parentElement;
        if (modalElement) {
            modalElement.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (modalElement.parentNode) {
                    modalElement.parentNode.removeChild(modalElement);
                }
            }, 300);
        }
    }

    function getTestResults() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (percentageEl && correctEl && totalEl) {
                const percentage = parseInt(percentageEl.textContent) || 0;
                const correct = parseInt(correctEl.textContent) || 0;
                const total = parseInt(totalEl.textContent) || 0;
                
                const modeEl = document.getElementById('mode-badge');
                const difficultyEl = document.getElementById('difficulty-badge');
                
                return {
                    percentage,
                    correct,
                    total,
                    mode: modeEl ? modeEl.textContent : 'Медицинский квиз',
                    difficulty: difficultyEl ? difficultyEl.textContent : 'Обычный'
                };
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Ошибка получения результатов:', error);
            return null;
        }
    }

    function createShareText(results, includeCallToAction = false) {
        const emoji = getEmoji(results.percentage);
        const grade = getGrade(results.percentage);
        
        let text = `${emoji} ${grade}! Прошел медицинский квиз и набрал ${results.percentage}%!\n\n`;
        text += `✅ Правильных ответов: ${results.correct} из ${results.total}\n`;
        text += `📋 Режим: ${results.mode}\n`;
        text += `🎯 Уровень: ${results.difficulty}\n\n`;
        text += getMotivationText(results.percentage);
        
        if (includeCallToAction) {
            text += '\n\n🩺 А ты сможешь лучше? Проверь свои медицинские знания в MedQuiz Pro!';
        }
        
        return text;
    }

    function copyResultText(results) {
        const text = createShareText(results, true);
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showSuccessMessage('📋 Текст скопирован!');
                }).catch(() => {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        } catch (error) {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showSuccessMessage('📋 Текст скопирован!');
        } catch (err) {
            showSuccessMessage('❌ Не удалось скопировать текст');
        }
        
        document.body.removeChild(textArea);
    }

    function getBridge() {
        return window.vkBridgeInstance || window.vkBridge || (typeof vkBridge !== 'undefined' ? vkBridge : null);
    }

    function rewardForSharing() {
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (!stats.achievements.includes('social_share')) {
                stats.achievements.push('social_share');
                setTimeout(() => {
                    if (window.Gamification.showAchievement) {
                        window.Gamification.showAchievement('Социальная активность: поделился результатом! 📤');
                    }
                }, 1000);
                
                if (window.Gamification.saveStats) {
                    window.Gamification.saveStats();
                }
            }
        }
    }

    function getEmoji(percentage) {
        if (percentage >= 95) return '🏆';
        if (percentage >= 85) return '🌟';
        if (percentage >= 75) return '👏';
        if (percentage >= 60) return '👍';
        if (percentage >= 50) return '📚';
        return '💪';
    }
    
    function getGrade(percentage) {
        if (percentage >= 95) return 'Превосходно';
        if (percentage >= 85) return 'Отлично';
        if (percentage >= 75) return 'Очень хорошо';
        if (percentage >= 60) return 'Хорошо';
        if (percentage >= 50) return 'Удовлетворительно';
        return 'Есть куда расти';
    }
    
    function getMotivationText(percentage) {
        if (percentage >= 90) {
            return '🏆 Отличный результат! Настоящий профессионал!';
        } else if (percentage >= 70) {
            return '👏 Хороший уровень знаний!';
        } else if (percentage >= 50) {
            return '📚 Есть база, но можно еще подучиться!';
        } else {
            return '💪 Начало положено, продолжаем изучать медицину!';
        }
    }

    function showSuccessMessage(text) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
            max-width: 300px;
            line-height: 1.4;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.textContent = text;
        
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Глобальная функция для копирования
    window.copyToClipboard = function(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showSuccessMessage('📋 Текст скопирован!');
                });
            } else {
                fallbackCopy(text);
            }
        } catch (error) {
            fallbackCopy(text);
        }
    };

    // Функции для отладки
    window.debugVKShare = {
        detectEnv: detectEnvironment,
        testShare: showVKShareOptions,
        testCopy: showCopyOnlyOption,
        getResults: getTestResults,
        checkBridge: () => !!getBridge()
    };

    console.log('✅ Исправленный VK Share загружен');
    console.log('🐛 Доступны функции отладки: window.debugVKShare');
    
})();
