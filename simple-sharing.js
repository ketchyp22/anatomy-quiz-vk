// simple-sharing.js - Простое и надежное решение для шеринга
(function() {
    'use strict';
    
    // Ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(setupSimpleSharing, 1000);
    });
    
    function setupSimpleSharing() {
        console.log('📤 Настраиваем простой шеринг');
        
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('Кнопка "Поделиться" не найдена');
            return;
        }
        
        // Заменяем обработчик на простой и надежный
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎯 Клик по кнопке "Поделиться"');
            handleSimpleShare();
        };
        
        // Обновляем текст кнопки
        shareButton.innerHTML = '📱 Поделиться результатом';
        
        console.log('✅ Простой шеринг настроен');
    }
    
    function handleSimpleShare() {
        // Получаем результаты
        const results = getCurrentResults();
        if (!results) {
            showError('Не удалось получить результаты теста');
            return;
        }
        
        console.log('📊 Результаты:', results);
        
        // Создаем сообщение
        const message = createSimpleMessage(results);
        console.log('📝 Сообщение:', message);
        
        // Показываем пользователю выбор способа шеринга
        showSharingOptions(message);
    }
    
    function getCurrentResults() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (!percentageEl || !correctEl || !totalEl) {
                return null;
            }
            
            return {
                percentage: parseInt(percentageEl.textContent) || 0,
                correct: parseInt(correctEl.textContent) || 0,
                total: parseInt(totalEl.textContent) || 0
            };
        } catch (e) {
            console.error('Ошибка получения результатов:', e);
            return null;
        }
    }
    
    function createSimpleMessage(results) {
        // Получаем информацию о тесте
        const modeBtn = document.querySelector('.quiz-mode-btn.active');
        const diffBtn = document.querySelector('.difficulty-btn.active');
        
        const mode = modeBtn ? modeBtn.textContent.trim() : 'Медицинский квиз';
        const difficulty = diffBtn ? diffBtn.textContent.trim() : 'обычный';
        
        // Выбираем эмодзи по результату
        let emoji = '📊';
        let grade = 'Хорошо';
        
        if (results.percentage >= 90) {
            emoji = '🏆';
            grade = 'Отлично';
        } else if (results.percentage >= 80) {
            emoji = '🌟';
            grade = 'Очень хорошо';
        } else if (results.percentage >= 70) {
            emoji = '👍';
            grade = 'Хорошо';
        } else if (results.percentage >= 50) {
            emoji = '📚';
            grade = 'Удовлетворительно';
        }
        
        // Формируем простое сообщение
        let message = `${emoji} ${grade}! Прошел "${mode}"`;
        
        if (difficulty.toLowerCase() !== 'обычный') {
            message += ` (${difficulty.toLowerCase()} уровень)`;
        }
        
        message += ` - ${results.percentage}%\n`;
        message += `Правильно: ${results.correct}/${results.total}\n`;
        
        // Добавляем статистику если есть
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (stats.currentStreak > 2) {
                message += `🔥 Серия: ${stats.currentStreak} подряд\n`;
            }
            
            if (stats.totalQuizzes > 1) {
                message += `📈 Всего тестов: ${stats.totalQuizzes}\n`;
            }
        }
        
        message += '\n🩺 Проверь свои медицинские знания!';
        
        return message;
    }
    
    function showSharingOptions(message) {
        // Создаем модальное окно с вариантами
        const modal = document.createElement('div');
        modal.className = 'sharing-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 90%;
            width: 400px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
        `;
        
        modalContent.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #333;">📱 Поделиться результатами</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; margin: 20px 0; font-family: monospace; font-size: 14px; line-height: 1.4; text-align: left; white-space: pre-line;">${message}</div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                <button id="share-vk-direct" style="background: #4680C2; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-size: 16px; cursor: pointer; transition: all 0.2s;">
                    🌐 Открыть ВКонтакте
                </button>
                <button id="share-copy" style="background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-size: 16px; cursor: pointer; transition: all 0.2s;">
                    📋 Скопировать текст
                </button>
                <button id="share-close" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.2s;">
                    Отмена
                </button>
            </div>
        `;
        
        // Добавляем анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            .sharing-modal button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
        `;
        document.head.appendChild(style);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Обработчики кнопок
        const vkButton = modalContent.querySelector('#share-vk-direct');
        const copyButton = modalContent.querySelector('#share-copy');
        const closeButton = modalContent.querySelector('#share-close');
        
        vkButton.onclick = function() {
            shareToVKDirect(message);
            closeModal();
        };
        
        copyButton.onclick = function() {
            copyToClipboard(message);
            closeModal();
        };
        
        closeButton.onclick = closeModal;
        
        // Закрытие по клику вне модального окна
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeModal();
            }
        };
        
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8) translateY(-50px)';
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
    
    function shareToVKDirect(message) {
        try {
            console.log('🌐 Открываем ВКонтакте для шеринга');
            
            // Создаем URL для шеринга
            const encodedMessage = encodeURIComponent(message);
            const currentUrl = encodeURIComponent(window.location.href);
            const title = encodeURIComponent('Медицинский квиз - мои результаты');
            
            const vkUrl = `https://vk.com/share.php?url=${currentUrl}&title=${title}&description=${encodedMessage}&noparse=1`;
            
            // Пробуем открыть в новом окне
            const newWindow = window.open(vkUrl, 'vk_share', 'width=650,height=500,scrollbars=yes,resizable=yes');
            
            if (newWindow) {
                console.log('✅ Окно ВКонтакте открыто');
                giveShareReward();
                
                // Проверяем, не заблокировано ли окно
                setTimeout(() => {
                    try {
                        if (newWindow.closed) {
                            console.log('👍 Пользователь завершил шеринг');
                        }
                    } catch (e) {
                        // Игнорируем ошибки cross-origin
                    }
                }, 1000);
            } else {
                console.warn('❌ Не удалось открыть окно (блокировщик попапов)');
                
                // Fallback: открываем в той же вкладке
                showMessage('Перенаправляем на ВКонтакте...', 'info');
                setTimeout(() => {
                    window.open(vkUrl, '_blank');
                }, 1000);
            }
        } catch (e) {
            console.error('Ошибка при открытии ВКонтакте:', e);
            showMessage('Ошибка при открытии ВКонтакте', 'error');
        }
    }
    
    function copyToClipboard(message) {
        console.log('📋 Копируем в буфер обмена');
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Современный способ
            navigator.clipboard.writeText(message)
                .then(() => {
                    console.log('✅ Текст скопирован (современный API)');
                    showMessage('✅ Текст скопирован! Теперь можете вставить его в пост ВКонтакте', 'success');
                    giveShareReward();
                })
                .catch(err => {
                    console.error('Ошибка современного копирования:', err);
                    fallbackCopy(message);
                });
        } else {
            // Старый способ
            fallbackCopy(message);
        }
    }
    
    function fallbackCopy(message) {
        try {
            console.log('📋 Используем старый способ копирования');
            
            const textArea = document.createElement('textarea');
            textArea.value = message;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                console.log('✅ Текст скопирован (старый способ)');
                showMessage('✅ Текст скопирован! Теперь можете вставить его в пост ВКонтакте', 'success');
                giveShareReward();
            } else {
                throw new Error('execCommand failed');
            }
        } catch (e) {
            console.error('Ошибка копирования:', e);
            
            // Последний резерв - показать текст для ручного копирования
            showTextForManualCopy(message);
        }
    }
    
    function showTextForManualCopy(message) {
        console.log('📝 Показываем текст для ручного копирования');
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 90%;
            width: 500px;
            text-align: center;
        `;
        
        content.innerHTML = `
            <h3 style="margin: 0 0 15px 0;">📝 Скопируйте текст вручную</h3>
            <textarea readonly style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-family: monospace; font-size: 14px; resize: vertical;">${message}</textarea>
            <div style="margin-top: 15px;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Понятно
                </button>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Автоматически выделяем текст
        const textarea = content.querySelector('textarea');
        textarea.focus();
        textarea.select();
        
        giveShareReward();
    }
    
    function showMessage(text, type = 'info') {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 500;
            z-index: 10002;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.textContent = text;
        
        // Добавляем анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // Убираем через 4 секунды
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                if (style.parentNode) style.parentNode.removeChild(style);
            }, 300);
        }, 4000);
    }
    
    function showError(message) {
        console.error('❌ Ошибка:', message);
        showMessage(`❌ ${message}`, 'error');
    }
    
    function giveShareReward() {
        console.log('🏆 Даем награду за шеринг');
        
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
    window.testSimpleShare = function() {
        console.log('🧪 Тестируем простой шеринг');
        
        // Имитируем результаты
        const testResults = {
            percentage: 85,
            correct: 8,
            total: 10
        };
        
        const message = createSimpleMessage(testResults);
        showSharingOptions(message);
    };
    
})();
