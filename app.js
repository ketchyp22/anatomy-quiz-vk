// Инициализация VK Mini Apps
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    // Обработка темы VK
    function applyVKTheme(scheme) {
        const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
        document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
    }
    
    // Проверяем, что questions определены
    if (typeof questions !== 'undefined') {
        console.log(`Загружено ${questions.length} вопросов`);
    } else {
        console.error('Ошибка: Массив questions не определен. Проверьте подключение файла questions.js');
    }
    
    // Запуск VK Bridge
    if (typeof vkBridge !== 'undefined') {
        console.log('VK Bridge найден, инициализация...');
        
        // Инициализация VK Bridge
        vkBridge.send('VKWebAppInit')
            .then(data => {
                console.log('VK Bridge успешно инициализирован:', data);
            })
            .catch(error => {
                console.error('Ошибка инициализации VK Bridge:', error);
            });
        
        // Подписка на события VK Bridge для отслеживания темы
        vkBridge.subscribe(event => {
            if (event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });
        
        // Получение данных пользователя
        vkBridge.send('VKWebAppGetUserInfo')
            .then(data => {
                console.log('Данные пользователя получены:', data);
                showUserInfo(data);
            })
            .catch(error => {
                console.error('Ошибка получения данных пользователя:', error);
                // Показываем гостевой режим
                showGuestMode();
            });
    } else {
        console.warn('VK Bridge не определен. Проверьте подключение VK Bridge SDK.');
        // Показываем гостевой режим для тестирования
        showGuestMode();
    }
});

// Дополнительная проверка загрузки страницы
window.addEventListener('load', function() {
    console.log('Страница полностью загружена');
    
    // Повторная проверка VK Bridge
    if (typeof vkBridge !== 'undefined' && typeof vkBridge.send === 'function') {
        console.log('Повторная попытка инициализации VK Bridge...');
        try {
            vkBridge.send('VKWebAppGetConfig')
                .then(data => {
                    console.log('Получена конфигурация приложения:', data);
                    // Применяем тему, если есть
                    if (data.scheme) {
                        const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(data.scheme);
                        document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
                    }
                })
                .catch(error => {
                    console.error('Ошибка получения конфигурации:', error);
                });
        } catch (e) {
            console.error('Исключение при повторной инициализации:', e);
        }
    }
});

// Глобальный обработчик ошибок для отладки
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Глобальная ошибка:', {
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error
    });
    return false;
};

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 20; // Количество вопросов для показа в одном тесте
let currentUserData = null; // Данные текущего пользователя

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
    console.error('Ошибка: Некоторые необходимые элементы не найдены в DOM. Проверьте HTML-структуру.');
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
            <span>${userData.first_name} ${userData.last_name}</span>
        `;
    }
}

// Начало квиза - проверяем наличие кнопки перед добавлением обработчика
if (startQuizButton) {
    startQuizButton.addEventListener('click', startQuiz);
}

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray(array) {
    if (!Array.isArray(array)) return [];
    
    const newArray = [...array]; // Создаем копию массива
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Выбор случайных вопросов из общего пула
function selectRandomQuestions() {
    if (typeof questions === 'undefined' || !Array.isArray(questions)) {
        console.error('Ошибка: массив вопросов не определен или не является массивом');
        return [];
    }
    
    const shuffledQuestions = shuffleArray([...questions]); // Создаем копию и перемешиваем
    return shuffledQuestions.slice(0, Math.min(totalQuestionsToShow, shuffledQuestions.length)); // Берем первые N вопросов
}

function startQuiz() {
    if (!startScreen || !quizContainer) return;
    
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    
    // Выбираем случайные вопросы для текущего теста
    questionsForQuiz = selectRandomQuestions();
    
    if (questionsForQuiz.length === 0) {
        console.error('Ошибка: не удалось загрузить вопросы для квиза');
        alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
        return;
    }
    
    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    if (!questionElement || !optionsElement || !questionCounter || !progressBar || 
        !Array.isArray(questionsForQuiz) || questionsForQuiz.length === 0) {
        console.error('Ошибка при загрузке вопроса: элементы не найдены или массив вопросов пуст');
        return;
    }
    
    selectedOption = null;
    if (nextButton) nextButton.disabled = true;
    
    if (currentQuestion >= questionsForQuiz.length) {
        console.error('Ошибка: индекс текущего вопроса выходит за пределы массива');
        return;
    }
    
    const question = questionsForQuiz[currentQuestion];
    questionElement.textContent = question.question;
    
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

// Переход к следующему вопросу - проверяем наличие кнопки перед добавлением обработчика
if (nextButton) {
    nextButton.addEventListener('click', () => {
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
    });
}

// Отображение результатов
function showResults() {
    if (!quizContainer || !resultsContainer || !scoreElement) return;
    
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
}

// Поделиться результатами - проверяем наличие кнопки перед добавлением обработчика
if (shareResultsButton) {
    shareResultsButton.addEventListener('click', () => {
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        const message = `Я прошел Анатомический квиз и набрал ${percentage}%! Попробуй и ты!`;
        
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppShare', {
                message: message
            })
            .then(data => {
                console.log('Поделились результатом:', data);
            })
            .catch(error => {
                console.error('Error sharing results:', error);
            });
        } else {
            alert(message);
            console.warn('VK Bridge не определен. Используется альтернативное действие для "Поделиться".');
        }
    });
}

// Перезапуск квиза - проверяем наличие кнопки перед добавлением обработчика
if (restartQuizButton) {
    restartQuizButton.addEventListener('click', () => {
        if (resultsContainer) resultsContainer.style.display = 'none';
        startQuiz();
    });
}
