// Обновленный модуль фармакологического теста с исправлением контрастности текста
(function() {
    const PharmacologyModule = {
        // Состояние модуля
        state: {
            currentQuestionIndex: 0,
            score: 0,
            totalQuestions: 10,
            isTestActive: false
        },

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
            }
        ],

        // Инициализация модуля
        init: function() {
            console.log('Инициализация модуля фармакологии');
            
            // Получаем контейнер
            this.container = document.getElementById('pharmacology-container');
            
            if (!this.container) {
                console.error('Контейнер для фармакологического модуля не найден');
                return false;
            }

            // Добавляем стили
            this.addStyles();

            // Создаем пользовательский интерфейс
            this.createUI();
            
            return true;
        },

        // Добавление стилей
        addStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                .pharma-module {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    padding: 30px;
                    max-width: 500px;
                    margin: 0 auto;
                    text-align: center;
                }

                .pharma-question {
                    margin-bottom: 20px;
                }

                .pharma-question p {
                    font-size: 20px;
                    margin-bottom: 20px;
                    color: #333333; /* Темный текст для лучшей читаемости */
                    font-weight: 500; /* Немного более жирный шрифт */
                }

                .pharma-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .pharma-option {
                    background-color: #f0f0f0;
                    padding: 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    color: #333333; /* Темный текст для опций */
                    border: 1px solid #e0e0e0; /* Добавляем границу для лучшего контраста */
                    font-weight: 500; /* Более жирный шрифт */
                }

                .pharma-option:hover {
                    background-color: #e0e0e0;
                    transform: translateX(5px);
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
                
                /* Добавляем стили для заголовка модуля */
                .pharma-module h2 {
                    color: #4a89dc;
                    font-size: 26px;
                    margin-bottom: 25px;
                    position: relative;
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
                
                /* Стили для результатов */
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
                    font-size: 18px;
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
            `;
            document.head.appendChild(style);
        },

        // Создание пользовательского интерфейса
        createUI: function() {
            this.container.innerHTML = `
                <div class="pharma-module">
                    <h2>Тест по Фармакологии</h2>
                    <div id="pharma-question-container"></div>
                    <div class="pharma-controls">
                        <button id="pharma-next-btn" disabled>Далее</button>
                    </div>
                </div>
            `;

            this.questionContainer = document.getElementById('pharma-question-container');
            this.nextButton = document.getElementById('pharma-next-btn');
            this.nextButton.addEventListener('click', () => this.nextQuestion());
        },

        // Показать модуль
        showModule: function() {
            console.log('Вызван метод showModule для фармакологического модуля');
            
            // Инициализируем модуль, если нужно
            if (!this.init()) {
                console.error('Не удалось инициализировать модуль фармакологии');
                return;
            }

            // Показываем контейнер
            this.container.style.display = 'block';

            // Запускаем тест
            this.startTest();
        },

        // Запуск теста
        startTest: function() {
            this.state.currentQuestionIndex = 0;
            this.state.score = 0;
            this.state.isTestActive = true;

            this.showQuestion();
        },

        // Показ вопроса
        showQuestion: function() {
            const currentQuestion = this.questions[this.state.currentQuestionIndex];

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
            options.forEach(option => {
                option.addEventListener('click', (e) => this.selectAnswer(e));
            });

            // Сбрасываем кнопку "Далее"
            this.nextButton.disabled = true;
        },

        // Выбор ответа
        selectAnswer: function(event) {
            const selectedIndex = parseInt(event.target.dataset.index);
            const currentQuestion = this.questions[this.state.currentQuestionIndex];
            const options = this.questionContainer.querySelectorAll('.pharma-option');

            // Сбрасываем предыдущие состояния
            options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

            // Отмечаем выбранный ответ
            event.target.classList.add('selected');

            // Проверяем правильность ответа
            if (selectedIndex === currentQuestion.correctAnswer) {
                event.target.classList.add('correct');
                this.state.score++;
            } else {
                event.target.classList.add('incorrect');
                options[currentQuestion.correctAnswer].classList.add('correct');
            }

            // Активируем кнопку "Далее"
            this.nextButton.disabled = false;
        },

        // Переход к следующему вопросу
        nextQuestion: function() {
            this.state.currentQuestionIndex++;

            // Проверяем, закончились ли вопросы
            if (this.state.currentQuestionIndex >= this.questions.length) {
                this.showResults();
                return;
            }

            // Показываем следующий вопрос
            this.showQuestion();
        },

        // Показ результатов
        showResults: function() {
            const percentage = Math.round((this.state.score / this.questions.length) * 100);

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
                    <p>Правильных ответов: ${this.state.score} из ${this.questions.length}</p>
                    <p>Процент: ${percentage}%</p>
                    <p>${resultText}</p>
                    <button id="pharma-restart-btn">Пройти снова</button>
                </div>
            `;

            // Убираем кнопку "Далее"
            this.nextButton.style.display = 'none';

            // Обработчик перезапуска теста
            const restartBtn = document.getElementById('pharma-restart-btn');
            restartBtn.addEventListener('click', () => {
                this.nextButton.style.display = 'block';
                this.startTest();
            });
        }
    };
    
    // Добавление модуля в глобальную область видимости
    window.PharmacologyModule = PharmacologyModule;
    
    // Инициализация модуля при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Модуль фармакологии загружен');
    });
})();
