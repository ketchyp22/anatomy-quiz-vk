// pharmacology-module.js - Модуль для тестов по фармакологии
(function() {
    // Модуль для тестов по фармакологии
    const PharmacologyModule = {
        // Состояние модуля
        state: {
            userAnswers: [],
            userScore: 0,
            moduleInitialized: false,
            moduleVisible: false,
            testInProgress: false
        },
        
        // База данных вопросов по фармакологии
        pharmaQuestions: [
            {
                id: 'pq-001',
                question: 'Какой из следующих препаратов относится к группе бета-блокаторов?',
                options: [
                    { id: 'a', text: 'Бисопролол', isCorrect: true },
                    { id: 'b', text: 'Амлодипин', isCorrect: false },
                    { id: 'c', text: 'Эналаприл', isCorrect: false },
                    { id: 'd', text: 'Фуросемид', isCorrect: false }
                ],
                explanation: 'Бисопролол - селективный бета-1-адреноблокатор, применяемый при артериальной гипертензии, стенокардии и хронической сердечной недостаточности.'
            },
            {
                id: 'pq-002',
                question: 'Какой основной механизм действия ингибиторов АПФ?',
                options: [
                    { id: 'a', text: 'Блокируют превращение ангиотензина I в ангиотензин II', isCorrect: true },
                    { id: 'b', text: 'Блокируют кальциевые каналы', isCorrect: false },
                    { id: 'c', text: 'Стимулируют выведение натрия с мочой', isCorrect: false },
                    { id: 'd', text: 'Блокируют бета-адренорецепторы', isCorrect: false }
                ],
                explanation: 'Ингибиторы АПФ блокируют ангиотензин-превращающий фермент, предотвращая образование ангиотензина II - мощного вазоконстриктора.'
            },
            {
                id: 'pq-003',
                question: 'Какой антибиотик из группы макролидов может вызывать удлинение интервала QT?',
                options: [
                    { id: 'a', text: 'Азитромицин', isCorrect: true },
                    { id: 'b', text: 'Амоксициллин', isCorrect: false },
                    { id: 'c', text: 'Метронидазол', isCorrect: false },
                    { id: 'd', text: 'Доксициклин', isCorrect: false }
                ],
                explanation: 'Азитромицин может вызывать удлинение интервала QT, что повышает риск аритмий, особенно у пациентов с факторами риска.'
            },
            {
                id: 'pq-004',
                question: 'Какое из следующих лекарственных средств используется для лечения болезни Паркинсона?',
                options: [
                    { id: 'a', text: 'Леводопа', isCorrect: true },
                    { id: 'b', text: 'Фенитоин', isCorrect: false },
                    { id: 'c', text: 'Метформин', isCorrect: false },
                    { id: 'd', text: 'Флуоксетин', isCorrect: false }
                ],
                explanation: 'Леводопа - предшественник дофамина, который превращается в дофамин в мозге и восполняет его дефицит при болезни Паркинсона.'
            },
            {
                id: 'pq-005',
                question: 'Какое побочное действие характерно для глюкокортикостероидов при длительном применении?',
                options: [
                    { id: 'a', text: 'Синдром Кушинга', isCorrect: true },
                    { id: 'b', text: 'Гипогликемия', isCorrect: false },
                    { id: 'c', text: 'Брадикардия', isCorrect: false },
                    { id: 'd', text: 'Снижение массы тела', isCorrect: false }
                ],
                explanation: 'Длительное применение глюкокортикостероидов может вызвать синдром Кушинга с характерными изменениями внешности, метаболическими нарушениями и другими системными эффектами.'
            },
            {
                id: 'pq-006',
                question: 'Какой препарат используется для лечения бронхиальной астмы в качестве базисной терапии?',
                options: [
                    { id: 'a', text: 'Ингаляционные глюкокортикостероиды', isCorrect: true },
                    { id: 'b', text: 'Ацетилсалициловая кислота', isCorrect: false },
                    { id: 'c', text: 'Нифедипин', isCorrect: false },
                    { id: 'd', text: 'Амиодарон', isCorrect: false }
                ],
                explanation: 'Ингаляционные глюкокортикостероиды - основа базисной противовоспалительной терапии бронхиальной астмы, уменьшают воспаление в дыхательных путях.'
            },
            {
                id: 'pq-007',
                question: 'Какое из следующих лекарственных средств относится к статинам?',
                options: [
                    { id: 'a', text: 'Аторвастатин', isCorrect: true },
                    { id: 'b', text: 'Метопролол', isCorrect: false },
                    { id: 'c', text: 'Варфарин', isCorrect: false },
                    { id: 'd', text: 'Дигоксин', isCorrect: false }
                ],
                explanation: 'Аторвастатин - препарат из группы статинов, ингибирует ГМГ-КоА-редуктазу, снижает уровень холестерина и применяется для профилактики сердечно-сосудистых заболеваний.'
            },
            {
                id: 'pq-008',
                question: 'Какой препарат применяется для лечения железодефицитной анемии?',
                options: [
                    { id: 'a', text: 'Препараты железа (Fe2+)', isCorrect: true },
                    { id: 'b', text: 'Цианокобаламин (витамин B12)', isCorrect: false },
                    { id: 'c', text: 'Эритропоэтин', isCorrect: false },
                    { id: 'd', text: 'Фолиевая кислота', isCorrect: false }
                ],
                explanation: 'Препараты железа (сульфат железа, фумарат железа) применяются для восполнения его дефицита при железодефицитной анемии.'
            },
            {
                id: 'pq-009',
                question: 'Какой препарат относится к группе нестероидных противовоспалительных средств (НПВС)?',
                options: [
                    { id: 'a', text: 'Ибупрофен', isCorrect: true },
                    { id: 'b', text: 'Омепразол', isCorrect: false },
                    { id: 'c', text: 'Преднизолон', isCorrect: false },
                    { id: 'd', text: 'Морфин', isCorrect: false }
                ],
                explanation: 'Ибупрофен - нестероидное противовоспалительное средство, обладающее противовоспалительным, жаропонижающим и анальгетическим эффектами.'
            },
            {
                id: 'pq-010',
                question: 'Какой побочный эффект характерен для НПВС?',
                options: [
                    { id: 'a', text: 'Повреждение слизистой желудка', isCorrect: true },
                    { id: 'b', text: 'Повышение уровня сахара в крови', isCorrect: false },
                    { id: 'c', text: 'Запор', isCorrect: false },
                    { id: 'd', text: 'Фотосенсибилизация', isCorrect: false }
                ],
                explanation: 'НПВС могут вызывать повреждение слизистой желудка и кишечника из-за подавления синтеза защитных простагландинов, что может приводить к язвенной болезни и кровотечениям.'
            }
        ],
        
        // Инициализация модуля
        init: function(container) {
            // Проверяем, был ли уже инициализирован модуль
            if (this.state.moduleInitialized) return;
            
            console.log('Инициализация модуля тестов по фармакологии...');
            
            this.container = container || document.getElementById('pharmacology-container');
            
            // Если контейнера нет, создаем его
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'pharmacology-container';
                this.container.className = 'module-container';
                this.container.style.display = 'none';
                document.body.appendChild(this.container);
            }
            
            this.addCSS();
            this.createModuleWrapper();
            
            this.state.moduleInitialized = true;
        },
        
        // Добавление стилей для модуля
        addCSS: function() {
            // Проверяем, есть ли уже стили
            if (document.getElementById('pharma-module-styles')) return;
            
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
                    overflow-y: auto;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .pharma-module {
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    max-width: 800px;
                    margin: 0 auto 20px;
                }
                
                .pharma-title {
                    font-size: 1.5em;
                    color: #FF1493;
                    margin-bottom: 10px;
                    text-align: center;
                }
                
                .pharma-question-container {
                    margin-bottom: 25px;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: #f8f8f8;
                    border-left: 4px solid #FF1493;
                }
                
                .question-number {
                    font-size: 0.9em;
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .pharma-question {
                    font-weight: bold;
                    margin: 15px 0 10px;
                    color: #333;
                }
                
                .pharma-options {
                    display: grid;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .pharma-option {
                    padding: 12px 15px;
                    background-color: #f1f1f1;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                
                .pharma-option:hover {
                    background-color: #e8e8e8;
                    transform: translateX(5px);
                }
                
                .pharma-option.selected {
                    border-color: #FF1493;
                    background-color: #fff0f7;
                }
                
                .pharma-option.correct {
                    border-color: #4CAF50;
                    background-color: #ebffef;
                }
                
                .pharma-option.incorrect {
                    border-color: #F44336;
                    background-color: #ffebeb;
                }
                
                .explanation {
                    background-color: #fff0f7;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 4px solid #FF1493;
                    display: none;
                }
                
                .pharma-navigation {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .pharma-btn {
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #FF1493, #ff4db8);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                }
                
                .pharma-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                
                .pharma-btn:disabled {
                    background: #cccccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .pharma-score {
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #FF1493;
                    margin: 20px 0;
                }
                
                .module-content {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s;
                }
                
                .module-content.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .close-module {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 36px;
                    height: 36px;
                    background: #fff;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    z-index: 1100;
                    transition: all 0.3s;
                }
                
                .close-module:hover {
                    transform: rotate(90deg);
                    background: #ff4db8;
                    color: white;
                }
                
                .close-module::before,
                .close-module::after {
                    content: '';
                    position: absolute;
                    width: 18px;
                    height: 2px;
                    background: #333;
                }
                
                .close-module:hover::before,
                .close-module:hover::after {
                    background: #fff;
                }
                
                .close-module::before {
                    transform: rotate(45deg);
                }
                
                .close-module::after {
                    transform: rotate(-45deg);
                }
                
                .fade-in {
                    animation: fadein 0.5s;
                }
                
                @keyframes fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Адаптивность для мобильных устройств */
                @media (max-width: 600px) {
                    .pharma-module {
                        padding: 15px;
                    }
                    
                    .pharma-option {
                        padding: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        },
        
        // Создание обертки для модуля
        createModuleWrapper: function() {
            // Создаем обертку для модуля
            const moduleWrapper = document.createElement('div');
            moduleWrapper.className = 'pharma-module';
            moduleWrapper.id = 'pharma-wrapper';
            
            // Создаем кнопку закрытия
            const closeButton = document.createElement('div');
            closeButton.className = 'close-module';
            closeButton.addEventListener('click', () => this.hideModule());
            this.container.appendChild(closeButton);
            
            // Создаем заголовок
            const moduleTitle = document.createElement('h2');
            moduleTitle.textContent = 'Тесты по фармакологии';
            moduleTitle.className = 'pharma-title';
            moduleWrapper.appendChild(moduleTitle);
            
            // Контейнер для содержимого модуля
            const moduleContent = document.createElement('div');
            moduleContent.className = 'module-content';
            moduleContent.id = 'pharma-content';
            moduleWrapper.appendChild(moduleContent);
            
            // Добавляем модуль в контейнер
            this.container.appendChild(moduleWrapper);
        },
        
        // Показать модуль
        showModule: function() {
            // Инициализируем модуль, если он еще не был инициализирован
            if (!this.state.moduleInitialized) {
                this.init();
            }
            
            // Показываем контейнер
            this.container.style.display = 'block';
            this.state.moduleVisible = true;
            
            // Запускаем тест по фармакологии
            setTimeout(() => {
                this.startPharmaTest();
            }, 100);
        },
        
        // Скрыть модуль
        hideModule: function() {
            this.container.style.display = 'none';
            this.state.moduleVisible = false;
            this.state.testInProgress = false;
        },
        
        // Запуск теста по фармакологии
        startPharmaTest: function() {
            // Сбрасываем состояние
            this.state.userAnswers = [];
            this.state.userScore = 0;
            this.state.testInProgress = true;
            
            // Отображаем тест
            this.renderPharmaTest();
        },
        
        // Отображение теста по фармакологии
        renderPharmaTest: function() {
            const moduleContent = document.getElementById('pharma-content');
            moduleContent.innerHTML = '';
            moduleContent.classList.remove('visible');
            
            // Задержка для анимации
            setTimeout(() => {
                // Выбираем 5 случайных вопросов
                const randomQuestions = this.getRandomQuestions(5);
                
                // Добавляем информацию о тесте
                const testInfo = document.createElement('div');
                testInfo.className = 'test-info fade-in';
                testInfo.textContent = 'Выберите правильный ответ в каждом вопросе. После ответа на все вопросы нажмите кнопку "Проверить результаты".';
                moduleContent.appendChild(testInfo);
                
                // Добавляем каждый вопрос
                randomQuestions.forEach((question, index) => {
                    const questionContainer = document.createElement('div');
                    questionContainer.className = 'pharma-question-container fade-in';
                    questionContainer.style.animationDelay = `${index * 0.1}s`;
                    
                    // Номер вопроса
                    const questionNumber = document.createElement('div');
                    questionNumber.className = 'question-number';
                    questionNumber.textContent = `Вопрос ${index + 1} из ${randomQuestions.length}`;
                    questionContainer.appendChild(questionNumber);
                    
                    // Текст вопроса
                    const questionText = document.createElement('div');
                    questionText.className = 'pharma-question';
                    questionText.textContent = question.question;
                    questionContainer.appendChild(questionText);
                    
                    // Варианты ответов
                    const optionsContainer = document.createElement('div');
                    optionsContainer.className = 'pharma-options';
                    optionsContainer.dataset.questionId = question.id;
                    
                    question.options.forEach((option) => {
                        const optionElem = document.createElement('div');
                        optionElem.className = 'pharma-option';
                        optionElem.textContent = option.text;
                        optionElem.dataset.id = option.id;
                        optionElem.dataset.correct = option.isCorrect;
                        
                        optionElem.addEventListener('click', (e) => this.selectOption(e.target, optionsContainer));
                        
                        optionsContainer.appendChild(optionElem);
                    });
                    
                    questionContainer.appendChild(optionsContainer);
                    
                    // Блок для объяснения
                    const explanation = document.createElement('div');
                    explanation.className = 'explanation';
                    explanation.style.display = 'none';
                    explanation.textContent = question.explanation;
                    questionContainer.appendChild(explanation);
                    
                    moduleContent.appendChild(questionContainer);
                });
                
                // Кнопка проверки результатов
                const navigation = document.createElement('div');
                navigation.className = 'pharma-navigation';
                
                const checkBtn = document.createElement('button');
                checkBtn.className = 'pharma-btn';
                checkBtn.id = 'check-results-btn';
                checkBtn.textContent = 'Проверить результаты';
                checkBtn.disabled = true;
                checkBtn.addEventListener('click', () => this.checkResults());
                
                navigation.appendChild(checkBtn);
                moduleContent.appendChild(navigation);
                
                // Показываем контент с анимацией
                moduleContent.classList.add('visible');
            }, 300);
        },
        
        // Выбор случайных вопросов
        getRandomQuestions: function(count) {
            const shuffled = [...this.pharmaQuestions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        },
        
        // Выбор варианта ответа
        selectOption: function(optionElem, optionsContainer) {
            // Если на вопрос уже ответили, игнорируем
            if (optionsContainer.querySelector('.selected')) {
                return;
            }
            
            // Отмечаем выбранный вариант
            const options = optionsContainer.querySelectorAll('.pharma-option');
            options.forEach(opt => opt.classList.remove('selected'));
            optionElem.classList.add('selected');
            
            // Сохраняем ответ
            this.state.userAnswers.push({
                questionId: optionsContainer.dataset.questionId,
                selectedId: optionElem.dataset.id,
                isCorrect: optionElem.dataset.correct === 'true'
            });
            
            // Проверяем, на все ли вопросы ответили
            const totalQuestions = document.querySelectorAll('.pharma-question-container').length;
            if (this.state.userAnswers.length === totalQuestions) {
                document.getElementById('check-results-btn').disabled = false;
            }
        },
        
        // Проверка результатов
        checkResults: function() {
            if (!this.state.testInProgress) return;
            
            this.state.testInProgress = false;
            let correctAnswers = 0;
            
            // Проходим по всем вопросам и показываем правильные/неправильные ответы
            const questionContainers = document.querySelectorAll('.pharma-question-container');
            questionContainers.forEach(container => {
                const optionsContainer = container.querySelector('.pharma-options');
                const selectedOption = optionsContainer.querySelector('.selected');
                const explanation = container.querySelector('.explanation');
                
                // Показываем объяснение
                explanation.style.display = 'block';
                
                // Отмечаем правильные и неправильные ответы
                if (selectedOption) {
                    if (selectedOption.dataset.correct === 'true') {
                        selectedOption.classList.add('correct');
                        correctAnswers++;
                        
                        // Анимация "+1" если доступна
                        if (window.QuizAnimations && window.QuizAnimations.showScoreAnimation) {
                            window.QuizAnimations.showScoreAnimation();
                        }
                    } else {
                        selectedOption.classList.add('incorrect');
                        
                        // Показываем правильный ответ
                        const options = optionsContainer.querySelectorAll('.pharma-option');
                        options.forEach(opt => {
                            if (opt.dataset.correct === 'true') {
                                opt.classList.add('correct');
                            }
                        });
                    }
                }
            });
            
            // Обновляем счет
            this.state.userScore = correctAnswers;
            
            // Показываем результат
            this.showResults(correctAnswers, questionContainers.length);
        },
        
        // Отображение результатов
        showResults: function(correctAnswers, totalQuestions) {
            const moduleContent = document.getElementById('pharma-content');
            
            // Удаляем кнопку проверки результатов
            const checkBtn = document.getElementById('check-results-btn');
            if (checkBtn) {
                checkBtn.parentNode.removeChild(checkBtn);
            }
            
            // Добавляем счет
            const scoreElement = document.createElement('div');
            scoreElement.className = 'pharma-score fade-in';
            scoreElement.textContent = `Ваш результат: ${correctAnswers} из ${totalQuestions}`;
            moduleContent.appendChild(scoreElement);
            
            // Добавляем оценку
            let assessment = '';
            if (correctAnswers === totalQuestions) {
                assessment = 'Отлично! Вы отлично знаете фармакологию!';
            } else if (correctAnswers >= totalQuestions * 0.8) {
                assessment = 'Очень хорошо! Ваши знания фармакологии на высоком уровне.';
            } else if (correctAnswers >= totalQuestions * 0.6) {
                assessment = 'Хорошо! У вас хорошие знания, но есть области для улучшения.';
            } else {
                assessment = 'Рекомендуем повторить основы фармакологии.';
            }
            
            const assessmentElement = document.createElement('div');
            assessmentElement.className = 'test-info fade-in';
            assessmentElement.textContent = assessment;
            moduleContent.appendChild(assessmentElement);
            
            // Кнопка для нового теста
            const navigation = document.createElement('div');
            navigation.className = 'pharma-navigation';
            
            const newTestBtn = document.createElement('button');
            newTestBtn.className = 'pharma-btn fade-in';
            newTestBtn.textContent = 'Новый тест';
            newTestBtn.addEventListener('click', () => this.startPharmaTest());
            
            navigation.appendChild(newTestBtn);
            moduleContent.appendChild(navigation);
        }
    };
    
    // Добавление модуля в глобальную область видимости
    window.PharmacologyModule = PharmacologyModule;
    
    // Инициализация модуля при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Модуль тестов по фармакологии загружен');
    });
})();
