// ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ СИСТЕМА ШЕРИНГА БЕЗ ССЫЛОК
// Замените функцию shareResults в app.js на эту:

function shareResults() {
    console.log('📤 НОВАЯ система шеринга - БЕЗ ссылок на GitHub');
    
    // Получаем результаты
    const percentage = Math.round((score / questionsForQuiz.length) * 100);
    const correctAnswers = score;
    const totalQuestions = questionsForQuiz.length;
    
    // Определяем режим
    let modeText = 'Анатомия';
    switch(currentQuizMode) {
        case 'clinical': modeText = 'Клиническое мышление'; break;
        case 'pharmacology': modeText = 'Фармакология'; break;
        case 'first_aid': modeText = 'Первая помощь'; break;
        case 'obstetrics': modeText = 'Акушерство'; break;
        case 'expert': modeText = '🧠 ЭКСПЕРТНЫЙ УРОВЕНЬ'; break;
    }
    
    // Определяем сложность
    const difficultyText = currentQuizMode === 'expert' ? 'экспертный уровень' : 
                          (currentDifficulty === 'hard' ? 'сложный уровень' : 'обычный уровень');
    
    // Создаем текст БЕЗ призыва к действию с ссылкой
    const shareText = createCleanShareText(percentage, correctAnswers, totalQuestions, modeText, difficultyText);
    
    // Проверяем доступность VK Bridge
    const bridge = getBridgeInstance();
    
    if (!bridge) {
        console.warn('VK Bridge недоступен - показываем только копирование');
        showCopyOnlyModal(shareText);
        return;
    }
    
    // Показываем модальное окно с вариантами шеринга
    showCleanShareModal(shareText, percentage, bridge);
}

// Создание чистого текста без ссылок
function createCleanShareText(percentage, correct, total, mode, difficulty) {
    const emoji = getResultEmoji(percentage);
    const grade = getResultGrade(percentage);
    const motivation = getCleanMotivation(percentage);
    
    return `${emoji} ${grade}! Прошел медицинский квиз и набрал ${percentage}%!

✅ Правильных ответов: ${correct} из ${total}
📋 Режим: ${mode}
🎯 Уровень: ${difficulty}

${motivation}

💪 Медицинские знания - это сила!`;
}

// Получение экземпляра VK Bridge
function getBridgeInstance() {
    return window.vkBridgeInstance || 
           window.vkBridge || 
           (typeof vkBridge !== 'undefined' ? vkBridge : null);
}

