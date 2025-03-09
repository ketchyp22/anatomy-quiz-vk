// Инициализация приложения при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});

// Глобальные переменные для хранения состояния приложения
let currentScreen = 'main-menu'; // Текущий экран
let selectedCategory = null; // Выбранная категория
let currentQuestionIndex = 0; // Индекс текущего вопроса
let selectedAnswerIndex = null; // Индекс выбранного ответа
let correctAnswers = 0; // Количество правильных ответов
let selectedDifficulty = 'easy'; // Выбранная сложность
let selectedGameMode = 'standard'; // Выбранный режим игры

// Инициализация приложения
function initApp() {
  // Загружаем прогресс из localStorage
  anatomyQuiz.utils.loadProgress();
  
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
  if (soundToggle) soundToggle.checked = settings.sound;
  
  const animationsToggle = document.getElementById('animations-toggle');
  if (animationsToggle) animationsToggle.checked = settings.animations;
}

// Обновление статистики пользователя на экране
function updateUserStats() {
  const stats = anatomyQuiz.userStats;
  
  const totalQuestionsElement = document.getElementById('total-questions');
  if (totalQuestionsElement) totalQuestionsElement.textContent = stats.totalQuestions;
  
  const correctAnswersElement = document.getElementById('correct-answers');
  if (correctAnswersElement) correctAnswersElement.textContent = stats.correctAnswers;
  
  const completedCategoriesElement = document.getElementById('completed-categories');
  if (completedCategoriesElement) completedCategoriesElement.textContent = stats.categoriesCompleted;
  
  const streakDaysElement = document.getElementById('streak-days');
  if (streakDaysElement) streakDaysElement.textContent = stats.streakDays;
}

