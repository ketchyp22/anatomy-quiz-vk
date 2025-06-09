// app.js - Полная версия с интеграцией системы подсказок

// Глобальная функция для показа гостевого режима
function showGuestMode() {
    const userInfoElement = document.getElementById('user-info');
    if (!userInfoElement) return;

    currentUserData = {
        id: 'guest' + Math.floor(Math.random() * 10000),
        first_name: 'Гость',
        last_name: '',
        photo_100: 'https://vk.com/images/camera_100.png'
    };

    userInfoElement.innerHTML = `
        <img src="${currentUserData.photo_100}" alt="${currentUserData.first_name}">
        <span>${currentUserData.first_name}</span>
    `;

    const userInfoQuizElement = document.getElementById('user-info-quiz');
    if (userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userInfoElement.innerHTML;
    }

    console.log('Запущен гостевой режим с ID:', currentUserData.id);
}

// Применение темы VK
function applyVKTheme(scheme) {
    console.log('Применяется тема:', scheme);
    const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
    document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
}

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
                console.log('VK Bridge успешно инициализирован');
                window.vkBridgeInstance = bridge;
                return bridge.send('VKWebAppGetUserInfo');
            })
            .then((userData) => {
                console.log('Данные пользователя получены:', userData);
                currentUserData = userData;

                const userInfoElement = document.getElementById('user-info');
                if (userInfoElement) {
                    userInfoElement.innerHTML = `
                        <img src="${userData.photo_100}" alt="${userData.first_name}">
                        <span>${userData.first_name} ${userData.last_name || ''}</span>
                    `;
                }

                return bridge.send('VKWebAppGetConfig');
            })
            .then((config) => {
                console.log('Получена конфигурация приложения:', config);
                if (config && config.scheme) {
                    applyVKTheme(config.scheme);
                }
            })
            .catch((error) => {
                console.error('Ошибка при работе с VK Bridge:', error);
                showGuestMode();
            });

        bridge.subscribe((event) => {
            if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });

        return bridge;
    } catch (e) {
        console.error('Критическая ошибка при работе с VK Bridge:', e);
        showGuestMode();
        return null;
    }
}

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 10; // Количество вопросов для показа в одном тесте
let currentUserData = null; // Данные текущего пользователя
let currentQuizMode = 'anatomy'; // Текущий режим квиза: anatomy, clinical, pharmacology, first_aid
let currentDifficulty = 'easy'; // Текущий уровень сложности: easy, hard
let vkBridgeInstance = null; // Будем хранить инициализированный VK Bridge
let appLink = window.location.href; // Ссылка на приложение для шаринга

// DOM элементы
let startScreen, quizContainer, resultsContainer;
let questionElement, optionsElement, progressBar, questionCounter, nextButton, exitQuizButton;
let scoreElement, userInfoElement, userInfoQuizElement, startQuizButton;
let shareResultsButton, restartQuizButton;

// Ждем полную загрузку страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM полностью загружен');

    // Проверяем есть ли вопросы
    if (!window.questions) {
        console.error('Ошибка: переменная window.questions не определена. Убедитесь, что questions.js подключен.');
        alert('Не удалось загрузить вопросы. Пожалуйста, проверьте файл questions.js.');
        return;
    }

    // Инициализируем VK Bridge
    vkBridgeInstance = initVKBridge();

    // Инициализация приложения
    initializeApp();
});

// Инициализация приложения
function initializeApp() {
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

    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const quizModeButtons = document.querySelectorAll('.quiz-mode-btn');

    // Проверяем наличие необходимых элементов
    if (!startScreen || !quizContainer || !resultsContainer ||
        !questionElement || !optionsElement || !progressBar) {
        console.error('Ошибка: Некоторые необходимые элементы не найдены в DOM');
    }

    // Если VK Bridge не был инициализирован, показываем гостевой режим
    if (!vkBridgeInstance && !window.vkBridgeInstance) {
        console.warn('VK Bridge не определен. Переключение в гостевой режим.');
        showGuestMode();
    }

    // Выбор уровня сложности
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function () {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.difficulty;
            console.log('Выбран уровень сложности:', currentDifficulty);
        });
    });

    // Выбор режима квиза
    quizModeButtons.forEach(button => {
        button.addEventListener('click', function () {
            quizModeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentQuizMode = this.dataset.mode;
            console.log('Выбран режим квиза:', currentQuizMode);
        });
    });

    // Начало квиза
    if (startQuizButton) {
        startQuizButton.addEventListener('click', startQuiz);
    } else {
        console.error('Ошибка: кнопка startQuizButton не найдена');
    }

    // Выход из квиза
    if (exitQuizButton) {
        exitQuizButton.addEventListener('click', resetQuiz);
    }

    // Перезапуск квиза
    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', resetQuiz);
    }

    // Переход к следующему вопросу
    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
    }
}

