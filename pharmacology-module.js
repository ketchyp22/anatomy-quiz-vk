// Модуль фармакологического теста
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
            }
            // Можно добавить больше вопросов
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

            // Создаем пользовательский интерфейс
            this.createUI();
            
            return true;
        },

        // Создание пользовательского интерфейса
        createUI: function() {
            this.container.innerHTML = `
                <div class="pharma-module">
                    <h2>Тест по Фармакологии</h2>
                    <div id="pharma-question-container"></div>
                    <div class="pharma-controls">
                        <button id="pharma-next-btn">Далее</button>
                    </div>
                </div>
            `;

            this.questionContainer = document.getElementById('pharma-question-container');
            this.nextButton = document.getElementById('pharma-next-btn');
            this.nextButton.addEventListener('click', () => this.nextQuestion());
        },

        // Показать модуль (ВАЖНЫЙ МЕТОД)
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
        },

        // Выбор ответа
        selectAnswer: function(event) {
            const selectedIndex = parseInt(event.target.dataset.index);
            const currentQuestion = this.questions[this.state.currentQuestionIndex];
            const options = this.questionContainer.querySelectorAll('.pharma-option');

            options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

            event.target.classList.add('selected');

            if (selectedIndex === currentQuestion.correctAnswer) {
                event.target.classList.add('correct');
                this.state.score++;
            } else {
                event.target.classList.add('incorrect');
                options[currentQuestion.correctAnswer].classList.add('correct');
            }

            this.nextButton.disabled = false;
        },

        // Переход к следующему вопросу
        nextQuestion: function() {
            this.state.currentQuestionIndex++;

            if (this.state.currentQuestionIndex >= this.state.totalQuestions) {
                this.showResults();
                return;
            }

            this.showQuestion();
        },

        // Показ результатов
        showResults: function() {
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

            this.questionContainer.innerHTML = `
                <div class="pharma-results">
                    <h2>Ваш результат</h2>
                    <p>Правильных ответов: ${this.state.score} из ${this.state.totalQuestions}</p>
                    <p>Процент: ${percentage}%</p>
                    <p>${resultText}</p>
                    <button id="pharma-restart-btn">Пройти снова</button>
                </div>
            `;

            const restartBtn = document.getElementById('pharma-restart-btn');
            restartBtn.addEventListener('click', () => this.startTest());
        }
    };
    
    // Добавление модуля в глобальную область видимости
    window.PharmacologyModule = PharmacologyModule;
    
    // Инициализация модуля при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Модуль фармакологии загружен');
    });
})();
