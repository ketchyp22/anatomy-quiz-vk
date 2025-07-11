// new-app.js - Полностью переписанное приложение для нового дизайна

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = [];
let totalQuestionsToShow = 10;
let currentUserData = null;
let currentQuizMode = 'anatomy';
let currentDifficulty = 'easy';
let vkBridgeInstance = null;

// DOM элементы
let startScreen, quizContainer, resultsContainer;
let questionElement, optionsElement, progressBar, questionCounter, nextButton, exitQuizButton;
let scoreElement, userInfoElement, userInfoQuizElement, startQuizButton;
let shareResultsButton, restartQuizButton;

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray(array) {
    if (!Array.isArray(array) || array.length === 0) {
        console.error('Ошибка: shuffleArray получил неверный массив');
        return [];
    }
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Функция применения темы VK
function applyVKTheme(scheme) {
    console.log('🎨 Применяется тема VK:', scheme);
    const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
    document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
}

// Функция для показа гостевого режима
function showGuestMode() {
    window.currentUserData = {
        id: 'guest' + Math.floor(Math.random() * 10000),
        first_name: 'Гость',
        last_name: '',
        photo_100: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM1YTY3ZDgiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkc8L3RleHQ+PC9zdmc+'
    };

    updateUserInfo(window.currentUserData);
    console.log('🎮 Запущен гостевой режим с ID:', window.currentUserData.id);
}

// Функция обновления информации о пользователе
function updateUserInfo(userData) {
    if (!userData || !userData.first_name) {
        console.warn('Неполные данные пользователя для обновления интерфейса');
        return;
    }
    
    const userHTML = `
        <img src="${userData.photo_100 || 'https://vk.com/images/camera_100.png'}" 
             alt="${userData.first_name}" 
             onerror="this.src='https://vk.com/images/camera_100.png'">
        <span>${userData.first_name} ${userData.last_name || ''}</span>
    `;
    
    if (userInfoElement) {
        userInfoElement.innerHTML = userHTML;
    }
    
    if (userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userHTML;
    }
    
    console.log('✅ Информация о пользователе обновлена в интерфейсе');
}

// Инициализация VK Bridge
function initVKBridge() {
    let bridge = null;

    if (typeof vkBridge !== 'undefined') {
        bridge = vkBridge;
    } else if (typeof window.vkBridge !== 'undefined') {
        bridge = window.vkBridge;
    } else {
        console.warn('VK Bridge не найден. Переключение в гостевой режим.');
        showGuestMode();
        return null;
    }

    try {
        bridge.send('VKWebAppInit')
            .then(() => {
                console.log('✅ VK Bridge успешно инициализирован');
                window.vkBridgeInstance = bridge;
                return bridge.send('VKWebAppGetUserInfo');
            })
            .then((userData) => {
                console.log('📋 Данные пользователя получены:', userData);
                window.currentUserData = userData;
                updateUserInfo(userData);
                return bridge.send('VKWebAppGetConfig');
            })
            .then((config) => {
                console.log('⚙️ Получена конфигурация приложения:', config);
                if (config && config.scheme) {
                    applyVKTheme(config.scheme);
                }
            })
            .catch((error) => {
                console.error('❌ Ошибка при работе с VK Bridge:', error);
                showGuestMode();
            });

        bridge.subscribe((event) => {
            if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });

        return bridge;
    } catch (e) {
        console.error('💥 Критическая ошибка при работе с VK Bridge:', e);
        showGuestMode();
        return null;
    }
}

// Ждем полную загрузку страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM полностью загружен, инициализируем приложение');

    if (!window.questions) {
        console.error('❌ Ошибка: переменная window.questions не определена');
        alert('Не удалось загрузить вопросы. Пожалуйста, проверьте файл questions.js.');
        return;
    }

    vkBridgeInstance = initVKBridge();
    initializeApp();
});

