// Структура приложения квиза по анатомии для ВКонтакте

// Инициализация VK Mini Apps
const bridge = window.vkBridge;

// Инициализируем приложение
bridge.send('VKWebAppInit');

// Основная структура данных квиза
const anatomyQuiz = {
  categories: [
    {
      id: 1,
      name: "Опорно-двигательная система",
      questions: [
        {
          id: 1,
          question: "Сколько костей в теле взрослого человека?",
          options: ["206", "180", "250", "300"],
          correctAnswer: 0,
          explanation: "Скелет взрослого человека состоит из 206 костей."
        },
        {
          id: 2,
          question: "Какая кость является самой длинной в человеческом теле?",
          options: ["Плечевая кость", "Бедренная кость", "Большеберцовая кость", "Лучевая кость"],
          correctAnswer: 1,
          explanation: "Бедренная кость — самая длинная и прочная кость в человеческом теле."
        },
        {
          id: 3,
          question: "Сколько групп мышц выделяют в теле человека?",
          options: ["Более 400", "Более 600", "Более 800", "Более 1000"],
          correctAnswer: 1,
          explanation: "В теле человека выделяют более 600 групп скелетных мышц."
        }
      ]
    },
    {
      id: 2,
      name: "Сердечно-сосудистая система",
      questions: [
        {
          id: 1,
          question: "Из скольких камер состоит сердце человека?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "Сердце человека четырехкамерное: два предсердия и два желудочка."
        },
        {
          id: 2,
          question: "Какой сосуд выносит кровь из левого желудочка?",
          options: ["Легочная артерия", "Легочная вена", "Аорта", "Верхняя полая вена"],
          correctAnswer: 2,
          explanation: "Аорта — самый крупный артериальный сосуд, который выносит кровь из левого желудочка."
        },
        {
          id: 3,
          question: "Сколько крови перекачивает сердце за сутки?",
          options: ["Около 5000 литров", "Около 7500 литров", "Около 10000 литров", "Около 12500 литров"],
          correctAnswer: 1,
          explanation: "В среднем за сутки сердце перекачивает около 7500 литров крови."
        }
      ]
    },
    {
      id: 3,
      name: "Нервная система",
      questions: [
        {
          id: 1,
          question: "Из скольких долей состоит кора головного мозга?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation: "Кора головного мозга делится на 4 доли: лобную, теменную, височную и затылочную."
        },
        {
          id: 2,
          question: "Какой отдел нервной системы отвечает за рефлексы?",
          options: ["Центральная нервная система", "Периферическая нервная система", "Соматическая нервная система", "Вегетативная нервная система"],
          correctAnswer: 0,
          explanation: "Центральная нервная система (головной и спинной мозг) отвечает за рефлексы."
        },
        {
          id: 3,
          question: "Сколько пар черепно-мозговых нервов отходит от головного мозга?",
          options: ["10", "12", "14", "16"],
          correctAnswer: 1,
          explanation: "От головного мозга отходит 12 пар черепно-мозговых нервов."
        }
      ]
    }
  ],
  
  // Статистика пользователя
  userStats: {
    totalQuestions: 0,
    correctAnswers: 0,
    categoriesCompleted: 0,
    achievements: []
  }
};

