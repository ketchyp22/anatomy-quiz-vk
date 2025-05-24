// integration-patch.js - Исправленный патч для интеграции геймификации
(function() {
    'use strict';
    
    let isQuizActive = false;
    let currentQuizResults = null;
    
    // Ждем полной загрузки приложения
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeIntegration, 2000);
    });
    
    function initializeIntegration() {
        console.log('🔗 Запуск интеграции геймификации');
        
        // Проверяем доступность геймификации
        if (!window.Gamification) {
            console.warn('Геймификация не найдена');
            return;
        }
        
        // Настраиваем отслеживание
        setupQuizTracking();
        setupAnswerTracking();
        setupShareButton();
        
        console.log('✅ Интеграция настроена');
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
        
        // Наблюдаем за основными экранами
        const screens = ['start-screen', 'quiz-container', 'results-container'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                observer.observe(screen, { attributes: true, attributeFilter: ['style'] });
            }
        });
    }
    
    // Обработка смены экранов
    function handleScreenChange(target) {
        const isVisible = target.style.display !== 'none';
        
        if (target.id === 'quiz-container' && isVisible && !isQuizActive) {
            startQuiz();
        } else if (target.id === 'results-container' && isVisible && isQuizActive) {
            setTimeout(finishQuiz, 500); // Даем время DOM обновиться
        } else if (target.id === 'start-screen' && isVisible) {
            resetQuiz();
        }
    }
    
    // Начало квиза
    function startQuiz() {
        isQuizActive = true;
        console.log('🎮 Квиз начат');
    }
    
    // Завершение квиза
    function finishQuiz() {
        if (!isQuizActive) return;
        
        isQuizActive = false;
        currentQuizResults = getQuizResults();
        
        if (currentQuizResults) {
            console.log('🏁 Квиз завершен:', currentQuizResults);
            
            // Уведомляем геймификацию
            window.Gamification.onQuizComplete(currentQuizResults);
            
            // Добавляем мотивационное сообщение
            addMotivationalMessage();
        }
    }
    
    // Сброс квиза
    function resetQuiz() {
        isQuizActive = false;
        currentQuizResults = null;
        
        // Обновляем статистику
        setTimeout(() => {
            window.Gamification.updateStatsDisplay();
        }, 100);
    }
    
    // Получение результатов квиза
    function getQuizResults() {
        const percentageEl = document.getElementById('percentage');
        const correctEl = document.getElementById('correct-answers');
        const totalEl = document.getElementById('total-questions-result');
        
        if (!percentageEl || !correctEl || !totalEl) {
            console.warn('Элементы результатов не найдены');
            return null;
        }
        
        return {
            percentage: parseInt(percentageEl.textContent) || 0,
            correct: parseInt(correctEl.textContent) || 0,
            total: parseInt(totalEl.textContent) || 0
        };
    }
    
    // Отслеживание ответов
    function setupAnswerTracking() {
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('option') || !isQuizActive) return;
            
            // Ждем обработки основным кодом
            setTimeout(() => {
                if (e.target.classList.contains('correct')) {
                    window.Gamification.onCorrectAnswer();
                } else if (e.target.classList.contains('wrong')) {
                    window.Gamification.onWrongAnswer();
                }
            }, 400);
        });
    }
    
    // Добавление мотивационного сообщения
    function addMotivationalMessage() {
        const container = document.getElementById('results-container');
        if (!container || !currentQuizResults) return;
        
        // Проверяем, не добавлено ли уже
        if (container.querySelector('.motivational-message')) return;
        
        const motivation = window.Gamification.addMotivationalMessage(currentQuizResults.percentage);
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
        }
    }
    
    // Настройка кнопки "Поделиться"
    function setupShareButton() {
        const shareButton = document.getElementById('share-results');
        if (!shareButton) {
            console.warn('Кнопка "Поделиться" не найдена');
            return;
        }
        
        // Заменяем обработчик полностью
        shareButton.onclick = function(e) {
            e.preventDefault();
            shareResults();
        };
        
        console.log('📤 Кнопка "Поделиться" настроена');
    }
    
    // Функция шеринга результатов
    function shareResults() {
        console.log('📤 Начинаем процесс шеринга');
        
        // Получаем результаты
        const results = currentQuizResults || getQuizResults();
        if (!results) {
            alert('Ошибка получения результатов');
            return;
        }
        
        // Создаем сообщение
        const message = createShareMessage(results);
        console.log('📝 Сообщение для шеринга готово');
        
        // Пытаемся поделиться через VK
        shareToVK(message);
    }
    
    // Создание сообщения для шеринга
    function createShareMessage(results) {
        // Получаем выбранный режим и сложность
        const modeBtn = document.querySelector('.quiz-mode-btn.active');
        const diffBtn = document.querySelector('.difficulty-btn.active');
        
        const modeName = modeBtn ? modeBtn.textContent.trim() : 'Медицинский квиз';
        const difficulty = diffBtn ? diffBtn.textContent.trim().toLowerCase() : 'обычный';
        
        // Эмодзи по результату
        let emoji = '📊';
        if (results.percentage >= 95) emoji = '🏆';
        else if (results.percentage >= 85) emoji = '🌟';
        else if (results.percentage >= 75) emoji = '👍';
        else if (results.percentage >= 60) emoji = '📚';
        else emoji = '🎯';
        
        // Основное сообщение
        let msg = `${emoji} Прошел тест "${modeName}"`;
        
        if (difficulty !== 'обычный') {
            msg += ` (${difficulty} уровень)`;
        }
        
        msg += ` и набрал ${results.percentage}%!\n`;
        msg += `Правильно ответил на ${results.correct} из ${results.total} вопросов.\n`;
        
        // Добавляем статистику геймификации
        if (window.Gamification && window.Gamification.stats) {
            const stats = window.Gamification.stats;
            
            if (stats.currentStreak > 2) {
                msg += `🔥 Серия правильных ответов: ${stats.currentStreak}\n`;
            }
            
            if (stats.totalQuizzes > 1) {
                msg += `📈 Всего пройдено тестов: ${stats.totalQuizzes}\n`;
            }
        }
        
        msg += '\n🩺 Проверь свои медицинские знания тоже!';
        
        return msg;
    }
    
    // Шеринг в VK
    function shareToVK(message) {
        // Поиск VK Bridge
        let bridge = null;
        
        if (window.vkBridgeInstance) {
            bridge = window.vkBridgeInstance;
        } else if (window.vkBridge) {
            bridge = window.vkBridge;
        } else if (typeof vkBridge !== 'undefined') {
            bridge = vkBridge;
        }
        
        if (!bridge) {
            console.warn('VK Bridge недоступен');
            fallbackShare(message);
            return;
        }
        
        console.log('🌐 Используем VK Bridge для шеринга');
        
        // Отправляем через VK Bridge
        bridge.send('VKWebAppShare', { message: message })
            .then(data => {
                console.log('✅ Результат успешно опубликован:', data);
                
                // Награда за шеринг
                if (window.Gamification && !window.Gamification.stats.achievements.includes('social')) {
                    window.Gamification.stats.achievements.push('social');
                    window.Gamification.showAchievement('Социальный: поделился результатом! 📱');
                    window.Gamification.saveStats();
                }
            })
            .catch(error => {
                console.error('❌ Ошибка при публикации:', error);
                fallbackShare(message);
            });
    }
    
    // Запасной вариант шеринга
    function fallbackShare(message) {
        console.log('📋 Используем запасной способ шеринга');
        
        // Пробуем скопировать в буфер обмена
        if (navigator.clipboard) {
            navigator.clipboard.writeText(message)
                .then(() => {
                    alert('Текст скопирован в буфер обмена! Вставьте его в пост ВКонтакте.');
                })
                .catch(() => {
                    // Если не получилось скопировать, показываем в alert
                    alert(message);
                });
        } else {
            // Старые браузеры - показываем в alert
            alert(message);
        }
    }
    
    // Функция для тестирования
    window.testGamification = function() {
        console.log('🧪 Тестирование геймификации');
        
        if (!window.Gamification) {
            console.error('Геймификация не найдена');
            return;
        }
        
        // Имитируем правильные ответы
        console.log('✅ Имитируем правильные ответы...');
        window.Gamification.onCorrectAnswer();
        
        setTimeout(() => {
            window.Gamification.onCorrectAnswer();
        }, 500);
        
        setTimeout(() => {
            window.Gamification.onCorrectAnswer();
        }, 1000);
        
        // Имитируем завершение квиза
        setTimeout(() => {
            console.log('🏁 Имитируем завершение квиза...');
            window.Gamification.onQuizComplete({
                percentage: 85,
                correct: 8,
                total: 10
            });
        }, 1500);
        
        // Показываем конфетти
        setTimeout(() => {
            console.log('🎊 Показываем конфетти...');
            window.Gamification.showConfetti();
        }, 2000);
    };
    
    // Функция для сброса статистики (для тестирования)
    window.resetGameStats = function() {
        if (window.Gamification) {
            window.Gamification.resetStats();
        }
    };
    
})();
