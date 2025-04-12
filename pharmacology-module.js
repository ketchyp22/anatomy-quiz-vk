// pharmacology-module.js - Полностью переписанный модуль фармакологии
// Модуль фармакологического теста с улучшенной надежностью и обработкой ошибок

(function() {
    try {
        // Объект модуля фармакологии
        const PharmacologyModule = {
            // Состояние модуля
            state: {
                currentQuestionIndex: 0,
                score: 0,
                isTestActive: false
            },

            // Переменная для хранения индекса выбранного ответа
            selectedAnswerIndex: undefined,

            // Базовый набор вопросов по фармакологии
            questions: [
                {
                    question: "Какой препарат относится к группе бета-блокаторов?",
                    options: [
                        "Амлодипин",
                        "Бисопролол",
                        "Панкреатин", 
                        "Парацетамол"
                    ],
                    correctAnswer: 1
                },
                {
                    question: "Какой орган метаболизирует большинство лекарств?",
                    options: [
                        "Почки",
                        "Желудок",
                        "Печень", 
                        "Легкие"
                    ],
                    correctAnswer: 2
                },
                {
                    question: "Какой тип препаратов снижает воспаление?",
                    options: [
                        "Антибиотики",
                        "Антигистаминные",
                        "Нестероидные противовоспалительные", 
                        "Гормональные"
                    ],
                    correctAnswer: 2
                },
                {
                    question: "Какие лекарства применяются для снижения артериального давления?",
                    options: [
                        "Антикоагулянты",
                        "Антигипертензивные",
                        "Антибиотики", 
                        "Антацидные"
                    ],
                    correctAnswer: 1
                },
                {
                    question: "К какой группе относится препарат Омепразол?",
                    options: [
                        "Ингибиторы протонной помпы",
                        "Антацидные средства",
                        "Антигистаминные", 
                        "Спазмолитики"
                    ],
                    correctAnswer: 0
                }
            ],

            // Инициализация модуля
            init: function() {
                console.log('Инициализация модуля фармакологии');
                
                // Получаем контейнер
                this.container = document.getElementById('pharmacology-container');
                
                if (!this.container) {
                    // Если контейнер не найден, создаем его
                    this.container = document.createElement('div');
                    this.container.id = 'pharmacology-container';
                    this.container.className = 'module-container';
                    document.body.appendChild(this.container);
                    console.log('Создан новый контейнер для модуля фармакологии');
                }

                // Добавляем стили
                this.addStyles();

                // Создаем пользовательский интерфейс
                this.createUI();
                
                return true;
            },

            // Добавление стилей
            addStyles: function() {
                // Проверяем, не добавлены ли уже стили
                if (document.getElementById('pharma-module-styles')) {
                    return;
                }

                const style = document.createElement('style');
                style.id = 'pharma-module-styles';
                style.textContent = `
                    .module-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(33, 33, 33, 0.95);
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow-y: auto;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                
                    .pharma-module {
                        background-color: white;
                        border-radius: 15px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                        padding: 30px 20px;
                        max-width: 500px;
                        width: 90%;
                        margin: 0 auto;
                        text-align: center;
                        position: relative;
                    }

                    .pharma-question {
                        margin-bottom: 20px;
                    }

                    .pharma-question p {
                        font-size: 18px;
                        margin-bottom: 20px;
                        color: #333333;
                        font-weight: 500;
                        line-height: 1.4;
                        word-wrap: break-word;
                    }

                    .pharma-options {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        width: 100%;
                    }

                    .pharma-option {
                        background-color: #f0f0f0;
                        padding: 15px;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.3s;
                        color: #333333;
                        border: 1px solid #e0e0e0;
                        font-weight: 500;
                        width: 100%;
                        text-align: center;
                        box-sizing: border-box;
                        word-break: break-word;
                    }

                    .pharma-option:hover {
                        background-color: #e0e0e0;
                        transform: translateY(-2px);
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }

                    .pharma-option.selected {
                        background-color: #4a89dc;
                        color: white;
                        border-color: #3a6fc7;
                    }

                    .pharma-option.correct {
                        background-color: #37bc9b;
                        color: white;
                        border-color: #2fa985;
                    }

                    .pharma-option.incorrect {
                        background-color: #e9573f;
                        color: white;
                        border-color: #d44b30;
                    }

                    .pharma-controls {
                        margin-top: 20px;
                    }

                    #pharma-next-btn {
                        background-color: #4a89dc;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        min-width: 120px;
                    }

                    #pharma-next-btn:not(:disabled):hover {
                        background-color: #3a6fc7;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    }

                    #pharma-next-btn:disabled {
                        background-color: #cccccc;
                        cursor: not-allowed;
                        color: #999999;
                    }
                    
                    .pharma-module h2 {
                        color: #4a89dc;
                        font-size: 24px;
                        margin-bottom: 25px;
                        position: relative;
                        word-break: break-word;
                    }
                    
                    .pharma-module h2::after {
                        content: '';
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 3px;
                        background-color: #37bc9b;
                        border-radius: 3px;
                    }
                    
                    .pharma-results {
                        text-align: center;
                    }
                    
                    .pharma-results h2 {
                        color: #4a89dc;
                        margin-bottom: 20px;
                    }
                    
                    .pharma-results p {
                        color: #333333;
                        margin-bottom: 15px;
                        font-size: 16px;
                    }
                    
                    #pharma-restart-btn {
                        background-color: #37bc9b;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        margin-top: 20px;
                    }
                    
                    #pharma-restart-btn:hover {
                        background-color: #2fa985;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    }
                    
                    .close-pharma-module {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background-color: #f0f0f0;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s;
                        z-index: 10;
                    }
                    
                    .close-pharma-module:hover {
                        background-color: #e0e0e0;
                        transform: rotate(90deg);
                    }
                    
                    .close-pharma-module:before,
                    .close-pharma-module:after {
                        content: '';
                        position: absolute;
                        width: 15px;
                        height: 2px;
                        background-color: #666;
                    }
                    
                    .close-pharma-module:before {
                        transform: rotate(45deg);
                    }
                    
                    .close-pharma-module:after {
                        transform: rotate(-45deg);
                    }
                    
                    @media (max-width: 340px) {
                        .pharma-module {
                            padding: 20px 15px;
                        }
                        
                        .pharma-option {
                            padding: 12px 10px;
                            font-size: 14px;
                        }
                        
                        .pharma-question p {
                            font-size: 16px;
                        }
                        
                        .pharma-module h2 {
                            font-size: 20px;
                        }
                        
                        #pharma-next-btn {
                            padding: 10px 20px;
                            font-size: 14px;
                        }
                    }
                `;
                document.head.appendChild(style);
                console.log('Стили модуля фармакологии добавлены');
            },

            // Создание пользовательского интерфейса
            createUI: function() {
                this.container.innerHTML = `
                    <div class="pharma-module">
                        <div class="close-pharma-module" id="close-pharma-module"></div>
                        <h2>Тест по Фармакологии</h2>
                        <div id="pharma-question-container"></div>
                        <div class="pharma-controls">
                            <button id="pharma-next-btn" disabled>Далее</button>
                        </div>
                    </div>
                `;

                this.questionContainer = document.getElementById('pharma-question-container');
                this.nextButton = document.getElementById('pharma-next-btn');
                
                // Проверка наличия элементов
                if (!this.questionContainer || !this.nextButton) {
                    console.error('Не удалось найти необходимые элементы интерфейса');
                    return false;
                }
                
                this.nextButton.addEventListener('click', () => this.nextQuestion());
                
                // Добавляем обработчик для кнопки закрытия
                const closeButton = document.getElementById('close-pharma-module');
                if (closeButton) {
                    closeButton.addEventListener('click', () => this.hideModule());
                }
                
                return true;
            },

            // Скрыть модуль
            hideModule: function() {
                this.container.style.display = 'none';
                
                // Показываем стартовый экран
                const startScreen = document.getElementById('start-screen');
                if (startScreen) {
                    startScreen.style.display = 'block';
                }
                
                // Скрываем контейнер анатомического квиза, если он открыт
                const quizContainer = document.getElementById('quiz-container');
                if (quizContainer) {
                    quizContainer.style.display = 'none';
                }
            },

            // Показать модуль
            showModule: function() {
                console.log('Запуск модуля фармакологии');
                
                try {
                    // Инициализируем модуль, если нужно
                    if (!this.init()) {
                        throw new Error('Не удалось инициализировать модуль фармакологии');
                    }

                    // Показываем контейнер
                    this.container.style.display = 'flex';

                    // Запускаем тест
                    this.startTest();
                    
                    return true;
                } catch (error) {
                    console.error('Ошибка при запуске модуля фармакологии:', error);
                    alert('Произошла ошибка при запуске модуля фармакологии. Пожалуйста, попробуйте снова.');
                    
                    // Показываем стартовый экран в случае ошибки
                    const startScreen = document.getElementById('start-screen');
                    if (startScreen) {
                        startScreen.style.display = 'block';
                    }
                    
                    return false;
                }
            },

            // Запуск теста
            startTest: function() {
                this.state.currentQuestionIndex = 0;
                this.state.score = 0;
                this.state.isTestActive = true;
                this.selectedAnswerIndex = undefined;

                // Проверяем наличие вопросов
                if (!this.questions || this.questions.length === 0) {
                    console.error('Ошибка: нет доступных вопросов');
                    this.questionContainer.innerHTML = '<p style="color: #e9573f;">Ошибка: нет доступных вопросов</p>';
                    return false;
                }

                // Сбрасываем состояние и показываем первый вопрос
                if (this.nextButton) {
                    this.nextButton.style.display = 'block';
                    this.nextButton.disabled = true;
                }
                
                return this.showQuestion();
            },

            // Показ вопроса
            showQuestion: function() {
                try {
                    // Проверяем доступность вопроса
                    if (this.state.currentQuestionIndex >= this.questions.length) {
                        console.error('Индекс вопроса вне диапазона:', this.state.currentQuestionIndex);
                        this.showResults();
                        return false;
                    }

                    const currentQuestion = this.questions[this.state.currentQuestionIndex];
                    
                    if (!currentQuestion || !currentQuestion.options) {
                        console.error('Некорректный формат вопроса:', currentQuestion);
                        return false;
                    }

                    this.questionContainer.innerHTML = `
                        <div class="pharma-question">
                            <p>${currentQuestion.question}</p>
                            <div class="pharma-options">
                                ${currentQuestion.options.map((option, index) => `
                                    <div class="pharma-option" data-index="${index}">
                                        ${option}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;

                    // Обработчики для вариантов ответа
                    const options = this.questionContainer.querySelectorAll('.pharma-option');
                    if (options.length === 0) {
                        console.error('Ошибка: варианты ответа не найдены');
                        return false;
                    }
                    
                    options.forEach(option => {
                        option.addEventListener('click', (e) => this.selectAnswer(e));
                    });

                    // Сбрасываем кнопку "Далее"
                    if (this.nextButton) {
                        this.nextButton.disabled = true;
                    }
                    
                    return true;
                } catch (error) {
                    console.error('Ошибка при отображении вопроса:', error);
                    this.questionContainer.innerHTML = `
                        <p style="color: #e9573f;">Произошла ошибка при загрузке вопроса</p>
                        <button id="pharma-retry-btn" class="pharma-btn">Попробовать снова</button>
                    `;
                    
                    const retryBtn = document.getElementById('pharma-retry-btn');
                    if (retryBtn) {
                        retryBtn.addEventListener('click', () => this.startTest());
                    }
                    
                    return false;
                }
            },

            // Выбор ответа
            selectAnswer: function(event) {
                try {
                    // Если ответ уже проверен (кнопка "Далее" активна), игнорируем клики
                    if (!this.nextButton || !this.nextButton.disabled) {
                        return;
                    }
                    
                    const selectedIndex = parseInt(event.target.dataset.index);
                    const options = this.questionContainer.querySelectorAll('.pharma-option');

                    // Проверяем корректность индекса
                    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= options.length) {
                        console.error('Некорректный индекс варианта ответа:', selectedIndex);
                        return;
                    }

                    // Сбрасываем предыдущие состояния для всех вариантов
                    options.forEach(opt => opt.classList.remove('selected'));

                    // Отмечаем только выбранный ответ
                    event.target.classList.add('selected');

                    // Активируем кнопку "Далее"
                    if (this.nextButton) {
                        this.nextButton.disabled = false;
                    }
                    
                    // Сохраняем выбранный ответ для проверки при переходе к следующему вопросу
                    this.selectedAnswerIndex = selectedIndex;
                } catch (error) {
                    console.error('Ошибка при выборе ответа:', error);
                }
            },

            // Переход к следующему вопросу
            nextQuestion: function() {
                try {
                    // Проверяем правильность ответа перед переходом к следующему вопросу
                    if (typeof this.selectedAnswerIndex !== 'undefined') {
                        const currentQuestion = this.questions[this.state.currentQuestionIndex];
                        const options = this.questionContainer.querySelectorAll('.pharma-option');
                        
                        // Проверяем наличие индекса правильного ответа
                        if (currentQuestion && typeof currentQuestion.correctAnswer !== 'undefined' && 
                            options.length > currentQuestion.correctAnswer) {
                            
                            // Отмечаем правильный или неправильный ответ
                            if (this.selectedAnswerIndex === currentQuestion.correctAnswer) {
                                options[this.selectedAnswerIndex].classList.add('correct');
                                this.state.score++;
                            } else {
                                options[this.selectedAnswerIndex].classList.add('incorrect');
                                options[currentQuestion.correctAnswer].classList.add('correct');
                            }
                            
                            // Деактивируем кнопку на время отображения результата
                            if (this.nextButton) {
                                this.nextButton.disabled = true;
                            }
                            
                            // Короткая пауза для того, чтобы пользователь увидел результат
                            setTimeout(() => {
                                // Увеличиваем индекс текущего вопроса
                                this.state.currentQuestionIndex++;
                                
                                // Сбрасываем выбранный ответ
                                this.selectedAnswerIndex = undefined;

                                // Проверяем, закончились ли вопросы
                                if (this.state.currentQuestionIndex >= this.questions.length) {
                                    this.showResults();
                                    return;
                                }

                                // Показываем следующий вопрос
                                this.showQuestion();
                                
                                // Активируем кнопку снова
                                if (this.nextButton) {
                                    this.nextButton.disabled = false;
                                }
                            }, 1000); // Задержка 1 секунда
                        } else {
                            console.error('Ошибка: не найден правильный ответ:', 
                                currentQuestion ? currentQuestion.correctAnswer : 'вопрос отсутствует');
                            this.state.currentQuestionIndex++;
                            this.showQuestion();
                        }
                    } else {
                        // На случай, если метод вызвали без выбранного ответа
                        this.state.currentQuestionIndex++;
                        
                        // Проверяем, закончились ли вопросы
                        if (this.state.currentQuestionIndex >= this.questions.length) {
                            this.showResults();
                            return;
                        }

                        // Показываем следующий вопрос
                        this.showQuestion();
                    }
                } catch (error) {
                    console.error('Ошибка при переходе к следующему вопросу:', error);
                    // Пытаемся восстановиться и показать следующий вопрос
                    this.state.currentQuestionIndex++;
                    if (this.state.currentQuestionIndex >= this.questions.length) {
                        this.showResults();
                    } else {
                        this.showQuestion();
                    }
                }
            },

            // Показ результатов
            showResults: function() {
                try {
                    const totalQuestions = this.questions.length;
                    if (totalQuestions === 0) {
                        console.error('Ошибка: нет вопросов для отображения результатов');
                        return;
                    }
                    
                    const percentage = Math.round((this.state.score / totalQuestions) * 100);

                    let resultText = '';
                    if (percentage >= 90) {
                        resultText = 'Отлично! Вы настоящий эксперт в фармакологии!';
                    } else if (percentage >= 70) {
                        resultText = 'Хороший результат! Вы хорошо знаете фармакологию.';
                    } else if (percentage >= 50) {
                        resultText = 'Неплохо, но есть над чем поработать.';
                    } else {
                        resultText = 'Рекомендуем изучить материал по фармакологии.';
                    }

                    this.questionContainer.innerHTML = `
                        <div class="pharma-results">
                            <h2>Ваш результат</h2>
                            <p>Правильных ответов: ${this.state.score} из ${totalQuestions}</p>
                            <p>Процент: ${percentage}%</p>
                            <p>${resultText}</p>
                            <button id="pharma-restart-btn">Пройти снова</button>
                            <button id="pharma-main-menu-btn" style="margin-top: 10px; background-color: #4a89dc;">В главное меню</button>
                        </div>
                    `;

                    // Скрываем кнопку "Далее"
                    if (this.nextButton) {
                        this.nextButton.style.display = 'none';
                    }

                    // Обработчик перезапуска теста
                    const restartBtn = document.getElementById('pharma-restart-btn');
                    if (restartBtn) {
                        restartBtn.addEventListener('click', () => {
                            if (this.nextButton) {
                                this.nextButton.style.display = 'block';
                            }
                            this.startTest();
                        });
                    }
                    
                    // Обработчик возврата в главное меню
                    const mainMenuBtn = document.getElementById('pharma-main-menu-btn');
                    if (mainMenuBtn) {
                        mainMenuBtn.addEventListener('click', () => this.hideModule());
                    }
                } catch (error) {
                    console.error('Ошибка при отображении результатов:', error);
                    this.questionContainer.innerHTML = `
                        <p style="color: #e9573f;">Произошла ошибка при отображении результатов</p>
                        <button id="pharma-main-menu-btn" style="margin-top: 10px; background-color: #4a89dc;">В главное меню</button>
                    `;
                    
                    const mainMenuBtn = document.getElementById('pharma-main-menu-btn');
                    if (mainMenuBtn) {
                        mainMenuBtn.addEventListener('click', () => this.hideModule());
                    }
                }
            }
        };
        
        // Добавление модуля в глобальную область видимости с защитой от перезаписи
        if (!window.PharmacologyModule) {
            window.PharmacologyModule = PharmacologyModule;
            console.log('Модуль фармакологии успешно инициализирован');
        }
        
    } catch (error) {
        console.error('Критическая ошибка при инициализации модуля фармакологии:', error);
        
        // Создаем резервный объект модуля в случае ошибки
        window.PharmacologyModule = {
            showModule: function() {
                alert('Модуль фармакологии временно недоступен. Пожалуйста, попробуйте позже или выберите другой режим.');
                
                // Возвращаемся к меню
                const startScreen = document.getElementById('start-screen');
                if (startScreen) {
                    startScreen.style.display = 'block';
                }
            },
            hideModule: function() {
                // Пустая реализация для совместимости
            }
        };
    }
    
    // Инициализация модуля при загрузке DOM если он еще не был инициализирован
    document.addEventListener('DOMContentLoaded', () => {
        try {
            console.log('Проверка модуля фармакологии при загрузке DOM');
            if (window.PharmacologyModule && typeof window.PharmacologyModule.init === 'function') {
                // Не инициализируем модуль автоматически, только проверяем наличие
                console.log('Модуль фармакологии доступен и готов к использованию');
            }
        } catch (error) {
            console.error('Ошибка при проверке модуля фармакологии:', error);
        }
    });
})();
