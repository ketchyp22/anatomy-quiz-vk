// Инициализация приложения при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация приложения
  initApp();
});

// Глобальные переменные для хранения состояния приложения
let currentScreen = 'main-menu'; // Текущий экран
let selectedCategory = null; // Выбранная категория
let currentQuestionIndex = 0; // Индекс текущего вопроса
let selectedAnswerIndex = null; // Индекс выбранного ответа
let timeLeft = 0; // Оставшееся время
let timerInterval = null; // Интервал таймера
let correctAnswers = 0; // Количество правильных ответов
let selectedDifficulty = 'easy'; // Выбранная сложность
let selectedGameMode = 'standard'; // Выбранный режим игры
let startTime = 0; // Время начала вопроса

// Инициализация приложения
function initApp() {
  if (anatomyQuiz && anatomyQuiz.utils && typeof anatomyQuiz.utils.loadProgress === 'function') {
    // Загружаем прогресс из localStorage
    anatomyQuiz.utils.loadProgress();
  }
  
  // Применяем пользовательские настройки
  applySettings();
  
  // Обновляем статистику пользователя
  updateUserStats();
  
  // Отображаем категории
  renderCategories();
  
  // Добавляем обработчики событий
  setupEventListeners();
}

// Применение пользовательских настроек
function applySettings() {
  if (!anatomyQuiz || !anatomyQuiz.uiSettings) return;
  
  const settings = anatomyQuiz.uiSettings;
  
  // Тема оформления
  document.body.className = settings.theme === 'dark' ? 'dark-theme' : '';
  
  // Размер шрифта
  document.body.classList.add(`font-${settings.fontSize}`);
  
  // Отмечаем кнопки настроек
  document.querySelectorAll('.theme-button').forEach(button => {
    button.classList.toggle('active', button.dataset.theme === settings.theme);
  });
  
  document.querySelectorAll('.font-button').forEach(button => {
    button.classList.toggle('active', button.dataset.font === settings.fontSize);
  });
  
  // Переключатели
  const soundToggle = document.getElementById('sound-toggle');
  const animToggle = document.getElementById('animations-toggle');
  
  if (soundToggle) soundToggle.checked = settings.sound;
  if (animToggle) animToggle.checked = settings.animations;
}

// Обновление статистики пользователя на экране
function updateUserStats() {
  if (!anatomyQuiz || !anatomyQuiz.userStats) return;
  
  const stats = anatomyQuiz.userStats;
  
  const totalQuestionsElement = document.getElementById('total-questions');
  const correctAnswersElement = document.getElementById('correct-answers');
  const completedCategoriesElement = document.getElementById('completed-categories');
  const streakDaysElement = document.getElementById('streak-days');
  
  if (totalQuestionsElement) totalQuestionsElement.textContent = stats.totalQuestions || 0;
  if (correctAnswersElement) correctAnswersElement.textContent = stats.correctAnswers || 0;
  if (completedCategoriesElement) completedCategoriesElement.textContent = stats.categoriesCompleted || 0;
  if (streakDaysElement) streakDaysElement.textContent = stats.streakDays || 0;
}

// Отображение категорий на главном экране
function renderCategories() {
  if (!anatomyQuiz || !anatomyQuiz.categories) return;
  
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) return;
  
  categoriesContainer.innerHTML = '';
  
  anatomyQuiz.categories.forEach((category, index) => {
    // Создаем карточку категории
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card animated';
    categoryCard.style.setProperty('--index', index);
    categoryCard.style.animationDelay = `${index * 0.1}s`;
    
    // Устанавливаем уникальный цвет для каждой категории
    const hue = (index * 30) % 360;
    categoryCard.style.borderLeftColor = `hsl(${hue}, 70%, 50%)`;
    
    // Рассчитываем прогресс по категории
    let progress = 0;
    if (anatomyQuiz.userStats && anatomyQuiz.userStats.categoryProgress && anatomyQuiz.userStats.categoryProgress[category.id]) {
      const categoryStats = anatomyQuiz.userStats.categoryProgress[category.id];
      progress = Math.round((categoryStats.correctAnswers / categoryStats.totalQuestions) * 100);
    }
    
    // Заполняем карточку
    categoryCard.innerHTML = `
      <div class="category-icon">${category.icon}</div>
      <h3 class="category-title">${category.name}</h3>
      <p class="category-description">${category.description}</p>
      <div class="category-progress">
        <div class="progress-bar" style="width: ${progress}%;"></div>
      </div>
      <p class="category-stats">${progress}% завершено</p>
    `;
    
    // Добавляем обработчик клика
    categoryCard.addEventListener('click', () => {
      startQuiz(category);
    });
    
    // Добавляем карточку в контейнер
    categoriesContainer.appendChild(categoryCard);
  });
}