// Инициализация приложения
function initializeApp() {
    console.log('🎯 Инициализация основного приложения');
    
    // Получаем DOM элементы
    startScreen = document.getElementById('start-screen');
    quizContainer = document.getElementById('quiz-container');
    resultsContainer = document.getElementById('results-container');
    questionElement = document.getElementById('question');
    optionsElement = document.getElementById('options');
    progressBar = document.getElementById('progress-bar');
    questionCounter = document.getElementById('question-counter');
    nextButton = document.getElementById('next-question');
    exitQuizButton = document.getElementById('exit-quiz');
    scoreElement = document.getElementById('score');
    userInfoElement = document.getElementById('user-info');
    userInfoQuizElement = document.getElementById('user-info-quiz');
    startQuizButton = document.getElementById('start-quiz');
    shareResultsButton = document.getElementById('share-results');
    restartQuizButton = document.getElementById('restart-quiz');

    if (!startScreen || !quizContainer || !resultsContainer) {
        console.error('❌ Ошибка: Некоторые необходимые элементы не найдены в DOM');
        return;
    }

    // Настраиваем обработчики событий
    setupEventHandlers();
    
    // Инициализируем интерфейс
    initializeInterface();
    
    console.log('✅ Приложение успешно инициализировано');
}

// Настройка обработчиков событий
function setupEventHandlers() {
    // Глобальный обработчик для всех кликов
    document.addEventListener('click', function(e) {
        // Переключение режимов квиза
        if (e.target.closest('.mode-card')) {
            handleModeSelection(e.target.closest('.mode-card'));
        }
        
        // Переключение сложности
        if (e.target.classList.contains('difficulty-option')) {
            handleDifficultySelection(e.target);
        }
        
        // Кнопка старта квиза
        if (e.target.closest('#start-quiz')) {
            handleQuizStart();
        }
        
        // Кнопка выхода из квиза
        if (e.target.closest('#exit-quiz')) {
            handleQuizExit();
        }
        
        // Кнопка перезапуска
        if (e.target.closest('#restart-quiz')) {
            handleQuizRestart();
        }
        
        // Кнопка следующего вопроса
        if (e.target.closest('#next-question')) {
            handleNextQuestion();
        }
        
        // Кнопка шеринга
        if (e.target.closest('#share-results')) {
            handleShare();
        }
        
        // Выбор варианта ответа
        if (e.target.classList.contains('option')) {
            handleOptionSelection(e.target);
        }
    });
    
    // Продвинутые 3D эффекты при движении мыши
    setupAdvanced3DEffects();
}

// Обработка выбора режима
function handleModeSelection(clickedCard) {
    const mode = clickedCard.dataset.mode;
    if (!mode) return;
    
    console.log('🎯 Выбран режим:', mode);
    
    // Деактивируем все карточки
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Активируем выбранную карточку
    clickedCard.classList.add('active');
    currentQuizMode = mode;
    window.currentQuizMode = mode;
    
    // Обновляем описание режима
    updateModeDescription(mode);
    
    // Обработка экспертного режима
    const difficultySection = document.querySelector('.difficulty-section');
    if (mode === 'expert') {
        difficultySection.style.opacity = '0.4';
        difficultySection.style.pointerEvents = 'none';
        currentDifficulty = 'expert';
        window.currentDifficulty = 'expert';
        console.log('🧠 ЭКСПЕРТНЫЙ РЕЖИМ АКТИВИРОВАН');
    } else {
        difficultySection.style.opacity = '1';
        difficultySection.style.pointerEvents = 'auto';
        const activeDifficultyBtn = document.querySelector('.difficulty-option.active');
        if (activeDifficultyBtn) {
            currentDifficulty = activeDifficultyBtn.dataset.difficulty;
            window.currentDifficulty = currentDifficulty;
        }
    }
    
    // Добавляем визуальную обратную связь
    clickedCard.style.transform = 'translateY(-6px) rotateX(8deg) scale(1.02)';
    setTimeout(() => {
        clickedCard.style.transform = '';
    }, 300);
}

// Обработка выбора сложности
function handleDifficultySelection(button) {
    if (currentQuizMode === 'expert') {
        console.log('⚠️ Экспертный режим активен - сложность заблокирована');
        return;
    }
    
    document.querySelectorAll('.difficulty-option').forEach(option => {
        option.classList.remove('active');
    });
    
    button.classList.add('active');
    currentDifficulty = button.dataset.difficulty;
    window.currentDifficulty = currentDifficulty;
    
    console.log('🎚️ Выбрана сложность:', currentDifficulty);
}

