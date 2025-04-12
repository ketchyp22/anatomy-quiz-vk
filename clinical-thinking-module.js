// clinical-thinking-module.js - Модуль для развития клинического мышления
(function() {
    // Модуль для клинического мышления
    const ClinicalThinkingModule = {
        // Состояние модуля
        state: {
            currentCase: null,
            currentCaseStep: 0,
            userAnswers: [],
            userScore: 0,
            moduleInitialized: false,
            moduleVisible: false
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
            },
            {
                id: 'cc-003',
                title: 'Одышка и кашель',
                description: 'Пациент 67 лет, курильщик со стажем 40 лет, жалуется на прогрессирующую одышку при физической нагрузке, утренний кашель с мокротой и периодические свистящие хрипы.',
                steps: [
                    {
                        question: 'Какое заболевание наиболее вероятно у данного пациента?',
                        options: [
                            { id: 'a', text: 'ХОБЛ (хроническая обструктивная болезнь легких)', isCorrect: true },
                            { id: 'b', text: 'Бронхиальная астма', isCorrect: false },
                            { id: 'c', text: 'Пневмония', isCorrect: false },
                            { id: 'd', text: 'Туберкулез легких', isCorrect: false }
                        ],
                        explanation: 'Длительный стаж курения, прогрессирующая одышка и утренний кашель с мокротой - типичные симптомы ХОБЛ.'
                    },
                    {
                        question: 'Какой метод исследования наиболее информативен для подтверждения диагноза?',
                        options: [
                            { id: 'a', text: 'Спирометрия', isCorrect: true },
                            { id: 'b', text: 'Общий анализ крови', isCorrect: false },
                            { id: 'c', text: 'Электрокардиография', isCorrect: false },
                            { id: 'd', text: 'Измерение артериального давления', isCorrect: false }
                        ],
                        explanation: 'Спирометрия позволяет выявить обструктивные нарушения вентиляции - основной признак ХОБЛ.'
                    },
                    {
                        question: 'Какие препараты являются основой базисной терапии ХОБЛ?',
                        options: [
                            { id: 'a', text: 'Бронходилататоры длительного действия', isCorrect: true },
                            { id: 'b', text: 'Антибиотики', isCorrect: false },
                            { id: 'c', text: 'Муколитики', isCorrect: false },
                            { id: 'd', text: 'Антигистаминные препараты', isCorrect: false }
                        ],
                        explanation: 'Бронходилататоры длительного действия (β2-агонисты и антихолинергические препараты) - основа поддерживающей терапии ХОБЛ.'
                    }
                ],
                conclusion: 'ХОБЛ - прогрессирующее заболевание, требующее комплексного подхода: отказ от курения, бронходилатационная терапия, реабилитация. Ранняя диагностика и адекватная терапия могут существенно улучшить качество жизни и замедлить прогрессирование заболевания.'
            }
        ],
        
        // Инициализация модуля
        init: function(container) {
            // Проверяем, был ли уже инициализирован модуль
            if (this.state.moduleInitialized) return;
            
            console.log('Инициализация модуля клинического мышления...');
            
            this.container = container || document.getElementById('clinical-thinking-container');
            
            // Если контейнера нет, создаем его
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'clinical-thinking-container';
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
            const style = document.createElement('style');
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
                
                .clinical-module {
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    max-width: 800px;
                    margin: 0 auto 20px;
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
                
                /* Адаптивность для мобильных устройств */
                @media (max-width: 600px) {
                    .clinical-module {
                        padding: 15px;
                    }
                }
            `;
            document.head.appendChild(style);
        },
        
        // Создание обертки для модуля
        createModuleWrapper: function() {
            // Создаем обертку для модуля
            const moduleWrapper = document.createElement('div');
            moduleWrapper.className = 'clinical-module';
            moduleWrapper.id = 'clinical-thinking-wrapper';
            
            // Создаем кнопку закрытия
            const closeButton = document.createElement('div');
            closeButton.className = 'close-module';
            closeButton.addEventListener('click', () => this.hideModule());
            this.container.appendChild(closeButton);
            
            // Создаем заголовок
            const moduleTitle = document.createElement('h2');
            moduleTitle.textContent = 'Развитие клинического мышления';
            moduleTitle.className = 'case-title heart-beat';
            moduleWrapper.appendChild(moduleTitle);
            
            // Контейнер для содержимого модуля
            const moduleContent = document.createElement('div');
            moduleContent.className = 'module-content';
            moduleContent.id = 'clinical-content';
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
            
            // Запускаем клинический случай
            setTimeout(() => {
                this.startClinicalCase();
            }, 100);
        },
        
        // Скрыть модуль
        hideModule: function() {
            this.container.style.display = 'none';
            this.state.moduleVisible = false;
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
            const moduleContent = document.getElementById('clinical-content');
            moduleContent.innerHTML = '';
            moduleContent.classList.remove('visible');
            
            // Задержка для анимации
            setTimeout(() => {
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
                    moduleContent.classList.add('visible');
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
                
                moduleContent.classList.add('visible');
            }, 300);
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
            const moduleContent = document.getElementById('clinical-content');
            
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
        }
    };
    
    // Добавление модуля в глобальную область видимости
    window.ClinicalThinkingModule = ClinicalThinkingModule;
    
    // Инициализация модуля при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Модуль клинического мышления загружен');
    });
})();
