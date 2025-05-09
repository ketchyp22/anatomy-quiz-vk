// add-first-aid-mode.js - версия с перехватом запуска квиза
(function() {
    // Константы для режима "Первая помощь"
    const MODE_ID = 'first_aid';
    const MODE_TITLE = 'Первая помощь';
    const MODE_ICON = '🚑'; // Опциональная иконка
    
    // Ждем полной загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Небольшая задержка для уверенности, что основной код инициализирован
        setTimeout(initFirstAidMode, 1000);
    });
    
    // Главная функция инициализации режима
    function initFirstAidMode() {
        console.log('Инициализация режима "Первая помощь"...');
        
        // Ключевые переменные
        window.selectedMode = null; // Для отслеживания выбранного пользователем режима
        
        // 1. Добавляем кнопку режима в интерфейс
        addModeButton();
        
        // 2. Патчим функцию запуска квиза
        patchStartQuizFunction();
        
        // 3. Патчим функцию отображения результатов
        patchResultsFunction();
        
        // 4. Расширяем функционал шеринга результатов
        extendShareFunction();
        
        // 5. Добавляем CSS стили для нового режима
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
        
        // Модифицируем все кнопки выбора режима
        const allModeButtons = document.querySelectorAll('.quiz-mode-btn');
        
        // Удаляем существующие обработчики со всех кнопок
        allModeButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Добавляем новый обработчик
            newBtn.addEventListener('click', function() {
                // Удаляем класс active у всех кнопок
                document.querySelectorAll('.quiz-mode-btn').forEach(b => 
                    b.classList.remove('active'));
                
                // Добавляем класс active выбранной кнопке
                this.classList.add('active');
                
                // Сохраняем выбранный режим в нашей гарантированной переменной
                window.selectedMode = this.getAttribute('data-mode');
                console.log(`Выбран режим: ${window.selectedMode}`);
            });
        });
        
        // Делаем активной кнопку "Анатомия" по умолчанию
        const defaultButton = document.querySelector('.quiz-mode-btn[data-mode="anatomy"]');
        if (defaultButton) {
            defaultButton.classList.add('active');
            window.selectedMode = 'anatomy';
        }
        
        console.log('Кнопки режимов модифицированы, добавлена кнопка "Первая помощь"');
    }
    
    // Функция патча для кнопки запуска квиза
    function patchStartQuizFunction() {
        const startQuizButton = document.getElementById('start-quiz');
        
        if (!startQuizButton) {
            console.error('Кнопка запуска квиза не найдена');
            return;
        }
        
        // Создаем копию кнопки для удаления существующих обработчиков
        const newStartButton = startQuizButton.cloneNode(true);
        startQuizButton.parentNode.replaceChild(newStartButton, startQuizButton);
        
        // Добавляем новый обработчик для запуска квиза
        newStartButton.addEventListener('click', function() {
            // Получаем выбранный режим
            const mode = window.selectedMode || 'anatomy';
            
            // Получаем выбранную сложность
            let difficulty = 'easy';
            const difficultyButtons = document.querySelectorAll('.difficulty-btn');
            difficultyButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    difficulty = btn.getAttribute('data-difficulty') || 'easy';
                }
            });
            
            console.log(`Запуск квиза, режим: ${mode}, сложность: ${difficulty}`);
            
            // Подготавливаем вопросы для квиза
            prepareQuestionsForQuiz(mode, difficulty);
            
            // Скрываем стартовый экран
            const startScreen = document.getElementById('start-screen');
            if (startScreen) {
                startScreen.style.display = 'none';
            }
            
            // Отображаем контейнер квиза
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.style.display = 'block';
            }
            
            // Загружаем первый вопрос
            loadQuestion(0);
        });
        
        console.log('Функция запуска квиза успешно модифицирована');
    }
    
    // Подготовка вопросов для квиза
    function prepareQuestionsForQuiz(mode, difficulty) {
        if (!Array.isArray(window.questions)) {
            console.error('Массив вопросов не найден');
            return [];
        }
        
        // Фильтруем вопросы по режиму и сложности
        const filteredQuestions = window.questions.filter(q => 
            q.mode === mode && q.difficulty === difficulty);
        
        // Получаем случайные 10 вопросов или меньше, если их меньше 10
        const questionsCount = Math.min(filteredQuestions.length, 10);
        window.questionsForQuiz = shuffleArray(filteredQuestions).slice(0, questionsCount);
        
        // Сбрасываем счетчики
        window.currentQuestionIndex = 0;
        window.score = 0;
        window.currentQuizMode = mode;
        window.currentDifficulty = difficulty;
        
        console.log(`Подготовлено ${window.questionsForQuiz.length} вопросов для режима "${mode}" (${difficulty})`);
        
        return window.questionsForQuiz;
    }
    
    // Функция загрузки вопроса
    function loadQuestion(index) {
        if (!Array.isArray(window.questionsForQuiz) || index >= window.questionsForQuiz.length) {
            console.error('Вопросы не подготовлены или индекс выходит за пределы');
            return;
        }
        
        const question = window.questionsForQuiz[index];
        window.currentQuestionIndex = index;
        
        // Обновляем счетчик вопросов
        const questionCounter = document.getElementById('question-counter');
        if (questionCounter) {
            questionCounter.textContent = `Вопрос ${index + 1} из ${window.questionsForQuiz.length}`;
        }
        
        // Обновляем прогресс-бар
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = ((index + 1) / window.questionsForQuiz.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Отображаем текст вопроса
        const questionElement = document.getElementById('question');
        if (questionElement) {
            questionElement.textContent = question.text;
        }
        
        // Отображаем варианты ответов
        const optionsElement = document.getElementById('options');
        if (optionsElement) {
            optionsElement.innerHTML = '';
            
            question.options.forEach((option, optionIndex) => {
                const optionButton = document.createElement('button');
                optionButton.className = 'option-btn';
                optionButton.textContent = option;
                optionButton.setAttribute('data-index', optionIndex);
                
                optionButton.addEventListener('click', function() {
                    selectOption(this);
                });
                
                optionsElement.appendChild(optionButton);
            });
        }
        
        // Сброс состояния кнопки "Далее"
        const nextButton = document.getElementById('next-question');
        if (nextButton) {
            nextButton.disabled = true;
        }
        
        console.log(`Загружен вопрос ${index + 1} из ${window.questionsForQuiz.length}`);
    }
    
    // Функция выбора варианта ответа
    function selectOption(optionButton) {
        const selectedIndex = parseInt(optionButton.getAttribute('data-index'));
        const question = window.questionsForQuiz[window.currentQuestionIndex];
        
        // Отключаем все кнопки вариантов
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.disabled = true;
            
            // Определяем правильный ответ
            const btnIndex = parseInt(btn.getAttribute('data-index'));
            if (btnIndex === question.correctOptionIndex) {
                btn.classList.add('correct');
            }
        });
        
        // Выделяем выбранный вариант
        if (selectedIndex === question.correctOptionIndex) {
            optionButton.classList.add('correct');
            window.score++;
        } else {
            optionButton.classList.add('incorrect');
        }
        
        // Активируем кнопку "Далее"
        const nextButton = document.getElementById('next-question');
        if (nextButton) {
            nextButton.disabled = false;
            
            // Добавляем обработчик для следующего вопроса или завершения квиза
            nextButton.onclick = function() {
                const nextIndex = window.currentQuestionIndex + 1;
                
                if (nextIndex < window.questionsForQuiz.length) {
                    loadQuestion(nextIndex);
                } else {
                    showResults();
                }
            };
        }
    }
    
    // Патч функции отображения результатов
    function patchResultsFunction() {
        // Определяем функцию показа результатов, если она не существует
        window.showResults = function() {
            // Скрываем контейнер квиза
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.style.display = 'none';
            }
            
            // Показываем контейнер результатов
            const resultsContainer = document.getElementById('results-container');
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
            }
            
            // Устанавливаем режим
            const modeBadge = document.getElementById('mode-badge');
            if (modeBadge) {
                let modeTitle = '';
                switch (window.currentQuizMode) {
                    case 'anatomy': modeTitle = 'Анатомия'; break;
                    case 'clinical': modeTitle = 'Клиническое мышление'; break;
                    case 'pharmacology': modeTitle = 'Фармакология'; break;
                    case 'first_aid': modeTitle = 'Первая помощь'; modeBadge.classList.add('first-aid-badge'); break;
                    default: modeTitle = 'Медицинский квиз';
                }
                modeBadge.textContent = modeTitle;
            }
            
            // Устанавливаем сложность
            const difficultyBadge = document.getElementById('difficulty-badge');
            if (difficultyBadge) {
                difficultyBadge.textContent = window.currentDifficulty === 'hard' ? 'Сложный' : 'Обычный';
            }
            
            // Вычисляем процент правильных ответов
            const percentage = Math.round((window.score / window.questionsForQuiz.length) * 100);
            
            // Отображаем процент
            const percentageElement = document.getElementById('percentage');
            if (percentageElement) {
                percentageElement.textContent = percentage;
            }
            
            // Отображаем количество правильных ответов
            const correctAnswersElement = document.getElementById('correct-answers');
            if (correctAnswersElement) {
                correctAnswersElement.textContent = window.score;
            }
            
            // Отображаем общее количество вопросов
            const totalQuestionsElement = document.getElementById('total-questions-result');
            if (totalQuestionsElement) {
                totalQuestionsElement.textContent = window.questionsForQuiz.length;
            }
            
            // Добавляем особые стили и текст для режима "Первая помощь"
            if (window.currentQuizMode === 'first_aid') {
                const scoreElement = document.querySelector('.score');
                if (scoreElement) {
                    scoreElement.classList.add('first-aid-results');
                }
                
                const scoreText = document.querySelector('.score-text');
                if (scoreText && !scoreText.querySelector('.first-aid-tip')) {
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
                    
                    scoreText.innerHTML += additionalText;
                }
            }
            
            // Настраиваем кнопку "Начать заново"
            const restartButton = document.getElementById('restart-quiz');
            if (restartButton) {
                restartButton.onclick = function() {
                    // Скрываем контейнер результатов
                    resultsContainer.style.display = 'none';
                    
                    // Показываем стартовый экран
                    const startScreen = document.getElementById('start-screen');
                    if (startScreen) {
                        startScreen.style.display = 'block';
                    }
                };
            }
            
            console.log(`Результаты: ${window.score} из ${window.questionsForQuiz.length} (${percentage}%)`);
        };
        
        console.log('Функция отображения результатов успешно определена или расширена');
    }
    
    // Функция расширения шеринга
    function extendShareFunction() {
        setTimeout(() => {
            const shareButton = document.getElementById('share-results');
            if (!shareButton) {
                console.warn('Кнопка шеринга не найдена');
                return;
            }
            
            // Клонируем кнопку для удаления существующих обработчиков
            const newShareButton = shareButton.cloneNode(true);
            shareButton.parentNode.replaceChild(newShareButton, shareButton);
            
            // Добавляем новый обработчик
            newShareButton.addEventListener('click', function() {
                const score = window.score || 0;
                const totalQuestions = window.questionsForQuiz ? window.questionsForQuiz.length : 10;
                const percentage = Math.round((score / totalQuestions) * 100);
                
                // Определяем название режима
                let modeTitle = '';
                switch (window.currentQuizMode) {
                    case 'anatomy': modeTitle = 'Анатомия'; break;
                    case 'clinical': modeTitle = 'Клиническое мышление'; break;
                    case 'pharmacology': modeTitle = 'Фармакология'; break;
                    case 'first_aid': modeTitle = 'Первая помощь'; break;
                    default: modeTitle = 'Медицинский квиз';
                }
                
                const difficultyText = window.currentDifficulty === 'hard' ? 
                    'сложный уровень' : 'обычный уровень';
                
                const message = `Я прошел Медицинский квиз (${modeTitle}, ${difficultyText}) и набрал ${percentage}%! Попробуй и ты!`;
                
                // Используем VK Bridge для шеринга
                let bridge = window.vkBridgeInstance || window.vkBridge;
                if (bridge) {
                    bridge.send('VKWebAppShare', { message })
                        .then(data => console.log('Шеринг успешен:', data))
                        .catch(error => {
                            console.error('Ошибка шеринга:', error);
                            alert(message);
                        });
                } else {
                    alert(message);
                }
            });
            
            console.log('Функция шеринга успешно модифицирована');
        }, 1000);
    }
    
    // Функция добавления стилей для нового режима
    function addCustomStyles() {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        
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
        
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = css;
        } else {
            styleElement.appendChild(document.createTextNode(css));
        }
        
        document.head.appendChild(styleElement);
        console.log('Стили для режима "Первая помощь" успешно добавлены');
    }
    
    // Вспомогательная функция для перемешивания массива (алгоритм Фишера-Йейтса)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
})();
