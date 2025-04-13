// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 10; // Количество вопросов для показа в одном тесте
let currentUserData = null; // Данные текущего пользователя
let currentQuizMode = 'anatomy'; // Текущий режим квиза: anatomy, clinical, pharmacology
let currentDifficulty = 'easy'; // Текущий уровень сложности: easy, hard
let vkBridgeInstance = null; // Будем хранить инициализированный VK Bridge

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray(array) {
    if (!Array.isArray(array) || array.length === 0) {
        console.error('Ошибка: shuffleArray получил неверный массив');
        return [];
    }
    const newArray = [...array]; // Создаем копию массива
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Функция для получения базовых вопросов, если нет файла questions.js
function getDefaultQuestions() {
    return [
        {
            id: 1,
            text: "Какой орган отвечает за производство инсулина?",
            options: ["Печень", "Поджелудочная железа", "Почки", "Селезенка"],
            correctOptionIndex: 1,
            mode: "anatomy",
            difficulty: "easy"
        },
        {
            id: 2,
            text: "Какая кость является самой длинной в человеческом теле?",
            options: ["Плечевая", "Бедренная", "Большеберцовая", "Локтевая"],
            correctOptionIndex: 1,
            mode: "anatomy",
            difficulty: "easy"
        },
        // Добавьте остальные вопросы здесь...
    ];
}

// Функция для показа гостевого режима
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

// Инициализация VK Bridge
function initVKBridge() {
    let bridge = null;

    // Определяем доступный экземпляр VK Bridge
    if (typeof vkBridge !== 'undefined') {
        console.log('Используем глобальный vkBridge');
        bridge = vkBridge;
    } else if (typeof window.vkBridge !== 'undefined') {
        console.log('Используем window.vkBridge');
        bridge = window.vkBridge;
    } else {
        console.warn('VK Bridge не найден');
        showGuestMode();
        return null;
    }

    try {
        // Корректная инициализация VK Bridge
        bridge.send('VKWebAppInit')
            .then(data => {
                console.log('VK Bridge успешно инициализирован:', data);
                window.vkBridgeInstance = bridge; // Сохраняем экземпляр глобально
                // Получаем данные пользователя
                return bridge.send('VKWebAppGetUserInfo');
            })
            .then(userData => {
                console.log('Данные пользователя получены:', userData);
                currentUserData = userData;

                // Отображаем информацию о пользователе
                const userInfoElement = document.getElementById('user-info');
                if (userInfoElement) {
                    userInfoElement.innerHTML = `
                        <img src="${userData.photo_100}" alt="${userData.first_name}">
                        <span>${userData.first_name} ${userData.last_name || ''}</span>
                    `;
                }

                // Получаем конфигурацию
                return bridge.send('VKWebAppGetConfig');
            })
            .then(config => {
                console.log('Получена конфигурация приложения:', config);
                if (config && config.scheme) {
                    applyVKTheme(config.scheme);
                }
            })
            .catch(error => {
                console.error('Ошибка при работе с VK Bridge:', error);
                showGuestMode();
            });

        // Подписка на события VK Bridge
        bridge.subscribe(event => {
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

// Ждем полную загрузку страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM полностью загружен');

    // Проверяем есть ли вопросы
    if (!window.questions) {
        window.questions = getDefaultQuestions();
        console.log('Загружены дефолтные вопросы:', window.questions.length);
    }

    initializeApp();
});

// Инициализация приложения
function initializeApp() {
    // DOM элементы - проверяем их существование перед использованием
    const startScreen = document.getElementById('start-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const nextButton = document.getElementById('next-question');
    const exitQuizButton = document.getElementById('exit-quiz');
    const scoreElement = document.getElementById('score');
    const userInfoElement = document.getElementById('user-info');
    const userInfoQuizElement = document.getElementById('user-info-quiz');
    const startQuizButton = document.getElementById('start-quiz');
    const shareResultsButton = document.getElementById('share-results');
    const restartQuizButton = document.getElementById('restart-quiz');
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

    // Начало квиза - проверяем наличие кнопки перед добавлением обработчика
    if (startQuizButton) {
        startQuizButton.addEventListener('click', startQuiz);
    } else {
        console.error('Ошибка: кнопка startQuizButton не найдена');
    }

    // Выбор вопросов на основе режима и сложности
    function selectQuestions() {
        if (!Array.isArray(window.questions)) {
            console.error('Ошибка: переменная window.questions не является массивом');
            return [];
        }
        console.log(`Выбор вопросов режима ${currentQuizMode}, сложность ${currentDifficulty}`);

        // Фильтруем вопросы по режиму и сложности
        const filteredQuestions = window.questions.filter(q =>
            q.mode === currentQuizMode && q.difficulty === currentDifficulty
        );

        if (filteredQuestions.length === 0) {
            console.warn(`Нет вопросов для режима ${currentQuizMode} и сложности ${currentDifficulty}. Используем все вопросы.`);
            return shuffleArray(window.questions).slice(0, totalQuestionsToShow);
        }

        // Если вопросов меньше чем нужно, используем имеющиеся
        if (filteredQuestions.length <= totalQuestionsToShow) {
            console.log(`Доступно только ${filteredQuestions.length} вопросов для выбранного режима и сложности`);
            return shuffleArray(filteredQuestions);
        }

        // Перемешиваем и выбираем нужное количество
        return shuffleArray(filteredQuestions).slice(0, totalQuestionsToShow);
    }

    function startQuiz() {
        console.log("Начало квиза");
        if (!startScreen || !quizContainer) {
            console.error('Ошибка: не найдены необходимые элементы DOM');
            return;
        }
        startScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        console.log(`Запуск квиза режима ${currentQuizMode}, сложность ${currentDifficulty}`);

        // Выбираем вопросы для текущего теста
        questionsForQuiz = selectQuestions();
        console.log(`Выбрано ${questionsForQuiz.length} вопросов для квиза`);

        if (questionsForQuiz.length === 0) {
            console.error('Ошибка: не удалось загрузить вопросы для квиза');
            alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
            return;
        }

        // Копируем информацию о пользователе
        if (userInfoElement && userInfoQuizElement) {
            userInfoQuizElement.innerHTML = userInfoElement.innerHTML;
        }

        loadQuestion();
    }

    // Загрузка вопроса
    function loadQuestion() {
        console.log(`Загрузка вопроса ${currentQuestion + 1} из ${questionsForQuiz.length}`);
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

        // Отображаем текст вопроса
        questionElement.textContent = question.text;

        // Обновление счетчика вопросов
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;

        // Обновление прогресс-бара
        const progress = ((currentQuestion) / questionsForQuiz.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Очистка предыдущих вариантов
        optionsElement.innerHTML = '';

        // Добавление новых вариантов
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

        // Подсветка выбранного варианта
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        e.target.classList.add('selected');

        // Активация кнопки "Далее"
        nextButton.disabled = false;
    }

    // Переход к следующему вопросу
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (selectedOption === null || !Array.isArray(questionsForQuiz) ||
                currentQuestion >= questionsForQuiz.length) {
                return;
            }

            // Блокировка кнопки после клика
            nextButton.disabled = true;

            // Проверка ответа
            const correct = questionsForQuiz[currentQuestion].correctOptionIndex;
            if (selectedOption === correct) {
                score++;
            }

            // Подсветка правильного/неправильного ответа
            const options = document.querySelectorAll('.option');
            if (options[correct]) options[correct].classList.add('correct');
            if (selectedOption !== correct && options[selectedOption]) {
                options[selectedOption].classList.add('wrong');
            }

            // Блокировка выбора после проверки
            options.forEach(option => {
                option.removeEventListener('click', selectOption);
                option.style.pointerEvents = 'none';
            });

            // Задержка перед следующим вопросом
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < questionsForQuiz.length) {
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 1500);  // 1.5 секунды, чтобы увидеть правильный ответ
        });
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

        // Обновляем бэйдж сложности
        const difficultyBadge = document.getElementById('difficulty-badge');
        if (difficultyBadge) {
            difficultyBadge.textContent = currentDifficulty === 'hard' ? 'Сложный уровень' : 'Обычный уровень';
            if (currentDifficulty === 'hard') {
                difficultyBadge.classList.add('hard');
            } else {
                difficultyBadge.classList.remove('hard');
            }
        }

        // Обновляем бэйдж режима
        const modeBadge = document.getElementById('mode-badge');
        if (modeBadge) {
            let modeText = 'Анатомия';
            if (currentQuizMode === 'clinical') modeText = 'Клиническое мышление';
            if (currentQuizMode === 'pharmacology') modeText = 'Фармакология';
            modeBadge.textContent = modeText;
        }

        // Обновляем процент и количество правильных ответов
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

        // Добавляем класс в зависимости от результата
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

        // Добавляем текст результата
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
    }

    // Поделиться результатами
    if (shareResultsButton) {
        shareResultsButton.addEventListener('click', () => {
            const percentage = Math.round((score / questionsForQuiz.length) * 100);
            let modeText = 'Анатомия';
            if (currentQuizMode === 'clinical') modeText = 'Клиническое мышление';
            if (currentQuizMode === 'pharmacology') modeText = 'Фармакология';
            const difficultyText = currentDifficulty === 'hard' ? 'сложный уровень' : 'обычный уровень';
            const message = `Я прошел Медицинский квиз (${modeText}, ${difficultyText}) и набрал ${percentage}%! Попробуй и ты!`;

            // Получаем текущий экземпляр VK Bridge
            let bridge = vkBridgeInstance || window.vkBridgeInstance;
            if (bridge) {
                bridge.send('VKWebAppShare', {
                    message: message
                })
                    .then(data => {
                        console.log('Поделились результатом:', data);
                    })
                    .catch(error => {
                        console.error('Ошибка при шеринге:', error);
                        alert(message);
                    });
            } else {
                alert(message);
                console.warn('VK Bridge не определен. Используется альтернативное действие для "Поделиться".');
            }
        });
    }

    // Выход из квиза в начальный экран
    if (exitQuizButton) {
        exitQuizButton.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите выйти? Прогресс будет потерян!')) {
                if (quizContainer) quizContainer.style.display = 'none';
                if (startScreen) startScreen.style.display = 'block';
            }
        });
    }

    // Перезапуск квиза
    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', () => {
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (startScreen) startScreen.style.display = 'block';
        });
    }
}
