// pharmacology-module.js - Модуль для тестов по фармакологии
(function() {
    // Модуль для тестов по фармакологии
    const PharmacologyModule = {
        // Константы для состояний и режимов
        STATES: {
            IDLE: 'idle',
            IN_PROGRESS: 'in_progress',
            COMPLETED: 'completed'
        },

        // Внутренние состояния модуля
        state: {
            currentState: 'idle',
            currentTest: null,
            userAnswers: [],
            score: 0,
            moduleInitialized: false
        },

        // База фармакологических вопросов
        questions: [
            {
                id: 'ph001',
                question: 'Какой препарат из группы бета-блокаторов?',
                options: [
                    { text: 'Бисопролол', isCorrect: true },
                    { text: 'Амлодипин', isCorrect: false },
                    { text: 'Эналаприл', isCorrect: false },
                    { text: 'Фуросемид', isCorrect: false }
                ],
                explanation: 'Бисопролол - селективный β1-адреноблокатор, применяемый при артериальной гипертензии и сердечной недостаточности.'
            },
            {
                id: 'ph002',
                question: 'Какой орган метаболизирует большинство лекарственных препаратов?',
                options: [
                    { text: 'Почки', isCorrect: false },
                    { text: 'Печень', isCorrect: true },
                    { text: 'Желудок', isCorrect: false },
                    { text: 'Легкие', isCorrect: false }
                ],
                explanation: 'Печень является основным органом метаболизма лекарственных препаратов благодаря наличию ферментных систем цитохрома P450.'
            },
            // Добавьте больше вопросов сюда
        ],

        // Инициализация модуля
        init: function() {
            if (this.state.moduleInitialized) return;

            // Создаем контейнер, если он не существует
            this.container = document.getElementById('pharmacology-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'pharmacology-container';
                this.container.className = 'module-container';
                document.body.appendChild(this.container);
            }

            // Добавляем стили
            this.addStyles();

            // Создаем базовую структуру модуля
            this.createModuleStructure();

            this.state.moduleInitialized = true;
        },

        // Добавление стилей
        addStyles: function() {
            if (document.getElementById('pharma-module-styles')) return;

            const style = document.createElement('style');
            style.id = 'pharma-module-styles';
            style.textContent = `
                .pharma-module {
                    background-color: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    max-width: 600px;
                    margin: 30px auto;
                    padding: 30px;
                    position: relative;
                }

                .pharma-module-title {
                    font-size: 24px;
                    color: #2c3e50;
                    text-align: center;
                    margin-bottom: 25px;
                    font-weight: 700;
                }

                .pharma-question {
                    background-color: #f7f9fc;
                    border-left: 4px solid #3498db;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                }

                .pharma-question-text {
                    font-size: 18px;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-weight: 600;
                }

                .pharma-options {
                    display: grid;
                    gap: 10px;
                }

                .pharma-option {
                    background-color: #ecf0f1;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    padding: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #2c3e50;
                    font-weight: 500;
                }

                .pharma-option:hover {
                    background-color: #e0e6ea;
                    border-color: #3498db;
                }

                .pharma-option.selected {
                    background-color: #3498db;
                    color: white;
                }

                .pharma-option.correct {
                    background-color: #2ecc71;
                    color: white;
                }

                .pharma-option.incorrect {
                    background-color: #e74c3c;
                    color: white;
                }

                .pharma-explanation {
                    background-color: #f1f8ff;
                    border-left: 4px solid #3498db;
                    padding: 15px;
                    margin-top: 15px;
                    border-radius: 8px;
                    font-size: 16px;
                    color: #2c3e50;
                }

                .pharma-progress {
                    width: 100%;
                    height: 10px;
                    background-color: #ecf0f1;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }

                .pharma-progress-bar {
                    height: 100%;
                    background-color: #3498db;
                    width: 0%;
                    transition: width 0.5s ease;
                }

                .pharma-controls {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .pharma-btn {
                    background-color: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .pharma-btn:hover {
                    background-color: #2980b9;
                }

                .pharma-btn:disabled {
                    background-color: #bdc3c7;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(style);
        },

        // Создание структуры модуля
        createModuleStructure: function() {
            this.container.innerHTML = `
                <div class="pharma-module">
                    <div class="pharma-module-title">Тест по Фармакологии</div>
                    <div class="pharma-progress">
                        <div class="pharma-progress-bar"></div>
                    </div>
                    <div id="pharma-test-container"></div>
                    <div class="pharma-controls">
                        <button id="pharma-next-btn" class="pharma-btn" disabled>Далее</button>
                    </div>
                </div>
            `;
        },

        // Запуск теста
        start: function() {
            // Сбрасываем состояние
            this.state.userAnswers = [];
            this.state.score = 0;
            this.state.currentState = this.STATES.IN_PROGRESS;

            // Перемешиваем вопросы
            const shuffledQuestions = this.shuffleArray(this.questions).slice(0, 5);
            this.state.currentTest = shuffledQuestions;

            // Показываем первый вопрос
            this.renderQuestion(0);
        },

        // Рендер вопроса
        renderQuestion: function(questionIndex) {
            const testContainer = document.getElementById('pharma-test-container');
            const progressBar = document.querySelector('.pharma-progress-bar');
            const nextButton = document.getElementById('pharma-next-btn');

            // Обновляем прогресс-бар
            progressBar.style.width = `${(questionIndex / this.state.currentTest.length) * 100}%`;

            // Если все вопросы пройдены
            if (questionIndex >= this.state.currentTest.length) {
                this.showResults();
                return;
            }

            const currentQuestion = this.state.currentTest[questionIndex];

            // Очищаем контейнер
            testContainer.innerHTML = `
                <div class="pharma-question">
                    <div class="pharma-question-text">${currentQuestion.question}</div>
                    <div class="pharma-options">
                        ${currentQuestion.options.map((option, idx) => `
                            <div class="pharma-option" data-index="${idx}">
                                ${option.text}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Сбрасываем кнопку "Далее"
            nextButton.disabled = true;

            // Навешиваем обработчики на варианты ответов
            const options = testContainer.querySelectorAll('.pharma-option');
            options.forEach(option => {
                option.addEventListener('click', () => this.selectOption(option, questionIndex));
            });

            // Обработчик кнопки "Далее"
            nextButton.onclick = () => this.renderQuestion(questionIndex + 1);
        },

        // Выбор варианта ответа
        selectOption: function(optionElement, questionIndex) {
            const options = document.querySelectorAll('.pharma-option');
            const nextButton = document.getElementById('pharma-next-btn');
            const currentQuestion = this.state.currentTest[questionIndex];

            // Сбрасываем предыдущие выделения
            options.forEach(opt => opt.classList.remove('selected'));

            // Выделяем текущий вариант
            optionElement.classList.add('selected');

            // Проверяем правильность ответа
            const selectedIndex = parseInt(optionElement.dataset.index);
            const isCorrect = currentQuestion.options[selectedIndex].isCorrect;

            // Сохраняем результат
            this.state.userAnswers.push({
                questionId: currentQuestion.id,
                isCorrect: isCorrect
            });

            // Обновляем счет
            if (isCorrect) this.state.score++;

            // Разблокируем кнопку "Далее"
            nextButton.disabled = false;

            // Показываем правильный ответ
            if (isCorrect) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
                // Находим и подсвечиваем правильный ответ
                options.forEach((opt, idx) => {
                    if (currentQuestion.options[idx].isCorrect) {
                        opt.classList.add('correct');
                    }
                });
            }
        },

        // Показ результатов
        showResults: function() {
            const testContainer = document.getElementById('pharma-test-container');
            const progressBar = document.querySelector('.pharma-progress-bar');
            const nextButton = document.getElementById('pharma-next-btn');

            // Заполняем прогресс-бар
            progressBar.style.width = '100%';

            // Скрываем кнопку "Далее"
            nextButton.style.display = 'none';

            // Рассчитываем процент правильных ответов
            const totalQuestions = this.state.currentTest.length;
            const correctAnswers = this.state.score;
            const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);

            // Формируем текст результата
            let resultText = '';
            if (percentageScore >= 90) {
                resultText = 'Отлично! Вы настоящий эксперт в фармакологии!';
            } else if (percentageScore >= 70) {
                resultText = 'Хороший результат! Вы хорошо знаете фармакологию.';
            } else if (percentageScore >= 50) {
                resultText = 'Неплохо, но есть над чем поработать.';
            } else {
                resultText = 'Рекомендуем повторить материал по фармакологии.';
            }

            // Отображаем результаты
            testContainer.innerHTML = `
                <div class="pharma-results">
                    <h2>Ваш результат</h2>
                    <p>Правильных ответов: ${correctAnswers} из ${totalQuestions}</p>
                    <p>Процент: ${percentageScore}%</p>
                    <p>${resultText}</p>
                    <div class="pharma-controls">
                        <button id="pharma-restart-btn" class="pharma-btn">Пройти снова</button>
                    </div>
                </div>
            `;

            // Обработчик перезапуска теста
            const restartButton = document.getElementById('pharma-restart-btn');
            restartButton.addEventListener('click', () => this.start());
        },

        // Вспомогательный метод перемешивания массива
        shuffleArray: function(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        // Показать модуль
        show: function() {
            // Инициализируем модуль, если нужно
            if (!this.state.moduleInitialized) {
                this.init();
            }

            // Показываем контейнер
            this.container.style.display = 'block';

            // Запускаем тест
            this.start();
        },

        // Скрыть модуль
        hide: function() {
            this.container.style.display = 'none';
        }
    };

    // Добавляем модуль в глобальную область видимости
    window.PharmacologyModule = PharmacologyModule;

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Модуль фармакологических тестов загружен');
    });
})();
