// Совместимая версия enhancements.js, созданная специально для структуры вашего приложения
console.log('Инициализация улучшений Анатомического квиза...');

// Глобальные переменные для статистики
let userStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  bestScore: 0
};

// Текущая серия правильных ответов
let currentStreak = 0;

// Проверка и удаление существующих панелей (если были добавлены ранее)
document.querySelectorAll('.stats-panel, .leaderboard-panel').forEach(panel => panel.remove());

// ===== СОЗДАНИЕ UI ЭЛЕМЕНТОВ =====

// Создаем панель статистики
function createStatsPanel() {
  console.log('Создание панели статистики');
  
  const statsPanel = document.createElement('div');
  statsPanel.className = 'stats-panel';
  statsPanel.innerHTML = `
    <div class="stats-header">
      <h3>Ваша статистика</h3>
      <button class="stats-toggle">▼</button>
    </div>
    <div class="stats-content">
      <div class="stats-item">
        <span>Всего вопросов:</span>
        <span id="total-questions">0</span>
      </div>
      <div class="stats-item">
        <span>Правильных ответов:</span>
        <span id="correct-answers">0</span>
      </div>
      <div class="stats-item">
        <span>Процент успеха:</span>
        <span id="success-rate">0%</span>
      </div>
      <div class="stats-item">
        <span>Лучшая серия:</span>
        <span id="best-score">0</span>
      </div>
    </div>
  `;
  
  // Добавляем панель перед main
  const mainElement = document.querySelector('.main');
  if (mainElement) {
    mainElement.parentElement.insertBefore(statsPanel, mainElement);
    console.log('Панель статистики добавлена в DOM');
  } else {
    document.querySelector('.container').appendChild(statsPanel);
    console.log('Панель статистики добавлена в контейнер');
  }
  
  // Добавляем функциональность сворачивания/разворачивания
  const toggleBtn = statsPanel.querySelector('.stats-toggle');
  const content = statsPanel.querySelector('.stats-content');
  
  toggleBtn.addEventListener('click', function() {
    content.classList.toggle('hidden');
    toggleBtn.textContent = content.classList.contains('hidden') ? '▲' : '▼';
  });
}

// Создаем панель рейтинга
function createLeaderboardPanel() {
  console.log('Создание панели рейтинга');
  
  const leaderboardPanel = document.createElement('div');
  leaderboardPanel.className = 'leaderboard-panel';
  leaderboardPanel.innerHTML = `
    <div class="leaderboard-header">
      <h3>Топ игроков</h3>
      <button class="leaderboard-toggle">▼</button>
    </div>
    <div class="leaderboard-content">
      <div class="leaderboard-list">
        <div class="leaderboard-loading">Загрузка...</div>
      </div>
      <button class="leaderboard-refresh">Обновить</button>
    </div>
  `;
  
  // Добавляем панель после stats-panel
  const statsPanel = document.querySelector('.stats-panel');
  if (statsPanel) {
    statsPanel.parentElement.insertBefore(leaderboardPanel, statsPanel.nextSibling);
    console.log('Панель рейтинга добавлена после панели статистики');
  } else {
    const mainElement = document.querySelector('.main');
    if (mainElement) {
      mainElement.parentElement.insertBefore(leaderboardPanel, mainElement);
      console.log('Панель рейтинга добавлена перед main');
    } else {
      document.querySelector('.container').appendChild(leaderboardPanel);
      console.log('Панель рейтинга добавлена в контейнер');
    }
  }
  
  // Добавляем функциональность сворачивания/разворачивания
  const toggleBtn = leaderboardPanel.querySelector('.leaderboard-toggle');
  const content = leaderboardPanel.querySelector('.leaderboard-content');
  
  toggleBtn.addEventListener('click', function() {
    content.classList.toggle('hidden');
    toggleBtn.textContent = content.classList.contains('hidden') ? '▲' : '▼';
  });
  
  // Добавляем обработчик кнопки обновления
  const refreshBtn = leaderboardPanel.querySelector('.leaderboard-refresh');
  refreshBtn.addEventListener('click', function() {
    updateLeaderboard();
  });
}

// ===== ОБНОВЛЕНИЕ ДАННЫХ =====

// Обновляем отображаемую статистику
function updateStatsPanel() {
  console.log('Обновление панели статистики');
  
  const totalElement = document.getElementById('total-questions');
  const correctElement = document.getElementById('correct-answers');
  const rateElement = document.getElementById('success-rate');
  const bestElement = document.getElementById('best-score');
  
  if (totalElement && correctElement && rateElement && bestElement) {
    totalElement.textContent = userStats.totalQuestions;
    correctElement.textContent = userStats.correctAnswers;
    
    const successRate = userStats.totalQuestions > 0 
      ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100) 
      : 0;
    
    rateElement.textContent = `${successRate}%`;
    bestElement.textContent = userStats.bestScore;
    
    console.log('Статистика обновлена в интерфейсе');
  } else {
    console.error('Не удалось найти элементы статистики в DOM');
  }
}

