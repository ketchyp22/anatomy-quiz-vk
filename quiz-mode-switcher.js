// quiz-mode-switcher.js - Модуль переключения режимов квиза
(function() {
    // Константы режимов
    const MODES = {
        ANATOMY: {
            id: 'anatomy', 
            name: 'Анатомия', 
            description: 'Проверьте свои знания анатомии человека с вопросами разной сложности',
            hasDifficulty: true
        },
        CLINICAL: {
            id: 'clinical', 
            name: 'Клиническое мышление', 
            description: 'Развивайте клиническое мышление, анализируя сложные медицинские случаи',
            isNew: true
        },
        PHARMA: {
            id: 'pharma', 
            name: 'Фармакология', 
            description: 'Изучайте и проверяйте знания лекарственных препаратов и их действия',
            isNew: true
        }
    };

    // Состояние приложения
    let currentMode = MODES.ANATOMY;
    let currentDifficulty = 'normal';

    // Инициализация модуля
    function initModeSwitcher() {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) return;

        // Создаем и настраиваем контейнеры
        createDifficultySelector(startScreen);
        createModeSelector(startScreen);
        
        // Настройка обработчиков событий
        setupEventHandlers();
    }

    // Создание селектора сложности
    function createDifficultySelector(startScreen) {
        // Заголовок
        const difficultyTitle = document.createElement('h3');
        difficultyTitle.textContent = 'Выберите уровень сложности:';

        // Контейнер для кнопок
        const difficultyButtons = document.createElement('div');
        difficultyButtons.className = 'difficulty-buttons';

        // Кнопки сложности
        const normalButton = createDifficultyButton('normal', 'Обычный', true);
        const hardButton = createDifficultyButton('hard', 'Сложный');

        difficultyButtons.appendChild(normalButton);
        difficultyButtons.appendChild(hardButton);

        // Вставляем после информации о пользователе
        const userInfo = document.getElementById('user-info');
        if (userInfo && userInfo.nextSibling) {
            startScreen.insertBefore(difficultyTitle, userInfo.nextSibling);
            startScreen.insertBefore(difficultyButtons, difficultyTitle.nextSibling);
        } else {
            startScreen.appendChild(difficultyTitle);
            startScreen.appendChild(difficultyButtons);
        }
    }

    // Создание кнопки сложности
    function createDifficultyButton(level, text, isActive = false) {
        const button = document.createElement('button');
        button.id = `${level}-difficulty`;
        button.className = `difficulty-btn ${isActive ? 'active' : ''}`;
        button.textContent = text;
        return button;
    }

    // Создание селектора режимов
    function createModeSelector(startScreen) {
        // Заголовок
        const modeTitle = document.createElement('h3');
        modeTitle.textContent = 'Выберите режим:';

        // Контейнер для кнопок
        const modeButtons = document.createElement('div');
        modeButtons.className = 'mode-buttons';

        // Создаем кнопки для каждого режима
        Object.values(MODES).forEach(mode => {
            const button = createModeButton(mode);
            modeButtons.appendChild(button);
        });

        // Кнопка старта
        const startButton = document.createElement('button');
        startButton.id = 'start-quiz';
        startButton.className = 'btn-start';
        startButton.textContent = 'Начать тест';

        // Вставляем в DOM
        startScreen.appendChild(modeTitle);
        startScreen.appendChild(modeButtons);
        startScreen.appendChild(startButton);
    }

    // Создание кнопки режима
    function createModeButton(mode) {
        const button = document.createElement('button');
        button.className = `mode-btn ${mode.id === currentMode.id ? 'active' : ''}`;
        button.textContent = mode.name;
        button.dataset.mode = mode.id;

        // Добавляем бейдж "New" для новых режимов
        if (mode.isNew) {
            const newBadge = document.createElement('span');
            newBadge.className = 'new-badge';
            newBadge.textContent = 'NEW';
            button.appendChild(newBadge);
        }

        return button;
    }

    // Настройка обработчиков событий
    function setupEventHandlers() {
        // Обработчики для кнопок сложности
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс со всех кнопок
                difficultyButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                // Обновляем текущую сложность
                currentDifficulty = this.id.replace('-difficulty', '');
            });
        });

        // Обработчики для кнопок режимов
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modeId = this.dataset.mode;
                
                // Обновляем активные кнопки режимов
                modeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Обновляем текущий режим
                currentMode = MODES[modeId.toUpperCase()];

                // Обновляем текст кнопки старта
                updateStartButton();
            });
        });

        // Обработчик кнопки старта
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', startQuiz);
        }
    }

    // Обновление текста кнопки старта
    function updateStartButton() {
        const startButton = document.getElementById('start-quiz');
        if (!startButton) return;

        const buttonTextMap = {
            'anatomy': 'Начать тест по анатомии',
            'clinical': 'Начать клинический случай',
            'pharma': 'Начать тест по фармакологии'
        };

        startButton.textContent = buttonTextMap[currentMode.id] || 'Начать тест';
    }

    // Запуск квиза
    function startQuiz() {
        const startScreen = document.getElementById('start-screen');
        const quizContainer = document.getElementById('quiz-container');
        
        // Скрываем стартовый экран
        if (startScreen) startScreen.style.display = 'none';

        // Запуск в зависимости от выбранного режима
        switch (currentMode.id) {
            case 'clinical':
                if (window.ClinicalThinkingModule) {
                    window.ClinicalThinkingModule.showModule();
                } else {
                    console.error('Модуль клинического мышления не загружен');
                }
                break;

            case 'pharma':
                if (window.PharmacologyModule) {
                    window.PharmacologyModule.showModule();
                } else {
                    console.error('Модуль фармакологии не загружен');
                }
                break;

            default: // anatomy
                if (quizContainer) {
                    quizContainer.style.display = 'block';
                    if (window.startQuiz) {
                        window.startQuiz();
                    }
                }
        }
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', initModeSwitcher);

    // Экспорт API
    window.QuizModeSwitcher = {
        getCurrentMode: () => currentMode,
        getCurrentDifficulty: () => currentDifficulty
    };
})();
