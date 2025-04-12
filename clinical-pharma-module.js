// clinical-pharma-module.js
(function() {
    // Модуль для клинического мышления и фармакологии
    const ClinicalPharmaModule = {
        // Типы модулей
        types: {
            CLINICAL_CASE: 'clinical-case',
            PHARMA_QUIZ: 'pharma-quiz'
        },
        
        // Состояние модуля
        state: {
            currentCase: null,
            currentCaseStep: 0,
            userAnswers: [],
            userScore: 0
        },
        
        // База данных клинических случаев
        clinicalCases: [
            {
                id: 'cc-001',
                title: 'Острая боль в животе',
                description: 'Пациент 45 лет обратился с жалобами на острую боль в правом нижнем квадранте живота, которая началась около 24 часов назад. Температура 38.2°C.',
                steps: [
                    {
                        question: 'Какие дополнительные симптомы наиболее важно выяснить?',
                        options: [
                            { id: 'a', text: 'Наличие тошноты и рвоты', isCorrect: true },
                            { id: 'b', text: 'Аллергические реакции в анамнезе', isCorrect: false },
                            { id: 'c', text: 'Хронические заболевания почек', isCorrect: false },
                            { id: 'd', text: 'Наличие болей в суставах', isCorrect: false }
                        ],
                        explanation: 'Тошнота и рвота часто сопровождают острый аппендицит и другие состояния с острой болью в животе.'
                    },
                    {
                        question: 'Пациент сообщает о тошноте и отсутствии аппетита. Какой наиболее вероятный диагноз?',
                        options: [
                            { id: 'a', text: 'Острый аппендицит', isCorrect: true },
                            { id: 'b', text: 'Острый холецистит', isCorrect: false },
                            { id: 'c', text: 'Мочекаменная болезнь', isCorrect: false },
                            { id: 'd', text: 'Воспалительное заболевание кишечника', isCorrect: false }
                        ],
                        explanation: 'Симптомы указывают на острый аппендицит: боль в правом нижнем квадранте, повышение температуры, тошнота.'
                    },
                    {
                        question: 'Какое исследование наиболее информативно для подтверждения предполагаемого диагноза?',
                        options: [
                            { id: 'a', text: 'УЗИ брюшной полости', isCorrect: true },
                            { id: 'b', text: 'Электрокардиограмма', isCorrect: false },
                            { id: 'c', text: 'Рентгенография грудной клетки', isCorrect: false },
                            { id: 'd', text: 'Определение уровня холестерина', isCorrect: false }
                        ],
                        explanation: 'УЗИ брюшной полости позволяет визуализировать аппендикс и выявить признаки воспаления.'
                    }
                ],
                conclusion: 'Острый аппендицит - частая причина острой боли в правом нижнем квадранте живота. Раннее выявление и хирургическое вмешательство снижают риск осложнений. Ключевые симптомы: локализованная боль, тошнота, повышение температуры.'
            },
            {
                id: 'cc-002',
                title: 'Головная боль и повышенное давление',
                description: 'Пациентка 58 лет жалуется на частые головные боли в затылочной области, головокружение и периодическое ощущение шума в ушах. При измерении АД: 160/95 мм рт. ст.',
                steps: [
                    {
                        question: 'Какие факторы риска важно уточнить у пациентки?',
                        options: [
                            { id: 'a', text: 'Наследственность, избыточный вес, стресс', isCorrect: true },
                            { id: 'b', text: 'Частота физических нагрузок', isCorrect: false },
                            { id: 'c', text: 'Наличие аллергических реакций', isCorrect: false },
                            { id: 'd', text: 'Употребление молочных продуктов', isCorrect: false }
                        ],
                        explanation: 'Наследственность, избыточный вес и стресс являются ключевыми факторами риска артериальной гипертензии.'
                    },
                    {
                        question: 'Какие дополнительные исследования необходимо назначить в первую очередь?',
                        options: [
                            { id: 'a', text: 'ЭКГ, биохимический анализ крови, УЗИ почек', isCorrect: true },
                            { id: 'b', text: 'МРТ головного мозга', isCorrect: false },
                            { id: 'c', text: 'Гастроскопия', isCorrect: false },
                            { id: 'd', text: 'Рентгенография суставов', isCorrect: false }
                        ],
                        explanation: 'ЭКГ, биохимический анализ крови и УЗИ почек помогают исключить вторичную гипертензию и оценить поражение органов-мишеней.'
                    },
                    {
                        question: 'Какую группу антигипертензивных препаратов наиболее целесообразно назначить в первую очередь?',
                        options: [
                            { id: 'a', text: 'Ингибиторы АПФ', isCorrect: true },
                            { id: 'b', text: 'Антибиотики', isCorrect: false },
                            { id: 'c', text: 'Гормональные препараты', isCorrect: false },
                            { id: 'd', text: 'Нестероидные противовоспалительные', isCorrect: false }
                        ],
                        explanation: 'Ингибиторы АПФ являются препаратами первой линии при артериальной гипертензии, особенно у пожилых пациентов.'
                    }
                ],
                conclusion: 'Артериальная гипертензия требует комплексного подхода: диагностика вторичных причин, оценка риска сердечно-сосудистых осложнений, подбор индивидуальной терапии. Регулярный контроль АД и приверженность к лечению критически важны.'
            }
        ],
        
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
            }
        ],
        
        // Инициализация модуля
        init: function(container) {
            this.container = container || document.getElementById('quiz-container');
            this.addCSS();
            this.createModuleSelector();
        },
        
        // Добавление стилей для модуля
        addCSS: function() {
            const style = document.createElement('style');
            style.textContent = `
                .clinical-module {
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    max-width: 800px;
                    margin: 0 auto 20px;
                }
                
                .module-selector {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                    gap: 10px;
                }
                
                .module-btn {
                    padding: 10px 15px;
                    background: linear-gradient(135deg, #FF1493, #ff4db8);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }
                
                .module-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }
                
                .module-btn.active {
                    background: linear-gradient(135deg, #ff4db8, #FF1493);
                    transform: translateY(1px);
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                }
                
                .case-title {
                    font-size: 1.5em;
                    color: #FF1493;
                    margin-bottom: 10px;
                    text-align: center;
                }
                
                .case-description {
                    background-color: #f8f8f8;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #FF1493;
                    margin-bottom: 15px;
                }
                
                .case-question {
                    font-weight: bold;
                    margin: 15px 0 10px;
                    color: #333;
                }
                
                .case-options {
                    display: grid;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .case-option {
                    padding: 12px 15px;
                    background-color: #f1f1f1;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                
                .case-option:hover {
                    background-color: #e8e8e8;
                    transform: translateX(5px);
                }
                
                .case-option.selected {
                    border-color: #FF1493;
                    background-color: #fff0f7;
                }
                
                .case-option.correct {
                    border-color: #4CAF50;
                    background-color: #ebffef;
                }
                
                .case-option.incorrect {
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
                
                .case-navigation {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .case-btn {
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #FF1493, #ff4db8);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                }
                
                .case-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                
                .case-btn:disabled {
                    background: #cccccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .case-conclusion {
                    background-color: #f1f8e9;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 4px solid #4CAF50;
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
                
                .progress-bar {
                    height: 8px;
                    background-color: #f1f1f1;
                    border-radius: 4px;
                    margin: 10px 0 20px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(to right, #FF1493, #ff4db8);
                    width: 0%;
                    transition: width 0.5s;
                    border-radius: 4px;
                }
                
                .case-score {
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #FF1493;
                    margin: 10px 0;
                }
                
                .heart-beat {
                    animation: heartbeat 1.2s infinite;
                }
                
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .fade-in {
                    animation: fadein 0.5s;
                }
                
                @keyframes fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        },
        
        // Создание селектора модулей
        createModuleSelector: function() {
            // Создаем обертку для модуля
            const moduleWrapper = document.createElement('div');
            moduleWrapper.className = 'clinical-module';
            moduleWrapper.id = 'clinical-pharma-wrapper';
            
            // Создаем заголовок
            const moduleTitle = document.createElement('h2');
            moduleTitle.textContent = 'Развитие клинического мышления';
            moduleTitle.className = 'case-title heart-beat';
            moduleWrapper.appendChild(moduleTitle);
            
            // Создаем селектор модулей
            const moduleSelector = document.createElement('div');
            moduleSelector.className = 'module-selector';
            
            // Кнопка для клинических случаев
            const clinicalBtn = document.createElement('button');
            clinicalBtn.className = 'module-btn';
            clinicalBtn.textContent = 'Клинические случаи';
            clinicalBtn.addEventListener('click', () => this.switchModule(this.types.CLINICAL_CASE));
            moduleSelector.appendChild(clinicalBtn);
            
            // Кнопка для фармакологии
            const pharmaBtn = document.createElement('button');
            pharmaBtn.className = 'module-btn';
            pharmaBtn.textContent = 'Тесты по фармакологии';
            pharmaBtn.addEventListener('click', () => this.switchModule(this.types.PHARMA_QUIZ));
            moduleSelector.appendChild(pharmaBtn);
            
            moduleWrapper.appendChild(moduleSelector);
            
            // Контейнер для содержимого модуля
            const moduleContent = document.createElement('div');
            moduleContent.className = 'module-content';
            moduleContent.id = 'module-content';
            moduleWrapper.appendChild(moduleContent);
            
            // Добавляем модуль на страницу
            const targetElement = document.getElementById('result-container');
            if (targetElement) {
                // Вставляем перед результатами
                targetElement.parentNode.insertBefore(moduleWrapper, targetElement);
            } else {
                // Если контейнер результатов не найден, добавляем в конец контейнера викторины
                this.container.appendChild(moduleWrapper);
            }
        },
        
        // Переключение между модулями
        switchModule: function(moduleType) {
            // Обновляем активную кнопку
            const buttons = document.querySelectorAll('.module-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            const moduleContent = document.getElementById('module-content');
            moduleContent.innerHTML = '';
            moduleContent.classList.remove('visible');
            
            // Небольшая задержка для анимации
            setTimeout(() => {
                if (moduleType === this.types.CLINICAL_CASE) {
                    document.querySelector('.module-btn:nth-child(1)').classList.add('active');
                    this.startClinicalCase();
                } else if (moduleType === this.types.PHARMA_QUIZ) {
                    document.querySelector('.module-btn:nth-child(2)').classList.add('active');
                    this.startPharmaQuiz();
                }
                
                moduleContent.classList.add('visible');
            }, 300);
        },
        
        // Запуск клинического случая
        startClinicalCase: function() {
            // Выбираем случайный клинический случай
            const randomIndex = Math.floor(Math.random() * this.clinicalCases.length);
            this.state.currentCase = this.clinicalCases[randomIndex];
            this.state.currentCaseStep = 0;
            this.state.userAnswers = [];
            this.state.userScore = 0;
            
            this.renderClinicalCase();
        },
        
        // Отрисовка клинического случая
        renderClinicalCase: function() {
            const moduleContent = document.getElementById('module-content');
            moduleContent.innerHTML = '';
            
            // Текущий случай
            const currentCase = this.state.currentCase;
            
            // Заголовок случая
            const caseTitle = document.createElement('h3');
            caseTitle.className = 'case-title fade-in';
            caseTitle.textContent = currentCase.title;
            moduleContent.appendChild(caseTitle);
            
            // Описание случая
            const caseDescription = document.createElement('div');
            caseDescription.className = 'case-description fade-in';
            caseDescription.textContent = currentCase.description;
            moduleContent.appendChild(caseDescription);
            
            // Прогресс-бар
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = `${(this.state.currentCaseStep / currentCase.steps.length) * 100}%`;
            progressBar.appendChild(progressFill);
            moduleContent.appendChild(progressBar);
            
            // Если все шаги пройдены, показываем заключение
            if (this.state.currentCaseStep >= currentCase.steps.length) {
                this.renderCaseConclusion();
                return;
            }
            
            // Текущий шаг
            const currentStep = currentCase.steps[this.state.currentCaseStep];
            
            // Вопрос
            const questionElem = document.createElement('div');
            questionElem.className = 'case-question fade-in';
            questionElem.textContent = currentStep.question;
            moduleContent.appendChild(questionElem);
            
            // Варианты ответов
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'case-options';
            
            currentStep.options.forEach((option) => {
                const optionElem = document.createElement('div');
                optionElem.className = 'case-option fade-in';
                optionElem.textContent = option.text;
                optionElem.dataset.id = option.id;
                optionElem.dataset.correct = option.isCorrect;
                
                optionElem.addEventListener('click', (e) => this.selectOption(e.target));
                
                optionsContainer.appendChild(optionElem);
            });
            
            moduleContent.appendChild(optionsContainer);
            
            // Блок для объяснения (будет показан после выбора ответа)
            const explanation = document.createElement('div');
            explanation.className = 'explanation';
            explanation.id = 'explanation';
            explanation.textContent = currentStep.explanation;
            moduleContent.appendChild(explanation);
            
            // Кнопки навигации
            const navigation = document.createElement('div');
            navigation.className = 'case-navigation';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'case-btn';
            nextBtn.textContent = 'Далее';
            nextBtn.id = 'next-case-btn';
            nextBtn.disabled = true;
            nextBtn.addEventListener('click', () => this.nextCaseStep());
            
            navigation.appendChild(nextBtn);
            moduleContent.appendChild(navigation);
        },
        
        // Выбор варианта ответа
        selectOption: function(optionElem) {
            // Если ответ уже выбран, ничего не делаем
            if (document.querySelector('.case-option.selected')) {
                return;
            }
            
            const options = document.querySelectorAll('.case-option');
            options.forEach(opt => {
                if (opt === optionElem) {
                    opt.classList.add('selected');
                    
                    // Сохраняем ответ пользователя
                    this.state.userAnswers.push({
                        step: this.state.currentCaseStep,
                        selectedId: opt.dataset.id,
                        isCorrect: opt.dataset.correct === 'true'
                    });
                    
                    // Если ответ правильный
                    if (opt.dataset.correct === 'true') {
                        opt.classList.add('correct');
                        this.state.userScore++;
                        
                        // Анимация "+1"
                        if (window.QuizAnimations && window.QuizAnimations.showScoreAnimation) {
                            window.QuizAnimations.showScoreAnimation();
                        }
                    } else {
                        opt.classList.add('incorrect');
                        
                        // Показываем правильный ответ
                        options.forEach(o => {
                            if (o.dataset.correct === 'true') {
                                o.classList.add('correct');
                            }
                        });
                    }
                }
            });
            
            // Показываем объяснение
            const explanation = document.getElementById('explanation');
            explanation.style.display = 'block';
            
            // Разблокируем кнопку "Далее"
            document.getElementById('next-case-btn').disabled = false;
        },
        
        // Переход к следующему шагу
        nextCaseStep: function() {
            this.state.currentCaseStep++;
            
            // Обновляем прогресс-бар с анимацией
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${(this.state.currentCaseStep / this.state.currentCase.steps.length) * 100}%`;
            }
            
            // Небольшая задержка для анимации
            setTimeout(() => {
                this.renderClinicalCase();
            }, 300);
        },
        
        // Отображение заключения по клиническому случаю
        renderCaseConclusion: function() {
            const moduleContent = document.getElementById('module-content');
            
            // Оценка
            const scoreElem = document.createElement('div');
            scoreElem.className = 'case-score fade-in';
            scoreElem.textContent = `Ваш результат: ${this.state.userScore} из ${this.state.currentCase.steps.length}`;
            moduleContent.appendChild(scoreElem);
            
            // Заключение
            const conclusion = document.createElement('div');
            conclusion.className = 'case-conclusion fade-in';
            conclusion.textContent = this.state.currentCase.conclusion;
            moduleContent.appendChild(conclusion);
            
            // Кнопка для нового случая
            const newCaseBtn = document.createElement('div');
            newCaseBtn.className = 'case-navigation';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'case-btn';
            nextBtn.textContent = 'Новый случай';
            nextBtn.addEventListener('click', () => this.startClinicalCase());
            
            newCaseBtn.appendChild(nextBtn);
            moduleContent.appendChild(newCaseBtn);
        },
        
        // Запуск теста по фармакологии
        startPharmaQuiz: function() {
            const moduleContent = document.getElementById('module-content');
            moduleContent.innerHTML = '';
            
            // Заголовок
            const quizTitle = document.createElement('h3');
            quizTitle.className = 'case-title fade-in';
            quizTitle.textContent = 'Тест по фармакологии';
            moduleContent.appendChild(quizTitle);
            
            // Выбираем 5 случайных вопросов из базы
            const randomQuestions = this.getRandomPharmaQuestions(5);
            
            // Создаем контейнер для вопросов
            const questionsWrapper = document.createElement('div');
            questionsWrapper.className = 'pharma-questions';
            
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
                questionText.className = 'case-question';
                questionText.textContent = question.question;
                questionContainer.appendChild(questionText);
                
                // Варианты ответов
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'case-options';
                optionsContainer.dataset.questionId = question.id;
                
                question.options.forEach((option) => {
                    const optionElem = document.createElement('div');
                    optionElem.className = 'case-option';
                    optionElem.textContent = option.text;
                    optionElem.dataset.id = option.id;
                    optionElem.dataset.correct = option.isCorrect;
                    
                    optionElem.addEventListener('click', (e) => this.selectPharmaOption(e.target, questionContainer));
                    
                    optionsContainer.appendChild(optionElem);
                });
                
                questionContainer.appendChild(optionsContainer);
                
                // Блок для объяснения
                const explanation = document.createElement('div');
                explanation.className = 'explanation';
                explanation.style.display = 'none';
                explanation.textContent = question.explanation;
                questionContainer.appendChild(explanation);
                
                questionsWrapper.appendChild(questionContainer);
            });
            
            moduleContent.appendChild(questionsWrapper);
            
            // Кнопка проверки результатов (изначально скрыта)
            const checkResultsBtn = document.createElement('button');
            checkResultsBtn.className = 'case-btn';
            checkResultsBtn.textContent = 'Проверить результаты';
            checkResultsBtn.id = 'check-pharma-results';
            checkResultsBtn.style.display = 'none';
            checkResultsBtn.addEventListener('click', () => this.checkPharmaResults());
            
            const navigation = document.createElement('div');
            navigation.className = 'case-navigation';
            navigation.appendChild(checkResultsBtn);
            
            moduleContent.appendChild(navigation);
        },
        
        // Выбор случайных вопросов по фармакологии
        getRandomPharmaQuestions: function(count) {
            const shuffled = [...this.pharmaQuestions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        },
        
        // Выбор варианта ответа в тесте по фармакологии
        selectPharmaOption: function(optionElem, questionContainer) {
            // Получаем контейнер с вариантами ответов
            const optionsContainer = optionElem.parentElement;
            
            // Если ответ уже выбран в этом вопросе, ничего не делаем
            if (optionsContainer.querySelector('.selected')) {
                return;
            }
            
            // Отмечаем выбранный вариант
            optionElem.classList.add('selected');
            
            // Считаем, сколько вопросов уже отвечено
            const answeredQuestions = document.querySelectorAll('.case-option.selected').length;
            const totalQuestions = document.querySelectorAll('.pharma-question-container').length;
            
            // Если ответили на все вопросы, показываем кнопку проверки
            if (answeredQuestions === totalQuestions) {
                document.getElementById('check-pharma-results').style.display = 'block';
            }
        },
        
        // Проверка результатов теста по фармакологии
        checkPharmaResults: function() {
            let correctAnswers = 0;
            const questionContainers = document.querySelectorAll('.pharma-question-container');
            
            questionContainers.forEach(container => {
                const optionsContainer = container.querySelector('.case-options');
                const selectedOption = optionsContainer.querySelector('.selected');
                const explanation = container.querySelector('.explanation');
                
                // Показываем объяснение
                explanation.style.display = 'block';
                
                // Если выбран правильный ответ
                if (selectedOption && selectedOption.dataset.correct === 'true') {
                    selectedOption.classList.add('correct');
                    correctAnswers++;
                    
                    // Анимация "+1" если доступна
                    if (window.QuizAnimations && window.QuizAnimations.showScoreAnimation) {
                        window.QuizAnimations.showScoreAnimation();
                    }
                } 
                // Если выбран неправильный ответ
                else if (selectedOption) {
                    selectedOption.classList.add('incorrect');
                    
                    // Показываем правильный ответ
                    const options = optionsContainer.querySelectorAll('.case-option');
                    options.forEach(opt => {
                        if (opt.dataset.correct === 'true') {
                            opt.classList.add('correct');
                        }
                    });
                }
            });
            
            // Скрываем кнопку проверки
            document.getElementById('check-pharma-results').style.display = 'none';
            
            // Создаем и показываем результат
            const moduleContent = document.getElementById('module-content');
            
            // Удаляем предыдущий результат, если он есть
            const existingResult = document.querySelector('.pharma-result');
            if (existingResult) {
                existingResult.remove();
            }
            
            const resultElem = document.createElement('div');
            resultElem.className = 'case-score fade-in pharma-result';
            resultElem.textContent = `Ваш результат: ${correctAnswers} из ${questionContainers.length}`;
            moduleContent.appendChild(resultElem);
            
            // Кнопка для нового теста
            const newTestBtn = document.createElement('button');
            newTestBtn.className = 'case-btn fade-in';
            newTestBtn.textContent = 'Новый тест';
            newTestBtn.addEventListener('click', () => this.startPharmaQuiz());
            
            const navigation = document.createElement('div');
            navigation.className = 'case-navigation';
            navigation.appendChild(newTestBtn);
            
            moduleContent.appendChild(navigation);
        }
    };
    
    // Добавление модуля в глобальную область видимости
    window.ClinicalPharmaModule = ClinicalPharmaModule;
    
    // Инициализация модуля при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Проверяем, загружено ли уже приложение
        if (document.getElementById('quiz-container') || document.getElementById('start-screen')) {
            setTimeout(() => {
                ClinicalPharmaModule.init();
            }, 500);
        }
    });
    
    // Запуск модуля при полной загрузке страницы
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!document.getElementById('clinical-pharma-wrapper')) {
                ClinicalPharmaModule.init();
            }
        }, 800);
    });
})();
