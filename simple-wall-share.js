// simple-wall-share.js - Простое решение для шеринга на стену ВК
(function() {
    'use strict';
    
    console.log('📝 Загружается простой шеринг на стену ВК...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initWallShare, 2000);
    });
    
    function initWallShare() {
        console.log('🎯 Инициализируем шеринг на стену ВК');
        
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('❌ Кнопка поделиться не найдена');
            return;
        }
        
        // Полностью заменяем функционал кнопки
        shareButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📤 Клик по кнопке - делимся на стену ВК');
            shareToWall();
        };
        
        console.log('✅ Кнопка настроена для шеринга на стену');
    }
    
    function shareToWall() {
        console.log('🎯 Начинаем процесс шеринга на стену...');
        
        // Получаем результаты
        const results = getResults();
        if (!results) {
            console.error('❌ Не удалось получить результаты');
            alert('Не удалось получить результаты теста');
            return;
        }
        
        console.log('📊 Результаты для шеринга:', results);
        
        // Создаем сообщение для стены
        const message = createWallMessage(results);
        console.log('📝 Сообщение для стены:', message);
        
        // Пробуем поделиться на стену через VK
        shareViaVKWall(message);
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
            
            // Ищем паттерны типа "85%" и "8 из 10"
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
            
            // Способ 3: Запрос у пользователя
            const userPercent = prompt('Не удалось автоматически определить результат.\nВведите ваш процент правильных ответов (например: 85):');
            
            if (userPercent && !isNaN(userPercent)) {
                const percent = Math.max(0, Math.min(100, parseInt(userPercent)));
                const total = 10;
                const correct = Math.round((percent / 100) * total);
                
                return {
                    percentage: percent,
                    correct: correct,
                    total: total,
                    method: 'user'
                };
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Ошибка получения результатов:', error);
            return null;
        }
    }
    
    function createWallMessage(results) {
        const emoji = getEmoji(results.percentage);
        const grade = getGrade(results.percentage);
        
        let message = `${emoji} ${grade}! Прошел медицинский квиз и набрал ${results.percentage}%!\n\n`;
        message += `✅ Правильных ответов: ${results.correct} из ${results.total}\n\n`;
        
        // Добавляем мотивационный текст
        if (results.percentage >= 90) {
            message += `🏆 Отличный результат! Настоящий профессионал!\n\n`;
        } else if (results.percentage >= 70) {
            message += `👏 Хороший уровень знаний!\n\n`;
        } else if (results.percentage >= 50) {
            message += `📚 Есть база, но можно еще подучиться!\n\n`;
        } else {
            message += `💪 Начало положено, продолжаем изучать медицину!\n\n`;
        }
        
        message += `🩺 А ты сможешь лучше? Проверь свои медицинские знания!\n\n`;
        message += `#медицинскийквиз #медицина #тест\n\n`;
        message += window.location.href;
        
        return message;
    }
    
    function shareViaVKWall(message) {
        console.log('📝 Пробуем поделиться на стену ВК...');
        
        const bridge = getVKBridge();
        if (!bridge) {
            console.warn('⚠️ VK Bridge недоступен');
            fallbackShare(message);
            return;
        }
        
        // Используем VKWebAppShowWallPostBox для шеринга на стену
        bridge.send('VKWebAppShowWallPostBox', {
            message: message
        })
        .then((data) => {
            console.log('✅ Успешно поделились на стену:', data);
            showSuccessMessage('🎉 Успешно опубликовано на стене!');
            
            // Даем награду за шеринг
            giveShareReward();
        })
        .catch((error) => {
            console.error('❌ Ошибка при шеринге на стену:', error);
            
            // Пробуем альтернативный способ через Share
            console.log('🔄 Пробуем альтернативный способ...');
            
            bridge.send('VKWebAppShare', { 
                message: message 
            })
            .then((data) => {
                console.log('✅ Поделились через Share:', data);
                showSuccessMessage('📤 Результат отправлен!');
                giveShareReward();
            })
            .catch((error2) => {
                console.error('❌ Ошибка альтернативного способа:', error2);
                console.log('📋 Переключаемся на копирование...');
                fallbackShare(message);
            });
        });
    }
    
    function fallbackShare(message) {
        console.log('📋 Используем fallback - копирование в буфер обмена');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(message)
                .then(() => {
                    showSuccessMessage('📋 Текст скопирован в буфер обмена!\nТеперь можете вставить его в пост ВК');
                })
                .catch(() => {
                    manualCopy(message);
                });
        } else {
            manualCopy(message);
        }
    }
    
    function manualCopy(message) {
        const textarea = document.createElement('textarea');
        textarea.value = message;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showSuccessMessage('📋 Текст скопирован!\nМожете вставить его в пост ВК');
            } else {
                showTextDialog(message);
            }
        } catch (err) {
            showTextDialog(message);
        }
        
        document.body.removeChild(textarea);
    }
    
    function showTextDialog(message) {
        alert(`Скопируйте этот текст и вставьте в пост ВК:\n\n${message}`);
    }
    
    function getVKBridge() {
        if (window.vkBridgeInstance) return window.vkBridgeInstance;
        if (window.vkBridge) return window.vkBridge;
        if (typeof vkBridge !== 'undefined') return vkBridge;
        return null;
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
    
    function showSuccessMessage(text) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
            max-width: 80%;
            line-height: 1.4;
        `;
        toast.textContent = text;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
    
    function giveShareReward() {
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (!stats.achievements.includes('social')) {
                stats.achievements.push('social');
                setTimeout(() => {
                    if (window.Gamification.showAchievement) {
                        window.Gamification.showAchievement('Социальный: поделился результатом на стене! 📱');
                    }
                }, 1000);
                if (window.Gamification.saveStats) {
                    window.Gamification.saveStats();
                }
            }
        }
    }
    
    // Отладочные функции
    window.debugWallShare = {
        testShare: () => {
            console.log('🧪 Тестируем шеринг на стену...');
            shareToWall();
        },
        
        getResults: () => {
            const results = getResults();
            console.log('📊 Найденные результаты:', results);
            return results;
        },
        
        checkVK: () => {
            const bridge = getVKBridge();
            console.log('🔍 VK Bridge:', bridge ? 'Доступен' : 'Недоступен');
            if (bridge) {
                console.log('📱 Тип VK Bridge:', typeof bridge);
                console.log('🔧 Методы VK Bridge:', Object.getOwnPropertyNames(bridge));
            }
            return !!bridge;
        }
    };
    
    console.log('✅ Простой шеринг на стену ВК загружен');
    console.log('🐛 Доступны функции отладки: window.debugWallShare');
    
})();