// Обновление описания режима
function updateModeDescription(mode) {
    const descriptionBox = document.querySelector('.mode-description-box');
    if (!descriptionBox || !window.modeDescriptions) return;
    
    const description = window.modeDescriptions[mode] || 'Описание недоступно';
    descriptionBox.textContent = description;
    
    // Анимируем изменение
    descriptionBox.style.transform = 'scale(0.95)';
    descriptionBox.style.opacity = '0.7';
    setTimeout(() => {
        descriptionBox.style.transform = 'scale(1)';
        descriptionBox.style.opacity = '1';
    }, 150);
}

// Инициализация интерфейса
function initializeInterface() {
    // Устанавливаем активный режим по умолчанию
    const firstModeCard = document.querySelector('.mode-card[data-mode="anatomy"]');
    if (firstModeCard) {
        firstModeCard.classList.add('active');
    }
    
    // Обновляем описание режима
    updateModeDescription('anatomy');
    
    // Анимация статистики при загрузке
    setTimeout(() => {
        animateStats();
    }, 1000);
}

// Анимация статистики
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.transform = 'scale(1.2)';
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Выбор вопросов для квиза
function selectQuestions() {
    if (!Array.isArray(window.questions)) {
        console.error('❌ Ошибка: window.questions не является массивом');
        return [];
    }
    
    console.log(`🎯 Выбор вопросов для режима "${currentQuizMode}", сложность "${currentDifficulty}"`);

    let filteredQuestions = [];

    if (currentQuizMode === 'expert') {
        // Для экспертного режима берем ВСЕ экспертные вопросы
        filteredQuestions = window.questions.filter(q => q.mode === 'expert');
        console.log(`🧠 Найдено ${filteredQuestions.length} экспертных вопросов - используем ВСЕ`);
        
        if (filteredQuestions.length === 0) {
            console.warn('⚠️ Экспертные вопросы не найдены! Используем обычные вопросы.');
            filteredQuestions = window.questions.filter(q => q.mode === 'anatomy' && q.difficulty === 'hard').slice(0, 10);
        }
        
        return shuffleArray(filteredQuestions);
    } else {
        // Для обычных режимов
        filteredQuestions = window.questions.filter(q =>
            q.mode === currentQuizMode && q.difficulty === currentDifficulty
        );
        console.log(`📚 Найдено ${filteredQuestions.length} вопросов для режима "${currentQuizMode}", сложность "${currentDifficulty}"`);
        
        const questionsLimit = 10;
        
        if (filteredQuestions.length === 0) {
            console.warn(`⚠️ Нет вопросов для режима "${currentQuizMode}" и сложности "${currentDifficulty}". Используем анатомию.`);
            filteredQuestions = window.questions.filter(q => q.mode === 'anatomy' && q.difficulty === 'easy');
        }

        if (filteredQuestions.length <= questionsLimit) {
            console.log(`📊 Доступно только ${filteredQuestions.length} вопросов`);
            return shuffleArray(filteredQuestions);
        }

        console.log(`📝 Выбираем ${questionsLimit} вопросов из ${filteredQuestions.length} доступных`);
        return shuffleArray(filteredQuestions).slice(0, questionsLimit);
    }
}

