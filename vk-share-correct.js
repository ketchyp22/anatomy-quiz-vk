// vk-share-correct.js - Правильная реализация шеринга для VK Mini Apps
(function() {
    'use strict';
    
    console.log('📤 Загружается правильная реализация VK Share...');

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initCorrectVKShare, 1000);
    });

    function initCorrectVKShare() {
        console.log('🎯 Инициализируем правильный VK Share');
        
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('❌ Кнопка поделиться не найдена');
            return;
        }

        // Обновляем текст кнопки
        shareButton.innerHTML = '📤 Поделиться результатом';

        // Заменяем обработчик кнопки
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📤 Клик по кнопке - делимся результатом через VK Bridge');
            showShareOptions();
        };
        
        console.log('✅ Правильный VK Share настроен');
    }

    function showShareOptions() {
        // Получаем результаты теста
        const results = getTestResults();
        if (!results) {
            console.error('❌ Не удалось получить результаты теста');
            showFallbackShare();
            return;
        }

        console.log('📊 Результаты для шеринга:', results);

        // Показываем варианты шеринга
        showShareModal(results);
    }

    function showShareModal(results) {
        // Создаем модальное окно с вариантами шеринга
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
        
        dialog.innerHTML = `
            <div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">
                    🎉 Поделиться результатом
                </h3>
                <div style="font-size: 48px; margin: 15px 0; color: #10B981;">
                    ${getEmoji(results.percentage)} ${results.percentage}%
                </div>
                <p style="color: #666; margin: 0;">
                    ${results.correct} из ${results.total} правильных ответов
                </p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                <button id="share-story" style="
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">
                    📸 Поделиться в истории
                </button>
                
                <button id="share-message" style="
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">
                    💬 Поделиться сообщением
                </button>
                
                <button id="copy-result" style="
                    padding: 12px 20px;
                    background: #f8f9fa;
                    color: #333;
                    border: 1px solid #dee2e6;
                    border-radius: 12px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">
                    📋 Скопировать текст
                </button>
            </div>
            
            <button id="close-share" style="
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
        `;
        
        // Добавляем стили
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        // Обработчики событий
        dialog.querySelector('#share-story').onclick = () => {
            closeModal();
            shareToStory(results);
        };
        
        dialog.querySelector('#share-message').onclick = () => {
            closeModal();
            shareToMessage(results);
        };
        
        dialog.querySelector('#copy-result').onclick = () => {
            copyResultText(results);
        };
        
        dialog.querySelector('#close-share').onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        
        function closeModal() {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 300);
        }
    }

    async function shareToStory(results) {
        console.log('📸 Поделиться в истории VK');
        
        const bridge = getBridge();
        if (!bridge) {
            showFallbackShare();
            return;
        }

        try {
            // Генерируем изображение для истории
            const imageBlob = await generateResultImage(results);
            
            // Создаем параметры для истории
            const storyParams = {
                background_type: 'image',
                blob: imageBlob,
                attachment: {
                    text: 'Пройти тест',
                    type: 'url',
                    url: window.location.href
                },
                stickers: [
                    {
                        sticker_type: 'native',
                        sticker: {
                            action_type: 'text',
                            action: {
                                text: `Я набрал ${results.percentage}% в медицинском квизе! 🩺`,
                                style: 'classic',
                                background_style: 'solid',
                                selection_color: '#5a67d8'
                            },
                            transform: {
                                gravity: 'center_bottom',
                                relation_width: 0.8,
                                translation_y: -0.2
                            }
                        }
                    }
                ]
            };

            const response = await bridge.send('VKWebAppShowStoryBox', storyParams);
            
            if (response.result) {
                console.log('✅ История успешно создана');
                showSuccessMessage('📸 Редактор историй открыт!');
                
                // Подписываемся на события завершения
                const handleStoryResult = (event) => {
                    if (event.detail?.type === 'VKWebAppShowStoryBoxLoadFinish') {
                        console.log('🎉 История опубликована!');
                        showSuccessMessage('🎉 История опубликована!');
                        bridge.unsubscribe(handleStoryResult);
                        
                        // Награждаем за шеринг
                        rewardForSharing();
                    }
                };
                
                bridge.subscribe(handleStoryResult);
            }
            
        } catch (error) {
            console.error('❌ Ошибка при создании истории:', error);
            
            if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
                showSuccessMessage('ℹ️ Создание истории отменено');
            } else {
                showSuccessMessage('❌ Не удалось создать историю');
                // Показываем альтернативные варианты
                setTimeout(() => shareToMessage(results), 1000);
            }
        }
    }

    async function shareToMessage(results) {
        console.log('💬 Поделиться сообщением VK');
        
        const bridge = getBridge();
        if (!bridge) {
            showFallbackShare();
            return;
        }

        try {
            const shareText = createShareText(results);
            
            const shareParams = {
                link: window.location.href,
                text: shareText
            };

            const response = await bridge.send('VKWebAppShare', shareParams);
            
            if (response) {
                console.log('✅ Сообщение отправлено:', response);
                
                if (response.type === 'message' && response.users) {
                    showSuccessMessage(`💬 Сообщение отправлено ${response.users.length} пользователям!`);
                } else if (response.type === 'story') {
                    showSuccessMessage('📸 Опубликовано в истории!');
                }
                
                // Награждаем за шеринг
                rewardForSharing();
            }
            
        } catch (error) {
            console.error('❌ Ошибка при отправке сообщения:', error);
            
            if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
                showSuccessMessage('ℹ️ Отправка сообщения отменена');
            } else {
                showSuccessMessage('❌ Не удалось отправить сообщение');
                // Показываем fallback
                setTimeout(() => showFallbackShare(), 1000);
            }
        }
    }

    function copyResultText(results) {
        const text = createShareText(results);
        
        try {
            // Современный способ копирования
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

    async function generateResultImage(results) {
        console.log('🖼️ Генерируем изображение результата...');
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Размеры для истории VK (соотношение 9:16)
            canvas.width = 720;
            canvas.height = 1280;
            
            // Градиентный фон
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(0.5, '#764ba2');
            gradient.addColorStop(1, '#667eea');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Полупрозрачный слой
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Настройки шрифта
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            
            // Заголовок
            ctx.font = 'bold 56px Arial';
            ctx.fillText('👨‍⚕️ Медицинский Квиз', canvas.width / 2, 200);
            
            // Основной результат
            ctx.font = 'bold 150px Arial';
            const emoji = getEmoji(results.percentage);
            ctx.fillText(`${emoji} ${results.percentage}%`, canvas.width / 2, 450);
            
            // Детали
            ctx.font = '40px Arial';
            ctx.fillText(`Правильных ответов: ${results.correct} из ${results.total}`, canvas.width / 2, 550);
            
            // Оценка
            const grade = getGrade(results.percentage);
            ctx.font = 'bold 48px Arial';
            ctx.fillText(grade, canvas.width / 2, 650);
            
            // Мотивационный текст
            ctx.font = '32px Arial';
            const motivationText = getMotivationText(results.percentage);
            wrapText(ctx, motivationText, canvas.width / 2, 750, 600, 40);
            
            // Призыв к действию
            ctx.font = '28px Arial';
            ctx.fillText('🩺 А ты сможешь лучше?', canvas.width / 2, 950);
            ctx.fillText('Проверь свои знания!', canvas.width / 2, 990);
            
            // Конвертируем в Base64
            return canvas.toDataURL('image/png');
            
        } catch (error) {
            console.error('❌ Ошибка генерации изображения:', error);
            return null;
        }
    }

    // Функция для переноса текста на canvas
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    function getTestResults() {
        try {
            // Способ 1: Прямой поиск элементов
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (percentageEl && correctEl && totalEl) {
                const percentage = parseInt(percentageEl.textContent) || 0;
                const correct = parseInt(correctEl.textContent) || 0;
                const total = parseInt(totalEl.textContent) || 0;
                
                // Дополнительная информация
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

    function createShareText(results) {
        const emoji = getEmoji(results.percentage);
        const grade = getGrade(results.percentage);
        
        let text = `${emoji} ${grade}! Прошел медицинский квиз и набрал ${results.percentage}%!\n\n`;
        text += `✅ Правильных ответов: ${results.correct} из ${results.total}\n`;
        text += `📋 Режим: ${results.mode}\n`;
        text += `🎯 Уровень: ${results.difficulty}\n\n`;
        text += getMotivationText(results.percentage) + '\n\n';
        text += `🩺 А ты сможешь лучше? Проверь свои медицинские знания!`;
        
        return text;
    }

    function getBridge() {
        return window.vkBridgeInstance || window.vkBridge || (typeof vkBridge !== 'undefined' ? vkBridge : null);
    }

    function showFallbackShare() {
        console.log('📋 Показываем резервный вариант шеринга');
        
        const results = getTestResults();
        if (!results) return;
        
        const text = createShareText(results);
        
        // Простое окно с текстом для копирования
        const message = `Скопируйте текст и поделитесь результатом:\n\n${text}`;
        
        if (confirm(message)) {
            copyResultText(results);
        }
    }

    function rewardForSharing() {
        // Награждаем пользователя за шеринг
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
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
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

    // Функции для отладки
    window.debugVKShare = {
        testShare: () => {
            console.log('🧪 Тестируем VK шеринг...');
            showShareOptions();
        },
        
        testStory: () => {
            const results = getTestResults() || { percentage: 85, correct: 8, total: 10, mode: 'Тест', difficulty: 'Обычный' };
            shareToStory(results);
        },
        
        testMessage: () => {
            const results = getTestResults() || { percentage: 85, correct: 8, total: 10, mode: 'Тест', difficulty: 'Обычный' };
            shareToMessage(results);
        },
        
        getResults: () => {
            return getTestResults();
        },
        
        checkBridge: () => {
            const bridge = getBridge();
            console.log('VK Bridge доступен:', !!bridge);
            return !!bridge;
        }
    };

    console.log('✅ Правильная реализация VK Share загружена');
    console.log('🐛 Доступны функции отладки: window.debugVKShare');
    
})();
