// enhanced-sharing.js - Решение проблемы "только ссылка"
(function() {
    'use strict';
    
    // Интеграция с существующим кодом
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(enhanceSharing, 2000);
    });
    
    function enhanceSharing() {
        console.log('🎨 Настраиваем улучшенный шеринг с результатами');
        
        // Заменяем кнопку "Поделиться" на более функциональную
        replaceShareButton();
    }
    
    function replaceShareButton() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) return;
        
        // Полностью заменяем функционал
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📤 Клик по улучшенной кнопке "Поделиться"');
            showSharingModal();
        };
        
        // Обновляем текст кнопки
        shareButton.innerHTML = '🎯 Поделиться результатами';
        
        console.log('✅ Кнопка "Поделиться" улучшена');
    }
    
    function showSharingModal() {
        const results = getCurrentResults();
        if (!results) {
            alert('❌ Не удалось получить результаты теста');
            return;
        }
        
        // Создаем модальное окно с вариантами
        const modal = createSharingModal(results);
        document.body.appendChild(modal);
    }
    
    function createSharingModal(results) {
        const modal = document.createElement('div');
        modal.className = 'sharing-modal-enhanced';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(8px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 90%;
            width: 450px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            animation: modalSlideIn 0.4s ease-out;
            position: relative;
        `;
        
        const message = createDetailedMessage(results);
        
        modalContent.innerHTML = `
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px;">×</button>
            
            <h2 style="margin: 0 0 20px 0; font-size: 24px;">🎯 Поделиться результатами</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin: 20px 0; backdrop-filter: blur(10px);">
                <div style="font-size: 48px; margin-bottom: 10px;">${getResultEmoji(results.percentage)}</div>
                <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">${results.percentage}%</div>
                <div style="font-size: 16px; opacity: 0.9;">Правильно: ${results.correct} из ${results.total}</div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 25px;">
                <button class="share-option" data-action="image" style="background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; border: none; padding: 15px 20px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    🖼️ Создать картинку с результатами
                </button>
                
                <button class="share-option" data-action="text" style="background: linear-gradient(135deg, #4ecdc4, #44a08d); color: white; border: none; padding: 15px 20px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    📝 Скопировать текст для поста
                </button>
                
                <button class="share-option" data-action="vk" style="background: linear-gradient(135deg, #4680C2, #3a6ba5); color: white; border: none; padding: 15px 20px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    💬 Отправить сообщением (VK)
                </button>
                
                <button class="share-option" data-action="story" style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; border: none; padding: 15px 20px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    📱 Поделиться в истории
                </button>
            </div>
        `;
        
        // Добавляем анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.7) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            .share-option:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
        
        modal.appendChild(modalContent);
        
        // Обработчики кнопок
        modal.addEventListener('click', function(e) {
            if (e.target.classList.contains('share-option')) {
                const action = e.target.dataset.action;
                handleShareAction(action, results, message);
                modal.remove();
                style.remove();
            } else if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });
        
        return modal;
    }
    
    function handleShareAction(action, results, message) {
        console.log(`🎯 Выбран способ шеринга: ${action}`);
        
        switch (action) {
            case 'image':
                createShareImage(results);
                break;
            case 'text':
                copyTextForPost(message);
                break;
            case 'vk':
                shareViaVKMessage(message);
                break;
            case 'story':
                shareToStory(results);
                break;
        }
        
        // Даем награду за любой шеринг
        giveShareReward();
    }
    
    // 1. Создание картинки с результатами
    function createShareImage(results) {
        console.log('🖼️ Создаем картинку с результатами');
        
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Фон с градиентом
        const gradient = ctx.createLinearGradient(0, 0, 600, 400);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 400);
        
        // Заголовок
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🩺 Медицинский Квиз', 300, 60);
        
        // Результат
        ctx.font = 'bold 72px Arial';
        ctx.fillText(`${results.percentage}%`, 300, 160);
        
        // Детали
        ctx.font = '24px Arial';
        ctx.fillText(`Правильно: ${results.correct} из ${results.total}`, 300, 200);
        
        // Режим и сложность
        const modeBtn = document.querySelector('.quiz-mode-btn.active');
        const diffBtn = document.querySelector('.difficulty-btn.active');
        const mode = modeBtn ? modeBtn.textContent.trim() : 'Тест';
        const difficulty = diffBtn ? diffBtn.textContent.trim() : '';
        
        ctx.font = '20px Arial';
        ctx.fillText(`${mode} ${difficulty ? '(' + difficulty.toLowerCase() + ')' : ''}`, 300, 240);
        
        // Мотивационный текст
        const motivationText = getMotivationText(results.percentage);
        ctx.font = '18px Arial';
        ctx.fillText(motivationText, 300, 280);
        
        // Призыв к действию
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Проверь свои медицинские знания!', 300, 320);
        
        // URL приложения
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText(window.location.href, 300, 360);
        
        // Конвертируем в изображение и предлагаем скачать
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `medical-quiz-result-${results.percentage}%.png`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            showToast('🖼️ Картинка сохранена! Теперь можете загрузить её в пост ВК', 'success');
        });
    }
    
    // 2. Копирование текста для поста
    function copyTextForPost(message) {
        console.log('📝 Копируем текст для поста');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(message)
                .then(() => {
                    showToast('📝 Текст скопирован! Теперь можете вставить его в пост на стену ВК', 'success');
                })
                .catch(() => fallbackCopy(message));
        } else {
            fallbackCopy(message);
        }
    }
    
    // 3. Шеринг через VK сообщения (старый способ)
    function shareViaVKMessage(message) {
        console.log('💬 Отправляем через VK сообщения');
        
        const bridge = getVKBridge();
        if (bridge) {
            bridge.send('VKWebAppShare', { message: message })
                .then(() => {
                    showToast('💬 Сообщение отправлено!', 'success');
                })
                .catch(error => {
                    console.error('Ошибка VK Share:', error);
                    showToast('❌ Не удалось отправить через VK', 'error');
                });
        } else {
            showToast('❌ VK Bridge недоступен', 'error');
        }
    }
    
    // 4. Шеринг в истории VK
    function shareToStory(results) {
        console.log('📱 Делимся в истории VK');
        
        const bridge = getVKBridge();
        if (!bridge) {
            showToast('❌ VK Bridge недоступен для историй', 'error');
            return;
        }
        
        // Создаем данные для истории
        const storyData = {
            background_type: 'color',
            background_color: '#667eea',
            stickers: [{
                sticker_type: 'renderable',
                sticker: {
                    content_type: 'text',
                    text: `🩺 Медицинский квиз\n${results.percentage}%\n${results.correct}/${results.total}`,
                    style: 'white'
                }
            }]
        };
        
        bridge.send('VKWebAppShowStoryBox', storyData)
            .then(() => {
                showToast('📱 История создана!', 'success');
            })
            .catch(error => {
                console.error('Ошибка Story:', error);
                showToast('❌ Не удалось создать историю', 'error');
            });
    }
    
    // Вспомогательные функции
    function getCurrentResults() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (!percentageEl || !correctEl || !totalEl) return null;
            
            return {
                percentage: parseInt(percentageEl.textContent) || 0,
                correct: parseInt(correctEl.textContent) || 0,
                total: parseInt(totalEl.textContent) || 0
            };
        } catch (e) {
            return null;
        }
    }
    
    function createDetailedMessage(results) {
        const modeBtn = document.querySelector('.quiz-mode-btn.active');
        const diffBtn = document.querySelector('.difficulty-btn.active');
        
        const mode = modeBtn ? modeBtn.textContent.trim() : 'Медицинский квиз';
        const difficulty = diffBtn ? diffBtn.textContent.trim() : 'обычный';
        
        const emoji = getResultEmoji(results.percentage);
        const grade = getResultGrade(results.percentage);
        
        let message = `${emoji} ${grade}! Прошел "${mode}"`;
        
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
                message += `📊 Всего пройдено тестов: ${stats.totalQuizzes}\n`;
            }
            
            if (stats.achievements && stats.achievements.length > 0) {
                message += `🏆 Получено достижений: ${stats.achievements.length}\n`;
            }
        }
        
        message += '\n🩺 А ты сможешь лучше? Проверь свои медицинские знания!\n';
        message += window.location.href;
        
        return message;
    }
    
    function getResultEmoji(percentage) {
        if (percentage >= 95) return '🏆';
        if (percentage >= 85) return '🌟';
        if (percentage >= 75) return '👏';
        if (percentage >= 60) return '👍';
        if (percentage >= 50) return '📚';
        return '💪';
    }
    
    function getResultGrade(percentage) {
        if (percentage >= 95) return 'Превосходно';
        if (percentage >= 85) return 'Отлично';
        if (percentage >= 75) return 'Очень хорошо';
        if (percentage >= 60) return 'Хорошо';
        if (percentage >= 50) return 'Удовлетворительно';
        return 'Нужно подучиться';
    }
    
    function getMotivationText(percentage) {
        if (percentage >= 90) return 'Настоящий профессионал!';
        if (percentage >= 80) return 'Отличные знания!';
        if (percentage >= 70) return 'Хороший результат!';
        if (percentage >= 50) return 'Есть куда расти!';
        return 'Не сдавайтесь!';
    }
    
    function getVKBridge() {
        if (window.vkBridgeInstance) return window.vkBridgeInstance;
        if (window.vkBridge) return window.vkBridge;
        if (typeof vkBridge !== 'undefined') return vkBridge;
        return null;
    }
    
    function fallbackCopy(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showToast('📝 Текст скопирован!', 'success');
            } else {
                alert(`Скопируйте текст:\n\n${text}`);
            }
        } catch (e) {
            alert(`Скопируйте текст:\n\n${text}`);
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
            border-radius: 12px;
            font-weight: 500;
            z-index: 10001;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
        }, 5000);
    }
    
    function giveShareReward() {
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
    window.testEnhancedSharing = function() {
        console.log('🧪 Тестируем улучшенный шеринг');
        showSharingModal();
    };
    
})();