// Обработка начала квиза
function handleQuizStart() {
    console.log('🚀 Начало квиза');
    
    // Событие для системы геймификации
    document.dispatchEvent(new CustomEvent('quizStarted', {
        detail: {
            mode: currentQuizMode,
            difficulty: currentDifficulty
        }
    }));
    
    if (!startScreen || !quizContainer) {
        console.error('❌ Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    // Визуальная обратная связь
    const btn = document.getElementById('start-quiz');
    if (btn) {
        btn.style.transform = 'translateY(-4px) rotateX(5deg) scale(1.02)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }
    
    // Переключаем экраны
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    
    // Сбрасываем переменные
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    
    console.log(`🎯 Запуск квиза "${currentQuizMode}", сложность "${currentDifficulty}"`);

    // Выбираем вопросы
    questionsForQuiz = selectQuestions();
    console.log(`📝 Выбрано ${questionsForQuiz.length} вопросов для квиза`);

    if (questionsForQuiz.length === 0) {
        console.error('❌ Ошибка: не удалось загрузить вопросы для квиза');
        alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
        return;
    }

    // Копируем информацию о пользователе
    if (userInfoElement && userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userInfoElement.innerHTML;
    }

    // Загружаем первый вопрос
    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    console.log(`📖 Загрузка вопроса ${currentQuestion + 1} из ${questionsForQuiz.length}`);
    
    // Событие для системы подсказок
    document.dispatchEvent(new CustomEvent('questionLoaded', {
        detail: {
            questionIndex: currentQuestion,
            totalQuestions: questionsForQuiz.length,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));
    
    if (!questionElement || !optionsElement || !questionCounter || !progressBar) {
        console.error('❌ Ошибка при загрузке вопроса: элементы не найдены');
        return;
    }
    
    if (!Array.isArray(questionsForQuiz) || questionsForQuiz.length === 0) {
        console.error('❌ Ошибка при загрузке вопроса: массив вопросов пуст');
        return;
    }
    
    selectedOption = null;
    if (nextButton) nextButton.disabled = true;
    
    if (currentQuestion >= questionsForQuiz.length) {
        console.error('❌ Ошибка: индекс текущего вопроса выходит за пределы массива');
        return;
    }
    
    const question = questionsForQuiz[currentQuestion];

    // Обновляем интерфейс
    questionElement.textContent = question.text;
    questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;
    
    // Обновляем прогресс-бар
    const progress = ((currentQuestion) / questionsForQuiz.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Очищаем варианты ответов
    optionsElement.innerHTML = '';
    
    if (Array.isArray(question.options)) {
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            
            // Анимация появления вариантов
            optionElement.style.opacity = '0';
            optionElement.style.transform = 'translateY(20px)';
            optionsElement.appendChild(optionElement);
            
            setTimeout(() => {
                optionElement.style.transition = 'all 0.3s ease';
                optionElement.style.opacity = '1';
                optionElement.style.transform = 'translateY(0)';
            }, index * 100);
        });
    } else {
        console.error('❌ Ошибка: варианты ответов не являются массивом');
    }
}

// Обработка выбора варианта ответа
function handleOptionSelection(optionElement) {
    if (!nextButton) return;
    
    const selectedIndex = parseInt(optionElement.dataset.index);
    selectedOption = selectedIndex;

    // Убираем выделение со всех вариантов
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Выделяем выбранный вариант
    optionElement.classList.add('selected');

    // Событие для системы подсказок
    document.dispatchEvent(new CustomEvent('answerSelected', {
        detail: {
            selectedIndex: selectedIndex,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));

    nextButton.disabled = false;
    
    // Визуальная обратная связь
    optionElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
        optionElement.style.transform = '';
    }, 150);
}

// Переход к следующему вопросу
function handleNextQuestion() {
    if (selectedOption === null || !Array.isArray(questionsForQuiz) ||
        currentQuestion >= questionsForQuiz.length) {
        return;
    }

    nextButton.disabled = true;

    const correct = questionsForQuiz[currentQuestion].correctOptionIndex;
    const isCorrect = selectedOption === correct;
    
    if (isCorrect) {
        score++;
    }

    // Событие для системы геймификации
    document.dispatchEvent(new CustomEvent('answerResult', {
        detail: { 
            correct: isCorrect,
            selectedIndex: selectedOption,
            correctIndex: correct,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));

    // Визуально показываем правильные и неправильные ответы
    const options = document.querySelectorAll('.option');
    
    if (options[correct]) {
        options[correct].classList.add('correct');
    }
    if (selectedOption !== correct && options[selectedOption]) {
        options[selectedOption].classList.add('wrong');
    }

    // Отключаем клики по вариантам
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questionsForQuiz.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Отображение результатов
function showResults() {
    console.log('🏁 Показываем результаты квиза');
    
    if (!quizContainer || !resultsContainer) {
        console.error('❌ Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    const percentage = Math.round((score / questionsForQuiz.length) * 100);

    // Обновляем значки режима и сложности
    const difficultyBadge = document.getElementById('difficulty-badge');
    const modeBadge = document.getElementById('mode-badge');
    
    if (difficultyBadge) {
        if (currentQuizMode === 'expert') {
            difficultyBadge.textContent = '🧠 ЭКСПЕРТНЫЙ УРОВЕНЬ';
            difficultyBadge.style.background = 'linear-gradient(135deg, #b45309 0%, #d97706 100%)';
            difficultyBadge.style.color = 'white';
        } else {
            difficultyBadge.textContent = currentDifficulty === 'hard' ? 'Сложный уровень' : 'Обычный уровень';
        }
    }
    
    if (modeBadge) {
        const modeNames = {
            'anatomy': 'Анатомия',
            'clinical': 'Клиническое мышление',
            'pharmacology': 'Фармакология',
            'first_aid': 'Первая помощь',
            'obstetrics': 'Акушерство',
            'expert': '🧠 ЭКСПЕРТ'
        };
        modeBadge.textContent = modeNames[currentQuizMode] || 'Неизвестный режим';
    }

    // Обновляем результаты
    const percentageElement = document.getElementById('percentage');
    const correctAnswersElement = document.getElementById('correct-answers');
    const totalQuestionsElement = document.getElementById('total-questions-result');
    const resultMessageElement = document.getElementById('result-message');
    
    if (percentageElement) {
        percentageElement.textContent = percentage;
    }
    
    if (correctAnswersElement) {
        correctAnswersElement.textContent = score;
    }
    
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = questionsForQuiz.length;
    }

    // Устанавливаем класс для цвета результата
    const scorePercentageElement = document.querySelector('.score-percentage');
    if (scorePercentageElement) {
        scorePercentageElement.classList.remove('excellent', 'good', 'average', 'poor');
        if (percentage >= 90) {
            scorePercentageElement.classList.add('excellent');
        } else if (percentage >= 70) {
            scorePercentageElement.classList.add('good');
        } else if (percentage >= 50) {
            scorePercentageElement.classList.add('average');
        } else {
            scorePercentageElement.classList.add('poor');
        }
    }

    // Обновляем мотивационное сообщение
    if (resultMessageElement) {
        let resultText;
        if (currentQuizMode === 'expert') {
            if (percentage >= 90) {
                resultText = '🧠 НЕВЕРОЯТНО! Вы - истинный эксперт медицины!';
            } else if (percentage >= 70) {
                resultText = '🔥 Отличный результат для экспертного уровня!';
            } else if (percentage >= 50) {
                resultText = '💪 Хороший уровень, но есть куда расти!';
            } else {
                resultText = '📚 Экспертный уровень очень сложен, продолжайте изучать!';
            }
        } else {
            if (percentage >= 90) {
                resultText = 'Великолепно! Вы настоящий эксперт!';
            } else if (percentage >= 70) {
                resultText = 'Хороший результат! Вы хорошо знаете предмет!';
            } else if (percentage >= 50) {
                resultText = 'Неплохо! Но есть над чем поработать.';
            } else {
                resultText = 'Стоит подучить материал, но вы уже на пути к знаниям!';
            }
        }
        resultMessageElement.textContent = resultText;
    }

    // Событие завершения квиза для системы геймификации
    document.dispatchEvent(new CustomEvent('quizCompleted', {
        detail: { 
            score: score, 
            total: questionsForQuiz.length, 
            percentage: percentage,
            mode: currentQuizMode,
            difficulty: currentDifficulty
        }
    }));
}

// Обработка выхода из квиза
function handleQuizExit() {
    resetQuiz();
}

// Обработка перезапуска квиза
function handleQuizRestart() {
    resetQuiz();
}

// Сброс квиза
function resetQuiz() {
    console.log('🔄 Сброс квиза');
    
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    questionsForQuiz = [];

    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (startScreen) startScreen.style.display = 'block';

    if (progressBar) progressBar.style.width = '0%';
    if (questionElement) questionElement.textContent = '';
    if (optionsElement) optionsElement.innerHTML = '';

    // Восстанавливаем состояние выбора сложности если НЕ экспертный режим
    if (currentQuizMode !== 'expert') {
        const difficultySection = document.querySelector('.difficulty-section');
        if (difficultySection) {
            difficultySection.style.opacity = '1';
            difficultySection.style.pointerEvents = 'auto';
        }
    }

    // Сбрасываем состояние системы подсказок
    if (window.HintsSystem && window.HintsSystem.resetHintState) {
        window.HintsSystem.resetHintState();
    }
}

// Обработка шеринга результатов
function handleShare() {
    console.log('📤 Запуск системы шеринга результатов');
    
    // Используем систему шеринга из vk-share-correct.js
    if (typeof shareResults === 'function') {
        shareResults();
    } else {
        console.warn('⚠️ Система шеринга не найдена');
        alert('Функция шеринга временно недоступна');
    }
}

// Настройка продвинутых 3D эффектов
function setupAdvanced3DEffects() {
    // Улучшенные 3D эффекты при движении мыши
    document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.mode-card, .stat-card');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        cards.forEach(card => {
            if (!card.matches(':hover')) {
                const rect = card.getBoundingClientRect();
                const cardX = (rect.left + rect.width / 2) / window.innerWidth;
                const cardY = (rect.top + rect.height / 2) / window.innerHeight;

                const deltaX = (mouseX - cardX) * 2;
                const deltaY = (mouseY - cardY) * 2;

                card.style.transform = `perspective(1000px) rotateX(${deltaY}deg) rotateY(${deltaX}deg)`;
            }
        });

        // Параллакс эффект для частиц
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Сброс трансформации при покидании области
    document.addEventListener('mouseleave', function() {
        document.querySelectorAll('.mode-card, .stat-card').forEach(card => {
            card.style.transform = '';
        });

        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.transform = '';
        });
    });

    // Интерактивные эффекты для кнопок
    document.querySelectorAll('.btn, .mode-card, .stat-card').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('scale')) {
                this.style.transform = this.style.transform + ' scale(1.02)';
            }
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(/scale\([^)]*\)/, '');
        });
    });
}

