// Инициализация VK Bridge
let vkBridgeInstance = null;
function initializeVKBridge() {
    if (typeof vkBridge !== 'undefined') {
        vkBridgeInstance = vkBridge;
    } else if (typeof window.vkBridge !== 'undefined') {
        vkBridgeInstance = window.vkBridge;
    } else {
        console.warn('VK Bridge не найден, пробуем загрузить динамически');
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js';
            script.onload = () => {
                if (typeof window.vkBridge !== 'undefined') {
                    vkBridgeInstance = window.vkBridge;
                    window.vkBridgeInstance = vkBridgeInstance;
                    resolve(vkBridgeInstance);
                } else {
                    reject(new Error('VK Bridge не найден после загрузки'));
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    return Promise.resolve(vkBridgeInstance);
}

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = [];
const totalQuestionsToShow = 25;
let currentUserData = null;
let currentDifficulty = 'easy';
let currentMode = 'anatomy';
let timerInterval = null;
const timePerQuestionEasy = 30; // 30 секунд для простых вопросов
const timePerQuestionHard = 45; // 45 секунд для сложных вопросов
let mistakesByCategory = {}; // Для статистики ошибок по категориям
let easyQuestions = []; // Массив для простых вопросов
let difficultQuestions = []; // Массив для сложных вопросов

// Категории вопросов для каждого режима
const modeCategories = {
    anatomy: ['КОСТНАЯ СИСТЕМА', 'МЫШЕЧНАЯ СИСТЕМА', 'СЕНСОРНЫЕ СИСТЕМЫ'],
    clinical: [
        'НЕРВНАЯ СИСТЕМА',
        'СЕРДЕЧНО-СОСУДИСТАЯ СИСТЕМА',
        'ДЫХАТЕЛЬНАЯ СИСТЕМА',
        'ВЫДЕЛИТЕЛЬНАЯ СИСТЕМА',
        'ПИЩЕВАРИТЕЛЬНАЯ СИСТЕМА',
        'ИММУННАЯ СИСТЕМА',
        'ИНТЕГРАТИВНАЯ ФИЗИОЛОГИЯ'
    ],
    pharmacology: ['ЭНДОКРИННАЯ СИСТЕМА', 'ПОЛОВАЯ СИСТЕМА']
};

// Загрузка простых вопросов из questions.js
async function loadEasyQuestions() {
    try {
        const script = document.createElement('script');
        script.src = 'questions.js';
        document.head.appendChild(script);

        return new Promise((resolve, reject) => {
            script.onload = () => {
                if (window.questions && Array.isArray(window.questions)) {
                    easyQuestions = window.questions;
                    resolve();
                } else {
                    reject(new Error('Простые вопросы не загружены или имеют неверный формат'));
                }
            };
            script.onerror = () => reject(new Error('Ошибка загрузки questions.js'));
        });
    } catch (error) {
        console.error('Ошибка загрузки простых вопросов:', error);
        easyQuestions = [];
    }
}

// Загрузка сложных вопросов из difficult-questions.json
async function loadDifficultQuestions() {
    try {
        const response = await fetch('difficult-questions.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить сложные вопросы');
        }
        difficultQuestions = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки сложных вопросов:', error);
        difficultQuestions = [];
    }
}

// Функция для фильтрации вопросов по режиму и сложности
function filterQuestionsByModeAndDifficulty(mode, difficulty) {
    // Определяем категории, связанные с выбранным режимом
    const categories = modeCategories[mode] || [];
    
    // Выбираем источник вопросов в зависимости от сложности
    const sourceQuestions = difficulty === 'hard' ? difficultQuestions : easyQuestions;

    // Фильтруем вопросы
    let filteredQuestions = sourceQuestions.filter((question, index) => {
        // Находим категорию вопроса по индексу
        let category = '';
        for (const [cat, questionsInCat] of Object.entries(modeCategories)) {
            const questionCount = sourceQuestions
                .slice(0, index)
                .filter(q => cat === 'КОСТНАЯ СИСТЕМА' ? q.question.includes('кость') : q.question.toLowerCase().includes(cat.toLowerCase())).length;
            if (index >= questionCount) {
                category = cat;
            }
        }
        return categories.includes(category);
    });

    // Для фармакологии добавляем вопросы, связанные с гормонами и веществами
    if (mode === 'pharmacology') {
        const additionalQuestions = sourceQuestions.filter(q => 
            q.question.toLowerCase().includes('гормон') ||
            q.question.toLowerCase().includes('вещество') ||
            q.question.toLowerCase().includes('фермент')
        );
        filteredQuestions = [...filteredQuestions, ...additionalQuestions];
        // Удаляем дубликаты
        filteredQuestions = Array.from(new Set(filteredQuestions.map(q => q.question)))
            .map(qText => filteredQuestions.find(q => q.question === qText));
    }

    return filteredQuestions;
}

// Перемешивание массива
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загружаем оба набора вопросов
        await Promise.all([loadEasyQuestions(), loadDifficultQuestions()]);
        
        if (easyQuestions.length === 0) {
            throw new Error('Не удалось загрузить простые вопросы');
        }
        if (difficultQuestions.length === 0) {
            console.warn('Сложные вопросы не загружены, режим "hard" будет недоступен');
        }

        await initializeVKBridge();
        if (vkBridgeInstance) {
            initVKBridge(vkBridgeInstance);
        } else {
            showGuestMode();
        }
        initializeApp();
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        alert('Ошибка загрузки. Пожалуйста, обновите страницу.');
        showGuestMode();
    }
});

