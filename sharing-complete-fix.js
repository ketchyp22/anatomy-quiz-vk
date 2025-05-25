// sharing-complete-fix.js - Полное исправление всех проблем с шерингом
(function() {
    'use strict';
    
    console.log('🚑 Загружается полное исправление шеринга...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initCompleteShareFix, 2000);
    });
    
    function initCompleteShareFix() {
        console.log('🔧 Инициализируем полное исправление шеринга');
        
        // 1. Исправляем получение результатов квиза
        fixResultsRetrieval();
        
        // 2. Исправляем кнопку поделиться
        fixShareButton();
        
        // 3. Добавляем отладочную информацию
        addDebugInfo();
    }
    
    // ===== 1. ИСПРАВЛЕНИЕ ПОЛУЧЕНИЯ РЕЗУЛЬТАТОВ =====
    function fixResultsRetrieval() {
        // Отслеживаем появление экрана результатов
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.id === 'results-container' && target.style.display !== 'none') {
                        console.log('🎯 Обнаружен экран результатов, ждем данные...');
                        setTimeout(captureResults, 1000); // Даем время на отрисовку
                    }
                }
            });
        });
        
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            observer.observe(resultsContainer, { attributes: true, attributeFilter: ['style'] });
        }
    }
    
    function captureResults() {
        const results = getResultsFromDOM();
        if (results && results.isValid) {
            console.log('✅ Результаты успешно получены:', results);
            window.currentQuizResults = results; // Сохраняем глобально
            
            // Уведомляем геймификацию с корректными данными
            if (window.Gamification) {
                window.Gamification.onQuizComplete({
                    percentage: results.percentage,
                    correct: results.correct,
                    total: results.total
                });
            }
        } else {
            console.warn('⚠️ Не удалось получить валидные результаты');
        }
    }
    
    function getResultsFromDOM() {
        try {
            const percentageEl = document.getElementById('percentage');
            const correctEl = document.getElementById('correct-answers');
            const totalEl = document.getElementById('total-questions-result');
            
            if (!percentageEl || !correctEl || !totalEl) {
                console.warn('⚠️ Элементы результатов не найдены');
                return null;
            }
            
            const percentage = parseInt(percentageEl.textContent) || 0;
            const correct = parseInt(correctEl.textContent) || 0;
            const total = parseInt(totalEl.textContent) || 0;
            
            console.log('📊 Данные из DOM:', { percentage, correct, total });
            
            // Проверяем валидность
            const isValid = total > 0 && percentage >= 0 && percentage <= 100 && correct >= 0 && correct <= total;
            
            if (!isValid) {
                console.warn('⚠️ Невалидные данные:', { percentage, correct, total });
                
                // Пытаемся восстановить корректные данные
                const correctedPercentage = Math.round((correct / total) * 100);
                console.log('🔧 Исправляем процент на:', correctedPercentage);
                
                return {
                    percentage: correctedPercentage,
                    correct: correct,
                    total: total,
                    isValid: true,
                    wasCorrected: true
                };
            }
            
            return {
                percentage: percentage,
                correct: correct,
                total: total,
                isValid: true,
                wasCorrected: false
            };
            
        } catch (error) {
            console.error('❌ Ошибка при получении результатов:', error);
            return null;
        }
    }
    
    // ===== 2. ИСПРАВЛЕНИЕ КНОПКИ ПОДЕЛИТЬСЯ =====
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
            
            console.log('📤 Клик по исправленной кнопке поделиться');
            handleShare();
        };
        
        console.log('✅ Кнопка поделиться исправлена');
    }
    
    function handleShare() {
        const results = window.currentQuizResults || getResultsFromDOM();
        
        if (!results || !results.isValid) {
            console.error('❌ Нет валидных результатов для шеринга');
            alert('Ошибка: не удалось получить результаты теста');
            return;
        }
        
        console.log('📤 Начинаем шеринг с результатами:', results);
        
        // Показываем модальное окно с вариантами
        showShareModal(results);
    }
    
    function showShareModal(results) {
        // Удаляем предыдущее модальное окно
        const existingModal = document.querySelector('.share-modal-fixed');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = createShareModal(results);
        document.body.appendChild(modal);
        
        // Показываем модальное окно
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
    
    function createShareModal(results) {
        const modal = document.createElement('div');
        modal.className = 'share-modal-fixed';
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
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        const message = createShareMessage(results);
        
        modalContent.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #333;">🎯 Поделиться результатами</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <div style="font-size: 36px; margin-bottom: 10px;">${getResultEmoji(results.percentage)}</div>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">${results.percentage}%</div>
                <div style="color: #666;">Правильно: ${results.correct} из ${results.total}</div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 25px;">
                <button class="share-option" data-action="copy" style="background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    📋 Скопировать текст
                </button>
                
                <button class="share-option" data-action="vk" style="background: #4680C2; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    💬 Попробовать VK
                </button>
                
                <button class="share-option" data-action="download" style="background: #FF9800; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    🖼️ Скачать картинку
                </button>
                
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; margin-top: 10px;">
                    ❌ Закрыть
                </button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        
        // Обработчики кнопок
        modal.addEventListener('click', function(e) {
            if (e.target.classList.contains('share-option')) {
                const action = e.target.dataset.action;
                handleShareAction(action, results, message);
                modal.remove();
            } else if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Показываем модальное окно с анимацией
        modal.classList.add('show');
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
        
        return modal;
    }
    
    function handleShareAction(action, results, message) {
        console.log(`🎯 Выполняем действие: ${action}`);
        
        switch (action) {
            case 'copy':
                copyToClipboard(message);
                break;
            case 'vk':
                tryVKShare(message);
                break;
            case 'download':
                downloadResultImage(results);
                break;
        }
        
        // Награда за шеринг
        giveShareReward();
    }
    
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('📋 Текст скопирован!');
                })
                .catch(() => {
                    fallbackCopy(text);
                });
        } else {
            fallbackCopy(text);
        }
    }
    
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('📋 Текст скопирован!');
            } else {
                alert(`Скопируйте текст:\n\n${text}`);
            }
        } catch (err) {
            alert(`Скопируйте текст:\n\n${text}`);
        }
        
        document.body.removeChild(textarea);
    }
    
    function tryVKShare(message) {
        const bridge = getVKBridge();
        if (!bridge) {
            showToast('❌ VK Bridge недоступен');
            copyToClipboard(message); // Fallback
            return;
        }
        
        console.log('🔄 Пробуем поделиться через VK...');
        
        bridge.send('VKWebAppShare', { message: message })
            .then((data) => {
                console.log('✅ VK Share успешно:', data);
                showToast('✅ Успешно поделились!');
            })
            .catch((error) => {
                console.error('❌ Ошибка VK Share:', error);
                showToast('⚠️ VK недоступен, текст скопирован');
                copyToClipboard(message); // Fallback
            });
    }
    
    function downloadResultImage(results) {
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
        ctx.fillText(`${results.percentage}%`, 300, 150);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Правильно: ${results.correct} из ${results.total}`, 300, 190);
        
        ctx.font = '18px Arial';
        ctx.fillText('Проверь свои знания!', 300, 280);
        
        // Скачиваем
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `medical-quiz-${results.percentage}%.png`;
            link.click();
            URL.revokeObjectURL(url);
            
            showToast('🖼️ Картинка сохранена!');
        });
    }
    
    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    function createShareMessage(results) {
        const emoji = getResultEmoji(results.percentage);
        const grade = getResultGrade(results.percentage);
        
        let message = `${emoji} ${grade}! Прошел медицинский квиз и набрал ${results.percentage}%!\n\n`;
        message += `✅ Правильных ответов: ${results.correct} из ${results.total}\n`;
        message += `\n🩺 А ты сможешь лучше? Проверь свои знания!\n`;
        message += window.location.href;
        
        return message;
    }
    
    function getResultEmoji(percentage) {
        if (percentage >= 90) return '🏆';
        if (percentage >= 80) return '🌟';
        if (percentage >= 70) return '👏';
        if (percentage >= 60) return '👍';
        return '📚';
    }
    
    function getResultGrade(percentage) {
        if (percentage >= 90) return 'Отлично';
        if (percentage >= 80) return 'Хорошо';
        if (percentage >= 70) return 'Неплохо';
        if (percentage >= 60) return 'Удовлетворительно';
        return 'Нужно подучиться';
    }
    
    function getVKBridge() {
        if (window.vkBridgeInstance) return window.vkBridgeInstance;
        if (window.vkBridge) return window.vkBridge;
        if (typeof vkBridge !== 'undefined') return vkBridge;
        return null;
    }
    
    function showToast(message) {
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
    
    function giveShareReward() {
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
    
    // ===== 3. ОТЛАДОЧНАЯ ИНФОРМАЦИЯ =====
    function addDebugInfo() {
        console.log('🐛 Режим отладки активен');
        
        // Добавляем глобальные функции для отладки
        window.debugShareFix = {
            getResults: () => {
                const results = getResultsFromDOM();
                console.log('📊 Текущие результаты:', results);
                return results;
            },
            testShare: () => {
                console.log('🧪 Тестируем шеринг...');
                const results = getResultsFromDOM() || {
                    percentage: 85,
                    correct: 8,
                    total: 10,
                    isValid: true
                };
                showShareModal(results);
            },
            checkVK: () => {
                const bridge = getVKBridge();
                console.log('🔍 VK Bridge:', bridge ? 'Доступен' : 'Недоступен');
                return !!bridge;
            }
        };
        
        console.log('🐛 Доступны функции отладки: window.debugShareFix');
    }
    
    console.log('✅ Полное исправление шеринга загружено');
    
})();