// Обработка клика по категории - начало квиза
function startQuiz(category) {
  // Сохраняем выбранную категорию
  selectedCategory = category;
  
  // Сбрасываем счетчики
  currentQuestionIndex = 0;
  correctAnswers = 0;
  
  // Получаем лимит времени для выбранной сложности
  const difficulty = anatomyQuiz.difficultyLevels.find(d => d.id === selectedDifficulty);
  timeLeft = difficulty ? difficulty.timeLimit : 30;
  
  // Переходим к экрану вопроса
  showScreen('question-screen');
  
  // Загружаем первый вопрос
  loadQuestion();
}

// Загрузка текущего вопроса
function loadQuestion() {
  if (!selectedCategory || !selectedCategory.questions || currentQuestionIndex >= selectedCategory.questions.length) {
    console.error("Ошибка загрузки вопроса");
    return;
  }

  const question = selectedCategory.questions[currentQuestionIndex];
  
  // Обновляем информацию в шапке
  const categoryIcon = document.getElementById('current-category-icon');
  const categoryName = document.getElementById('current-category-name');
  const currentQuestion = document.getElementById('current-question');
  const totalCategoryQuestions = document.getElementById('total-category-questions');
  
  if (categoryIcon) categoryIcon.textContent = selectedCategory.icon;
  if (categoryName) categoryName.textContent = selectedCategory.name;
  if (currentQuestion) currentQuestion.textContent = currentQuestionIndex + 1;
  if (totalCategoryQuestions) totalCategoryQuestions.textContent = selectedCategory.questions.length;
  
  // Устанавливаем текст вопроса
  const questionText = document.getElementById('question-text');
  if (questionText) questionText.textContent = question.question;
  
  // Отображаем варианты ответов
  renderAnswerOptions(question);
  
  // Сбрасываем выбранный ответ
  selectedAnswerIndex = null;
  
  // Запускаем таймер
  startTimer();
  
  // Запоминаем время начала вопроса
  startTime = Date.now();
}

// Отображение вариантов ответа
function renderAnswerOptions(question) {
  const answersContainer = document.getElementById('answers-container');
  if (!answersContainer) return;
  
  answersContainer.innerHTML = '';
  
  if (!question || !question.options) return;
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'answer-option animated';
    optionElement.style.animationDelay = `${index * 0.1}s`;
    optionElement.textContent = option;
    optionElement.dataset.index = index;
    
    // Добавляем обработчик клика
    optionElement.addEventListener('click', () => {
      selectAnswer(index);
    });
    
    answersContainer.appendChild(optionElement);
  });
}

// Выбор варианта ответа
function selectAnswer(index) {
  // Если ответ уже выбран, игнорируем
  if (selectedAnswerIndex !== null) return;
  
  // Сохраняем выбранный ответ
  selectedAnswerIndex = index;
  
  // Останавливаем таймер
  clearInterval(timerInterval);
  
  // Выделяем выбранный вариант
  const options = document.querySelectorAll('.answer-option');
  if (options[index]) options[index].classList.add('selected');
  
  // Проверяем ответ после небольшой задержки
  setTimeout(() => {
    checkAnswer();
  }, 500);
}