// Обновляем таблицу лидеров
function updateLeaderboard() {
  console.log('Обновление таблицы лидеров');
  
  const leaderboardList = document.querySelector('.leaderboard-list');
  if (!leaderboardList) {
    console.error('Не удалось найти список лидеров в DOM');
    return;
  }
  
  leaderboardList.innerHTML = '<div class="leaderboard-loading">Загрузка...</div>';
  
  // Имитация загрузки данных с сервера
  setTimeout(() => {
    // Фиктивные данные для демонстрации
    const demoLeaderboard = [
      { name: 'Иван П.', score: 95 },
      { name: 'Мария С.', score: 90 },
      { name: 'Алексей К.', score: 85 },
      { name: 'Елена В.', score: 80 },
      { name: 'Дмитрий Ж.', score: 75 }
    ];
    
    // Добавляем данные текущего пользователя, если есть результаты
    let leaderboardData = [...demoLeaderboard];
    if (userStats.bestScore > 0) {
      leaderboardData.push({
        name: 'Вы', 
        score: userStats.bestScore,
        isCurrentUser: true
      });
      
      // Сортируем по убыванию результата
      leaderboardData.sort((a, b) => b.score - a.score);
    }
    
    // Формируем HTML для списка
    let leaderboardHTML = '';
    leaderboardData.forEach((player, index) => {
      leaderboardHTML += `
        <div class="leaderboard-item${player.isCurrentUser ? ' current-user' : ''}">
          <div class="leaderboard-rank">${index + 1}</div>
          <div class="leaderboard-name">${player.name}</div>
          <div class="leaderboard-score">${player.score}</div>
        </div>
      `;
    });
    
    leaderboardList.innerHTML = leaderboardHTML;
    console.log('Таблица лидеров обновлена');
  }, 500);
}

// ===== СОХРАНЕНИЕ И ЗАГРУЗКА ДАННЫХ =====

// Загружаем сохраненную статистику
function loadUserStats() {
  console.log('Загрузка сохраненной статистики');
  
  try {
    const savedStats = localStorage.getItem('anatomy-quiz-stats');
    if (savedStats) {
      userStats = JSON.parse(savedStats);
      console.log('Загружена статистика:', userStats);
    } else {
      console.log('Сохраненная статистика не найдена');
    }
  } catch (error) {
    console.error('Ошибка при загрузке статистики:', error);
  }
}

// Сохраняем статистику
function saveUserStats() {
  console.log('Сохранение статистики');
  
  try {
    localStorage.setItem('anatomy-quiz-stats', JSON.stringify(userStats));
    console.log('Статистика сохранена:', userStats);
  } catch (error) {
    console.error('Ошибка при сохранении статистики:', error);
  }
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

// Отслеживаем выбор варианта ответа
function setupQuizListeners() {
  console.log('Настройка слушателей для квиза');
  
  // Получаем контейнер с вариантами ответов
  const optionsContainer = document.getElementById('options');
  
  if (!optionsContainer) {
    console.error('Не удалось найти контейнер с вариантами ответов (#options)');
    return;
  }
  
  // Слушаем клики на вариантах ответов
  optionsContainer.addEventListener('click', function(event) {
    // Проверяем, является ли кликнутый элемент вариантом ответа
    const optionElement = event.target.closest('.option');
    if (!optionElement) return;
    
    console.log('Выбран вариант ответа:', optionElement.textContent.trim());
    
    // Определяем, является ли ответ правильным (по классу correct)
    // Добавляем небольшую задержку, чтобы дать приложению время отметить правильный ответ
    setTimeout(() => {
      const isCorrect = optionElement.classList.contains('correct');
      
      // Обновляем статистику
      userStats.totalQuestions++;
      
      if (isCorrect) {
        userStats.correctAnswers++;
        currentStreak++;
        console.log('Ответ правильный! Текущая серия:', currentStreak);
      } else {
        userStats.incorrectAnswers++;
        currentStreak = 0;
        console.log('Ответ неправильный. Серия сброшена.');
      }
      
      // Обновляем лучший результат
      if (currentStreak > userStats.bestScore) {
        userStats.bestScore = currentStreak;
        console.log('Новый рекорд серии правильных ответов:', userStats.bestScore);
      }
      
      // Обновляем интерфейс и сохраняем данные
      updateStatsPanel();
      saveUserStats();
      
    }, 500); // Задержка для определения правильности ответа
  });
  
  // Слушаем кнопку "Далее"
  const nextButton = document.getElementById('next-question');
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      console.log('Нажата кнопка "Далее"');
    });
  }
  
  // Слушаем кнопку "Пройти ещё раз"
  const restartButton = document.getElementById('restart-quiz');
  if (restartButton) {
    restartButton.addEventListener('click', function() {
      console.log('Перезапуск квиза');
      currentStreak = 0; // Сбрасываем текущую серию
    });
  }
  
  // Слушаем кнопку "Начать квиз"
  const startButton = document.getElementById('start-quiz');
  if (startButton) {
    startButton.addEventListener('click', function() {
      console.log('Начало квиза');
      currentStreak = 0; // Сбрасываем текущую серию
    });
  }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====

// Главная функция инициализации
function initializeEnhancements() {
  console.log('Инициализация улучшений...');
  
  // Загружаем сохраненную статистику
  loadUserStats();
  
  // Создаем UI элементы
  createStatsPanel();
  createLeaderboardPanel();
  
  // Обновляем данные в UI
  updateStatsPanel();
  updateLeaderboard();
  
  // Настраиваем слушатели событий
  setupQuizListeners();
  
  console.log('Улучшения инициализированы успешно');
}

// Запускаем инициализацию, когда DOM полностью загружен
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancements);
} else {
  // Если DOM уже загружен, запускаем сразу
  initializeEnhancements();
}