// Отображение категорий на главном экране
function renderCategories() {
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) return;
  
  categoriesContainer.innerHTML = '';
  
  anatomyQuiz.categories.forEach((category, index) => {
    // Создаем карточку категории
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card animated';
    categoryCard.style.setProperty('--index', index);
    
    // Устанавливаем уникальный цвет для каждой категории
    const hue = (index * 30) % 360;
    categoryCard.style.borderLeftColor = `hsl(${hue}, 70%, 50%)`;
    
    // Рассчитываем прогресс по категории
    let progress = 0;
    if (anatomyQuiz.userStats.categoryProgress[category.id]) {
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
  
  // Переходим к экрану вопроса
  showScreen('question-screen');
  
  // Загружаем первый вопрос
  loadQuestion();
}

// Загрузка текущего вопроса
function loadQuestion() {
  if (!selectedCategory || !selectedCategory.questions || currentQuestionIndex >= selectedCategory.questions.length) {
    console.error("Невозможно загрузить вопрос - неверная категория или индекс");
    return;
  }
  
  const question = selectedCategory.questions[currentQuestionIndex];
  
  // Обновляем информацию в шапке
  const categoryIconElement = document.getElementById('current-category-icon');
  if (categoryIconElement) categoryIconElement.textContent = selectedCategory.icon;
  
  const categoryNameElement = document.getElementById('current-category-name');
  if (categoryNameElement) categoryNameElement.textContent = selectedCategory.name;
  
  const currentQuestionElement = document.getElementById('current-question');
  if (currentQuestionElement) currentQuestionElement.textContent = currentQuestionIndex + 1;
  
  const totalQuestionsElement = document.getElementById('total-category-questions');
  if (totalQuestionsElement) totalQuestionsElement.textContent = selectedCategory.questions.length;
  
  // Устанавливаем текст вопроса
  const questionTextElement = document.getElementById('question-text');
  if (questionTextElement) questionTextElement.textContent = question.question;
  
  // Отображаем варианты ответов
  renderAnswerOptions(question);
  
  // Сбрасываем выбранный ответ
  selectedAnswerIndex = null;
}

// Отображение вариантов ответа
function renderAnswerOptions(question) {
  const answersContainer = document.getElementById('answers-container');
  if (!answersContainer) return;
  
  answersContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'answer-option animated';
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
  
  // Выделяем выбранный вариант
  const options = document.querySelectorAll('.answer-option');
  if (options && options.length > index) {
    options[index].classList.add('selected');
  }
  
  // Проверяем ответ после небольшой задержки
  setTimeout(() => {
    checkAnswer();
  }, 500);
}

// Проверка правильности ответа
function checkAnswer() {
  if (!selectedCategory || !selectedCategory.questions || currentQuestionIndex >= selectedCategory.questions.length) {
    console.error("Невозможно проверить ответ - неверная категория или индекс");
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
  if (options && options.length) {
    options.forEach((option, index) => {
      if (index === question.correctAnswer) {
        option.classList.add('correct');
      } else if (index === selectedAnswerIndex) {
        option.classList.add('incorrect');
      }
      option.classList.add('disabled');
    });
  }
  
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
  if (selectedCategory && currentQuestionIndex < selectedCategory.questions.length) {
    loadQuestion();
  } else {
    // Иначе завершаем квиз
    finishQuiz();
  }
}

// Завершение квиза
function finishQuiz() {
  // Обновляем статистику пользователя
  updateUserStatsAfterQuiz();
  
  // Показываем экран результатов
  showResultScreen();
}

// Обновление статистики пользователя после квиза
function updateUserStatsAfterQuiz() {
  // Обновляем общую статистику
  anatomyQuiz.userStats.totalQuestions += selectedCategory.questions.length;
  anatomyQuiz.userStats.correctAnswers += correctAnswers;
  
  // Обновляем статистику по категории
  if (!anatomyQuiz.userStats.categoryProgress[selectedCategory.id]) {
    anatomyQuiz.userStats.categoryProgress[selectedCategory.id] = {
      totalQuestions: 0,
      correctAnswers: 0
    };
  }
  
  anatomyQuiz.userStats.categoryProgress[selectedCategory.id].totalQuestions = selectedCategory.questions.length;
  anatomyQuiz.userStats.categoryProgress[selectedCategory.id].correctAnswers = correctAnswers;
  
  // Проверяем, завершена ли категория полностью
  if (correctAnswers === selectedCategory.questions.length) {
    anatomyQuiz.userStats.categoriesCompleted++;
  }
  
  // Обновляем дату последней игры
  anatomyQuiz.userStats.lastPlayed = new Date().toISOString();
  
  // Сохраняем прогресс
  anatomyQuiz.utils.saveProgress();
}

// Показ экрана результатов
function showResultScreen() {
  // Проверяем наличие необходимых элементов
  if (!selectedCategory) return;
  
  // Обновляем информацию о категории
  const categoryIconElement = document.getElementById('result-category-icon');
  if (categoryIconElement) categoryIconElement.textContent = selectedCategory.icon;
  
  const categoryNameElement = document.getElementById('result-category-name');
  if (categoryNameElement) categoryNameElement.textContent = selectedCategory.name;
  
  // Обновляем статистику
  const correctElement = document.getElementById('result-correct');
  if (correctElement) correctElement.textContent = correctAnswers;
  
  const totalElement = document.getElementById('result-total');
  if (totalElement) totalElement.textContent = selectedCategory.questions.length;
  
  // Вычисляем процент успеха
  const percent = Math.round((correctAnswers / selectedCategory.questions.length) * 100);
  const percentageElement = document.getElementById('result-percentage');
  if (percentageElement) percentageElement.textContent = `${percent}%`;
  
  // Рассчитываем награды
  let coinsEarned = correctAnswers * anatomyQuiz.rewards.correctAnswer.coins;
  let hintsEarned = 0;
  
  // Если категория пройдена полностью
  if (correctAnswers === selectedCategory.questions.length) {
    coinsEarned += anatomyQuiz.rewards.categoryCompletion.coins;
    hintsEarned += anatomyQuiz.rewards.categoryCompletion.hints;
  }
  
  const coinsElement = document.getElementById('reward-coins');
  if (coinsElement) coinsElement.textContent = `+${coinsEarned}`;
  
  const hintsElement = document.getElementById('reward-hints');
  if (hintsElement) hintsElement.textContent = `+${hintsEarned}`;
  
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
  const backButton = document.getElementById('back-to-menu');
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите вернуться в главное меню? Прогресс будет потерян.')) {
        showScreen('main-menu');
      }
    });
  }
  
  // Кнопки на экране результатов
  const retryButton = document.getElementById('retry-button');
  if (retryButton) {
    retryButton.addEventListener('click', () => {
      startQuiz(selectedCategory);
    });
  }
  
  const menuButton = document.getElementById('menu-button');
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  // Кнопки в нижнем меню
  const achievementsButton = document.querySelector('.achievements-button');
  if (achievementsButton) {
    achievementsButton.addEventListener('click', () => {
      showAchievementsScreen();
    });
  }
  
  const settingsButton = document.querySelector('.settings-button');
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      showSettingsScreen();
    });
  }
  
  const learningButton = document.querySelector('.learning-button');
  if (learningButton) {
    learningButton.addEventListener('click', () => {
      showLearningScreen();
    });
  }
  
  // Кнопки возврата из разных экранов
  const achievementsBack = document.getElementById('achievements-back');
  if (achievementsBack) {
    achievementsBack.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  const settingsBack = document.getElementById('settings-back');
  if (settingsBack) {
    settingsBack.addEventListener('click', () => {
      showScreen('main-menu');
    });
  }
  
  const learningBack = document.getElementById('learning-back');
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
      changeTheme(button.dataset.theme);
    });
  });
  
  // Настройка размера шрифта
  document.querySelectorAll('.font-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.font-button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      changeFontSize(button.dataset.font);
    });
  });
  
  // Переключатели настроек
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('change', (e) => {
      anatomyQuiz.uiSettings.sound = e.target.checked;
      anatomyQuiz.utils.saveProgress();
    });
  }
  
  const animationsToggle = document.getElementById('animations-toggle');
  if (animationsToggle) {
    animationsToggle.addEventListener('change', (e) => {
      anatomyQuiz.uiSettings.animations = e.target.checked;
      anatomyQuiz.utils.saveProgress();
    });
  }
  
  // Кнопка сброса прогресса
  const resetButton = document.getElementById('reset-progress');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
        anatomyQuiz.utils.resetProgress();
        updateUserStats();
        renderCategories();
        alert('Ваш прогресс был успешно сброшен.');
      }
    });
  }
}

