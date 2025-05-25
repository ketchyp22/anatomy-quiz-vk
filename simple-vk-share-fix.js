// simple-vk-share-fix.js - Простое решение шеринга для VK
(function() {
    'use strict';
    
    console.log('📤 Загружается простое решение шеринга для VK...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initSimpleShare, 2000);
    });
    
    function initSimpleShare() {
        console.log('🎯 Инициализируем простой шеринг');
        
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('❌ Кнопка поделиться не найдена');
            return;
        }
        
        // Меняем текст кнопки
        shareButton.innerHTML = '📋 Скопировать результат';
        
        // Заменяем функционал кнопки
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📋 Клик по кнопке - копируем результат');
            shareResultsSimple();
        };
        
        console.log('✅ Простой шеринг настроен');
    }
    
    function shareResultsSimple() {
        console.log('🎯 Начинаем простой процесс шеринга...');
        
        // Получаем результаты
        const results = getResults();
        if (!results) {
            console.error('❌ Не удалось получить результаты');
            showSimpleAlert('Не удалось получить результаты теста');
            return;
        }
        
        console.log('📊 Результаты для шеринга:', results);
        
        // Создаем сообщение
        const message = createShareMessage(results);
        
        // Показываем красивое окно с текстом для копирования
        showShareModal(message, results);
    }
    
    function showShareModal(message, results) {
        // Создаем модальное окно
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
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            position: relative;
        `;
        
        dialog.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">
                    🎉 Ваш результат готов!
                </h3>
                <div style="font-size: 48px; margin: 10px 0; color: #10B981;">
                    ${getEmoji(results.percentage)} ${results.percentage}%
                </div>
                <p style="color: #666; margin: 0;">
                    ${results.correct} из ${results.total} правильных ответов
                </p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p style="margin-bottom: 15px; color: #333; font-weight: 600;">
                    📝 Скопируйте текст и поделитесь в ВК:
                </p>
                <textarea id="share-text" readonly style="
                    width: 100%;
                    height: 200px;
                    padding: 15px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 1.5;
                    resize: vertical;
                    background: #f8fafc;
                    color: #334155;
                    box-sizing: border-box;
                ">${message}</textarea>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="select-all-text" style="
                    flex: 1;
                    padding: 15px;
                    background: #3B82F6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    📝 Выделить весь текст
                </button>
                
                <button id="download-image" style="
                    flex: 1;
                    padding: 15px;
                    background: #8B5CF6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    🖼️ Скачать картинку
                </button>
            </div>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #0369a1; line-height: 1.4;">
                    💡 <strong>Как поделиться:</strong><br>
                    1. Нажмите "Выделить весь текст"<br>
                    2. Скопируйте текст (Ctrl+C)<br>
                    3. Вставьте в пост ВК или сообщение
                </p>
            </div>
            
            <button id="close-share-modal" style="
                width: 100%;
                padding: 12px;
                background: #6b7280;
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
            ">
                Закрыть
            </button>
        `;
        
        // Добавляем стили для анимации
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
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        // Обработчики событий
        const textarea = dialog.querySelector('#share-text');
        const selectButton = dialog.querySelector('#select-all-text');
        const downloadButton = dialog.querySelector('#download-image');
        const closeButton = dialog.querySelector('#close-share-modal');
        
        selectButton.onclick = () => {
            textarea.select();
            textarea.setSelectionRange(0, 99999); // Для мобильных
            
            // Пытаемся скопировать через старый метод
            try {
                document.execCommand('copy');
                showSuccessMessage('✅ Текст выделен и скопирован!');
            } catch (err) {
                showSuccessMessage('📝 Текст выделен! Нажмите Ctrl+C для копирования');
            }
        };
        
        downloadButton.onclick = () => {
            generateAndDownloadImage(results);
        };
        
        closeButton.onclick = closeModal;
        
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        
        // Автоматически выделяем текст при открытии
        setTimeout(() => {
            textarea.focus();
            textarea.select();
        }, 500);
        
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
    
    function generateAndDownloadImage(results) {
        console.log('🖼️ Генерируем изображение...');
        
        try {
            // Создаем canvas для генерации изображения
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Размеры изображения
            canvas.width = 800;
            canvas.height = 600;
            
            // Фон с градиентом
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Добавляем полупрозрачный слой
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Настройки шрифта
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            
            // Заголовок
            ctx.font = 'bold 48px Arial';
            ctx.fillText('👨‍⚕️ Медицинский Квиз', canvas.width / 2, 100);
            
            // Основной результат
            ctx.font = 'bold 120px Arial';
            ctx.fillText(`${results.percentage}%`, canvas.width / 2, 250);
            
            // Детали
            ctx.font = '32px Arial';
            ctx.fillText(`Правильных ответов: ${results.correct} из ${results.total}`, canvas.width / 2, 320);
            
            // Оценка
            const grade = getGrade(results.percentage);
            ctx.font = 'bold 36px Arial';
            ctx.fillText(grade, canvas.width / 2, 380);
            
            // Мотивационный текст
            ctx.font = '24px Arial';
            const motivationText = getMotivationText(results.percentage);
            wrapText(ctx, motivationText, canvas.width / 2, 450, 600, 30);
            
            // Призыв к действию
            ctx.font = '20px Arial';
            ctx.fillText('🩺 А ты сможешь лучше? Проверь свои знания!', canvas.width / 2, 520);
            
            // URL приложения (если нужно)
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText('Медицинский Квиз ВК', canvas.width / 2, 560);
            
            // Конвертируем в изображение и скачиваем
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `medical-quiz-result-${results.percentage}%.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showSuccessMessage('🖼️ Изображение сохранено!');
            }, 'image/png');
            
        } catch (error) {
            console.error('Ошибка генерации изображения:', error);
            showSuccessMessage('❌ Не удалось создать изображение');
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
    
    function getResults() {
        try {
            // Способ 1: Прямой поиск элементов
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (percentageEl && correctEl && totalEl) {
                return {
                    percentage: parseInt(percentageEl.textContent) || 0,
                    correct: parseInt(correctEl.textContent) || 0,
                    total: parseInt(totalEl.textContent) || 0,
                    method: 'direct'
                };
            }
            
            // Способ 2: Поиск в тексте страницы
            const pageText = document.body.textContent || '';
            const percentMatch = pageText.match(/(\d+)%/g);
            const scoreMatch = pageText.match(/(\d+)\s*из\s*(\d+)/g);
            
            if (percentMatch && scoreMatch) {
                const percentage = parseInt(percentMatch[percentMatch.length - 1]);
                const lastScore = scoreMatch[scoreMatch.length - 1];
                const scoreNumbers = lastScore.match(/(\d+)\s*из\s*(\d+)/);
                
                if (scoreNumbers) {
                    return {
                        percentage: percentage,
                        correct: parseInt(scoreNumbers[1]),
                        total: parseInt(scoreNumbers[2]),
                        method: 'text'
                    };
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Ошибка получения результатов:', error);
            return null;
        }
    }
    
    function createShareMessage(results) {
        const emoji = getEmoji(results.percentage);
        const grade = getGrade(results.percentage);
        
        let message = `${emoji} ${grade}! Прошел медицинский квиз и набрал ${results.percentage}%!\n\n`;
        message += `✅ Правильных ответов: ${results.correct} из ${results.total}\n\n`;
        
        // Добавляем мотивационный текст
        message += getMotivationText(results.percentage) + '\n\n';
        
        message += `🩺 А ты сможешь лучше? Проверь свои медицинские знания!\n\n`;
        message += `#медицинскийквиз #медицина #тест`;
        
        return message;
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
    
    function showSimpleAlert(message) {
        alert(message);
    }
    
    function showSuccessMessage(text) {
        // Создаем простое уведомление
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
        
        // Добавляем стили для анимации если их еще нет
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
    
    // Награда за шеринг
    function giveShareReward() {
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (!stats.achievements.includes('social')) {
                stats.achievements.push('social');
                setTimeout(() => {
                    if (window.Gamification.showAchievement) {
                        window.Gamification.showAchievement('Социальный: поделился результатом! 📤');
                    }
                }, 1000);
                if (window.Gamification.saveStats) {
                    window.Gamification.saveStats();
                }
            }
        }
    }
    
    // Отладочные функции
    window.debugSimpleShare = {
        testShare: () => {
            console.log('🧪 Тестируем простой шеринг...');
            shareResultsSimple();
        },
        
        getResults: () => {
            const results = getResults();
            console.log('📊 Найденные результаты:', results);
            return results;
        }
    };
    
    console.log('✅ Простое решение шеринга загружено');
    console.log('🐛 Доступны функции отладки: window.debugSimpleShare');
    
})();