// UI компоненты
const UI = {
  // Отображение главного меню
  renderMainMenu: function() {
    const mainContainer = document.getElementById('app');
    mainContainer.innerHTML = `
      <div class="quiz-container">
        <h1>Квиз по анатомии</h1>
        <div class="categories-container">
          ${anatomyQuiz.categories.map(category => `
            <div class="category-card" onclick="UI.startCategory(${category.id})">
              <h3>${category.name}</h3>
              <p>${category.questions.length} вопросов</p>
            </div>
          `).join('')}
        </div>
        <div class="stats-panel">
          <h3>Ваша статистика</h3>
          <p>Правильных ответов: ${anatomyQuiz.userStats.correctAnswers}/${anatomyQuiz.userStats.totalQuestions}</p>
          <p>Завершенных категорий: ${anatomyQuiz.userStats.categoriesCompleted}/${anatomyQuiz.categories.length}</p>
        </div>
        <button class="share-btn" onclick="shareResults()">Поделиться результатами</button>
      </div>
    `;
  },
  
  // Запуск категории
  startCategory: function(categoryId) {
    currentCategory = anatomyQuiz.categories.find(cat => cat.id === categoryId);
    currentQuestionIndex = 0;
    score = 0;
    
    this.renderQuestion();
  },
  
  // Отображение вопроса
  renderQuestion: function() {
    const currentQuestion = currentCategory.questions[currentQuestionIndex];
    const mainContainer = document.getElementById('app');
    
    mainContainer.innerHTML = `
      <div class="quiz-container">
        <h2>${currentCategory.name}</h2>
        <div class="progress-bar">
          <div class="progress" style="width: ${(currentQuestionIndex / currentCategory.questions.length) * 100}%"></div>
        </div>
        <div class="question-card">
          <h3>Вопрос ${currentQuestionIndex + 1} из ${currentCategory.questions.length}</h3>
          <p class="question-text">${currentQuestion.question}</p>
          <div class="options-container">
            ${currentQuestion.options.map((option, index) => `
              <div class="option" onclick="UI.checkAnswer(${index})">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
  
  // Проверка ответа
  checkAnswer: function(selectedIndex) {
    const currentQuestion = currentCategory.questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    
    // Обновляем статистику
    anatomyQuiz.userStats.totalQuestions++;
    if (isCorrect) {
      anatomyQuiz.userStats.correctAnswers++;
      score++;
    }
    
    // Показываем результат ответа
    this.showAnswerResult(isCorrect, currentQuestion.explanation);
  },
  
  // Отображение результата ответа
  showAnswerResult: function(isCorrect, explanation) {
    const optionsElements = document.querySelectorAll('.option');
    const currentQuestion = currentCategory.questions[currentQuestionIndex];
    
    // Отмечаем правильный ответ
    optionsElements[currentQuestion.correctAnswer].classList.add('correct-answer');
    
    // Если выбран неправильный ответ, отмечаем его красным
    if (!isCorrect) {
      const selectedOption = document.querySelector('.selected');
      if (selectedOption) {
        selectedOption.classList.add('wrong-answer');
      }
    }
    
    // Добавляем объяснение
    const questionCard = document.querySelector('.question-card');
    const explanationDiv = document.createElement('div');
    explanationDiv.classList.add('explanation');
    explanationDiv.innerHTML = `
      <p>${isCorrect ? '✓ Правильно!' : '✗ Неправильно'}</p>
      <p>${explanation}</p>
      <button onclick="UI.nextQuestion()">Далее</button>
    `;
    questionCard.appendChild(explanationDiv);
    
    // Блокируем клики по другим вариантам
    optionsElements.forEach(option => {
      option.style.pointerEvents = 'none';
    });
  },
  
  // Переход к следующему вопросу или завершение категории
  nextQuestion: function() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentCategory.questions.length) {
      this.renderQuestion();
    } else {
      this.showCategoryResults();
    }
  },
  
  // Отображение результатов категории
  showCategoryResults: function() {
    const mainContainer = document.getElementById('app');
    const percentage = Math.round((score / currentCategory.questions.length) * 100);
    
    // Обновляем статистику категорий
    anatomyQuiz.userStats.categoriesCompleted++;
    
    // Проверяем достижения
    if (percentage === 100) {
      const achievement = `Эксперт в ${currentCategory.name}`;
      if (!anatomyQuiz.userStats.achievements.includes(achievement)) {
        anatomyQuiz.userStats.achievements.push(achievement);
      }
    }
    
    mainContainer.innerHTML = `
      <div class="quiz-container">
        <div class="results-card">
          <h2>Результаты: ${currentCategory.name}</h2>
          <div class="score-circle">
            <span class="score-text">${percentage}%</span>
          </div>
          <p>Вы ответили правильно на ${score} из ${currentCategory.questions.length} вопросов.</p>
          ${percentage === 100 ? '<div class="achievement">🏆 Достижение: Эксперт в этой категории!</div>' : ''}
          <div class="buttons-container">
            <button onclick="UI.renderMainMenu()">На главную</button>
            <button onclick="UI.startCategory(${currentCategory.id})">Попробовать снова</button>
            <button onclick="shareResults()">Поделиться</button>
          </div>
        </div>
      </div>
    `;
  }
};

// Функция поделиться результатами через ВК
function shareResults() {
  const percentage = Math.round((anatomyQuiz.userStats.correctAnswers / anatomyQuiz.userStats.totalQuestions) * 100) || 0;
  const message = `Я прошел квиз по анатомии и ответил правильно на ${anatomyQuiz.userStats.correctAnswers} из ${anatomyQuiz.userStats.totalQuestions} вопросов (${percentage}%)! Попробуй свои силы!`;
  
  bridge.send('VKWebAppShare', {
    message: message
  });
}

// Глобальные переменные для отслеживания текущего состояния
let currentCategory;
let currentQuestionIndex;
let score;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
  UI.renderMainMenu();
});

// CSS стили для приложения
const styles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  }
  
  body {
    background-color: #EDEEF0;
    color: #000;
  }
  
  .quiz-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
  }
  
  h1, h2, h3 {
    text-align: center;
    margin-bottom: 16px;
  }
  
  .categories-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .category-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
    text-align: center;
  }
  
  .category-card:hover {
    transform: translateY(-4px);
  }
  
  .stats-panel {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .share-btn {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #4986CC;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .progress-bar {
    height: 8px;
    background-color: #EDEEF0;
    border-radius: 4px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background-color: #4986CC;
    transition: width 0.3s;
  }
  
  .question-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .question-text {
    font-size: 18px;
    margin-bottom: 16px;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .option {
    display: flex;
    align-items: center;
    background-color: #F5F6F8;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .option:hover {
    background-color: #EBF2FB;
  }
  
  .option.selected {
    background-color: #EBF2FB;
  }
  
  .option.correct-answer {
    background-color: #E8F5E9;
    border: 1px solid #4CAF50;
  }
  
  .option.wrong-answer {
    background-color: #FFEBEE;
    border: 1px solid #F44336;
  }
  
  .option-letter {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    background-color: #4986CC;
    color: white;
    border-radius: 50%;
    margin-right: 12px;
    font-weight: bold;
  }
  
  .explanation {
    margin-top: 16px;
    padding: 12px;
    background-color: #F5F6F8;
    border-radius: 8px;
  }
  
  .explanation button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    background-color: #4986CC;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .results-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
    background-color: #4986CC;
    border-radius: 50%;
    margin: 16px auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .score-text {
    color: white;
    font-size: 36px;
    font-weight: bold;
  }
  
  .achievement {
    margin: 16px 0;
    padding: 8px;
    background-color: #FFF8E1;
    border-radius: 8px;
    font-weight: bold;
  }
  
  .buttons-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
  }
  
  .buttons-container button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .buttons-container button:first-child {
    background-color: #F5F6F8;
  }
  
  .buttons-container button:nth-child(2) {
    background-color: #E8F5E9;
  }
  
  .buttons-container button:last-child {
    background-color: #4986CC;
    color: white;
  }
`;

// Добавляем стили на страницу
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);