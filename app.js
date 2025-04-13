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

// Функция для проверки существования файла
function checkFileExists(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                resolve(xhr.status === 200);
            }
        };
        xhr.send();
    });
}

// Функция для динамической загрузки скрипта с вопросами
function loadQuestionsScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${url}`));
        document.head.appendChild(script);
    });
}

// Загрузка вопросов
async function loadQuestions() {
    if (typeof window.questions !== 'undefined' && Array.isArray(window.questions)) {
        return;
    }

    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const possiblePaths = [
        'questions.js',
        './questions.js',
        `${baseUrl}questions.js`,
        '/questions.js',
        'js/questions.js',
        './js/questions.js',
        `${baseUrl}js/questions.js`
    ];

    const timestamp = new Date().getTime();
    const pathsWithTimestamp = possiblePaths.map(path =>
        path.includes('?') ? `${path}&t=${timestamp}` : `${path}?t=${timestamp}`
    );

    for (const path of pathsWithTimestamp) {
        try {
            const exists = await checkFileExists(path);
            if (!exists) continue;
            await loadQuestionsScript(path);
            if (typeof window.questions !== 'undefined' && Array.isArray(window.questions)) {
                return;
            }
        } catch (error) {
            console.error(`Ошибка при загрузке: ${path}`, error);
        }
    }

    throw new Error('Не удалось загрузить вопросы');
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadQuestions();
        await initializeVKBridge();
        if (vkBridgeInstance) {
            initVKBridge(vkBridgeInstance);
        } else {
            showGuestMode();
        }
        initializeApp();
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        alert('Ошибка загрузки вопросов. Пожалуйста, обновите страницу.');
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

// Перемешивание массива
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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

        questionsForQuiz = shuffleArray(window.questions).slice(0, totalQuestionsToShow);
        if (questionsForQuiz.length === 0) {
            alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
            return;
        }

        if (currentDifficulty === 'hard') {
            const indicator = document.createElement('div');
            indicator.className = 'difficulty-indicator hard';
            indicator.textContent = 'Сложный уровень';
            quizContainer.appendChild(indicator);
        }

        loadQuestion();
    });

    // Загрузка вопроса
    function loadQuestion() {
        selectedOption = null;
        nextButton.disabled = true;

        const question = questionsForQuiz[currentQuestion];
        questionElement.textContent = question.question;
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${totalQuestionsToShow}`;
        const progress = (currentQuestion / totalQuestionsToShow) * 100;
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
    }

    // Выбор варианта ответа
    function selectOption(e) {
        selectedOption = parseInt(e.target.dataset.index);
        document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
        e.target.classList.add('selected');
        nextButton.disabled = false;
    }

    // Переход к следующему вопросу
    nextButton.addEventListener('click', () => {
        if (selectedOption === null) return;

        nextButton.disabled = true;
        const correct = questionsForQuiz[currentQuestion].correct;
        if (selectedOption === correct) {
            score++;
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
                ? 'Великолепно! Вы настоящий эксперт в анатомии!'
                : 'Отлично! Вы эксперт в анатомии!';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
        }

        scoreElement.innerHTML = `
            ${difficultyText}
            <p>Вы ответили правильно на ${score} из ${questionsForQuiz.length} вопросов</p>
            <p>${percentage}%</p>
            <p>${resultText}</p>
        `;
    }

    // Поделиться результатами
    shareResultsButton.addEventListener('click', () => {
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        const message = `Я прошел Анатомический квиз и набрал ${percentage}%! Попробуй и ты!`;

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
    });
}