// Эффект печатания для заголовка
function typewriterEffect() {
    const title = document.querySelector('.title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    let i = 0;
    
    const timer = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// Запуск эффекта печатания через секунду после загрузки
window.addEventListener('load', function() {
    setTimeout(typewriterEffect, 1000);
    
    // Анимация статистики при загрузке
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }, 1500);
});

// Глобальные функции для доступа из других модулей
window.getCurrentQuestion = function() {
    return currentQuestion;
};

window.getQuestionsForQuiz = function() {
    return questionsForQuiz;
};

window.getCurrentQuestionData = function() {
    if (questionsForQuiz && currentQuestion < questionsForQuiz.length) {
        return questionsForQuiz[currentQuestion];
    }
    return null;
};

window.setExpertMode = function() {
    window.currentQuizMode = 'expert';
    window.currentDifficulty = 'expert';
    currentQuizMode = 'expert';
    currentDifficulty = 'expert';
    console.log('🧠 Экспертный режим установлен глобально');
};

window.getQuizMode = function() {
    return {
        mode: currentQuizMode,
        difficulty: currentDifficulty,
        globalMode: window.currentQuizMode,
        globalDifficulty: window.currentDifficulty
    };
};

// Функции для совместимости с существующими системами
window.applyVKTheme = applyVKTheme;
window.showGuestMode = showGuestMode;
window.updateUserInfo = updateUserInfo;
window.initVKBridge = initVKBridge;

