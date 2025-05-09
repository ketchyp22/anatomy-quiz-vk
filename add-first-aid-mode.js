// add-first-aid-mode.js
(function() {
    // Константы для режима "Первая помощь"
    const MODE_ID = 'first_aid';
    const MODE_TITLE = 'Первая помощь';
    const MODE_ICON = '🚑'; // Опциональная иконка
    
    // Ждем полной загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Небольшая задержка для уверенности, что основной код инициализирован
        setTimeout(initFirstAidMode, 700);
    });
    
    // Главная функция инициализации режима
    function initFirstAidMode() {
        console.log('Инициализация режима "Первая помощь"...');
        
        // 1. Добавляем кнопку режима в интерфейс
        addModeButton();
        
        // 2. Расширяем функционал отображения результатов
        extendResultsDisplay();
        
        // 3. Расширяем функционал шеринга результатов
        extendShareFunction();
        
        // 4. Добавляем CSS стили для нового режима
        addCustomStyles();
    }
    
    // Функция добавления кнопки режима в интерфейс
    function addModeButton() {
        // Находим контейнер для кнопок выбора режима
        const modeContainer = document.querySelector('.quiz-mode-selection');
        
        // Проверки безопасности
        if (!modeContainer) {
            console.error('Ошибка: Контейнер для кнопок режимов не найден!');
            return;
        }
        
        // Проверяем, не добавлена ли уже кнопка режима
        if (document.querySelector(`.quiz-mode-btn[data-mode="${MODE_ID}"]`)) {
            console.log('Кнопка режима "Первая помощь" уже существует');
            return;
        }
        
        // Создаем новую кнопку
        const button = document.createElement('button');
        button.className = 'quiz-mode-btn';
        button.setAttribute('data-mode', MODE_ID);
        
        // Добавляем иконку (если она указана)
        if (MODE_ICON) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'mode-icon';
            iconSpan.textContent = MODE_ICON;
            iconSpan.style.marginRight = '8px';
            button.appendChild(iconSpan);
        }
        
        // Добавляем текст кнопки
        const textSpan = document.createElement('span');
        textSpan.textContent = MODE_TITLE;
        button.appendChild(textSpan);
        
        // Добавляем кнопку в контейнер
        modeContainer.appendChild(button);
        
        // Добавляем обработчик события клика
        button.addEventListener('click', function() {
            // Удаляем класс active у всех кнопок
            document.querySelectorAll('.quiz-mode-btn').forEach(btn => 
                btn.classList.remove('active'));
            
            // Добавляем класс active выбранной кнопке
            this.classList.add('active');
            
            // Устанавливаем текущий режим
            if (typeof window.currentQuizMode !== 'undefined') {
                window.currentQuizMode = MODE_ID;
                console.log(`Выбран режим квиза: ${MODE_ID}`);
            } else {
                console.error('Ошибка: Переменная currentQuizMode не найдена в глобальном контексте');
            }
        });
        
        console.log('Кнопка режима "Первая помощь" успешно добавлена');
    }
    
    // Функция расширения отображения результатов
    function extendResultsDisplay() {
        // Проверяем, существует ли функция showResults в глобальном контексте
        if (typeof window.showResults !== 'function') {
            console.warn('Функция showResults не найдена в глобальном контексте. Расширение отображения результатов невозможно.');
            return;
        }
        
        // Сохраняем оригинальную функцию
        const originalShowResults = window.showResults;
        
        // Заменяем оригинальную функцию нашей расширенной версией
        window.showResults = function() {
            // Сначала вызываем оригинальную функцию
            originalShowResults.apply(this, arguments);
            
            // Затем добавляем свою логику для режима "Первая помощь"
            if (window.currentQuizMode === MODE_ID) {
                // Обновляем отображение названия режима
                const modeBadge = document.getElementById('mode-badge');
                if (modeBadge) {
                    modeBadge.textContent = MODE_TITLE;
                    modeBadge.classList.add('first-aid-badge');
                }
                
                // Добавляем дополнительные стили для оформления результатов
                const scoreElement = document.querySelector('.score');
                if (scoreElement) {
                    scoreElement.classList.add('first-aid-results');
                }
                
                // Добавляем дополнительный текст или подсказки для режима первой помощи
                const scoreText = document.querySelector('.score-text');
                if (scoreText) {
                    const percentage = parseInt(document.getElementById('percentage')?.textContent || '0');
                    
                    // Добавляем специфичный для первой помощи текст, в зависимости от результата
                    let additionalText = '';
                    if (percentage >= 90) {
                        additionalText = '<p class="first-aid-tip">Прекрасно! Вы отлично подготовлены к оказанию первой помощи.</p>';
                    } else if (percentage >= 70) {
                        additionalText = '<p class="first-aid-tip">Хороший результат! Вы знаете основы первой помощи.</p>';
                    } else if (percentage >= 50) {
                        additionalText = '<p class="first-aid-tip">Неплохо! Но стоит углубить знания о первой помощи - это может спасти чью-то жизнь.</p>';
                    } else {
                        additionalText = '<p class="first-aid-tip">Рекомендуем изучить основы первой помощи - эти знания необходимы каждому.</p>';
                    }
                    
                    // Добавляем текст после существующего содержимого
                    scoreText.innerHTML += additionalText;
                }
            }
        };
        
        console.log('Функция отображения результатов успешно расширена');
    }
    
    // Функция расширения функционала шеринга
    function extendShareFunction() {
        // Дожидаемся подготовки кнопки шеринга
        setTimeout(() => {
            const shareButton = document.getElementById('share-results');
            if (!shareButton) {
                console.warn('Кнопка шеринга не найдена. Расширение функционала шеринга невозможно.');
                return;
            }
            
            // Клонируем кнопку, чтобы удалить все обработчики событий
            const newShareButton = shareButton.cloneNode(true);
            shareButton.parentNode.replaceChild(newShareButton, shareButton);
            
            // Добавляем новый обработчик клика
            newShareButton.addEventListener('click', function(event) {
                // Получаем необходимые данные
                const score = window.score || 0;
                const totalQuestions = window.questionsForQuiz ? window.questionsForQuiz.length : 10;
                const percentage = Math.round((score / totalQuestions) * 100);
                
                // Определяем название режима для сообщения
                let modeTitle = '';
                if (window.currentQuizMode === 'anatomy') {
                    modeTitle = 'Анатомия';
                } else if (window.currentQuizMode === 'clinical') {
                    modeTitle = 'Клиническое мышление';
                } else if (window.currentQuizMode === 'pharmacology') {
                    modeTitle = 'Фармакология';
                } else if (window.currentQuizMode === MODE_ID) {
                    modeTitle = MODE_TITLE;
                } else {
                    modeTitle = 'Медицинский квиз';
                }
                
                const difficultyText = window.currentDifficulty === 'hard' ? 
                    'сложный уровень' : 'обычный уровень';
                
                // Формируем сообщение
                const message = `Я прошел Медицинский квиз (${modeTitle}, ${difficultyText}) и набрал ${percentage}%! Попробуй и ты!`;
                
                // Используем VK Bridge для шеринга, если он доступен
                let bridge = window.vkBridgeInstance || window.vkBridge;
                if (bridge) {
                    bridge.send('VKWebAppShare', { message })
                        .then(data => {
                            console.log('Результат успешно опубликован:', data);
                        })
                        .catch(error => {
                            console.error('Ошибка при шеринге:', error);
                            alert(message);
                        });
                } else {
                    alert(message);
                    console.warn('VK Bridge не найден. Используется альтернативный вариант шеринга.');
                }
            });
            
            console.log('Функционал шеринга успешно расширен');
            
        }, 1000);
    }
    
    // Функция добавления стилей для нового режима
    function addCustomStyles() {
        // Создаем элемент style
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        
        // Определяем стили
        const css = `
            /* Стили для кнопки режима "Первая помощь" */
            .quiz-mode-btn[data-mode="${MODE_ID}"] {
                background-image: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
                color: white;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .quiz-mode-btn[data-mode="${MODE_ID}"]:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 16px rgba(229, 62, 62, 0.3);
            }
            
            /* Стили для бейджа режима на странице результатов */
            #mode-badge.first-aid-badge {
                background-color: #e53e3e;
                color: white;
                animation: pulseBadge 2s infinite;
            }
            
            /* Анимация пульсации */
            @keyframes pulseBadge {
                0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(229, 62, 62, 0); }
                100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
            }
            
            /* Стили для отображения результатов */
            .first-aid-results .score-percentage {
                color: #e53e3e;
            }
            
            /* Стили для дополнительных подсказок */
            .first-aid-tip {
                margin-top: 15px;
                padding: 10px 15px;
                background-color: rgba(229, 62, 62, 0.1);
                border-left: 4px solid #e53e3e;
                border-radius: 4px;
                font-style: italic;
                animation: fadeIn 0.5s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        
        // Добавляем стили в элемент
        if (styleElement.styleSheet) {
            // Для поддержки IE
            styleElement.styleSheet.cssText = css;
        } else {
            styleElement.appendChild(document.createTextNode(css));
        }
        
        // Добавляем элемент в head
        document.head.appendChild(styleElement);
        console.log('Стили для режима "Первая помощь" успешно добавлены');
    }
})();
