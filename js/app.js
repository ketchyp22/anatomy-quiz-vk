// Инициализация VK Mini Apps
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Загружено ${questions.length} вопросов`); // Проверка количества вопросов
    
    // Запуск VK Bridge
    vkBridge.send('VKWebAppInit');

    // Получение данных пользователя
    vkBridge.send('VKWebAppGetUserInfo')
        .then(data => {
            console.log('User data:', data);
            showUserInfo(data);
        })
        .catch(error => {
            console.error('Error getting user data:', error);
        });
});

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 20; // Количество вопросов для показа в одном тесте

// DOM элементы
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

// Отображение информации о пользователе
function showUserInfo(userData) {
    if (userData && userData.photo_100) {
        userInfoElement.innerHTML = `
            <img src="${userData.photo_100}" alt="${userData.first_name}">
            <span>${userData.first_name} ${userData.last_name}</span>
        `;
    }
}

// Начало квиза
startQuizButton.addEventListener('click', startQuiz);

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Выбор случайных вопросов из общего пула
function selectRandomQuestions() {
    const shuffledQuestions = shuffleArray([...questions]); // Создаем копию и перемешиваем
    return shuffledQuestions.slice(0, totalQuestionsToShow); // Берем первые N вопросов
}

function startQuiz() {
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    
    // Выбираем случайные вопросы для текущего теста
    questionsForQuiz = selectRandomQuestions();
    
    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    selectedOption = null;
    nextButton.disabled = true;
    
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
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);
        optionsElement.appendChild(optionElement);
    });
}

// Выбор варианта ответа - позволяет менять выбор до нажатия кнопки "Далее"
function selectOption(e) {
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
nextButton.addEventListener('click', () => {
    if (selectedOption === null) {
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
    options[correct].classList.add('correct');
    if (selectedOption !== correct) {
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

// Отображение результатов
function showResults() {
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

// Поделиться результатами
shareResultsButton.addEventListener('click', () => {
    const percentage = Math.round((score / questionsForQuiz.length) * 100);
    const message = `Я прошел Анатомический квиз и набрал ${percentage}%! Попробуй и ты!`;
    
    vkBridge.send('VKWebAppShare', {
        message: message
    })
    .then(data => {
        console.log('Поделились результатом:', data);
    })
    .catch(error => {
        console.error('Error sharing results:', error);
    });
});

// Перезапуск квиза
restartQuizButton.addEventListener('click', () => {
    resultsContainer.style.display = 'none';
    startQuiz();
});