// Отображение экрана достижений
function showAchievementsScreen() {
  renderAchievements();
  showScreen('achievements-screen');
}

// Отрисовка достижений
function renderAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  anatomyQuiz.achievements.forEach((achievement, index) => {
    const card = document.createElement('div');
    card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} animated`;
    
    card.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
    `;
    
    container.appendChild(card);
  });
}

// Отображение экрана настроек
function showSettingsScreen() {
  applySettings();
  showScreen('settings-screen');
}

// Изменение темы
function changeTheme(theme) {
  anatomyQuiz.uiSettings.theme = theme;
  document.body.className = theme === 'dark' ? 'dark-theme' : '';
  anatomyQuiz.utils.saveProgress();
}

// Изменение размера шрифта
function changeFontSize(size) {
  anatomyQuiz.uiSettings.fontSize = size;
  document.body.classList.remove('font-small', 'font-medium', 'font-large');
  document.body.classList.add(`font-${size}`);
  anatomyQuiz.utils.saveProgress();
}

// Отображение экрана учебных материалов
function showLearningScreen() {
  renderLearningCategories();
  showScreen('learning-screen');
}

// Отрисовка категорий учебных материалов
function renderLearningCategories() {
  const categoriesContainer = document.querySelector('.learning-categories');
  if (!categoriesContainer) return;
  
  categoriesContainer.innerHTML = '';
  
  anatomyQuiz.categories.forEach((category, index) => {
    const categoryButton = document.createElement('div');
    categoryButton.className = `learning-category ${index === 0 ? 'active' : ''}`;
    categoryButton.textContent = category.name;
    categoryButton.dataset.categoryId = category.id;
    
    categoryButton.addEventListener('click', () => {
      document.querySelectorAll('.learning-category').forEach(button => {
        button.classList.remove('active');
      });
      categoryButton.classList.add('active');
      loadLearningMaterials(category.id);
    });
    
    categoriesContainer.appendChild(categoryButton);
  });
  
  if (anatomyQuiz.categories.length > 0) {
    loadLearningMaterials(anatomyQuiz.categories[0].id);
  }
}

// Загрузка учебных материалов для выбранной категории
function loadLearningMaterials(categoryId) {
  const contentContainer = document.getElementById('learning-content');
  if (!contentContainer) return;
  
  contentContainer.innerHTML = '';
  
  const materials = anatomyQuiz.learningMaterials.filter(material => material.categoryId === parseInt(categoryId));
  
  if (materials.length > 0) {
    materials.forEach(material => {
      const materialDiv = document.createElement('div');
      materialDiv.className = 'learning-material';
      
      let content = `
        <h3 class="learning-title">${material.title}</h3>
        <div class="learning-text">${material.content}</div>
      `;
      
      if (material.imageUrl) {
        content += `<img src="${material.imageUrl}" alt="${material.title}" class="learning-image">`;
      }
      
      if (!material.unlocked) {
        content += `<div class="locked-indicator">🔒 Продолжайте проходить квизы, чтобы разблокировать</div>`;
      }
      
      materialDiv.innerHTML = content;
      contentContainer.appendChild(materialDiv);
    });
    
    const firstMaterial = contentContainer.querySelector('.learning-material');
    if (firstMaterial) {
      firstMaterial.classList.add('active');
    }
  } else {
    contentContainer.innerHTML = '<p class="no-materials">Для этой категории пока нет учебных материалов.</p>';
  }
}