// Функция для гостевого режима
function showGuestMode() {
    const userInfoElements = [document.getElementById('user-info'), document.getElementById('user-info-quiz')];
    currentUserData = {
        id: 'guest' + Math.floor(Math.random() * 10000),
        first_name: 'Гость',
        last_name: '',
        photo_100: 'https://vk.com/images/camera_100.png'
    };

    userInfoElements.forEach(element => {
        if (element) {
            element.innerHTML = `
                <img src="${currentUserData.photo_100}" alt="${currentUserData.first_name}">
                <span>${currentUserData.first_name}</span>
            `;
        }
    });
}

// Инициализация VK Bridge
function initVKBridge(bridge) {
    bridge.send('VKWebAppInit')
        .then(() => bridge.send('VKWebAppGetUserInfo'))
        .then(userData => {
            currentUserData = userData;
            const userInfoElements = [document.getElementById('user-info'), document.getElementById('user-info-quiz')];
            userInfoElements.forEach(element => {
                if (element) {
                    element.innerHTML = `
                        <img src="${userData.photo_100}" alt="${userData.first_name}">
                        <span>${userData.first_name} ${userData.last_name || ''}</span>
                    `;
                }
            });
            return bridge.send('VKWebAppGetConfig');
        })
        .then(config => {
            if (config && config.scheme) {
                applyVKTheme(config.scheme);
            }
        })
        .catch(error => {
            console.error('Ошибка VK Bridge:', error);
            showGuestMode();
        });

    bridge.subscribe(event => {
        if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
            applyVKTheme(event.detail.data.scheme);
        }
    });
}

// Применение темы VK
function applyVKTheme(scheme) {
    const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
    document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
}

// Функция для сохранения результатов
function saveResults(score, totalQuestions, difficulty, mode) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const result = {
        user: currentUserData ? `${currentUserData.first_name} ${currentUserData.last_name || ''}` : 'Гость',
        score: percentage,
        difficulty: difficulty,
        mode: mode,
        date: new Date().toLocaleString(),
        mistakes: mistakesByCategory
    };

    const previousResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    previousResults.push(result);
    localStorage.setItem('quizResults', JSON.stringify(previousResults));
}

// Функция для отображения предыдущих результатов
function showPreviousResults() {
    const previousResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const resultsList = document.createElement('div');
    resultsList.className = 'previous-results';
    resultsList.innerHTML = '<h3>Предыдущие результаты:</h3>';

    if (previousResults.length === 0) {
        resultsList.innerHTML += '<p>Нет сохраненных результатов.</p>';
    } else {
        const ul = document.createElement('ul');
        previousResults.forEach(result => {
            const li = document.createElement('li');
            li.textContent = `${result.user} | ${result.mode} (${result.difficulty}) | ${result.score}% | ${result.date}`;
            ul.appendChild(li);
        });
        resultsList.appendChild(ul);
    }

    const startScreen = document.getElementById('start-screen');
    startScreen.appendChild(resultsList);
}

// Определение категории вопроса
function getQuestionCategory(question) {
    for (const [category, keywords] of Object.entries(modeCategories)) {
        if (keywords.some(keyword => question.toLowerCase().includes(keyword.toLowerCase()))) {
            return category;
        }
    }
    return 'Неизвестная категория';
}

