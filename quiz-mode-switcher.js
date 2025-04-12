// quiz-mode-switcher.js - Улучшенный модуль для переключения между режимами приложения
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
        
        // Добавляем стили для улучшенного пользовательского интерфейса
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
    
    // Добавляем стили для кнопок режимов и UI
    function addModeSwitcherStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Стили для главного меню */
            .main-menu-container {
                max-width: 600px;
                margin: 20px auto;
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
            
            /* Заголовок раздела меню */
            .menu-section-title {
                font-size: 18px;
                color: var(--medical-dark-grey);
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            
            .menu-section-title::before,
            .menu-section-title::after {
                content: '';
                height: 1px;
                flex-grow: 1;
                background-color: rgba(74, 137, 220, 0.3);
                margin: 0 10px;
            }
            
            /* Контейнер для режимов */
            .quiz-modes-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            /* Панель режима */
            .mode-panel {
                background: white;
                border-radius: 12px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                transition: all 0.3s ease;
                cursor: pointer;
                border: 2px solid transparent;
            }
            
            .mode-panel:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            }
            
            .mode-panel.active {
                border-color: var(--medical-blue);
                background-color: rgba(74, 137, 220, 0.05);
            }
            
            /* Заголовок панели режима */
            .mode-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--medical-blue);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .mode-title .icon {
                font-size: 22px;
            }
            
            /* Описание режима */
            .mode-description {
                font-size: 14px;
                color: var(--medical-dark-grey);
                margin-bottom: 12px;
                line-height: 1.4;
            }
            
            /* Контейнер для опций режима */
            .mode-options {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                align-items: center;
            }
            
            /* Для анатомического режима - переключатель сложности */
            .difficulty-toggle {
                display: flex;
                background-color: #f0f2f5;
                border-radius: 20px;
                padding: 3px;
                position: relative;
                overflow: hidden;
            }
            
            .difficulty-option {
                padding: 6px 12px;
                border-radius: 17px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                position: relative;
                z-index: 2;
                color: var(--medical-dark-grey);
                transition: color 0.3s;
            }
            
            .difficulty-slider {
                position: absolute;
                top: 3px;
                left: 3px;
                height: calc(100% - 6px);
                border-radius: 17px;
                background-color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                z-index: 1;
            }
            
            .difficulty-toggle[data-level="normal"] .difficulty-slider {
                transform: translateX(0);
                width: 60px;
            }
            
            .difficulty-toggle[data-level="hard"] .difficulty-slider {
                transform: translateX(65px);
                width: 55px;
                background-color: rgba(233, 87, 63, 0.2);
            }
            
            .difficulty-toggle[data-level="normal"] .difficulty-option:first-child,
            .difficulty-toggle[data-level="hard"] .difficulty-option:last-child {
                color: var(--text-color);
                font-weight: 600;
            }
            
            .difficulty-toggle[data-level="hard"] .difficulty-option:last-child {
                color: var(--medical-red);
            }
            
            /* Для других режимов - бейдж "Скоро" */
            .coming-soon-badge {
                font-size: 12px;
                background-color: #f0f2f5;
                color: var(--medical-dark-grey);
                padding: 4px 8px;
                border-radius: 10px;
                font-weight: 500;
                display: none; /* По умолчанию скрыт */
            }
            
            /* Бейдж "Новый" */
            .new-badge {
                font-size: 10px;
                background-color: var(--medical-red);
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: 600;
                text-transform: uppercase;
                position: relative;
                margin-left: 5px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { 
                    box-shadow: 0 0 0 0 rgba(233, 87, 63, 0.7);
                }
                70% { 
                    box-shadow: 0 0 0 5px rgba(233, 87, 63, 0);
                }
                100% { 
                    box-shadow: 0 0 0 0 rgba(233, 87, 63, 0);
                }
            }
            
            /* Медиа-запрос для мобильных устройств */
            @media (max-width: 600px) {
                .mode-options {
                    justify-content: center;
                    margin-top: 10px;
                }
                
                .main-menu-container {
                    gap: 15px;
                }
                
                .mode-title {
                    font-size: 16px;
                }
                
                .mode-description {
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создание и настройка интерфейса меню выбора режима
    function setupModeButtons() {
        // Находим стартовый экран
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) {
            console.error('Не найден стартовый экран для добавления меню режимов');
            return;
        }
        
        // Находим текущее меню, если оно существует, чтобы удалить
        const existingModeSelector = document.querySelector('.quiz-mode-selector');
        const existingDifficultySelector = document.querySelector('.difficulty-selector');
        
        if (existingModeSelector) {
            existingModeSelector.remove();
        }
        
        if (existingDifficultySelector) {
            existingDifficultySelector.remove();
        }
        
        // Создаем новый контейнер для главного меню
        const mainMenuContainer = document.createElement('div');
        mainMenuContainer.className = 'main-menu-container';
        
        // Добавляем заголовок раздела
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'menu-section-title';
        sectionTitle.textContent = 'Выберите режим';
        mainMenuContainer.appendChild(sectionTitle);
        
        // Создаем контейнер для панелей режимов
        const modesContainer = document.createElement('div');
        modesContainer.className = 'quiz-modes-container';
        
        // 1. Панель анатомического режима
        const anatomyPanel = createModePanel(
            '🦴 Анатомия', 
            'Проверьте свои знания анатомии человека с вопросами разной сложности.',
            QUIZ_MODES.ANATOMY,
            createDifficultyToggle()
        );
        
        // 2. Панель клинического мышления
        const clinicalPanel = createModePanel(
            '🩺 Клиническое мышление', 
            'Развивайте клиническое мышление, анализируя сложные случаи из практики!',
            QUIZ_MODES.CLINICAL,
            document.createTextNode('')  // Пустой узел вместо опций
        );
        
        // 3. Панель фармакологии
        const pharmaPanel = createModePanel(
            '💊 Фармакология', 
            'Проверьте свои знания в области фармакологии и лекарственных препаратов!',
            QUIZ_MODES.PHARMA,
            document.createTextNode('')  // Пустой узел вместо опций
        );
        
        // Добавляем все панели в контейнер
        modesContainer.appendChild(anatomyPanel);
        modesContainer.appendChild(clinicalPanel);
        modesContainer.appendChild(pharmaPanel);
        
        // Добавляем контейнер режимов в главное меню
        mainMenuContainer.appendChild(modesContainer);
        
        // Находим подходящее место для вставки и добавляем наше меню
        const userInfo = document.getElementById('user-info');
        if (userInfo && userInfo.nextSibling) {
            startScreen.insertBefore(mainMenuContainer, userInfo.nextSibling);
        } else {
            // Если не удалось найти user-info, просто добавляем в начало
            startScreen.prepend(mainMenuContainer);
        }
        
        // Устанавливаем обработчики событий для панелей
        setupPanelHandlers();
        
        // Устанавливаем текущий режим
        setActiveMode(currentMode);
    }
    
    // Создание панели режима
    function createModePanel(title, description, modeId, optionsElement) {
        const panel = document.createElement('div');
        panel.className = 'mode-panel';
        panel.dataset.mode = modeId;
        
        // Заголовок
        const titleElement = document.createElement('div');
        titleElement.className = 'mode-title';
        titleElement.innerHTML = title;
        
        // Добавляем бейдж "Новый" для клинического мышления и фармакологии
        if (modeId === QUIZ_MODES.CLINICAL || modeId === QUIZ_MODES.PHARMA) {
            const newBadge = document.createElement('span');
            newBadge.className = 'new-badge';
            newBadge.textContent = 'new';
            titleElement.appendChild(newBadge);
        }
        
        // Описание
        const descElement = document.createElement('div');
        descElement.className = 'mode-description';
        descElement.textContent = description;
        
        // Контейнер для опций
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'mode-options';
        optionsContainer.appendChild(optionsElement);
        
        // Собираем панель
        panel.appendChild(titleElement);
        panel.appendChild(descElement);
        panel.appendChild(optionsContainer);
        
        return panel;
    }
    
    // Создание переключателя сложности для анатомии
    function createDifficultyToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'difficulty-toggle';
        toggleContainer.dataset.level = 'normal'; // По умолчанию обычный уровень
        
        const normalOption = document.createElement('div');
        normalOption.className = 'difficulty-option';
        normalOption.textContent = 'Обычный';
        
        const hardOption = document.createElement('div');
        hardOption.className = 'difficulty-option';
        hardOption.textContent = 'Сложный';
        
        const slider = document.createElement('div');
        slider.className = 'difficulty-slider';
        
        toggleContainer.appendChild(normalOption);
        toggleContainer.appendChild(hardOption);
        toggleContainer.appendChild(slider);
        
        // Обработчик для переключения сложности
        toggleContainer.addEventListener('click', function(e) {
            const currentLevel = this.dataset.level;
            const newLevel = currentLevel === 'normal' ? 'hard' : 'normal';
            
            // Меняем уровень сложности
            this.dataset.level = newLevel;
            
            // Обновляем сложность в менеджере сложности
            if (window.difficultyManager) {
                window.difficultyManager.setLevel(newLevel);
            }
            
            // Предотвращаем всплытие события, чтобы не активировать панель
            e.stopPropagation();
        });
        
        return toggleContainer;
    }
    
    // Настройка обработчиков для панелей
    function setupPanelHandlers() {
        const panels = document.querySelectorAll('.mode-panel');
        
        panels.forEach(panel => {
            panel.addEventListener('click', function() {
                const mode = this.dataset.mode;
                setActiveMode(mode);
            });
        });
    }
    
    // Установка активного режима
    function setActiveMode(mode) {
        currentMode = mode;
        
        // Обновляем активную панель
        const panels = document.querySelectorAll('.mode-panel');
        panels.forEach(panel => {
            if (panel.dataset.mode === mode) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        console.log('Выбран режим:', mode);
        
        // Обновляем текст кнопки старта в зависимости от режима
        updateStartButton();
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
                startButton.textContent = 'Начать тест по анатомии';
        }
    }
    
    // Запуск квиза
    function startQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        const startScreen = document.getElementById('start-screen');
        
        startScreen.style.display = 'none';
        
        // В зависимости от выбранного режима
        switch (currentMode) {
            case QUIZ_MODES.CLINICAL:
                // Запускаем клинический случай
                if (window.ClinicalThinkingModule) {
                    window.ClinicalThinkingModule.showModule();
                } else {
                    console.error('Модуль клинического мышления не найден');
                    alert('Модуль клинического мышления временно недоступен');
                    startScreen.style.display = 'block';
                }
                break;
                
            case QUIZ_MODES.PHARMA:
                // Запускаем тест по фармакологии
                if (window.PharmacologyModule) {
                    window.PharmacologyModule.showModule();
                } else {
                    console.error('Модуль фармакологии не найден');
                    alert('Модуль фармакологии временно недоступен');
                    startScreen.style.display = 'block';
                }
                break;
                
            default:
                // Запускаем обычный анатомический квиз
                if (quizContainer) {
                    quizContainer.style.display = 'block';
                    
                    // Вызываем оригинальную функцию запуска квиза, если она доступна
                    if (window.startQuiz && typeof window.startQuiz === 'function') {
                        window.startQuiz();
                    } else {
                        console.warn('Функция startQuiz не найдена, продолжаем со стандартным функционалом');
                        // Здесь можно добавить резервный код для запуска анатомического квиза
                    }
                } else {
                    console.error('Контейнер квиза не найден');
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
            // Сохраняем оригинальный обработчик, если он есть
            const originalHandler = startButton.onclick;
            
            startButton.addEventListener('click', function(event) {
                // Предотвращаем действие по умолчанию
                event.preventDefault();
                event.stopPropagation();
                
                // Запускаем квиз в выбранном режиме
                startQuiz();
            });
        }
    });
})();
