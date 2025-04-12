// Модуль фармакологического теста
(function() {
    // Основной объект модуля
    const PharmacologyModule = {
        // Состояние модуля
        state: {
            currentQuestionIndex: 0,
            score: 0,
            totalQuestions: 10,
            isTestActive: false
        },

        // Базовый набор вопросов
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
                question: "Какой препарат используется для снижения холестерина?",
                options: [
                    "Метформин",
                    "Аторвастатин",
                    "Инсулин",
                    "Нитроглицерин"
                ],
                correctAnswer: 1
            },
            {
                question: "Что такое антибиотик?",
                options: [
                    "Препарат для снижения давления",
                    "Средство против воспаления",
                    "Лекарство для уничтожения бактерий",
                    "Болеутоляющее средство"
                ],
                correctAnswer: 2
            },
            {
                question: "Какой препарат используется при диабете?",
                options: [
                    "Инсулин",
                    "Аспирин",
                    "Анальгин",
                    "Преднизолон"
                ],
                correctAnswer: 0
            },
            {
                question: "Что такое антигистаминный препарат?",
                options: [
                    "Средство от боли",
                    "Лекарство от аллергии",
                    "Препарат для снижения давления",
                    "Антибиотик"
                ],
                correctAnswer: 1
            },
            {
                question: "Какой препарат снижает давление?",
                options: [
                    "Парацетамол",
                    "Но-шпа",
                    "Каптоприл",
                    "Панкреатин"
                ],
                correctAnswer: 2
            },
            {
                question: "Что такое противовоспалительный препарат?",
                options: [
                    "Лекарство, уменьшающее воспаление",
                    "Антибиотик",
                    "Средство от аллергии",
                    "Препарат для сна"
                ],
                correctAnswer: 0
            },
            {
                question: "Какой препарат используется при болях?",
                options: [
                    "Инсулин",
                    "Ибупрофен",
                    "Антибиотик",
                    "Препарат от давления"
                ],
                correctAnswer: 1
            },
            {
                question: "Что такое диуретик?",
                options: [
                    "Препарат от боли",
                    "Средство для похудения",
                    "Лекарство, усиливающее мочеотделение",
                    "Антибиотик"
                ],
                correctAnswer: 2
            }
        ],

        // Инициализация модуля
        init() {
            this.container = document.getElementById('pharmacology-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'pharmacology-container';
                this.container.className = 'module-container';
                document.body.appendChild(this.container);
            }
            this.container.style.display = 'none';
            
            this.createUI();
        },

        // Создание пользовательского интерфейса
        createUI() {
            this.container.innerHTML = `
                <div class="pharma-module">
                    <div class="pharma-header">
                        <h2>Тест по Фармакологии</h2>
                        <div class="pharma-progress">
                            <div class="pharma-progress-bar"></div>
                        </div>
                    </div>
                    <div id="pharma-question-container" class="pharma-question-container"></div>
                    <div class="pharma-controls">
                        <button id="pharma-next-btn" class="pharma-btn" disabled>Далее</button>
                    </div>
                </div>
            `;

            this.questionContainer = document.getElementById('pharma-question-container');
            this.nextButton = document.getElementById('pharma-next-btn');
            this.progressBar = document.querySelector('.pharma-progress-bar');

            this.nextButton.addEventListener('click', () => this.nextQuestion());
        },

        // Перемешивание вопросов
        shuffleQuestions() {
            const shuffled = [...this.questions];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, this.state.totalQuestions);
        },

        // Запуск теста
        start() {
            // Сбрасываем состояние
            this.state.currentQuestionIndex = 0;
            this.state.score = 0;
            this.state.isTestActive = true;

            // Перемешиваем и выбираем вопросы
            this.currentQuestions = this.shuffleQuestions();

            // Показываем первый вопрос
            this.showQuestion();
        },

        // Показ вопроса
        showQuestion() {
            const question = this.currentQuestions[this.state.currentQuestionIndex];
            
            // Обновляем прогресс-бар
            this.progressBar.style.width = 
                `${(this.state.currentQuestionIndex / this.state.totalQuestions) * 100}%`;

            // Очищаем предыдущий вопрос
            this.questionContainer.innerHTML = `
                <div class="pharma-question">
                    <p>${question.question}</p>
                    <div class="pharma-options">
                        ${question.options.map((option, index) => `
                            <div class="pharma-option" data-index="${index}">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Добавляем обработчики для вариантов ответа
            const options = this.questionContainer.querySelectorAll('.pharma-option');
            options.forEach(option => {
                option.addEventListener('click', (e) => this.selectAnswer(e));
            });

            // Сбрасываем кнопку "Далее"
            this.nextButton.disabled = true;
        },

        // Выбор ответа
        selectAnswer(event) {
            const selectedIndex = parseInt(event.target.dataset.index);
            const question = this.currentQuestions[this.state.currentQuestionIndex];
            const options = this.questionContainer.querySelectorAll('.pharma-option');

            // Очищаем предыдущие выделения
            options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });

            // Выделяем выбранный ответ
            event.target.classList.add('selected');

            // Проверяем правильность
            if (selectedIndex === question.correctAnswer) {
                event.target.classList.add('correct');
                this.state.score++;
            } else {
                event.target.classList.add('incorrect');
                // Подсвечиваем правильный ответ
                options[question.correctAnswer].classList.add('correct');
            }

            // Активируем кнопку "Далее"
            this.nextButton.disabled = false;
        },

        // Переход к следующему вопросу
        nextQuestion() {
            this.state.currentQuestionIndex++;

            // Проверяем, закончились ли вопросы
            if (this.state.currentQuestionIndex >= this.state.totalQuestions) {
                this.showResults();
                return;
            }

            // Показываем следующий вопрос
            this.showQuestion();
        },

        // Показ результатов
        showResults() {
            this.state.isTestActive = false;

            // Полностью заполняем прогресс-бар
            this.progressBar.style.width = '100%';

            const percentage = Math.round((this.state.score / this.state.totalQuestions) * 100);

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

            // Показываем результаты
            this.questionContainer.innerHTML = `
                <div class="pharma-results">
                    <h2>Ваш результат</h2>
                    <p>Правильных ответов: ${this.state.score} из ${this.state.totalQuestions}</p>
                    <p>Процент: ${percentage}%</p>
                    <p>${resultText}</p>
                    <button id="pharma-restart-btn" class="pharma-btn">Пройти снова</button>
                </div>
            `;

            // Обработчик перезапуска
            const restartBtn = document.getElementById('pharma-restart-btn');
            restartBtn.addEventListener('click', () => this.start());
        },

        // Показ модуля
        showModule() {
            if (!this.container) {
                this.init();
            }
            
            this.container.style.display = 'block';
            this.start();
        },

        // Скрытие модуля
        hideModule() {
            this.container.style.display = 'none';
        }
    };

    // Регистрация модуля глобально
    window.PharmacologyModule = PharmacologyModule;

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        PharmacologyModule.init();
    });
})();
