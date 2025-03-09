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
  document.getElementById('sound-toggle').checked = settings.sound;
  document.getElementById('animations-toggle').checked = settings.animations;
}

// Обновление статистики пользователя на экране
function updateUserStats() {
  const stats = anatomyQuiz.userStats;
  
  if (!stats) return;
  
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
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) return;
  
  categoriesContainer.innerHTML = '';
  
  if (!anatomyQuiz.categories || !Array.isArray(anatomyQuiz.categories)) {
    console.error('Категории не найдены');
    return;
  }
  
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
  
  // Получаем лимит времени для выбранной сложности
  const difficulty = anatomyQuiz.difficultyLevels.find(d => d.id === selectedDifficulty);
  timeLeft = difficulty.timeLimit;
  
  // Переходим к экрану вопроса
  showScreen('question-screen');
  
  // Загружаем первый вопрос
  loadQuestion();
}

// Загрузка текущего вопроса
function loadQuestion() {
  if (!selectedCategory || !selectedCategory.questions || currentQuestionIndex >= selectedCategory.questions.length) {
    console.error('Ошибка загрузки вопроса');
    return;
  }

  const question = selectedCategory.questions[currentQuestionIndex];
  
  // Обновляем информацию в шапке
  document.getElementById('current-category-icon').textContent = selectedCategory.icon;
  document.getElementById('current-category-name').textContent = selectedCategory.name;
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  document.getElementById('total-category-questions').textContent = selectedCategory.questions.length;
  
  // Устанавливаем текст вопроса
  document.getElementById('question-text').textContent = question.question;
  
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
  answersContainer.innerHTML = '';
  
  if (question && Array.isArray(question.options)) {
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
  options[index].classList.add('selected');
  
  // Проверяем ответ после небольшой задержки
  setTimeout(() => {
    checkAnswer();
  }, 500);
}

// Проверка правильности ответа
function checkAnswer() {
  if (!selectedCategory || !selectedCategory.questions || currentQuestionIndex >= selectedCategory.questions.length) {
    console.error('Ошибка проверки ответа');
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
  const difficulty = anatomyQuiz.difficultyLevels.find(d => d.id === selectedDifficulty);
  timeLeft = difficulty.timeLimit;
  
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
  
  // Обновляем текст
  timerValue.textContent = timeLeft;
  
  // Обновляем полосу прогресса
  const difficulty = anatomyQuiz.difficultyLevels.find(d => d.id === selectedDifficulty);
  const progressWidth = (timeLeft / difficulty.timeLimit) * 100;
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
  // Обновляем общую статистику
  anatomyQuiz.userStats.totalQuestions += selectedCategory.questions.length;
  anatomyQuiz.userStats.correctAnswers += correctAnswers;
  
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
  
  anatomyQuiz.userStats.categoryProgress[selectedCategory.id].totalQuestions = selectedCategory.questions.length;
  anatomyQuiz.userStats.categoryProgress[selectedCategory.id].correctAnswers = correctAnswers;
  
  // Проверяем, завершена ли категория полностью
  if (correctAnswers === selectedCategory.questions.length) {
    anatomyQuiz.userStats.categoriesCompleted++;
  }
  
  // Обновляем дату последней игры и серию дней
  updateStreakDays();
  
  // Обновляем лучшую и худшую категории
  updateBestWorstCategories();
  
  // Сохраняем прогресс
  anatomyQuiz.utils.saveProgress();
}

// Обновление серии дней
function updateStreakDays() {
  if (!anatomyQuiz.userStats) return;
  
  const lastPlayed = anatomyQuiz.userStats.lastPlayed;
  const today = new Date().toISOString().split('T')[0];
  
  if (lastPlayed) {
    const lastDate = new Date(lastPlayed).toISOString().split('T')[0];
    
    // Если уже играли сегодня, оставляем без изменений
    if (lastDate === today) return;
    
    // Вычисляем вчерашнюю дату
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Если играли вчера, увеличиваем серию
    if (lastDate === yesterdayStr) {
      anatomyQuiz.userStats.streakDays = (anatomyQuiz.userStats.streakDays || 0) + 1;
    } else {
      // Если был пропуск, начинаем новую серию
      anatomyQuiz.userStats.streakDays = 1;
    }
  } else {
    // Первая игра
    anatomyQuiz.userStats.streakDays = 1;
  }
  
  // Обновляем дату последней игры
  anatomyQuiz.userStats.lastPlayed = new Date().toISOString();
}

// Обновление лучшей и худшей категорий
function updateBestWorstCategories() {
  const categories = Object.entries(anatomyQuiz.userStats.categoryProgress);
  
  if (categories.length > 0) {
    let bestId = categories[0][0];
    let worstId = categories[0][0];
    let bestScore = 0;
    let worstScore = 100;
    
    categories.forEach(([id, stats]) => {
      if (stats.totalQuestions > 0) {
        const score = (stats.correctAnswers / stats.totalQuestions) * 100;
        
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
        
        if (score < worstScore) {
          worstScore = score;
          worstId = id;
        }
      }
    });
    
    anatomyQuiz.userStats.bestCategory = bestId;
    anatomyQuiz.userStats.worstCategory = worstId;
  }
}

// Показ экрана результатов
function showResultScreen() {
  // Обновляем информацию о категории
  document.getElementById('result-category-icon').textContent = selectedCategory.icon;
  document.getElementById('result-category-name').textContent = selectedCategory.name;
  
  // Обновляем статистику
  document.getElementById('result-correct').textContent = correctAnswers;
  document.getElementById('result-total').textContent = selectedCategory.questions.length;
  
  // Вычисляем процент успеха
  const percent = Math.round((correctAnswers / selectedCategory.questions.length) * 100);
  document.getElementById('result-percentage').textContent = `${percent}%`;
  
  // Вычисляем время
  const totalTime = Math.ceil((Date.now() - startTime) / 1000);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  document.getElementById('result-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Рассчитываем награды
  let coinsEarned = correctAnswers * anatomyQuiz.rewards.correctAnswer.coins;
  let hintsEarned = 0;
  
  // Если категория пройдена полностью
  if (correctAnswers === selectedCategory.questions.length) {
    coinsEarned += anatomyQuiz.rewards.categoryCompletion.coins;
    hintsEarned += anatomyQuiz.rewards.categoryCompletion.hints;
  }
  
  document.getElementById('reward-coins').textContent = `+${coinsEarned}`;
  document.getElementById('reward-hints').textContent = `+${hintsEarned}`;
  
  // Проверяем разблокировку достижений
  const newAchievements = checkUnlockedAchievements();
  const achievementContainer = document.getElementById('achievement-container');
  
  if (newAchievements.length > 0) {
    achievementContainer.innerHTML = '';
    achievementContainer.classList.add('visible');
    
    newAchievements.forEach(achievement => {
      achievementContainer.innerHTML += `
        <div class="achievement">
          <span class="achievement-icon">${achievement.icon}</span>
          <div class="achievement-info">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
          </div>
        </div>
      `;
    });
  } else {
    achievementContainer.classList.remove('visible');
  }
  
  // Показываем экран результатов
  showScreen('result-screen');
}

// Проверка разблокированных достижений
function checkUnlockedAchievements() {
  const newAchievements = [];
  const achievements = anatomyQuiz.utils.checkAchievements();
  
  if (achievements && Array.isArray(achievements)) {
    achievements.forEach(achievementId => {
      const achievement = anatomyQuiz.achievements.find(a => a.id === achievementId);
      
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        newAchievements.push(achievement);
      }
    });
  }
  
  return newAchievements;
}

// Переключение между экранами
function showScreen(screenId) {
  // Скрываем текущий экран
  document.querySelector(`.screen.active`).classList.remove('active');
  
  // Показываем новый экран
  document.getElementById(screenId).classList.add('active');
  
  // Обновляем текущий экран
  currentScreen = screenId;
}

// Использование подсказки
function useHint(hintType) {
  // Проверяем, доступны ли подсказки
  if (anatomyQuiz.hints.available <= 0) {
    alert('У вас нет доступных подсказок!');
    return;
  }
  
  // Применяем подсказку в зависимости от типа
  switch (hintType) {
    case 'fifty_fifty':
      applyFiftyFiftyHint();
      break;
    case 'extra_time':
      applyExtraTimeHint();
      break;
    case 'hint':
      applyTextHint();
      break;
  }
  
  // Уменьшаем количество доступных подсказок
  anatomyQuiz.hints.available--;
  
  // Сохраняем прогресс
  anatomyQuiz.utils.saveProgress();
}

// Подсказка 50/50
function applyFiftyFiftyHint() {
  const question = selectedCategory.questions[currentQuestionIndex];
  const options = document.querySelectorAll('.answer-option');
  
  // Собираем индексы неправильных ответов
  const incorrectIndices = [];
  for (let i = 0; i < options.length; i++) {
    if (i !== question.correctAnswer) {
      incorrectIndices.push(i);
    }
  }
  
  // Выбираем случайно два неправильных ответа для скрытия
  const shuffled = incorrectIndices.sort(() => 0.5 - Math.random());
  const toHide = shuffled.slice(0, 2);
  
  // Скрываем выбранные варианты
  toHide.forEach(index => {
    options[index].classList.add('disabled');
    options[index].style.opacity = '0.3';
  });
}

// Подсказка с дополнительным временем
function applyExtraTimeHint() {
  // Добавляем 30 секунд к оставшемуся времени
  timeLeft += 30;
  
  // Обновляем отображение таймера
  updateTimerDisplay();
}

// Текстовая подсказка
function applyTextHint() {
  const question = selectedCategory.questions[currentQuestionIndex];
  const correctOption = question.options[question.correctAnswer];
  
  // Показываем модальное окно с подсказкой
  const modal = document.getElementById('explanation-modal');
  const content = document.getElementById('explanation-content');
  
  content.innerHTML = `
    <div class="hint-content">
      <h4>Подсказка</h4>
      <p>Обратите внимание на ответ, который содержит "${correctOption.substring(0, 3)}..."</p>
    </div>
  `;
  
  modal.classList.add('active');
  
  // Закрываем по клику на кнопку
  document.getElementById('explanation-close').addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

// Отображение экрана достижений
function showAchievementsScreen() {
  // Отрисовываем достижения
  renderAchievements();
  
  // Показываем экран
  showScreen('achievements-screen');
}

// Отрисовка достижений
function renderAchievements() {
  const container = document.getElementById('achievements-container');
  container.innerHTML = '';
  
  anatomyQuiz.achievements.forEach((achievement, index) => {
    const card = document.createElement('div');
    card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} animated`;
    card.style.animationDelay = `${index * 0.1}s`;
    
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
  // Применяем текущие настройки
  applySettings();
  
  // Показываем экран
  showScreen('settings-screen');
}

// Изменение темы
function changeTheme(theme) {
  // Обновляем тему в настройках
  anatomyQuiz.uiSettings.theme = theme;
  
  // Применяем тему
  document.body.className = theme === 'dark' ? 'dark-theme' : '';
  
  // Сохраняем настройки
  anatomyQuiz.utils.saveProgress();
}

// Изменение размера шрифта
function changeFontSize(size) {
  // Обновляем размер в настройках
  anatomyQuiz.uiSettings.fontSize = size;
  
  // Удаляем предыдущие классы размера
  document.body.classList.remove('font-small', 'font-medium', 'font-large');
  
  // Применяем новый размер
  document.body.classList.add(`font-${size}`);
  
  // Сохраняем настройки
  anatomyQuiz.utils.saveProgress();
}

// Переключение звука
function toggleSound(enabled) {
  anatomyQuiz.uiSettings.sound = enabled;
  anatomyQuiz.utils.saveProgress();
}

// Переключение анимаций
function toggleAnimations(enabled) {
  anatomyQuiz.uiSettings.animations = enabled;
  anatomyQuiz.utils.saveProgress();
}

// Сброс прогресса
function resetProgress() {
  // Используем метод из объекта данных
  anatomyQuiz.utils.resetProgress();
  
  // Обновляем статистику на экране
  updateUserStats();
  
  // Перерисовываем категории
  renderCategories();
  
  // Показываем уведомление
  alert('Ваш прогресс был успешно сброшен.');
}

// Отображение экрана учебных материалов
function showLearningScreen() {
  // Отображаем категории учебных материалов
  renderLearningCategories();
  
  // Показываем экран
  showScreen('learning-screen');
}

// Отрисовка категорий учебных материалов
function renderLearningCategories() {
  const categoriesContainer = document.querySelector('.learning-categories');
  categoriesContainer.innerHTML = '';
  
  // Добавляем кнопки для всех категорий
  anatomyQuiz.categories.forEach((category, index) => {
    const categoryButton = document.createElement('div');
    categoryButton.className = `learning-category ${index === 0 ? 'active' : ''}`;
    categoryButton.textContent = category.name;
    categoryButton.dataset.categoryId = category.id;
    
    categoryButton.addEventListener('click', () => {
      // Снимаем активный класс со всех кнопок
      document.querySelectorAll('.learning-category').forEach(button => {
        button.classList.remove('active');
      });
      
      // Делаем текущую кнопку активной
      categoryButton.classList.add('active');
      
      // Загружаем материалы для выбранной категории
      loadLearningMaterials(category.id);
    });
    
    categoriesContainer.appendChild(categoryButton);
  });
  
  // Загружаем материалы первой категории по умолчанию
  if (anatomyQuiz.categories.length > 0) {
    loadLearningMaterials(anatomyQuiz.categories[0].id);
  }
}

// Загрузка учебных материалов для выбранной категории
function loadLearningMaterials(categoryId) {
  const contentContainer = document.getElementById('learning-content');
  contentContainer.innerHTML = '';
  
  // Фильтруем материалы по выбранной категории
  const materials = anatomyQuiz.learningMaterials.filter(material => material.categoryId === parseInt(categoryId));
  
  if (materials.length > 0) {
    materials.forEach(material => {
      const materialDiv = document.createElement('div');
      materialDiv.className = 'learning-material';
      
      // Формируем HTML для материала
      let content = `
        <h3 class="learning-title">${material.title}</h3>
        <div class="learning-text">${material.content}</div>
      `;
      
      // Добавляем изображение, если оно есть
      if (material.imageUrl) {
        content += `<img src="${material.imageUrl}" alt="${material.title}" class="learning-image">`;
      }
      
      // Если материал заблокирован, показываем соответствующий индикатор
      if (!material.unlocked) {
        content += `<div class="locked-indicator">🔒 Продолжайте проходить квизы, чтобы разблокировать</div>`;
      }
      
      materialDiv.innerHTML = content;
      contentContainer.appendChild(materialDiv);
    });
    
    // Активируем первый материал
    const firstMaterial = contentContainer.querySelector('.learning-material');
    if (firstMaterial) {
      firstMaterial.classList.add('active');
    }
  } else {
    // Если материалов нет, показываем сообщение
    contentContainer.innerHTML = '<p class="no-materials">Для этой категории пока нет учебных материалов.</p>';
  }
}

// Показ модального окна подтверждения
function showConfirmModal(message, confirmCallback) {
  const modal = document.getElementById('confirmation-modal');
  document.getElementById('confirmation-message').textContent = message;
  
  // Сохраняем callback для подтверждения
  window.confirmCallback = confirmCallback;
  
  // Показываем модальное окно
  modal.classList.add('active');
}

// Закрытие модального окна подтверждения
function closeConfirmModal(confirmed) {
  const modal = document.getElementById('confirmation-modal');
  
  // Вызываем callback, если пользователь подтвердил
  if (confirmed && window.confirmCallback) {
    window.confirmCallback();
  }
  
  // Очищаем callback
  window.confirmCallback = null;
  
  // Скрываем модальное окно
  modal.classList.remove('active');
}

// Показ уведомления
function showNotification(message, duration = 3000) {
  // Создаем элемент уведомления, если его еще нет
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
  document.getElementById('back-to-menu').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите вернуться в главное меню? Прогресс будет потерян.')) {
      clearInterval(timerInterval);
      showScreen('main-menu');
    }
  });
  
  // Кнопки на экране результатов
  document.getElementById('retry-button').addEventListener('click', () => {
    startQuiz(selectedCategory);
  });
  
  document.getElementById('menu-button').addEventListener('click', () => {
    showScreen('main-menu');
  });
  
  // Кнопки в нижнем меню
  document.querySelector('.achievements-button').addEventListener('click', () => {
    showAchievementsScreen();
  });
  
  document.querySelector('.settings-button').addEventListener('click', () => {
    showSettingsScreen();
  });
  
  document.querySelector('.learning-button').addEventListener('click', () => {
    showLearningScreen();
  });
  
  // Кнопки подсказок
  document.querySelectorAll('.hint-button').forEach(button => {
    button.addEventListener('click', () => {
      useHint(button.dataset.hint);
    });
  });
  
  // Кнопки возврата из разных экранов
  document.getElementById('achievements-back').addEventListener('click', () => {
    showScreen('main-menu');
  });
  
  document.getElementById('settings-back').addEventListener('click', () => {
    showScreen('main-menu');
  });
  
  document.getElementById('learning-back').addEventListener('click', () => {
    showScreen('main-menu');
  });
  
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
  document.getElementById('sound-toggle').addEventListener('change', (e) => {
    toggleSound(e.target.checked);
  });
  
  document.getElementById('animations-toggle').addEventListener('change', (e) => {
    toggleAnimations(e.target.checked);
  });
  
  // Кнопка сброса прогресса
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
      resetProgress();
    }
  });
