// enhanced-results.js
(function() {
    // Функция для улучшения отображения результатов
    function enhanceResults() {
        console.log("Инициализация улучшенного отображения результатов");
        
        // Патчим функцию showResults для корректного отображения результатов
        if (typeof window.showResults === 'function') {
            // Сохраняем оригинальную функцию
            const originalShowResults = window.showResults;
            
            // Переопределяем функцию
            window.showResults = function() {
                console.log("Вызвана функция отображения результатов");
                
                // Сохраняем текущие значения перед вызовом оригинальной функции
                const currentScore = window.score;
                const currentTotalQuestions = window.questionsForQuiz ? window.questionsForQuiz.length : 25;
                
                console.log("Текущий счет:", currentScore, "Всего вопросов:", currentTotalQuestions);
                
                // Вызываем оригинальную функцию
                originalShowResults.apply(this, arguments);
                
                // Находим элемент с результатами
                const scoreElement = document.getElementById('score');
                if (!scoreElement) {
                    console.error("Не найден элемент #score");
                    return;
                }
                
                // Рассчитываем процент правильных ответов
                let percentage = 0;
                if (currentTotalQuestions > 0) {
                    percentage = Math.round((currentScore / currentTotalQuestions) * 100);
                }
                
                // Проверяем на NaN и устанавливаем на 0, если NaN
                if (isNaN(percentage)) {
                    console.error("ВНИМАНИЕ: Процент вычислен как NaN!");
                    percentage = 0;
                }
                
                console.log("Рассчитанный процент:", percentage + "%");
                
                // Определяем текст с результатом
                let resultText;
                let resultClass;
                
                if (percentage >= 90) {
                    resultText = 'Отлично! Вы эксперт в анатомии!';
                    resultClass = 'result-excellent';
                } else if (percentage >= 70) {
                    resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
                    resultClass = 'result-good';
                } else if (percentage >= 50) {
                    resultText = 'Неплохо! Но есть над чем поработать.';
                    resultClass = 'result-average';
                } else {
                    resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
                    resultClass = 'result-needs-work';
                }
                
                // Обновляем HTML с улучшенным форматированием и анимацией
                scoreElement.innerHTML = `
                    <div class="result-summary">
                        <p>Вы ответили правильно на <strong>${currentScore}</strong> из <strong>${currentTotalQuestions}</strong> вопросов</p>
                        <div class="result-percentage ${resultClass}">
                            <span class="percentage-value">${percentage}</span><span class="percentage-symbol">%</span>
                        </div>
                        <p class="result-message">${resultText}</p>
                    </div>
                `;
                
                // Добавляем стили для улучшенного отображения результатов
                const style = document.createElement('style');
                style.textContent = `
                    .result-summary {
                        text-align: center;
                        padding: 20px;
                        animation: fadeInUp 0.5s ease-out;
                    }
                    
                    .result-percentage {
                        font-size: 72px;
                        font-weight: bold;
                        margin: 20px 0;
                        text-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        animation: scaleIn 0.7s ease-out;
                    }
                    
                    .percentage-value {
                        display: inline-block;
                    }
                    
                    .percentage-symbol {
                        font-size: 40px;
                        vertical-align: super;
                    }
                    
                    .result-message {
                        font-size: 20px;
                        font-weight: 500;
                        margin-top: 15px;
                        animation: fadeIn 1s ease-out;
                    }
                    
                    .result-excellent { color: #4CAF50; }
                    .result-good { color: #8BC34A; }
                    .result-average { color: #FFC107; }
                    .result-needs-work { color: #FF9800; }
                    
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.5); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
                
                console.log("Отображение результатов успешно улучшено");
            };
            
            console.log("Функция showResults успешно пропатчена");
        } else {
            console.error("Не удалось найти функцию showResults для улучшения");
        }
    }
    
    // Расширение возможностей кнопки "Поделиться результатами"
    function enhanceShareFunction() {
        // Находим кнопку "Поделиться результатами"
        const shareButton = document.getElementById('share-results');
        if (shareButton) {
            // Сохраняем оригинальный обработчик клика
            const originalClickHandler = shareButton.onclick;
            
            // Устанавливаем новый обработчик клика
            shareButton.onclick = function(event) {
                // Получаем актуальный счет и общее количество вопросов
                const score = window.score || 0;
                const totalQuestions = window.questionsForQuiz ? window.questionsForQuiz.length : 25;
                
                // Рассчитываем процент
                let percentage = 0;
                if (totalQuestions > 0) {
                    percentage = Math.round((score / totalQuestions) * 100);
                }
                
                // Проверяем на NaN
                if (isNaN(percentage)) {
                    percentage = 0;
                }
                
                // Формируем сообщение для шаринга
                let shareMessage = '';
                if (percentage >= 90) {
                    shareMessage = `Я эксперт в анатомии! Набрал ${percentage}% в анатомическом квизе!`;
                } else if (percentage >= 70) {
                    shareMessage = `Хорошо знаю анатомию! Мой результат ${percentage}% в анатомическом квизе!`;
                } else if (percentage >= 50) {
                    shareMessage = `Неплохой результат в анатомическом квизе - ${percentage}%. Сможешь лучше?`;
                } else {
                    shareMessage = `Я прошел анатомический квиз и набрал ${percentage}%. Попробуй и ты!`;
                }
                
                // Проверяем доступность VK Bridge
                if (window.vkBridgeInstance) {
                    console.log("Используем VK Bridge для шаринга");
                    
                    // Делимся через VK Bridge
                    window.vkBridgeInstance.send('VKWebAppShare', {
                        message: shareMessage
                    })
                    .then(data => {
                        console.log('Поделились результатом через VK:', data);
                    })
                    .catch(error => {
                        console.error('Ошибка при шеринге через VK:', error);
                        // Запасной вариант - показать сообщение в алерте
                        alert(shareMessage);
                    });
                } else {
                    // Запасной вариант без VK Bridge
                    console.log("VK Bridge не найден, используем запасной вариант");
                    alert(shareMessage);
                }
                
                // Предотвращаем вызов оригинального обработчика
                event.preventDefault();
            };
            
            console.log("Функция поделиться успешно улучшена");
        } else {
            console.error("Не найдена кнопка #share-results");
        }
    }
    
    // Запускаем улучшения после загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        enhanceResults();
        enhanceShareFunction();
    });
})();