// Показ модального окна с чистыми вариантами шеринга
function showCleanShareModal(shareText, percentage, bridge) {
    // Удаляем существующие модальные окна
    const existingModals = document.querySelectorAll('.share-modal');
    existingModals.forEach(modal => modal.remove());
    
    // Создаем новое модальное окно
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(8px);
        animation: modalFadeIn 0.3s ease-out;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 24px;
        padding: 32px;
        max-width: 380px;
        width: 90%;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.3);
        position: relative;
        animation: modalSlideIn 0.4s ease-out;
    `;
    
    const resultEmoji = getResultEmoji(percentage);
    
    dialog.innerHTML = `
        <div style="margin-bottom: 28px;">
            <div style="font-size: 64px; margin-bottom: 12px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
                ${resultEmoji}
            </div>
            <h3 style="margin: 0 0 8px 0; color: #1a202c; font-size: 24px; font-weight: 700;">
                Поделиться результатом
            </h3>
            <div style="font-size: 36px; font-weight: 800; color: #059669; margin: 8px 0;">
                ${percentage}%
            </div>
            <p style="color: #64748b; margin: 0; font-size: 15px;">
                ${score} из ${questionsForQuiz.length} правильных ответов
            </p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
            <button id="clean-share-message" style="
                padding: 16px 24px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                border-radius: 16px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                💬 Отправить друзьям
            </button>
            
            <button id="clean-share-wall" style="
                padding: 16px 24px;
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                border: none;
                border-radius: 16px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                📝 Опубликовать на стене
            </button>
            
            <button id="clean-copy-text" style="
                padding: 14px 24px;
                background: #f1f5f9;
                color: #475569;
                border: 2px solid #e2e8f0;
                border-radius: 16px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                📋 Скопировать текст
            </button>
        </div>
        
        <button id="clean-close-modal" style="
            width: 100%;
            padding: 12px;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
            Закрыть
        </button>
    `;
    
    // Добавляем стили анимации
    addModalStyles();
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Обработчики событий
    dialog.querySelector('#clean-share-message').onclick = () => {
        closeCleanModal(modal);
        shareVKMessage(shareText, bridge);
    };
    
    dialog.querySelector('#clean-share-wall').onclick = () => {
        closeCleanModal(modal);
        shareVKWall(shareText, bridge);
    };
    
    dialog.querySelector('#clean-copy-text').onclick = () => {
        closeCleanModal(modal);
        copyCleanText(shareText);
    };
    
    dialog.querySelector('#clean-close-modal').onclick = () => {
        closeCleanModal(modal);
    };
    
    // Закрытие по клику на фон
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeCleanModal(modal);
        }
    };
}

// Отправка сообщения в VK (БЕЗ ссылок)
async function shareVKMessage(text, bridge) {
    console.log('💬 Отправляем сообщение в VK БЕЗ ссылок');
    
    try {
        const result = await bridge.send('VKWebAppShare', {
            text: text
            // КРИТИЧЕСКИ ВАЖНО: НЕ передаем параметр link!
        });
        
        console.log('✅ Сообщение отправлено:', result);
        
        if (result && result.type === 'message') {
            const count = result.users ? result.users.length : 1;
            showCleanNotification(`💬 Сообщение отправлено ${count > 1 ? count + ' друзьям' : 'другу'}!`);
        } else {
            showCleanNotification('💬 Сообщение отправлено!');
        }
        
        // Награда за шеринг
        rewardSharing();
        
    } catch (error) {
        console.error('❌ Ошибка отправки сообщения:', error);
        
        if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
            showCleanNotification('ℹ️ Отправка отменена');
        } else {
            showCleanNotification('❌ Не удалось отправить. Попробуйте скопировать текст.');
            setTimeout(() => copyCleanText(text), 1500);
        }
    }
}

// Публикация на стене VK (БЕЗ ссылок)
async function shareVKWall(text, bridge) {
    console.log('📝 Публикуем на стене VK БЕЗ ссылок');
    
    try {
        const result = await bridge.send('VKWebAppShowWallPostBox', {
            message: text
            // КРИТИЧЕСКИ ВАЖНО: НЕ передаем attachment или link!
        });
        
        console.log('✅ Запись опубликована:', result);
        
        if (result && result.post_id) {
            showCleanNotification('📝 Запись опубликована на стене!');
        } else {
            showCleanNotification('📝 Редактор записи открыт!');
        }
        
        // Награда за шеринг
        rewardSharing();
        
    } catch (error) {
        console.error('❌ Ошибка публикации:', error);
        
        if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
            showCleanNotification('ℹ️ Публикация отменена');
        } else {
            showCleanNotification('❌ Не удалось опубликовать. Попробуйте скопировать текст.');
            setTimeout(() => copyCleanText(text), 1500);
        }
    }
}

// Копирование текста в буфер обмена
function copyCleanText(text) {
    console.log('📋 Копируем текст в буфер обмена');
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCleanNotification('📋 Текст скопирован в буфер обмена!');
            }).catch(() => {
                fallbackCopyText(text);
            });
        } else {
            fallbackCopyText(text);
        }
    } catch (error) {
        console.error('Ошибка копирования:', error);
        fallbackCopyText(text);
    }
}

// Резервный способ копирования
function fallbackCopyText(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showCleanNotification('📋 Текст скопирован!');
        } else {
            showCopyOnlyModal(text);
        }
    } catch (error) {
        console.error('Резервное копирование не удалось:', error);
        showCopyOnlyModal(text);
    }
}

// Показ модального окна только для копирования (fallback)
function showCopyOnlyModal(text) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: modalFadeIn 0.3s ease-out;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 420px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.4s ease-out;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #333; font-size: 22px;">📤 Поделиться результатом</h3>
        <p style="color: #666; margin-bottom: 18px; line-height: 1.5;">
            Скопируйте текст и поделитесь им в VK или других социальных сетях:
        </p>
        <textarea readonly id="share-textarea" style="
            width: 100%; 
            height: 140px; 
            padding: 16px; 
            border: 2px solid #e2e8f0; 
            border-radius: 12px; 
            font-size: 14px; 
            resize: none; 
            margin-bottom: 20px;
            font-family: inherit;
            line-height: 1.4;
            background: #f8fafc;
        ">${text}</textarea>
        <div style="display: flex; gap: 12px;">
            <button onclick="selectAndCopy();" style="
                flex: 1;
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white; 
                border: none; 
                padding: 14px 20px; 
                border-radius: 12px; 
                cursor: pointer;
                font-weight: 600;
                font-size: 15px;
            ">📋 Выделить и скопировать</button>
            <button onclick="this.closest('.share-modal').remove();" style="
                flex: 1;
                background: #6b7280; 
                color: white; 
                border: none; 
                padding: 14px 20px; 
                border-radius: 12px; 
                cursor: pointer;
                font-weight: 500;
                font-size: 15px;
            ">Закрыть</button>
        </div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Автовыделение текста при клике
    const textarea = dialog.querySelector('#share-textarea');
    textarea.onclick = () => textarea.select();
    
    // Функция выделения и копирования
    window.selectAndCopy = function() {
        textarea.select();
        textarea.setSelectionRange(0, 99999); // Для мобильных устройств
        
        try {
            document.execCommand('copy');
            showCleanNotification('📋 Текст скопирован!');
            modal.remove();
        } catch (error) {
            showCleanNotification('⚠️ Выделите текст и нажмите Ctrl+C');
        }
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Закрытие модального окна с анимацией
function closeCleanModal(modal) {
    modal.style.animation = 'modalFadeOut 0.3s ease-out';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Добавление стилей анимации
function addModalStyles() {
    if (document.getElementById('clean-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'clean-modal-styles';
    style.textContent = `
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes modalSlideIn {
            from { 
                opacity: 0; 
                transform: translateY(-30px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        @keyframes notificationSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes notificationSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Показ уведомлений
function showCleanNotification(text) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.clean-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'clean-notification';
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        font-size: 15px;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
        max-width: 320px;
        line-height: 1.4;
        animation: notificationSlideIn 0.4s ease-out;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.textContent = text;
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.4s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Награда за шеринг
function rewardSharing() {
    if (window.Gamification && window.Gamification.stats) {
        const stats = window.Gamification.stats;
        
        if (!stats.achievements.includes('social_butterfly')) {
            stats.achievements.push('social_butterfly');
            
            setTimeout(() => {
                if (window.Gamification.showAchievement) {
                    window.Gamification.showAchievement('Социальная бабочка: поделился результатом! 🦋');
                }
            }, 1200);
            
            if (window.Gamification.saveStats) {
                window.Gamification.saveStats();
            }
        }
    }
}

// Вспомогательные функции для результатов
function getResultEmoji(percentage) {
    if (percentage >= 95) return '🏆';
    if (percentage >= 85) return '🌟';
    if (percentage >= 75) return '🎉';
    if (percentage >= 65) return '👏';
    if (percentage >= 50) return '👍';
    if (percentage >= 35) return '📚';
    return '💪';
}

function getResultGrade(percentage) {
    if (percentage >= 95) return 'Превосходно';
    if (percentage >= 85) return 'Отлично';
    if (percentage >= 75) return 'Очень хорошо';
    if (percentage >= 65) return 'Хорошо';
    if (percentage >= 50) return 'Удовлетворительно';
    if (percentage >= 35) return 'Есть потенциал';
    return 'Начинаем изучать';
}

function getCleanMotivation(percentage) {
    if (percentage >= 90) {
        return '🏆 Выдающийся результат! Вы настоящий эксперт в медицине!';
    } else if (percentage >= 75) {
        return '⭐ Отличные знания! Продолжайте в том же духе!';
    } else if (percentage >= 60) {
        return '👍 Хорошая база знаний! Есть куда расти!';
    } else if (percentage >= 40) {
        return '📖 Неплохое начало! Больше практики - и успех придет!';
    } else {
        return '🚀 Каждый эксперт когда-то был новичком. Вперед к знаниям!';
    }
}

// Функции для отладки
window.debugCleanShare = {
    test: () => {
        // Тестируем с фейковыми данными
        window.score = 8;
        window.questionsForQuiz = new Array(10);
        window.currentQuizMode = 'anatomy';
        window.currentDifficulty = 'easy';
        shareResults();
    },
    
    testCopy: () => {
        const text = "Тестовый текст для копирования";
        copyCleanText(text);
    },
    
    checkBridge: () => {
        const bridge = getBridgeInstance();
        console.log('VK Bridge доступен:', !!bridge);
        return !!bridge;
    }
};

console.log('✅ ПОЛНОСТЬЮ НОВАЯ система шеринга БЕЗ ссылок загружена');
console.log('🔧 Тест: window.debugCleanShare.test()');

// ИНСТРУКЦИЯ ПО ЗАМЕНЕ:
// 1. Найдите в app.js функцию shareResults()
// 2. Замените ее полностью на этот код
// 3. Удалите старые файлы vk-share-*.js
// 4. Теперь шеринг будет работать БЕЗ ссылок на GitHub!
