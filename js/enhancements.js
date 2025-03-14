// ==== АНАТОМИЯ ВИКТОРИНА - ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ====
// Файл содержит новые функции для приложения Анатомия-Викторина ВК
// Автор: Claude, по заказу пользователя
// Создан: 15 Марта 2025

// Инициализация VK Mini Apps API
const bridge = window.bridge || {};

// Глобальные переменные
let userStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  lastScore: 0,
  bestScore: 0,
  history: []
};

let leaderboard = [];

// ==== ИНИЦИАЛИЗАЦИЯ ====
document.addEventListener('DOMContentLoaded', function() {
  // Создаем элементы интерфейса
  createStatsPanel();
  createLeaderboardPanel();
  
  // Добавляем слушатели событий для отслеживания действий в основном приложении
  setupEventListeners();
  
  // Запрашиваем данные текущего пользователя
  getUserData();
  
  // Загружаем таблицу лидеров
  loadLeaderboard();
  
  // Добавляем улучшенные анимации
  enhanceAnimations();
});

// ==== СТАТИСТИКА ПОЛЬЗОВАТЕЛЯ ====
function createStatsPanel() {
  // Создаем панель статистики
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
        <span>Лучший результат:</span>
        <span id="best-score">0</span>
      </div>
    </div>
  `;
  
  // Добавляем панель в DOM
  const app = document.querySelector('.app') || document.body;
  app.appendChild(statsPanel);
  
  // Добавляем функциональность сворачивания/разворачивания
  const toggleBtn = statsPanel.querySelector('.stats-toggle');
  const content = statsPanel.querySelector('.stats-content');
  
  toggleBtn.addEventListener('click', function() {
    content.classList.toggle('hidden');
    toggleBtn.textContent = content.classList.contains('hidden') ? '▲' : '▼';
  });
}

function updateStatsPanel() {
  // Обновляем отображаемую статистику
  document.getElementById('total-questions').textContent = userStats.totalQuestions;
  document.getElementById('correct-answers').textContent = userStats.correctAnswers;
  
  const successRate = userStats.totalQuestions > 0 
    ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100) 
    : 0;
  
  document.getElementById('success-rate').textContent = `${successRate}%`;
  document.getElementById('best-score').textContent = userStats.bestScore;
}

// ==== ТАБЛИЦА ЛИДЕРОВ ====
function createLeaderboardPanel() {
  // Создаем панель таблицы лидеров
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
  
  // Добавляем панель в DOM
  const app = document.querySelector('.app') || document.body;
  app.appendChild(leaderboardPanel);
  
  // Добавляем функциональность сворачивания/разворачивания
  const toggleBtn = leaderboardPanel.querySelector('.leaderboard-toggle');
  const content = leaderboardPanel.querySelector('.leaderboard-content');
  
  toggleBtn.addEventListener('click', function() {
    content.classList.toggle('hidden');
    toggleBtn.textContent = content.classList.contains('hidden') ? '▲' : '▼';
  });
  
  // Добавляем обработчик для кнопки обновления
  const refreshBtn = leaderboardPanel.querySelector('.leaderboard-refresh');
  refreshBtn.addEventListener('click', loadLeaderboard);
}

function updateLeaderboardPanel() {
  const leaderboardList = document.querySelector('.leaderboard-list');
  
  // Очищаем текущий список
  leaderboardList.innerHTML = '';
  
  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = '<div class="leaderboard-empty">Пока нет данных</div>';
    return;
  }
  
  // Создаем элементы для каждого игрока в топе
  leaderboard.forEach((player, index) => {
    const playerItem = document.createElement('div');
    playerItem.className = 'leaderboard-item';
    
    // Выделяем текущего пользователя
    if (player.isCurrentUser) {
      playerItem.classList.add('current-user');
    }
    
    playerItem.innerHTML = `
      <div class="leaderboard-rank">${index + 1}</div>
      <div class="leaderboard-name">${player.name}</div>
      <div class="leaderboard-score">${player.score}</div>
    `;
    
    leaderboardList.appendChild(playerItem);
  });
}

// ==== ИНТЕГРАЦИЯ С VK ====
function getUserData() {
  // Получаем данные о пользователе через VK Mini Apps API
  if (bridge.send) {
    bridge.send('VKWebAppGetUserInfo')
      .then(data => {
        // Сохраняем ID пользователя для таблицы лидеров
        userStats.userId = data.id;
        userStats.userName = `${data.first_name} ${data.last_name}`;
        
        // Загружаем сохраненную статистику пользователя
        loadUserStats(data.id);
      })
      .catch(error => {
        console.log('Ошибка при получении данных пользователя:', error);
      });
  } else {
    // Для тестирования без VK API
    userStats.userId = 'test-user';
    userStats.userName = 'Тестовый Пользователь';
    loadUserStats('test-user');
  }
}

function loadUserStats(userId) {
  // В реальном приложении здесь был бы запрос к серверу
  // Для демонстрации используем localStorage
  const savedStats = localStorage.getItem(`anatomy-quiz-stats-${userId}`);
  
  if (savedStats) {
    try {
      const parsedStats = JSON.parse(savedStats);
      userStats = { ...userStats, ...parsedStats };
      updateStatsPanel();
    } catch (e) {
      console.error('Ошибка при загрузке статистики:', e);
    }
  }
}

function saveUserStats() {
  // Сохраняем статистику пользователя
  if (userStats.userId) {
    localStorage.setItem(
      `anatomy-quiz-stats-${userStats.userId}`, 
      JSON.stringify({
        totalQuestions: userStats.totalQuestions,
        correctAnswers: userStats.correctAnswers,
        incorrectAnswers: userStats.incorrectAnswers,
        bestScore: userStats.bestScore,
        history: userStats.history
      })
    );
    
    // В реальном приложении здесь был бы запрос к серверу для обновления общей статистики
    updateLeaderboard();
  }
}

function loadLeaderboard() {
  // В реальном приложении здесь был бы запрос к серверу
  // Для демонстрации генерируем случайные данные
  
  document.querySelector('.leaderboard-list').innerHTML = 
    '<div class="leaderboard-loading">Загрузка...</div>';
  
  // Эмулируем задержку загрузки
  setTimeout(() => {
    // Генерируем тестовые данные для таблицы лидеров
    const demoLeaderboard = [
      { userId: 1, name: 'Иван Петров', score: 95 },
      { userId: 2, name: 'Мария Иванова', score: 92 },
      { userId: 3, name: 'Алексей Смирнов', score: 88 },
      { userId: 4, name: 'Елена Кузнецова', score: 85 },
      { userId: 5, name: 'Дмитрий Соколов', score: 82 }
    ];
    
    // Добавляем текущего пользователя, если есть статистика
    if (userStats.userId && userStats.bestScore > 0) {
      const userEntry = {
        userId: userStats.userId,
        name: userStats.userName || 'Вы',
        score: userStats.bestScore,
        isCurrentUser: true
      };
      
      // Добавляем пользователя и сортируем по убыванию score
      leaderboard = [...demoLeaderboard, userEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Ограничиваем до топ-10
    } else {
      leaderboard = demoLeaderboard;
    }
    
    updateLeaderboardPanel();
  }, 1000);
}

function updateLeaderboard() {
  // В реальном приложении здесь был бы запрос к серверу
  // Для демонстрации обновляем локальную версию
  
  if (userStats.userId && userStats.bestScore > 0) {
    // Проверяем, есть ли пользователь уже в списке
    const userIndex = leaderboard.findIndex(player => player.userId === userStats.userId);
    
    if (userIndex !== -1) {
      // Обновляем существующую запись
      leaderboard[userIndex].score = userStats.bestScore;
      leaderboard[userIndex].isCurrentUser = true;
    } else {
      // Добавляем нового пользователя
      leaderboard.push({
        userId: userStats.userId,
        name: userStats.userName || 'Вы',
        score: userStats.bestScore,
        isCurrentUser: true
      });
    }
    
    // Сортируем и ограничиваем список
    leaderboard = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    updateLeaderboardPanel();
  }
}

// ==== ИНТЕГРАЦИЯ С ОСНОВНЫМ ПРИЛОЖЕНИЕМ ====
function setupEventListeners() {
  // Отслеживаем события в основном приложении
  
  // Отслеживаем нажатия на варианты ответов
  document.addEventListener('click', function(event) {
    // Проверяем, является ли элемент вариантом ответа
    if (event.target.closest('.answer')) {
      const answerElement = event.target.closest('.answer');
      
      // Определяем, правильный ли ответ был выбран
      setTimeout(() => {
        const isCorrect = answerElement.classList.contains('correct');
        
        // Обновляем статистику
        userStats.totalQuestions++;
        
        if (isCorrect) {
          userStats.correctAnswers++;
          userStats.lastScore++;
        } else {
          userStats.incorrectAnswers++;
        }
        
        // Обновляем лучший результат
        if (userStats.lastScore > userStats.bestScore) {
          userStats.bestScore = userStats.lastScore;
        }
        
        // Сохраняем статистику
        updateStatsPanel();
        saveUserStats();
      }, 500); // Небольшая задержка, чтобы дождаться отображения результата
    }
  });
  
  // Отслеживаем начало новой игры
  // Это требует знания структуры основного приложения
  document.addEventListener('click', function(event) {
    // Пример: кнопка "Начать заново" или аналогичная
    if (event.target.closest('.restart-button') || 
        (event.target.closest('button') && 
         event.target.textContent.includes('Начать'))) {
      userStats.lastScore = 0;
    }
  });
}

// ==== УЛУЧШЕННЫЕ АНИМАЦИИ ====
function enhanceAnimations() {
  // Добавляем CSS-классы для анимаций
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Анимация появления вопроса */
    .question-container {
      animation: fadeInQuestion 0.5s ease-out;
    }
    
    /* Анимация при выборе правильного ответа */
    .answer.correct {
      animation: correctAnswer 0.8s ease-out !important;
    }
    
    /* Анимация при выборе неправильного ответа */
    .answer.incorrect {
      animation: incorrectAnswer 0.8s ease-out !important;
    }
    
    /* Анимация перехода к следующему вопросу */
    .question-container.exit {
      animation: exitQuestion 0.5s ease-in forwards;
    }
    
    /* Анимация подсчета результатов */
    .results-container {
      animation: showResults 1s ease-out;
    }
    
    /* Определения анимаций */
    @keyframes fadeInQuestion {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes correctAnswer {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); background-color: #4CAF50; }
      100% { transform: scale(1); }
    }
    
    @keyframes incorrectAnswer {
      0% { transform: scale(1); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
      100% { transform: scale(1); }
    }
    
    @keyframes exitQuestion {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(-30px); }
    }
    
    @keyframes showResults {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  
  document.head.appendChild(styleElement);
  
  // Добавляем классы к элементам при переходе между вопросами
  // Это требует знания структуры основного приложения
  const observeDOM = (function(){
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    return function(obj, callback){
      if (!obj || obj.nodeType !== 1) return; 
      
      if (MutationObserver) {
        const mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(obj, { childList: true, subtree: true });
        return mutationObserver;
      } else {
        // Резервный вариант для старых браузеров
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();
  
  // Отслеживаем изменения в DOM для применения анимаций
  const appContainer = document.querySelector('.app') || document.body;
  observeDOM(appContainer, function(mutations) {
    mutations.forEach(function(mutation) {
      // Новый вопрос добавлен
      const newQuestions = Array.from(mutation.addedNodes)
        .filter(node => node.nodeType === 1 && 
                (node.classList?.contains('question-container') || 
                 node.querySelector?.('.question-container')));
      
      if (newQuestions.length > 0) {
        // Добавляем выходную анимацию к старым вопросам перед удалением
        const oldQuestions = appContainer.querySelectorAll('.question-container:not(:last-child)');
        oldQuestions.forEach(q => q.classList.add('exit'));
      }
      
      // Результаты игры отображены
      const resultsAdded = Array.from(mutation.addedNodes)
        .filter(node => node.nodeType === 1 && 
                (node.classList?.contains('results-container') || 
                 node.querySelector?.('.results-container')));
      
      if (resultsAdded.length > 0) {
        // Выполняем дополнительные действия при показе результатов
        updateStatsPanel();
        saveUserStats();
        loadLeaderboard(); // Обновляем таблицу лидеров
      }
    });
  });
}
