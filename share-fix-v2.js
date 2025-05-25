// share-fix-v2.js - Новая версия исправления шеринга
(function() {
    'use strict';
    
    console.log('🔧 Загружается исправление шеринга v2...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initShareFix, 2000);
    });
    
    function initShareFix() {
        console.log('🚀 Инициализируем исправление шеринга v2');
        
        // Исправляем кнопку поделиться
        fixShareButton();
        
        // Добавляем отладочные функции
        addDebugFunctions();
    }
    
    function fixShareButton() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('❌ Кнопка поделиться не найдена');
            return;
        }
        
        // Полностью заменяем обработчик
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📤 Клик по кнопке поделиться v2');
            handleShareV2();
        };
        
        console.log('✅ Кнопка поделиться исправлена v2');
    }
    
    function handleShareV2() {
        console.log('🎯 Начинаем процесс шеринга v2...');
        
        // Пробуем найти результаты разными способами
        let results = findResults();
        
        if (!results) {
            console.warn('⚠️ Результаты не найдены, запрашиваем у пользователя...');
            results = getResultsFromUser();
        }
        
        if (!results) {
            console.error('❌ Не удалось получить результаты');
            alert('Не удалось получить результаты теста. Попробуйте еще раз.');
            return;
        }
        
        console.log('📊 Используем результаты:', results);
        showShareModalV2(results);
    }
    
    function findResults() {
        console.log('🔍 Ищем результаты на странице...');
        
        // Способ 1: Поиск по ID
        const percentageEl = document.getElementById('percentage');
        const correctEl = document.getElementById('correct-answers');
        const totalEl = document.getElementById('total-questions-result');
        
        if (percentageEl && correctEl && totalEl) {
            const percentage = parseInt(percentageEl.textContent) || 0;
            const correct = parseInt(correctEl.textContent) || 0;
            const total = parseInt(totalEl.textContent) || 0;
            
            console.log('✅ Найдены элементы по ID:', { percentage, correct, total });
            
            if (total > 0) {
                return { percentage, correct, total, method: 'id' };
            }
        }
        
        // Способ 2: Поиск в тексте страницы
        const bodyText = document.body.textContent || '';
        console.log('📄 Ищем в тексте страницы...');
        
        // Ищем проценты
        const percentMatch = bodyText.match(/(\d+)%/g);
        const correctMatch = bodyText.match(/Правильных ответов:\s*(\d+)\s*из\s*(\d+)/i);
        const scoreMatch = bodyText.match(/(\d+)\s*из\s*(\d+)/g);
        
        console.log('🔍 Найденные совпадения:', {
            percentMatch,
            correctMatch,
            scoreMatch
        });
        
        if (percentMatch && scoreMatch) {
            // Берем последний найденный процент (вероятно результат)
            const percentage = parseInt(percentMatch[percentMatch.length - 1]);
            
            // Берем последний найденный счет
            const lastScore = scoreMatch[scoreMatch.length - 1];
            const scoreNumbers = lastScore.match(/(\d+)\s*из\s*(\d+)/);
            
            if (scoreNumbers) {
                const correct = parseInt(scoreNumbers[1]);
                const total = parseInt(scoreNumbers[2]);
                
                console.log('✅ Найдены результаты в тексте:', { percentage, correct, total });
                return { percentage, correct, total, method: 'text' };
            }
        }
        
        // Способ 3: Поиск в элементах с классами счета
        const scoreElements = document.querySelectorAll('.score, .score-percentage, .result, [class*="result"]');
        for (let el of scoreElements) {
            const text = el.textContent || '';
            const percentMatch = text.match(/(\d+)%/);
            const scoreMatch = text.match(/(\d+)\s*из\s*(\d+)/);
            
            if (percentMatch && scoreMatch) {
                const percentage = parseInt(percentMatch[1]);
                const scoreNumbers = scoreMatch[0].match(/(\d+)\s*из\s*(\d+)/);
                
                if (scoreNumbers) {
                    const correct = parseInt(scoreNumbers[1]);
                    const total = parseInt(scoreNumbers[2]);
                    
                    console.log('✅ Найдены результаты в элементах:', { percentage, correct, total });
                    return { percentage, correct, total, method: 'elements' };
                }
            }
        }
        
        console.warn('❌ Результаты не найдены ни одним способом');
        return null;
    }
    
    function getResultsFromUser() {
        const percentage = prompt('Введите ваш результат в процентах (например: 85):');
        
        if (percentage && !isNaN(percentage)) {
            const percent = Math.max(0, Math.min(100, parseInt(percentage)));
            const total = 10; // стандартное количество вопросов
            const correct = Math.round((percent / 100) * total);
            
            return {
                percentage: percent,
                correct: correct,
                total: total,
                method: 'user_input'
            };
        }
        
        return null;
    }
    
    function showShareModalV2(results) {
        // Удаляем предыдущее модальное окно
        const existingModal = document.querySelector('.share-modal-v2');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'share-modal-v2';
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
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 90%;
            width: 400px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        const message = createMessage(results);
        
        modalContent.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #333;">🎯 Поделиться результатами</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <div style="font-size: 36px; margin-bottom: 10px;">${getEmoji(results.percentage)}</div>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">${results.percentage}%</div>
                <div style="color: #666;">Правильно: ${results.correct} из ${results.total}</div>
                <div style="font-size: 12px; color: #999; margin-top: 5px;">Метод: ${results.method}</div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.shareFixV2.copyText('${message.replace(/'/g, "\\'")}'); this.parentElement.parentElement.parentElement.remove();" style="background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    📋 Скопировать текст
                </button>
                
                <button onclick="window.shareFixV2.tryVK('${message.replace(/'/g, "\\'")}'); this.parentElement.parentElement.parentElement.remove();" style="background: #4680C2; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    💬 Поделиться в VK
                </button>
                
                <button onclick="window.shareFixV2.downloadImage(${results.percentage}, ${results.correct}, ${results.total}); this.parentElement.parentElement.parentElement.remove();" style="background: #FF9800; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    🖼️ Скачать картинку
                </button>
                
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; margin-top: 10px;">
                    ❌ Закрыть
                </button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 100);
        
        // Закрытие по клику на фон
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function createMessage(results) {
        const emoji = getEmoji(results.percentage);
        const grade = getGrade(results.percentage);
        
        let message = `${emoji} ${grade}! Прошел медицинский квиз и набрал ${results.percentage}%!\\n\\n`;
        message += `✅ Правильных ответов: ${results.correct} из ${results.total}\\n\\n`;
        message += `🩺 А ты сможешь лучше? Проверь свои знания!\\n`;
        message += window.location.href;
        
        return message;
    }
    
    function getEmoji(percentage) {
        if (percentage >= 90) return '🏆';
        if (percentage >= 80) return '🌟';
        if (percentage >= 70) return '👏';
        if (percentage >= 60) return '👍';
        return '📚';
    }
    
    function getGrade(percentage) {
        if (percentage >= 90) return 'Отлично';
        if (percentage >= 80) return 'Хорошо';
        if (percentage >= 70) return 'Неплохо';
        if (percentage >= 60) return 'Удовлетворительно';
        return 'Есть куда расти';
    }
    
    // Глобальные функции для кнопок
    window.shareFixV2 = {
        copyText: function(text) {
            const cleanText = text.replace(/\\n/g, '\n');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(cleanText)
                    .then(() => {
                        this.showToast('📋 Текст скопирован!');
                    })
                    .catch(() => {
                        this.fallbackCopy(cleanText);
                    });
            } else {
                this.fallbackCopy(cleanText);
            }
        },
        
        tryVK: function(text) {
            const cleanText = text.replace(/\\n/g, '\n');
            const bridge = this.getVKBridge();
            
            if (!bridge) {
                this.showToast('❌ VK недоступен, копируем текст');
                this.copyText(text);
                return;
            }
            
            bridge.send('VKWebAppShare', { message: cleanText })
                .then(() => {
                    this.showToast('✅ Успешно поделились в VK!');
                })
                .catch((error) => {
                    console.error('❌ Ошибка VK:', error);
                    this.showToast('⚠️ Ошибка VK, копируем текст');
                    this.copyText(text);
                });
        },
        
        downloadImage: function(percentage, correct, total) {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // Фон
            const gradient = ctx.createLinearGradient(0, 0, 600, 400);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 400);
            
            // Текст
            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🩺 Медицинский Квиз', 300, 60);
            
            ctx.font = 'bold 64px Arial';
            ctx.fillText(`${percentage}%`, 300, 150);
            
            ctx.font = '24px Arial';
            ctx.fillText(`Правильно: ${correct} из ${total}`, 300, 190);
            
            ctx.font = '18px Arial';
            ctx.fillText('Проверь свои знания!', 300, 280);
            
            ctx.font = '14px Arial';
            ctx.fillText(window.location.href, 300, 350);
            
            // Скачиваем
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `medical-quiz-${percentage}%.png`;
                link.click();
                URL.revokeObjectURL(url);
                
                this.showToast('🖼️ Картинка сохранена!');
            });
        },
        
        getVKBridge: function() {
            if (window.vkBridgeInstance) return window.vkBridgeInstance;
            if (window.vkBridge) return window.vkBridge;
            if (typeof vkBridge !== 'undefined') return vkBridge;
            return null;
        },
        
        fallbackCopy: function(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    this.showToast('📋 Текст скопирован!');
                } else {
                    alert(`Скопируйте текст:\n\n${text}`);
                }
            } catch (err) {
                alert(`Скопируйте текст:\n\n${text}`);
            }
            
            document.body.removeChild(textarea);
        },
        
        showToast: function(message) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10001;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
    };
    
    function addDebugFunctions() {
        window.debugShareV2 = {
            findResults: findResults,
            testModal: () => {
                showShareModalV2({
                    percentage: 85,
                    correct: 8,
                    total: 10,
                    method: 'test'
                });
            },
            inspectPage: () => {
                console.log('🔍 Инспектируем страницу...');
                console.log('📄 Весь текст страницы:', document.body.textContent);
                console.log('🎯 Элементы с ID percentage:', document.getElementById('percentage'));
                console.log('🎯 Элементы с ID correct-answers:', document.getElementById('correct-answers'));
                console.log('🎯 Элементы с ID total-questions-result:', document.getElementById('total-questions-result'));
                
                const allElements = document.querySelectorAll('*');
                const withNumbers = [];
                allElements.forEach(el => {
                    const text = el.textContent?.trim();
                    if (text && /\d/.test(text) && text.length < 100 && !el.querySelector('*')) {
                        withNumbers.push({
                            tag: el.tagName,
                            id: el.id,
                            class: el.className,
                            text: text
                        });
                    }
                });
                console.log('🔢 Элементы с числами:', withNumbers);
            }
        };
        
        console.log('🐛 Доступны функции отладки: window.debugShareV2');
    }
    
    console.log('✅ Исправление шеринга v2 загружено');
    
})();
