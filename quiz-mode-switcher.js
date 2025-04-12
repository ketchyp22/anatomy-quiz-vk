// quiz-mode-switcher.js
(function() {
    // Режимы квиза
    const QUIZ_MODES = {
        ANATOMY: 'anatomy',
        CLINICAL: 'clinical',
        PHARMA: 'pharma'
    };
    
    // Текущий режим квиза
    let currentMode = QUIZ_MODES.ANATOMY;
    
    // Инициализация переключателя режимов
    function initModeSwitcher() {
        console.log('Инициализация переключателя режимов квиза...');
        
        // Добавляем стили для кнопок режима
        addModeSwitcherStyles();
        
        // Настраиваем обработчики событий для кнопок режима
        setupModeButtons();
        
        // Настраиваем кнопку переключения режима на странице результатов
        const switchModeButton = document.getElementById('switch-mode');
        if (switchModeButton) {
            switchModeButton.addEventListener('click', function() {
                // Скрываем экран результатов
                document.getElementById('results-container').style.display = 'none';
                // Показываем стартовый экран
                document.getElementById('start-screen').style.display = 'block';
            });
        }
    }
    
    // Добавляем стили для кнопок режимов
    function addModeSwitcherStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quiz-mode-selector {
                margin: 20px auto;
                text-align: center;
                max-width: 600px;
            }
            
            .quiz-mode-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 10px;
            }
            
            .quiz-mode-btn {
                padding: 10px 15px;
                background: linear-gradient(135deg, #4a76a8, #7BA7D7);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                flex: 1;
                max-width: 180px;
            }
            
            .quiz-mode-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .quiz-mode-btn.active {
                background: linear-gradient(135deg, #FF1493, #ff4db8);
                transform: translateY(1px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            
            /* Анимация для кнопок режима */
            @keyframes pulse-button {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .pulse-animation {
                animation: pulse-button 1.5s infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Настраиваем обработчики событий для кнопок режима
    function setupModeButtons() {
        const anatomyModeBtn = document.getElementById('anatomy-mode');
        const clinicalModeBtn = document.getElementById('clinical-mode');
        const pharmaModeBtn = document.getElementById('pharma-mode');
        
        if (!anatomyModeBtn || !clinicalModeBtn || !pharmaModeBtn) {
            console.error('Не удалось найти кнопки переключения режима');
            return;
        }
        
        // Устанавливаем обработчики событий
        anatomyModeBtn.addEventListener('click', function() {
            setActiveMode(QUIZ_MODES.ANATOMY, this);
        });
        
        clinicalModeBtn.addEventListener('click', function() {
            setActiveMode(QUIZ_MODES.CLINICAL, this);
        });
        
        pharmaModeBtn.addEventListener('click', function() {
            setActiveMode(QUIZ_MODES.PHARMA, this);
        });
        
        // Добавляем анимацию пульсации для новых режимов
        clinicalModeBtn.classList.add('pulse-animation');
        pharmaModeBtn.classList.add('pulse-animation');
    }
    
    // Установка активного режима
    function setActiveMode(mode, button) {
        currentMode = mode;
        
        // Обновляем активную кнопку
        const modeButtons = document.querySelectorAll('.quiz-mode-btn');
        modeButtons.forEach(btn => {
            btn.classList.remove('active');
            // Удаляем анимацию пульсации при клике
            btn.classList.remove('pulse-animation');
        });
        
        if (button) {
            button.classList.add('active');
        }
        
        console.log('Выбран режим:', mode);
        
        // Обновляем текст кнопки старта в зависимости от режима
        updateStartButton();
        
        // Обновляем описание квиза
        updateQuizDescription();
    }
    
    // Обновление текста кнопки старта
    function updateStartButton() {
        const startButton = document.getElementById('start-quiz');
        if (!startButton) return;
        
        switch (currentMode) {
            case QUIZ_MODES.CLINICAL:
                startButton.textContent = 'Начать клинический случай';
                break;
            case QUIZ_MODES.PHARMA:
                startButton.textContent = 'Начать тест по фармакологии';
                break;
            default:
                startButton.textContent = 'Начать тест';
        }
    }
    
    // Обновление описания квиза
    function updateQuizDescription() {
        const descriptionElement = document.querySelector('#start-screen p');
        if (!descriptionElement) return;
        
        switch (currentMode) {
            case QUIZ_MODES.CLINICAL:
                descriptionElement.textContent = 'Развивайте клиническое мышление, анализируя сложные случаи из практики!';
                break;
            case QUIZ_MODES.PHARMA:
                descriptionElement.textContent = 'Проверьте свои знания в области фармакологии и лекарственных препаратов!';
                break;
            default:
                descriptionElement.textContent = 'Проверьте свои знания анатомии человека!';
        }
    }
    
    // Запуск квиза
    function startQuiz() {
        const clinicalPharmaContainer = document.getElementById('clinical-pharma-container');
        const quizContainer = document.getElementById('quiz-container');
        const startScreen = document.getElementById('start-screen');
        
        startScreen.style.display = 'none';
        
        // В зависимости от выбранного режима
        switch (currentMode) {
            case QUIZ_MODES.CLINICAL:
                // Запускаем клинический случай
                if (clinicalPharmaContainer) {
                    clinicalPharmaContainer.style.display = 'block';
                    
                    // Вызываем функцию из модуля клинического мышления
                    if (window.ClinicalPharmaModule) {
                        window.ClinicalPharmaModule.init(clinicalPharmaContainer);
                        window.ClinicalPharmaModule.switchModule('clinical-case');
                    }
                }
                break;
                
            case QUIZ_MODES.PHARMA:
                // Запускаем тест по фармакологии
                if (clinicalPharmaContainer) {
                    clinicalPharmaContainer.style.display = 'block';
                    
                    // Вызываем функцию из модуля фармакологии
                    if (window.ClinicalPharmaModule) {
                        window.ClinicalPharmaModule.init(clinicalPharmaContainer);
                        window.ClinicalPharmaModule.switchModule('pharma-quiz');
                    }
                }
                break;
                
            default:
                // Запускаем обычный анатомический квиз
                if (quizContainer) {
                    quizContainer.style.display = 'block';
                    
                    // Вызываем оригинальную функцию запуска квиза, если она доступна
                    if (window.startQuiz && typeof window.startQuiz === 'function') {
                        window.startQuiz();
                    }
                }
        }
    }
    
    // Экспортируем функции для использования в основном приложении
    window.QuizModeSwitcher = {
        init: initModeSwitcher,
        startQuiz: startQuiz,
        getCurrentMode: function() { return currentMode; }
    };
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Инициализируем переключатель режимов
        initModeSwitcher();
        
        // Перехватываем клик по кнопке запуска
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', function(event) {
                // Предотвращаем действие по умолчанию, чтобы наш обработчик работал вместо оригинального
                event.preventDefault();
                event.stopPropagation();
                
                // Запускаем квиз в выбранном режиме
                startQuiz();
            });
        }
    });
})();