// Проверка правильности ответа
function checkAnswer() {
  if (!selectedCategory || !selectedCategory.questions || currentQuestionIndex >= selectedCategory.questions.length) {
    console.error("Ошибка проверки ответа");
    return;
  }
  
  const question = selectedCategory.questions[currentQuestionIndex];
  
  // Определяем, правильный ли ответ
  const isCorrect = selectedAnswerIndex === question.correctAnswer;
  
  // Обновляем статистику
  if (isCorrect) {
    correctAnswers++;
  }
  
  // Выделяем правильный и неправильный ответы
  const options = document.querySelectorAll('.answer-option');
  options.forEach((option, index) => {
    if (index === question.correctAnswer) {
      option.classList.add('correct');
    } else if (index === selectedAnswerIndex) {
      option.classList.add('incorrect');
    }
    option.classList.add('disabled');
  });
  
  // Показываем объяснение
  showExplanation(question.explanation, isCorrect);
  
  // Переходим к следующему вопросу через 2 секунды
  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

// Показ объяснения к ответу
function showExplanation(explanation, isCorrect) {
  const modal = document.getElementById('explanation-modal');
  const content = document.getElementById('explanation-content');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
      <p class="result-message">${isCorrect ? 'Правильно!' : 'Неправильно!'}</p>
      <p class="explanation-text">${explanation}</p>
    </div>
  `;
  
  modal.classList.add('active');
  
  // Автоматически закрываем через 2 секунды
  setTimeout(() => {
    modal.classList.remove('active');
  }, 2000);
}

// Переход к следующему вопросу
function nextQuestion() {
  currentQuestionIndex++;
  
  // Если есть еще вопросы, загружаем следующий
  if (currentQuestionIndex < selectedCategory.questions.length) {
    loadQuestion();
  } else {
    // Иначе завершаем квиз
    finishQuiz();
  }
}

// Запуск таймера
function startTimer() {
  // Получаем лимит времени для текущей сложности
  const difficulty = anatomyQuiz && anatomyQuiz.difficultyLevels ? 
    anatomyQuiz.difficultyLevels.find(d => d.id === selectedDifficulty) : null;
  timeLeft = difficulty && difficulty.timeLimit ? difficulty.timeLimit : 30;
  
  // Обновляем отображение таймера
  updateTimerDisplay();
  
  // Очищаем предыдущий интервал, если он был
  clearInterval(timerInterval);
  
  // Запускаем новый интервал
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    // Если время вышло
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

// Обновление отображения таймера
function updateTimerDisplay() {
  const timerValue = document.getElementById('timer-value');
  const timerProgress = document.getElementById('timer-progress');
  
  if (!timerValue || !timerProgress) return;
  
  // Обновляем текст
  timerValue.textContent = timeLeft;
  
  // Обновляем полосу прогресса
  const difficulty = anatomyQuiz && anatomyQuiz.difficultyLevels ? 
    anatomyQuiz.difficultyLevels.find(d => d.id === selectedDifficulty) : null;
  const maxTime = difficulty && difficulty.timeLimit ? difficulty.timeLimit : 30;
  const progressWidth = (timeLeft / maxTime) * 100;
  timerProgress.style.width = `${progressWidth}%`;
  
  // Меняем цвет при малом количестве времени
  if (timeLeft <= 5) {
    timerProgress.style.backgroundColor = 'var(--accent-color)';
  } else {
    timerProgress.style.backgroundColor = 'var(--primary-color)';
  }
}

// Действие при истечении времени
function timeUp() {
  // Если ответ не выбран
  if (selectedAnswerIndex === null) {
    // Показываем правильный ответ
    const question = selectedCategory.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
    options.forEach((option, index) => {
      if (index === question.correctAnswer) {
        option.classList.add('correct');
      }
      option.classList.add('disabled');
    });
    
    // Показываем объяснение
    showExplanation(question.explanation, false);
    
    // Переходим к следующему вопросу через 2 секунды
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }
}

// Завершение квиза
function finishQuiz() {
  // Останавливаем таймер
  clearInterval(timerInterval);
  
  // Обновляем статистику пользователя
  updateUserStatsAfterQuiz();
  
  // Показываем экран результатов
  showResultScreen();
}

// Обновление статистики пользователя после квиза
function updateUserStatsAfterQuiz() {
  if (!anatomyQuiz) return;
  
  // Проверяем доступность userStats
  if (!anatomyQuiz.userStats) {
    anatomyQuiz.userStats = {
      totalQuestions: 0,
      correctAnswers: 0,
      categoriesCompleted: 0,
      categoryProgress: {}
    };
  }
  
  // Обновляем общую статистику
  if (selectedCategory && selectedCategory.questions) {
    anatomyQuiz.userStats.totalQuestions += selectedCategory.questions.length;
    anatomyQuiz.userStats.correctAnswers += correctAnswers;
  }
  
  // Обновляем статистику по категории
  if (!anatomyQuiz.userStats.categoryProgress) {
    anatomyQuiz.userStats.categoryProgress = {};
  }
  
  if (!anatomyQuiz.userStats.categoryProgress[selectedCategory.id]) {
    anatomyQuiz.userStats.categoryProgress[selectedCategory.id] = {
      totalQuestions: 0,
      correctAnswers: 0
    };
  }
  
  if (selectedCategory && selectedCategory.questions) {
    anatomyQuiz.userStats.categoryProgress[selectedCategory.id].totalQuestions = selectedCategory.questions.length;
    anatomyQuiz.userStats.categoryProgress[selectedCategory.id].correctAnswers = correctAnswers;
  }
  
  // Проверяем, завершена ли категория полностью
  if (correctAnswers === selectedCategory.questions.length) {
    anatomyQuiz.userStats.categoriesCompleted++;
  }
  
  // Сохраняем прогресс
  if (anatomyQuiz.utils && anatomyQuiz.utils.saveProgress) {
    anatomyQuiz.utils.saveProgress();
  }
}

// Показ экрана результатов
function showResultScreen() {
  // Обновляем информацию о категории
  const categoryIcon = document.getElementById('result-category-icon');
  const categoryName = document.getElementById('result-category-name');
  
  if (categoryIcon) categoryIcon.textContent = selectedCategory.icon;
  if (categoryName) categoryName.textContent = selectedCategory.name;
  
  // Обновляем статистику
  const resultCorrect = document.getElementById('result-correct');
  const resultTotal = document.getElementById('result-total');
  const resultPercentage = document.getElementById('result-percentage');
  const resultTime = document.getElementById('result-time');
  
  if (resultCorrect) resultCorrect.textContent = correctAnswers;
  if (resultTotal) resultTotal.textContent = selectedCategory.questions.length;
  
  // Вычисляем процент успеха
  const percent = selectedCategory && selectedCategory.questions ? 
    Math.round((correctAnswers / selectedCategory.questions.length) * 100) : 0;
  if (resultPercentage) resultPercentage.textContent = `${percent}%`;
  
  // Вычисляем время
  const totalTime = Math.ceil((Date.now() - startTime) / 1000);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  if (resultTime) resultTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Рассчитываем награды
  let coinsEarned = correctAnswers;
  let hintsEarned = 0;
  
  // Если категория пройдена полностью
  if (selectedCategory && selectedCategory.questions && correctAnswers === selectedCategory.questions.length) {
    coinsEarned += 5;
    hintsEarned += 1;
  }
  
  const rewardCoins = document.getElementById('reward-coins');
  const rewardHints = document.getElementById('reward-hints');
  
  if (rewardCoins) rewardCoins.textContent = `+${coinsEarned}`;
  if (rewardHints) rewardHints.textContent = `+${hintsEarned}`;
  
  // Показываем экран результатов
  showScreen('result-screen');
}

// Переключение между экранами
function showScreen(screenId) {
  // Скрываем текущий экран
  const activeScreen = document.querySelector(`.screen.active`);
  if (activeScreen) activeScreen.classList.remove('active');
  
  // Показываем новый экран
  const newScreen = document.getElementById(screenId);
  if (newScreen) newScreen.classList.add('active');
  
  // Обновляем текущий экран
  currentScreen = screenId;
}

// Показ уведомления
function showNotification(message, duration = 3000) {
  // Создаем элемент уведомления
  let notification = document.getElementById('notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Устанавливаем текст
  notification.textContent = message;
  
  // Показываем уведомление
  notification.classList.add('active');
  
  // Скрываем через указанное время
  setTimeout(() => {
    notification.classList.remove('active');
  }, duration);
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Кнопки режимов игры
  document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.mode-button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      selectedGameMode = button.dataset.mode;
    });
  });
  
  // Кнопки сложности
  document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      selectedDifficulty = button.dataset.difficulty;
    });
  });
  
  // Кнопка возврата в меню из экрана вопроса
  const backToMenu = document.getElementById('back-to-menu');
  if (backToMenu) {
    backToMenu.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите вернуться в главное меню? Прогресс будет потерян.')) {
        clearInterval(timerInterval);
        showScreen('main-menu');
      }
    });
  }
  
  // Кнопки на экране результатов
  const retryButton = document.getElementById('retry-button');
  const menuButton = document.getElementById('menu-button');
  
  if (retryButton) {
    retryButton.addEventListener('click', () => {
      if (selectedCategory) {
        startQuiz(selectedCategory);
      }
    });
  }
  
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  // Кнопки в нижнем меню
  const achievementsButton = document.querySelector('.achievements-button');
  const settingsButton = document.querySelector('.settings-button');
  const learningButton = document.querySelector('.learning-button');
  
  if (achievementsButton) {
    achievementsButton.addEventListener('click', () => {
      showScreen('achievements-screen');
    });
  }
  
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      showScreen('settings-screen');
    });
  }
  
  if (learningButton) {
    learningButton.addEventListener('click', () => {
      showScreen('learning-screen');
    });
  }
  
  // Кнопки возврата из разных экранов
  const achievementsBack = document.getElementById('achievements-back');
  const settingsBack = document.getElementById('settings-back');
  const learningBack = document.getElementById('learning-back');
  
  if (achievementsBack) {
    achievementsBack.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  if (settingsBack) {
    settingsBack.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  if (learningBack) {
    learningBack.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  // Настройка темы
  document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.theme-button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const theme = button.dataset.theme;
      if (theme) {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        // Сохраняем настройку
        if (anatomyQuiz.uiSettings) {
          anatomyQuiz.uiSettings.theme = theme;
          if (anatomyQuiz.utils && anatomyQuiz.utils.saveProgress) {
            anatomyQuiz.utils.saveProgress();
          }
        }
      }
    });
  });
}