// Сброс квиза
function resetQuiz() {
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

    // Сбрасываем состояние подсказок
    if (window.HintsSystem && window.HintsSystem.resetHintState) {
        window.HintsSystem.resetHintState();
    }
}

// Выбор вопросов на основе режима и сложности
function selectQuestions() {
    if (!Array.isArray(window.questions)) {
        console.error('Ошибка: переменная window.questions не является массивом');
        return [];
    }
    console.log(`Выбор вопросов режима ${currentQuizMode}, сложность ${currentDifficulty}`);

    const filteredQuestions = window.questions.filter(q =>
        q.mode === currentQuizMode && q.difficulty === currentDifficulty
    );

    if (filteredQuestions.length === 0) {
        console.warn(`Нет вопросов для режима ${currentQuizMode} и сложности ${currentDifficulty}. Используем все вопросы.`);
        return shuffleArray(window.questions).slice(0, totalQuestionsToShow);
    }

    if (filteredQuestions.length <= totalQuestionsToShow) {
        console.log(`Доступно только ${filteredQuestions.length} вопросов для выбранного режима и сложности`);
        return shuffleArray(filteredQuestions);
    }

    return shuffleArray(filteredQuestions).slice(0, totalQuestionsToShow);
}

// Начало квиза
function startQuiz() {
    console.log("Начало квиза");
    
    // Отправляем событие начала квиза
    document.dispatchEvent(new CustomEvent('quizStarted', {
        detail: {
            mode: currentQuizMode,
            difficulty: currentDifficulty
        }
    }));
    
    if (!startScreen || !quizContainer) {
        console.error('Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    console.log(`Запуск квиза режима ${currentQuizMode}, сложность ${currentDifficulty}`);

    questionsForQuiz = selectQuestions();
    console.log(`Выбрано ${questionsForQuiz.length} вопросов для квиза`);

    if (questionsForQuiz.length === 0) {
        console.error('Ошибка: не удалось загрузить вопросы для квиза');
        alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
        return;
    }

    if (userInfoElement && userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userInfoElement.innerHTML;
    }

    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    console.log(`Загрузка вопроса ${currentQuestion + 1} из ${questionsForQuiz.length}`);
    
    // Отправляем событие загрузки вопроса для системы подсказок
    document.dispatchEvent(new CustomEvent('questionLoaded', {
        detail: {
            questionIndex: currentQuestion,
            totalQuestions: questionsForQuiz.length,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));
    
    if (!questionElement || !optionsElement || !questionCounter || !progressBar) {
        console.error('Ошибка при загрузке вопроса: элементы не найдены');
        return;
    }
    
    if (!Array.isArray(questionsForQuiz) || questionsForQuiz.length === 0) {
        console.error('Ошибка при загрузке вопроса: массив вопросов пуст');
        return;
    }
    
    selectedOption = null;
    if (nextButton) nextButton.disabled = true;
    
    if (currentQuestion >= questionsForQuiz.length) {
        console.error('Ошибка: индекс текущего вопроса выходит за пределы массива');
        return;
    }
    
    const question = questionsForQuiz[currentQuestion];

    questionElement.textContent = question.text;
    questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;
    const progress = ((currentQuestion) / questionsForQuiz.length) * 100;
    progressBar.style.width = `${progress}%`;

    optionsElement.innerHTML = '';
    if (Array.isArray(question.options)) {
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsElement.appendChild(optionElement);
        });
    } else {
        console.error('Ошибка: варианты ответов не являются массивом');
    }
}

// Выбор варианта ответа
function selectOption(e) {
    if (!nextButton) return;
    
    const selectedIndex = parseInt(e.target.dataset.index);
    selectedOption = selectedIndex;

    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    e.target.classList.add('selected');

    // Отправляем событие выбора ответа для системы подсказок
    document.dispatchEvent(new CustomEvent('answerSelected', {
        detail: {
            selectedIndex: selectedIndex,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));

    nextButton.disabled = false;
}

// Переход к следующему вопросу
function nextQuestion() {
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

    // Отправляем событие с результатом ответа
    document.dispatchEvent(new CustomEvent('answerResult', {
        detail: { 
            correct: isCorrect,
            selectedIndex: selectedOption,
            correctIndex: correct,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));

    const options = document.querySelectorAll('.option');
    
    // Показываем правильный и неправильный ответы
    if (options[correct]) {
        options[correct].classList.add('correct');
    }
    if (selectedOption !== correct && options[selectedOption]) {
        options[selectedOption].classList.add('wrong');
    }

    // Отключаем все варианты от выбора
    options.forEach(option => {
        option.removeEventListener('click', selectOption);
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
    if (!quizContainer || !resultsContainer || !scoreElement) {
        console.error('Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    const percentage = Math.round((score / questionsForQuiz.length) * 100);

    const difficultyBadge = document.getElementById('difficulty-badge');
    if (difficultyBadge) {
        difficultyBadge.textContent = currentDifficulty === 'hard' ? 'Сложный уровень' : 'Обычный уровень';
        if (currentDifficulty === 'hard') {
            difficultyBadge.classList.add('hard');
        } else {
            difficultyBadge.classList.remove('hard');
        }
    }

    const modeBadge = document.getElementById('mode-badge');
    if (modeBadge) {
        let modeText = 'Анатомия';
        if (currentQuizMode === 'clinical') modeText = 'Клиническое мышление';
        if (currentQuizMode === 'pharmacology') modeText = 'Фармакология';
        if (currentQuizMode === 'first_aid') modeText = 'Первая помощь';
        if (currentQuizMode === 'obstetrics') modeText = 'Акушерство';
        modeBadge.textContent = modeText;
    }

    const percentageElement = document.getElementById('percentage');
    if (percentageElement) {
        percentageElement.textContent = percentage;
    }
    
    const correctAnswersElement = document.getElementById('correct-answers');
    if (correctAnswersElement) {
        correctAnswersElement.textContent = score;
    }
    
    const totalQuestionsElement = document.getElementById('total-questions-result');
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = questionsForQuiz.length;
    }

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

    const scoreTextElement = document.querySelector('.score-text');
    if (scoreTextElement) {
        let resultText;
        if (percentage >= 90) {
            resultText = 'Великолепно! Вы настоящий эксперт!';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо знаете предмет!';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultText = 'Стоит подучить материал, но вы уже на пути к знаниям!';
        }
        scoreTextElement.innerHTML = `<span class="result-text">${resultText}</span>`;
    }

    // Отправляем событие завершения квиза
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

// ИСПРАВЛЕННАЯ ФУНКЦИЯ ШЕРИНГА
if (shareResultsButton) {
    shareResultsButton.addEventListener('click', shareResults);
}

// Функция для шеринга результатов
function shareResults() {
    const percentage = Math.round((score / questionsForQuiz.length) * 100);
    let modeText = 'Анатомия';
    if (currentQuizMode === 'clinical') modeText = 'Клиническое мышление';
    if (currentQuizMode === 'pharmacology') modeText = 'Фармакология';
    if (currentQuizMode === 'first_aid') modeText = 'Первая помощь';
    if (currentQuizMode === 'obstetrics') modeText = 'Акушерство';
    
    const difficultyText = currentDifficulty === 'hard' ? 'сложный уровень' : 'обычный уровень';
    const message = `Я прошел Медицинский квиз (${modeText}, ${difficultyText}) и набрал ${percentage}%! Попробуй и ты!`;

    const bridge = vkBridgeInstance || window.vkBridgeInstance;
    
    if (!bridge) {
        alert(message);
        console.warn('VK Bridge не определен. Используется альтернативное действие для "Поделиться".');
        return;
    }

    // Сначала пробуем поделиться через сообщение
    useSimpleShare(bridge, message);
}

// Функция шеринга через сообщение (VKWebAppShare)
function useSimpleShare(bridge, message) {
    bridge.send('VKWebAppShare', { message })
        .then(data => {
            console.log('Поделились результатом через сообщение:', data);
            if (data && data.result) {
                console.log('Результат успешно отправлен');
            }
        })
        .catch(error => {
            console.error('Ошибка при шеринге через сообщение:', error);
            alert('Не удалось поделиться результатом. Попробуйте еще раз или сохраните скриншот.');
        });
}

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

// Функции для отладки
window.debugQuiz = {
    getCurrentQuestion: () => currentQuestion,
    getQuestionsForQuiz: () => questionsForQuiz,
    getCurrentQuestionData: () => window.getCurrentQuestionData(),
    getScore: () => score,
    getSelectedOption: () => selectedOption,
    skipToResults: () => {
        score = Math.floor(Math.random() * questionsForQuiz.length);
        showResults();
    },
    resetQuiz: () => resetQuiz()
};

console.log('✅ app.js загружен с поддержкой системы подсказок');
console.log('🐛 Доступны функции отладки: window.debugQuiz');
