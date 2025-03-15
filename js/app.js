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
let currentUserData = null; // Данные текущего пользователя

// DOM элементы
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const statisticsContainer = document.getElementById('statistics-container');
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
const showStatsButton = document.getElementById('show-stats');
const backToHomeButton = document.getElementById('back-to-home');
const viewStatsButton = document.getElementById('view-stats');
const totalQuizzesElement = document.getElementById('total-quizzes');
const bestScoreElement = document.getElementById('best-score');
const lastScoreElement = document.getElementById('last-score');
const averageScoreElement = document.getElementById('average-score');
const topUsersList = document.getElementById('top-users-list');

// Отображение информации о пользователе
function showUserInfo(userData) {
    currentUserData = userData; // Сохраняем данные пользователя
    
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
    statisticsContainer.style.display = 'none';
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
    statisticsContainer.style.display = 'none';
    
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
    
    // Обновляем статистику пользователя
    updateStatsAfterQuiz();
}

// Сохранение статистики пользователя
function saveUserStats(userId, scorePercent, totalQuestions, correctAnswers) {
    try {
        // Получаем текущую статистику
        const statsJson = localStorage.getItem('anatomyQuizStats');
        const allStats = statsJson ? JSON.parse(statsJson) : {};
        
        // Проверяем, есть ли статистика для данного пользователя
        const userStats = allStats[userId] || {
            totalQuizzes: 0,
            bestScore: 0,
            averageScore: 0,
            totalScore: 0,
            history: []
        };
        
        // Обновляем статистику
        userStats.totalQuizzes += 1;
        userStats.lastScore = scorePercent;
        userStats.bestScore = Math.max(userStats.bestScore, scorePercent);
        userStats.totalScore += scorePercent;
        userStats.averageScore = Math.round(userStats.totalScore / userStats.totalQuizzes);
        
        // Добавляем текущий результат в историю
        userStats.history.push({
            date: new Date().toISOString(),
            score: scorePercent,
            totalQuestions,
            correctAnswers
        });
        
        // Ограничиваем историю последними 20 тестами
        if (userStats.history.length > 20) {
            userStats.history = userStats.history.slice(-20);
        }
        
        // Сохраняем обновленную статистику
        allStats[userId] = userStats;
        localStorage.setItem('anatomyQuizStats', JSON.stringify(allStats));
        
        return userStats;
    } catch (error) {
        console.error('Ошибка при сохранении статистики:', error);
        return null;
    }
}

// Получение статистики пользователя
function getUserStats(userId) {
    try {
        const statsJson = localStorage.getItem('anatomyQuizStats');
        if (!statsJson) return null;
        
        const allStats = JSON.parse(statsJson);
        return allStats[userId] || null;
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        return null;
    }
}

// Получение топа пользователей
function getTopUsers() {
    try {
        // Получаем статистику всех пользователей
        const statsJson = localStorage.getItem('anatomyQuizStats');
        if (!statsJson) return [];
        
        const allStats = JSON.parse(statsJson);
        
        // Преобразуем объект в массив
        const usersArray = Object.keys(allStats).map(userId => ({
            id: userId,
            stats: allStats[userId]
        }));
        
        // Сортируем по лучшему результату
        usersArray.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
        
        // Возвращаем топ-10 пользователей
        return usersArray.slice(0, 10);
    } catch (error) {
        console.error('Ошибка при получении топа пользователей:', error);
        return [];
    }
}

// Обновление статистики после завершения теста
function updateStatsAfterQuiz() {
    if (currentUserData && currentUserData.id) {
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        saveUserStats(
            currentUserData.id, 
            percentage, 
            questionsForQuiz.length, 
            score
        );
    }
}

// Показать страницу статистики
function showStatistics() {
    startScreen.style.display = 'none';
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    statisticsContainer.style.display = 'block';
    
    // Загружаем статистику текущего пользователя
    if (currentUserData && currentUserData.id) {
        const userStats = getUserStats(currentUserData.id);
        
        if (userStats) {
            totalQuizzesElement.textContent = userStats.totalQuizzes;
            bestScoreElement.textContent = userStats.bestScore + '%';
            lastScoreElement.textContent = userStats.lastScore + '%';
            averageScoreElement.textContent = userStats.averageScore + '%';
        } else {
            totalQuizzesElement.textContent = '0';
            bestScoreElement.textContent = '0%';
            lastScoreElement.textContent = '0%';
            averageScoreElement.textContent = '0%';
        }
    }
    
    // Загружаем топ пользователей
    loadTopUsers();
}

// Загрузка списка топ пользователей
function loadTopUsers() {
    const topUsers = getTopUsers();
    topUsersList.innerHTML = '';
    
    if (topUsers.length === 0) {
        topUsersList.innerHTML = '<div class="no-data">Нет данных о пользователях</div>';
        return;
    }
    
    // Создаем элементы списка
    topUsers.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.className = `top-user-item ${index < 3 ? 'top-' + (index + 1) : ''}`;
        
        // Если это текущий пользователь, добавляем соответствующий класс
        if (currentUserData && user.id === currentUserData.id.toString()) {
            userItem.classList.add('current-user');
        }
        
        // Ищем данные пользователя или используем заглушку
        let userName = `Пользователь ${user.id}`;
        let userAvatar = 'https://vk.com/images/camera_100.png'; // Стандартный аватар
        
        if (currentUserData && user.id === currentUserData.id.toString()) {
            userName = `${currentUserData.first_name} ${currentUserData.last_name}`;
            userAvatar = currentUserData.photo_100;
        }
        
        userItem.innerHTML = `
            <div class="user-rank">${index + 1}</div>
            <img class="user-avatar" src="${userAvatar}" alt="${userName}">
            <div class="user-info">
                <div class="user-name">${userName}</div>
                <div class="user-score">${user.stats.bestScore}%</div>
            </div>
            ${currentUserData && user.id === currentUserData.id.toString() ? '<div class="user-indicator">Вы</div>' : ''}
        `;
        
        topUsersList.appendChild(userItem);
    });
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

// Показать статистику
if (showStatsButton) {
    showStatsButton.addEventListener('click', showStatistics);
}

// Просмотр статистики с экрана результатов
if (viewStatsButton) {
    viewStatsButton.addEventListener('click', showStatistics);
}

// Вернуться на главную со страницы статистики
if (backToHomeButton) {
    backToHomeButton.addEventListener('click', () => {
        statisticsContainer.style.display = 'none';
        startScreen.style.display = 'block';
    });
}
