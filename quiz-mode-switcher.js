// quiz-mode-switcher.js - Улучшенный модуль переключения режимов квиза
(function() {
    // Константы режимов
    const QUIZ_MODES = {
        ANATOMY: {
            id: 'anatomy',
            title: 'Анатомия',
            description: 'Проверьте свои знания анатомии человека с вопросами разной сложности',
            icon: '🦴',
            isActive: true
        },
        CLINICAL: {
            id: 'clinical',
            title: 'Клиническое мышление',
            description: 'Развивайте клиническое мышление, анализируя сложные медицинские случаи',
            icon: '🩺',
            isNew: true
        },
        PHARMA: {
            id: 'pharma',
            title: 'Фармакология',
            description: 'Изучайте и проверяйте знания лекарственных препаратов и их действия',
            icon: '💊',
            isNew: true
        }
    };

    // Текущий активный режим
    let currentMode = QUIZ_MODES.ANATOMY;

    // Создание контейнера режимов
    function createModesContainer() {
        const container = document.createElement('div');
        container.className = 'main-menu-container';

        const title = document.createElement('h3');
        title.className = 'menu-section-title';
        title.textContent = 'Выберите режим';

        const modesContainer = document.createElement('div');
        modesContainer.className = 'quiz-modes-container';

        // Создаем панели для каждого режима
        Object.values(QUIZ_MODES).forEach(mode => {
            const modePanel = createModePanel(mode);
            modesContainer.appendChild(modePanel);
        });

        container.appendChild(title);
        container.appendChild(modesContainer);

        return container;
    }

    // Создание панели режима
    function createModePanel(mode) {
        const panel = document.createElement('div');
        panel.className = `mode-panel ${mode.id === currentMode.id ? 'active' : ''}`;
        panel.dataset.mode = mode.id;

        // Заголовок
        const titleElement = document.createElement('div');
        titleElement.className = 'mode-title';
        
        // Иконка
        const iconSpan = document.createElement('span');
        iconSpan.textContent = mode.icon;
        iconSpan.style.marginRight = '10px';

        // Текст заголовка
        const titleText = document.createElement('span');
        titleText.textContent = mode.title;

        titleElement.appendChild(iconSpan);
        titleElement.appendChild(titleText);

        // Новый бейдж
        if (mode.isNew) {
            const newBadge = document.createElement('span');
            newBadge.className = 'new-badge';
            newBadge.textContent = 'New';
            titleElement.appendChild(newBadge);
        }

        // Описание
        const descElement = document.createElement('div');
        descElement.className = 'mode-description';
        descElement.textContent = mode.description;

        // Опции для анатомии (переключатель сложности)
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'mode-options';

        if (mode.id === 'anatomy') {
            optionsContainer.appendChild(createDifficultyToggle());
        }

        // Сборка панели
        panel.appendChild(titleElement);
        panel.appendChild(descElement);
        panel.appendChild(optionsContainer);

        // Обработчик клика
        panel.addEventListener('click', () => setActiveMode(mode.id));

        return panel;
    }

    // Создание переключателя сложности
    function createDifficultyToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'difficulty-toggle';
        toggleContainer.dataset.level = 'normal';

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

        // Обработчик переключения сложности
        toggleContainer.addEventListener('click', function(e) {
            e.stopPropagation();
            const currentLevel = this.dataset.level;
            const newLevel = currentLevel === 'normal' ? 'hard' : 'normal';
            this.dataset.level = newLevel;

            // Обновляем сложность в менеджере сложности
            if (window.difficultyManager) {
                window.difficultyManager.setLevel(newLevel);
            }
        });

        return toggleContainer;
    }

    // Установка активного режима
    function setActiveMode(modeId) {
        // Находим выбранный режим
        const selectedMode = Object.values(QUIZ_MODES).find(mode => mode.id === modeId);
        if (!selectedMode) return;

        // Обновляем панели
        const panels = document.querySelectorAll('.mode-panel');
        panels.forEach(panel => {
            if (panel.dataset.mode === modeId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Обновляем текущий режим
        currentMode = selectedMode;

        // Обновляем кнопку старта
        updateStartButton();
    }

    // Обновление кнопки старта
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
        const clinicalContainer = document.getElementById('clinical-thinking-container');
        const pharmaContainer = document.getElementById('pharmacology-container');

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

    // Инициализация модуля
    function init() {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) {
            console.error('Стартовый экран не найден');
            return;
        }

        // Создаем и вставляем контейнер режимов
        const modesContainer = createModesContainer();
        const userInfo = document.getElementById('user-info');

        if (userInfo && userInfo.nextSibling) {
            startScreen.insertBefore(modesContainer, userInfo.nextSibling);
        } else {
            startScreen.appendChild(modesContainer);
        }

        // Настройка кнопки старта
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', startQuiz);
        }
    }

    // Экспорт API
    window.QuizModeSwitcher = {
        init,
        getCurrentMode: () => currentMode,
        startQuiz
    };

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', init);
})();