// Основная логика приложения
function initializeApp() {
    const startScreen = document.getElementById('start-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const nextButton = document.getElementById('next-question');
    const scoreElement = document.getElementById('score');
    const startQuizButton = document.getElementById('start-quiz');
    const shareResultsButton = document.getElementById('share-results');
    const restartQuizButton = document.getElementById('restart-quiz');

    // Добавляем таймер
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    quizContainer.insertBefore(timerElement, questionElement);

    // Показываем предыдущие результаты
    showPreviousResults();

    // Выбор сложности и режима
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentDifficulty = btn.dataset.difficulty;
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.mode;
            document.querySelectorAll('.quiz-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Начало квиза
    startQuizButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        mistakesByCategory = {};

        // Фильтруем вопросы по режиму и сложности
        let filteredQuestions = filterQuestionsByModeAndDifficulty(currentMode, currentDifficulty);

        if (filteredQuestions.length === 0) {
            alert('Вопросов для выбранного режима и сложности не найдено. Пожалуйста, выберите другой режим или сложность.');
            startScreen.style.display = 'block';
            quizContainer.style.display = 'none';
            return;
        }

        // Если вопросов меньше, чем totalQuestionsToShow, корректируем количество
        const questionsToShow = Math.min(totalQuestionsToShow, filteredQuestions.length);
        questionsForQuiz = shuffleArray(filteredQuestions).slice(0, questionsToShow);

        if (currentDifficulty === 'hard') {
            const indicator = document.createElement('div');
            indicator.className = 'difficulty-indicator hard';
            indicator.textContent = 'Сложный уровень';
            quizContainer.appendChild(indicator);
        }

        loadQuestion();
    });

    // Запуск таймера
    function startTimer() {
        const timePerQuestion = currentDifficulty === 'hard' ? timePerQuestionHard : timePerQuestionEasy;
        let timeLeft = timePerQuestion;
        timerElement.textContent = `Осталось: ${timeLeft} сек`;

        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Осталось: ${timeLeft} сек`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        }, 1000);
    }

    // Обработка истечения времени
    function handleTimeout() {
        selectedOption = null;
        nextButton.disabled = true;

        const question = questionsForQuiz[currentQuestion];
        const category = getQuestionCategory(question.question);
        mistakesByCategory[category] = (mistakesByCategory[category] || 0) + 1;

        const correct = question.correct;
        const options = document.querySelectorAll('.option');
        options[correct].classList.add('correct');

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

    // Загрузка вопроса
    function loadQuestion() {
        selectedOption = null;
        nextButton.disabled = true;

        const question = questionsForQuiz[currentQuestion];
        questionElement.textContent = question.question;
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;
        const progress = (currentQuestion / questionsForQuiz.length) * 100;
        progressBar.style.width = `${progress}%`;

        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsElement.appendChild(optionElement);
        });

        // Запускаем таймер
        clearInterval(timerInterval);
        startTimer();
    }

    // Выбор варианта ответа
    function selectOption(e) {
        selectedOption = parseInt(e.target.dataset.index);
        document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
        e.target.classList.add('selected');
        nextButton.disabled = false;
        clearInterval(timerInterval);
    }

    // Переход к следующему вопросу
    nextButton.addEventListener('click', () => {
        if (selectedOption === null) return;

        nextButton.disabled = true;
        const question = questionsForQuiz[currentQuestion];
        const correct = question.correct;
        if (selectedOption === correct) {
            score++;
        } else {
            const category = getQuestionCategory(question.question);
            mistakesByCategory[category] = (mistakesByCategory[category] || 0) + 1;
        }

        const options = document.querySelectorAll('.option');
        options[correct].classList.add('correct');
        if (selectedOption !== correct) {
            options[selectedOption].classList.add('wrong');
        }

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
    });

    // Отображение результатов
    function showResults() {
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        const difficultyText = currentDifficulty === 'hard'
            ? '<div class="difficulty-badge hard">Сложный уровень</div>'
            : '<div class="difficulty-badge">Обычный уровень</div>';

        let resultText;
        if (percentage >= 90) {
            resultText = currentDifficulty === 'hard'
                ? 'Великолепно! Вы настоящий эксперт!'
                : 'Отлично! Вы эксперт!';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо справились!';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultText = 'Стоит подучиться, но вы уже на пути к знаниям!';
        }

        // Статистика по категориям
        let mistakesHTML = '<h3>Ваши ошибки по категориям:</h3>';
        if (Object.keys(mistakesByCategory).length === 0) {
            mistakesHTML += '<p>Вы не сделали ни одной ошибки! Поздравляем!</p>';
        } else {
            mistakesHTML += '<ul>';
            for (const [category, count] of Object.entries(mistakesByCategory)) {
                mistakesHTML += `<li>${category}: ${count} ошибок</li>`;
            }
            mistakesHTML += '</ul>';
        }

        scoreElement.innerHTML = `
            ${difficultyText}
            <p>Режим: ${currentMode === 'anatomy' ? 'Анатомия' : currentMode === 'clinical' ? 'Клиническое мышление' : 'Фармакология'}</p>
            <p>Вы ответили правильно на ${score} из ${questionsForQuiz.length} вопросов</p>
            <p>${percentage}%</p>
            <p>${resultText}</p>
            ${mistakesHTML}
        `;

        // Сохраняем результаты
        saveResults(score, questionsForQuiz.length, currentDifficulty, currentMode);
    }

    // Поделиться результатами
    shareResultsButton.addEventListener('click', () => {
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        const modeText = currentMode === 'anatomy' ? 'Анатомия' : currentMode === 'clinical' ? 'Клиническое мышление' : 'Фармакология';
        const message = `Я прошел квиз (${modeText}) и набрал ${percentage}%! Попробуй и ты!`;

        if (vkBridgeInstance) {
            vkBridgeInstance.send('VKWebAppShare', { message })
                .then(data => console.log('Поделились результатом:', data))
                .catch(error => {
                    console.error('Ошибка при шеринге:', error);
                    alert(message);
                });
        } else {
            alert(message);
        }
    });

    // Перезапуск квиза
    restartQuizButton.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
        startScreen.style.display = 'block';
        showPreviousResults();
    });
}
