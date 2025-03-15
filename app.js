// Инициализация VK Mini Apps
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    // Проверяем, что questions определены и выводим информацию о количестве
    if (typeof questions !== 'undefined') {
        console.log(`Загружено ${questions.length} вопросов`);
    } else {
        console.error('Ошибка: Массив questions не определен');
    }
    
    // Проверяем доступность VK Bridge
    let bridge = null;
    if (window.vkBridgeInstance) {
        console.log('VK Bridge найден через window.vkBridgeInstance');
        bridge = window.vkBridgeInstance;
    } else if (window.vkBridge) {
        console.log('VK Bridge найден через window.vkBridge');
        bridge = window.vkBridge;
    } else if (typeof vkBridge !== 'undefined') {
        console.log('VK Bridge найден через глобальную переменную vkBridge');
        bridge = vkBridge;
    }
    
    if (bridge) {
        initVKBridge(bridge);
    } else {
        console.warn('VK Bridge не определен. Переключение в гостевой режим.');
        showGuestMode();
    }
});

// Функция для инициализации VK Bridge
function initVKBridge(bridge) {
    try {
        // Инициализация VK Bridge
        bridge.send('VKWebAppInit')
            .then(data => {
                console.log('VK Bridge успешно инициализирован:', data);
                
                // Получаем конфигурацию приложения для применения темы
                bridge.send('VKWebAppGetConfig')
                    .then(config => {
                        console.log('Получена конфигурация приложения:', config);
                        if (config && config.scheme) {
                            applyVKTheme(config.scheme);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка получения конфигурации:', error);
                    });
                
                // Получаем данные пользователя
                bridge.send('VKWebAppGetUserInfo')
                    .then(userData => {
                        console.log('Данные пользователя получены:', userData);
                        showUserInfo(userData);
                    })
                    .catch(error => {
                        console.error('Ошибка получения данных пользователя:', error);
                        showGuestMode();
                    });
            })
            .catch(error => {
                console.error('Ошибка инициализации VK Bridge:', error);
                showGuestMode();
            });
        
        // Подписка на события VK Bridge для отслеживания темы
        bridge.subscribe(event => {
            if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });
    } catch (e) {
        console.error('Критическая ошибка при работе с VK Bridge:', e);
        showGuestMode();
    }
}

// Обработка темы VK
function applyVKTheme(scheme) {
    console.log('Применяется тема:', scheme);
    const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
    document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
}

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 20; // Количество вопросов для показа в одном тесте
let currentUserData = null; // Данные текущего пользователя
let vkBridgeInstance = null; // Экземпляр VK Bridge для использования в функциях

// DOM элементы - проверяем их существование перед использованием
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const nextButton = document.getElementById('next-question');
const scoreElement = document.getElementById('score');
const userInfoElement = document.getElementById('user-info');
const startQuizButton = document.getElementById('start-quiz');
const shareResultsButton = document.getElementById('share-results');
const restartQuizButton = document.getElementById('restart-quiz');

// Проверяем наличие необходимых элементов
if (!startScreen || !quizContainer || !resultsContainer || 
    !questionElement || !optionsElement || !progressBar) {
    console.error('Ошибка: Некоторые необходимые элементы не найдены в DOM');
}

// Гостевой режим для тестирования (если VK API недоступен)
function showGuestMode() {
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
    
    console.log('Запущен гостевой режим с ID:', currentUserData.id);
}

// Отображение информации о пользователе
function showUserInfo(userData) {
    if (!userInfoElement) return;
    
    currentUserData = userData; // Сохраняем данные пользователя
    
    if (userData && userData.photo_100) {
        userInfoElement.innerHTML = `
            <img src="${userData.photo_100}" alt="${userData.first_name}">
            <span>${userData.first_name}</span>
        `;
    }
}

// Начало квиза - проверяем наличие кнопки перед добавлением обработчика
if (startQuizButton) {
    startQuizButton.addEventListener('click', startQuiz);
} else {
    console.error('Ошибка: кнопка startQuizButton не найдена');
}

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray(array) {
    if (!Array.isArray(array)) {
        console.error('Ошибка: параметр не является массивом');
        return [];
    }
    
    const newArray = [...array]; // Создаем копию массива
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Выбор случайных вопросов из общего пула
function selectRandomQuestions() {
    try {
        if (typeof questions === 'undefined') {
            console.error('Ошибка: массив вопросов не определен');
            return [];
        }
        
        if (!Array.isArray(questions)) {
            console.error('Ошибка: questions не является массивом');
            return [];
        }
        
        console.log(`Выбираем ${totalQuestionsToShow} вопросов из ${questions.length} доступных`);
        
        const shuffledQuestions = shuffleArray(questions); // Перемешиваем
        return shuffledQuestions.slice(0, Math.min(totalQuestionsToShow, shuffledQuestions.length)); // Берем первые N вопросов
    } catch (e) {
        console.error('Ошибка при выборе случайных вопросов:', e);
        return [];
    }
}

function startQuiz() {
    try {
        if (!startScreen || !quizContainer) {
            console.error('Ошибка: не найдены необходимые элементы DOM');
            return;
        }
        
        startScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        
        // Выбираем случайные вопросы для текущего теста
        questionsForQuiz = selectRandomQuestions();
        
        console.log(`Выбрано ${questionsForQuiz.length} вопросов для квиза`);
        
        if (questionsForQuiz.length === 0) {
            console.error('Ошибка: не удалось загрузить вопросы для квиза');
            alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
            return;
        }
        
        loadQuestion();
    } catch (e) {
        console.error('Ошибка при запуске квиза:', e);
        alert('Произошла ошибка при запуске квиза. Пожалуйста, обновите страницу.');
    }
}

// Загрузка вопроса
function loadQuestion() {
    try {
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
        
        if (!question || !question.question || !Array.isArray(question.options)) {
            console.error('Ошибка: некорректный формат вопроса', question);
            return;
        }
        
        questionElement.textContent = question.question;
        
        // Обновление счетчика вопросов
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;
        
        // Обновление прогресс-бара
        const progress = ((currentQuestion) / questionsForQuiz.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Очистка предыдущих вариантов
        optionsElement.innerHTML = '';
        
        // Добавление новых вариантов
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsElement.appendChild(optionElement);
        });
    } catch (e) {
        console.error('Ошибка при загрузке вопроса:', e);
    }
}

// Выбор варианта ответа
function selectOption(e) {
    try {
        if (!nextButton) return;
        
        const selectedIndex = parseInt(e.target.dataset.index);
        selectedOption = selectedIndex;
        
        // Подсветка выбранного варианта
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        e.target.classList.add('selected');
        
        // Активация кнопки "Далее"
        nextButton.disabled = false;
    } catch (e) {
        console.error('Ошибка при выборе варианта ответа:', e);
    }
}

// Переход к следующему вопросу - проверяем наличие кнопки перед добавлением обработчика
if (nextButton) {
    nextButton.addEventListener('click', () => {
        try {
            if (selectedOption === null || !Array.isArray(questionsForQuiz) || 
                currentQuestion >= questionsForQuiz.length) {
                return;
            }
            
            // Блокировка кнопки после клика
            nextButton.disabled = true;
            
            // Проверка ответа
            const correct = questionsForQuiz[currentQuestion].correct;
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
        } catch (e) {
            console.error('Ошибка при переходе к следующему вопросу:', e);
        }
    });
}

// Отображение результатов
function showResults() {
    try {
        if (!quizContainer || !resultsContainer || !scoreElement) {
            console.error('Ошибка: не найдены необходимые элементы для отображения результатов');
            return;
        }
        
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        
        let resultText;
        if (percentage >= 90) {
            resultText = 'Отлично! Вы эксперт в анатомии!';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
        }
        
        scoreElement.innerHTML = `
            <p>Вы ответили правильно на ${score} из ${questionsForQuiz.length} вопросов</p>
            <p>${percentage}%</p>
            <p>${resultText}</p>
        `;
        
        console.log(`Квиз завершён. Результат: ${score}/${questionsForQuiz.length} (${percentage}%)`);
    } catch (e) {
        console.error('Ошибка при отображении результатов:', e);
    }
}

// Поделиться результатами - проверяем наличие кнопки перед добавлением обработчика
if (shareResultsButton) {
    shareResultsButton.addEventListener('click', () => {
        try {
            const percentage = Math.round((score / questionsForQuiz.length) * 100);
            const message = `Я прошел Анатомический квиз и набрал ${percentage}%! Попробуй и ты!`;
            
            let bridge = null;
            if (window.vkBridgeInstance) {
                bridge = window.vkBridgeInstance;
            } else if (window.vkBridge) {
                bridge = window.vkBridge;
            } else if (typeof vkBridge !== 'undefined') {
                bridge = vkBridge;
            }
            
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
        } catch (e) {
            console.error('Ошибка при попытке поделиться результатами:', e);
        }
    });
}

// Перезапуск квиза - проверяем наличие кнопки перед добавлением обработчика
if (restartQuizButton) {
    restartQuizButton.addEventListener('click', () => {
        try {
            if (resultsContainer) resultsContainer.style.display = 'none';
            startQuiz();
        } catch (e) {
            console.error('Ошибка при перезапуске квиза:', e);
        }
    });
}

// Защитный код на случай, если массив questions не определен
window.addEventListener('load', function() {
    setTimeout(() => {
        if (typeof questions === 'undefined' || !Array.isArray(questions)) {
            console.error('Массив вопросов не загружен после таймаута. Создаю временный массив.');
            
            // Создаем небольшой тестовый массив
            window.questions = [
                { 
                    question: "Какая кость является самой длинной в человеческом теле?", 
                    options: ["Плечевая кость", "Бедренная кость", "Большеберцовая кость", "Малоберцовая кость"], 
                    correct: 1 
                },
                { 
                    question: "Сколько камер в сердце человека?", 
                    options: ["2 камеры", "3 камеры", "4 камеры", "5 камер"], 
                    correct: 2 
                },
                { 
                    question: "Какой орган производит желчь?", 
                    options: ["Печень", "Поджелудочная железа", "Желчный пузырь", "Желудок"], 
                    correct: 0 
                }
            ];
            
            console.log('Создан временный массив вопросов для тестирования:', window.questions.length);
        }
    }, 1000); // Даем секунду на загрузку скриптов
});
