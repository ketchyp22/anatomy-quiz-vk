// quiz-mode-switcher.js - Модуль для переключения между режимами приложения
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
        
        // Настраиваем обработчики событий для кнопок режима
        setupModeButtons();
        
        // Настраиваем кнопку переключения режима на странице результатов
        setupResultsModeButton();
    }
    
    // Настраиваем обработчики событий для кнопок режима
    function setupModeButtons() {
        const modeButtons = document.querySelectorAll('.quiz-mode-btn');
        
        modeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const mode = this.dataset.mode;
                setActiveMode(mode);
            });
        });
    }
    
    // Настраиваем кнопку переключения режима на странице результатов
    function setupResultsModeButton() {
        const switchModeButton = document.getElementById('switch-mode');
        if (switchModeButton) {
            switchModeButton.addEventListener('click', function() {
                showStartScreen();
            });
        }
    }
    
    // Установка активного режима
    function setActiveMode(mode) {
        if (mode === currentMode) {
            return; // Если выбран текущий режим, ничего не делаем
        }
        
        currentMode = mode;
        
        // Обновляем активную кнопку режима
        const modeButtons = document.querySelectorAll('.quiz-mode-btn');
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        console.log('Выбран режим:', mode);
        
        // Обновляем текст кнопки старта в зависимости от режима
        updateStartButton();
        
        // Обновляем описание квиза
        updateQuizDescription();
        
        // Обновляем видимость селектора сложности в зависимости от режима
        updateDifficultySelector();
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
        const descriptionElement = document.getElementById('quiz-description');
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
    
    // Обновление видимости селектора сложности
    function updateDifficultySelector() {
        const difficultySelector = document.querySelector('.difficulty-selector');
        if (!difficultySelector) return;
        
        difficultySelector.style.display = (currentMode === QUIZ_MODES.ANATOMY) ? 'block' : 'none';
    }
    
    // Показ стартового экрана
    function showStartScreen() {
        const startScreen = document.getElementById('start-screen');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        
        if (startScreen && quizContainer && resultsContainer) {
            startScreen.style.display = 'block';
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'none';
        }
    }
    
    // Запуск квиза
    function startQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        const startScreen = document.getElementById('start-screen');
        
        if (startScreen && quizContainer) {
            startScreen.style.display = 'none';
            quizContainer.style.display = 'block';
            
            // В зависимости от выбранного режима
            switch (currentMode) {
                case QUIZ_MODES.CLINICAL:
                    startClinicalModule();
                    break;
                    
                case QUIZ_MODES.PHARMA:
                    startPharmaModule();
                    break;
                    
                default:
                    startAnatomyQuiz();
            }
        }
    }
    
    // Запуск модуля клинических случаев
    function startClinicalModule() {
        if (window.ClinicalThinkingModule) {
            window.ClinicalThinkingModule.showModule();
        } else {
            console.error('Модуль клинического мышления не найден');
            alert('Модуль клинического мышления временно недоступен');
            showStartScreen();
        }
    }
    
    // Запуск модуля фармакологии  
    function startPharmaModule() {
        if (window.PharmacologyModule) {
            window.PharmacologyModule.showModule();
        } else {
            console.error('Модуль фармакологии не найден');
            alert('Модуль фармакологии временно недоступен');
            showStartScreen();
        }
    }
    
    // Запуск обычного анатомического квиза
    function startAnatomyQuiz() {
        if (window.startQuiz && typeof window.startQuiz === 'function') {
            window.startQuiz();
        } else {
            console.error('Функция запуска анатомического квиза не найдена');
            alert('Не удалось запустить квиз по анатомии. Пожалуйста, обновите страницу.');
            showStartScreen();
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
        initModeSwitcher();
        
        // Перехватываем клик по кнопке запуска
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', function(event) {
                event.preventDefault();
                startQuiz();
            });
        }
    });
})();
