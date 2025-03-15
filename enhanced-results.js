// enhanced-results.js - Улучшенное отображение результатов для анатомического квиза
(function() {
    // Функция для показа улучшенных результатов
    function showEnhancedResults(score, totalQuestions, difficulty) {
        const resultsContainer = document.getElementById('results-container');
        const scoreElement = document.getElementById('score');
        
        if (!resultsContainer || !scoreElement) {
            console.error('Не найдены необходимые элементы для отображения результатов');
            return;
        }
        
        // Рассчитываем процент
        const percentage = Math.round((score / totalQuestions) * 100);
        
        // Определяем текст и классы в зависимости от результата
        let resultClass, resultEmoji, resultText;
        
        if (percentage >= 90) {
            resultClass = 'excellent';
            resultEmoji = '🏆';
            resultText = difficulty === 'hard' ? 
                'Великолепно! Вы настоящий эксперт в анатомии!' : 
                'Отлично! Вы эксперт в анатомии!';
        } else if (percentage >= 70) {
            resultClass = 'good';
            resultEmoji = '🎓';
            resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
        } else if (percentage >= 50) {
            resultClass = 'average';
            resultEmoji = '📚';
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultClass = 'needs-improvement';
            resultEmoji = '🔍';
            resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
        }
        
        // Формируем HTML для отображения результатов
        const difficultyText = difficulty === 'hard' ? 
            '<div class="difficulty-badge hard">Сложный уровень</div>' : 
            '<div class="difficulty-badge">Обычный уровень</div>';
        
        scoreElement.innerHTML = `
            ${difficultyText}
            <div class="result-emoji">${resultEmoji}</div>
            <div class="result-percentage ${resultClass}">${percentage}%</div>
            <p class="correct-answers">Вы ответили правильно на ${score} из ${totalQuestions} вопросов</p>
            <p class="result-message">${resultText}</p>
        `;
        
        // Добавляем дополнительные эффекты
        addResultsEffects(resultsContainer, scoreElement, percentage);
        
        // Воспроизводим звук завершения
        if (window.playCompleteSound) {
            window.playCompleteSound();
        }
        
        // Отправляем статистику (если приложение работает в ВК)
        sendStatistics(percentage, difficulty);
        
        console.log(`Квиз завершен. Результат: ${percentage}%, сложность: ${difficulty}`);
    }
    
    // Функция для добавления визуальных эффектов к результатам
    function addResultsEffects(container, scoreElement, percentage) {
        // Показываем танцующий скелет при хорошем результате
        if (percentage >= 70) {
            const dancingSkeleton = document.getElementById('dancing-skeleton');
            if (dancingSkeleton) {
                dancingSkeleton.innerHTML = '<div class="skeleton-emoji">💀</div>';
                dancingSkeleton.style.display = 'block';
            }
        }
        
        // Анимируем появление результатов
        if (window.QuizAnimations && window.QuizAnimations.animateElement) {
            const resultElements = scoreElement.querySelectorAll('div, p');
            resultElements.forEach((element, index) => {
                setTimeout(() => {
                    window.QuizAnimations.animateElement(element, 'fadeIn');
                }, index * 300); // Показываем элементы с небольшой задержкой
            });
        }
        
        // Добавляем стили для результатов
        addResultsStyles();
    }
    
    // Добавляем стили для улучшенного отображения результатов
    function addResultsStyles() {
        if (document.getElementById('enhanced-results-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'enhanced-results-styles';
        style.textContent = `
            .result-emoji {
                font-size: 64px;
                margin: 15px 0;
                animation: bounce 2s infinite;
            }
            
            .result-percentage {
                font-size: 48px;
                font-weight: 700;
                margin: 15px 0;
                color: var(--btn-primary-bg);
            }
            
            .result-percentage.excellent {
                color: #4CAF50;
            }
            
            .result-percentage.good {
                color: #8BC34A;
            }
            
            .result-percentage.average {
                color: #FFC107;
            }
            
            .result-percentage.needs-improvement {
                color: #FF9800;
            }
            
            .correct-answers {
                font-size: 18px;
                margin: 15px 0;
                color: var(--secondary-text);
            }
            
            .result-message {
                font-size: 20px;
                font-weight: 600;
                margin: 15px 0;
                color: var(--text-color);
            }
            
            .skeleton-emoji {
                font-size: 50px;
                animation: dance 2s infinite;
            }
            
            @keyframes bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-15px);
                }
            }
            
            @keyframes dance {
                0%, 100% {
                    transform: rotate(0deg);
                }
                25% {
                    transform: rotate(20deg) translateY(-10px);
                }
                50% {
                    transform: rotate(0deg);
                }
                75% {
                    transform: rotate(-20deg) translateY(-10px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Вспомогательная функция для отправки статистики
    function sendStatistics(result, difficulty) {
        let bridge = null;
        if (window.vkBridgeInstance) {
            bridge = window.vkBridgeInstance;
        } else if (window.vkBridge) {
            bridge = window.vkBridge;
        } else if (typeof vkBridge !== 'undefined') {
            bridge = vkBridge;
        }
        
        if (bridge) {
            try {
                bridge.send('VKWebAppStorageSet', {
                    key: `last_quiz_result_${difficulty}`,
                    value: String(result)
                })
                .then(() => {
                    console.log('Результат сохранен в хранилище VK');
                })
                .catch(error => {
                    console.warn('Не удалось сохранить результат в хранилище VK:', error);
                });
            } catch (e) {
                console.warn('Ошибка при отправке статистики:', e);
            }
        }
    }
    
    // Экспортируем функции для использования в основном приложении
    window.EnhancedResults = {
        showResults: showEnhancedResults
    };
})();