// Экспорт переменных для совместимости
window.currentQuizMode = currentQuizMode;
window.currentDifficulty = currentDifficulty;
window.score = score;
window.questionsForQuiz = questionsForQuiz;
window.currentQuestion = currentQuestion;

// Функции для отладки
window.debugQuiz = {
    getCurrentQuestion: () => currentQuestion,
    getQuestionsForQuiz: () => questionsForQuiz,
    getCurrentQuestionData: () => window.getCurrentQuestionData(),
    getScore: () => score,
    getSelectedOption: () => selectedOption,
    getCurrentMode: () => currentQuizMode,
    getCurrentDifficulty: () => currentDifficulty,
    
    testExpertMode: () => {
        currentQuizMode = 'expert';
        currentDifficulty = 'expert';
        window.currentQuizMode = 'expert';
        window.currentDifficulty = 'expert';
        console.log('🧠 Экспертный режим активирован для тестирования');
        const expertQuestions = selectQuestions();
        console.log(`Найдено ${expertQuestions.length} экспертных вопросов:`, expertQuestions);
    },
    
    checkExpertQuestions: () => {
        const expertQuestions = window.questions ? window.questions.filter(q => q.mode === 'expert') : [];
        console.log(`🧠 Всего экспертных вопросов в базе: ${expertQuestions.length}`);
        return expertQuestions;
    },
    
    forceExpertMode: () => {
        window.setExpertMode();
        const expertBtn = document.querySelector('.expert-card, .mode-card[data-mode="expert"]');
        if (expertBtn) {
            document.querySelectorAll('.mode-card').forEach(btn => btn.classList.remove('active'));
            expertBtn.classList.add('active');
            
            const difficultySection = document.querySelector('.difficulty-section');
            if (difficultySection) {
                difficultySection.style.opacity = '0.5';
                difficultySection.style.pointerEvents = 'none';
            }
        }
        console.log('🧠 Экспертный режим принудительно активирован');
    },
    
    skipToResults: () => {
        score = Math.floor(Math.random() * questionsForQuiz.length);
        showResults();
    },
    
    resetQuiz: () => resetQuiz(),
    
    getState: () => ({
        currentQuestion,
        score,
        selectedOption,
        currentQuizMode,
        currentDifficulty,
        questionsCount: questionsForQuiz.length,
        expertQuestionsAvailable: window.questions ? window.questions.filter(q => q.mode === 'expert').length : 0
    }),

    // Тестирование режимов
    testModeSwitch: () => {
        console.log('🧪 Тестируем переключение режимов...');
        
        // Тестируем анатомию
        const anatomyBtn = document.querySelector('.mode-card[data-mode="anatomy"]');
        if (anatomyBtn) {
            handleModeSelection(anatomyBtn);
            console.log('Анатомия:', { mode: currentQuizMode, difficulty: currentDifficulty });
        }
        
        setTimeout(() => {
            // Тестируем экспертный режим
            const expertBtn = document.querySelector('.mode-card[data-mode="expert"]');
            if (expertBtn) {
                handleModeSelection(expertBtn);
                console.log('Экспертный:', { mode: currentQuizMode, difficulty: currentDifficulty });
            }
            
            setTimeout(() => {
                // Возвращаемся к анатомии
                if (anatomyBtn) {
                    handleModeSelection(anatomyBtn);
                    console.log('Анатомия снова:', { mode: currentQuizMode, difficulty: currentDifficulty });
                }
            }, 1000);
        }, 1000);
    },

    // Тестирование шеринга
    testShare: () => {
        console.log('🧪 Тестируем функцию шеринга...');
        
        // Устанавливаем тестовые данные
        score = 8;
        questionsForQuiz = new Array(10).fill({});
        currentQuizMode = 'anatomy';
        currentDifficulty = 'easy';
        
        handleShare();
    },

    // Тестирование анимаций
    testAnimations: () => {
        console.log('🎨 Тестируем анимации...');
        animateStats();
        setTimeout(() => {
            typewriterEffect();
        }, 1000);
    },

    // Информация о системе
    systemInfo: () => {
        return {
            version: '2.0.0',
            design: 'Modern Glassmorphism',
            components: {
                vkBridge: !!window.vkBridgeInstance,
                gamification: !!window.Gamification,
                hints: !!window.HintsSystem,
                questions: !!window.questions,
                questionsCount: window.questions ? window.questions.length : 0,
                expertQuestions: window.questions ? window.questions.filter(q => q.mode === 'expert').length : 0
            },
            currentState: {
                screen: startScreen?.style.display !== 'none' ? 'start' : 
                       quizContainer?.style.display !== 'none' ? 'quiz' : 
                       resultsContainer?.style.display !== 'none' ? 'results' : 'unknown',
                mode: currentQuizMode,
                difficulty: currentDifficulty,
                question: currentQuestion,
                score: score
            }
        };
    }
};

console.log('✅ new-app.js загружен с современным дизайном');
console.log('🎨 Новый интерфейс с Glassmorphism и 3D эффектами');
console.log('🐛 Доступны функции отладки: window.debugQuiz');
console.log('💡 Системная информация: window.debugQuiz.systemInfo()');

// Экспортируем основные функции для совместимости
window.newApp = {
    version: '2.0.0',
    handleModeSelection,
    handleDifficultySelection,
    handleQuizStart,
    handleShare,
    resetQuiz,
    selectQuestions,
    animateStats,
    typewriterEffect
};
