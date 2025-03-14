// Упрощенная версия enhancements.js
// Фокусируется только на работающей статистике

// Глобальные переменные
let userStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  bestScore: 0
};

// Переменная для отслеживания текущей серии правильных ответов
let currentStreak = 0;

// Удаляем существующие панели перед созданием
document.querySelectorAll('.stats-panel, .leaderboard-panel').forEach(el => el.remove());

// Создаем интерфейс статистики
function createStatsUI() {
  // Создаем панель статистики
  const statsPanel = document.createElement('div');
  statsPanel.className = 'stats-panel';
  statsPanel.style.cssText = `
    width: 100%;
    max-width: 500px;
    margin: 10px auto;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f5f5f5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  `;
  
  // Добавляем содержимое
  statsPanel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background-color: #4a76a8; color: white;">
      <h3 style="margin: 0; font-weight: 500; font-size: 16px;">Ваша статистика</h3>
      <button id="stats-toggle" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0 5px;">▼</button>
    </div>
    <div id="stats-content" style="padding: 15px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">
        <span>Всего вопросов:</span>
        <span id="total-questions">0</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">
        <span>Правильных ответов:</span>
        <span id="correct-answers">0</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">
        <span>Процент успеха:</span>
        <span id="success-rate">0%</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Лучшая серия:</span>
        <span id="best-score">0</span>
      </div>
    </div>
  `;
  
  // Добавляем на страницу
  const app = document.querySelector('.app') || document.body;
  app.appendChild(statsPanel);
  
  // Функциональность сворачивания/разворачивания
  const toggleBtn = document.getElementById('stats-toggle');
  const content = document.getElementById('stats-content');
  
  toggleBtn.addEventListener('click', function() {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      toggleBtn.textContent = '▼';
    } else {
      content.style.display = 'none';
      toggleBtn.textContent = '▲';
    }
  });
  
  // Обновляем статистику при создании
  updateStats();
}

// Создаем таблицу лидеров
function createLeaderboardUI() {
  // Создаем панель лидеров
  const leaderboardPanel = document.createElement('div');
  leaderboardPanel.className = 'leaderboard-panel';
  leaderboardPanel.style.cssText = `
    width: 100%;
    max-width: 500px;
    margin: 15px auto;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f5f5f5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  `;
  
  // Добавляем содержимое
  leaderboardPanel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background-color: #4a76a8; color: white;">
      <h3 style="margin: 0; font-weight: 500; font-size: 16px;">Топ игроков</h3>
      <button id="leaderboard-toggle" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0 5px;">▼</button>
    </div>
    <div id="leaderboard-content" style="padding: 15px;">
      <div id="leaderboard-list">
        <div style="text-align: center; color: #818c99; padding: 20px 0;">Загрузка...</div>
      </div>
      <button id="leaderboard-refresh" style="width: 100%; padding: 10px; background-color: #5181b8; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; margin-top: 10px;">Обновить</button>
    </div>
  `;
  
  // Добавляем на страницу
  const app = document.querySelector('.app') || document.body;
  app.appendChild(leaderboardPanel);
  
  // Функциональность сворачивания/разворачивания
  const toggleBtn = document.getElementById('leaderboard-toggle');
  const content = document.getElementById('leaderboard-content');
  
  toggleBtn.addEventListener('click', function() {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      toggleBtn.textContent = '▼';
    } else {
      content.style.display = 'none';
      toggleBtn.textContent = '▲';
    }
  });
  
  // Обновить таблицу лидеров при создании
  updateLeaderboard();
  
  // Обработчик для кнопки обновления
  document.getElementById('leaderboard-refresh').addEventListener('click', updateLeaderboard);
}

// Обновляем отображение статистики
function updateStats() {
  document.getElementById('total-questions').textContent = userStats.totalQuestions;
  document.getElementById('correct-answers').textContent = userStats.correctAnswers;
  
  const rate = userStats.totalQuestions > 0 
    ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100) 
    : 0;
  
  document.getElementById('success-rate').textContent = `${rate}%`;
  document.getElementById('best-score').textContent = userStats.bestScore;
}

// Обновляем таблицу лидеров
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Генерируем случайные данные для демо
  const names = ['Иван П.', 'Мария И.', 'Алексей С.', 'Елена К.', 'Дмитрий С.', 'Ольга Р.', 'Сергей В.'];
  const scores = [95, 92, 88, 85, 82, 78, 75];
  
  // Добавляем текущего пользователя
  const userData = {
    name: 'Вы',
    score: userStats.bestScore
  };
  
  // Создаем список лидеров
  let leaderboardHTML = '';
  let userAdded = false;
  
  // Генерируем таблицу лидеров
  for (let i = 0; i < 7; i++) {
    // Если счет пользователя больше текущего в списке и пользователь еще не добавлен
    if (userData.score > scores[i] && !userAdded && userData.score > 0) {
      leaderboardHTML += `
        <div style="display: flex; padding: 10px; border-bottom: 1px solid #e0e0e0; background-color: rgba(81, 129, 184, 0.1); font-weight: 500;">
          <div style="width: 30px; text-align: center; font-weight: 700;">${i+1}</div>
          <div style="flex-grow: 1; padding: 0 10px;">${userData.name}</div>
          <div style="width: 60px; text-align: right; font-weight: 500;">${userData.score}</div>
        </div>
      `;
      userAdded = true;
      i--; // Чтобы не пропустить текущий элемент демо-данных
    } else {
      leaderboardHTML += `
        <div style="display: flex; padding: 10px; border-bottom: 1px solid #e0e0e0;">
          <div style="width: 30px; text-align: center; font-weight: 700;">${i+1}</div>
          <div style="flex-grow: 1; padding: 0 10px;">${names[i]}</div>
          <div style="width: 60px; text-align: right; font-weight: 500;">${scores[i]}</div>
        </div>
      `;
    }
  }
  
  // Если пользователь не попал в топ, добавляем его в конец
  if (!userAdded && userData.score > 0) {
    leaderboardHTML += `
      <div style="display: flex; padding: 10px; border-bottom: 1px solid #e0e0e0; background-color: rgba(81, 129, 184, 0.1); font-weight: 500; margin-top: 10px;">
        <div style="width: 30px; text-align: center; font-weight: 700;">-</div>
        <div style="flex-grow: 1; padding: 0 10px;">${userData.name}</div>
        <div style="width: 60px; text-align: right; font-weight: 500;">${userData.score}</div>
      </div>
    `;
  }
  
  // Обновляем содержимое
  leaderboardList.innerHTML = leaderboardHTML;
}

// Загрузка сохраненной статистики
function loadStats() {
  try {
    const savedStats = localStorage.getItem('anatomy-quiz-stats-simple');
    if (savedStats) {
      userStats = JSON.parse(savedStats);
      console.log('Загружена статистика:', userStats);
    }
  } catch (e) {
    console.error('Ошибка при загрузке статистики:', e);
  }
}

// Сохранение статистики
function saveStats() {
  try {
    localStorage.setItem('anatomy-quiz-stats-simple', JSON.stringify(userStats));
    console.log('Статистика сохранена:', userStats);
  } catch (e) {
    console.error('Ошибка при сохранении статистики:', e);
  }
}

// Обработчик кликов по вариантам ответов
function handleAnswerClick(event) {
  // Проверяем, был ли клик по варианту ответа
  // Перебираем все возможные селекторы, которые могут быть в вашем приложении
  const answerElements = ['li', '.answer', '.variant', '.option', '.quiz-option'];
  
  let answerElement = null;
  for (const selector of answerElements) {
    if (event.target.closest(selector)) {
      answerElement = event.target.closest(selector);
      break;
    }
  }
  
  if (!answerElement) return; // Не вариант ответа
  
  console.log('Клик по варианту ответа');
  
  // Проверяем, правильный ли ответ (с задержкой)
  setTimeout(() => {
    // Проверяем возможные индикаторы правильного ответа
    // 1. Проверка по классам
    const correctClasses = ['correct', 'right', 'success', 'true'];
    let isCorrect = correctClasses.some(cls => answerElement.classList.contains(cls));
    
    // 2. Проверка по цвету фона
    if (!isCorrect) {
      const bgColor = getComputedStyle(answerElement).backgroundColor;
      isCorrect = bgColor.includes('0, 128, 0') || // rgb(0, 128, 0) - зеленый
                  bgColor.includes('0, 255, 0') || // rgb(0, 255, 0) - светло-зеленый
                  bgColor.includes('75, 179, 75') || // rgb(75, 179, 75) - зеленый
                  bgColor.includes('green');
    }
    
    // 3. Проверка по тексту (если есть слово "правильно" рядом)
    if (!isCorrect) {
      const containerText = answerElement.textContent.toLowerCase();
      isCorrect = containerText.includes('правильно') || 
                  containerText.includes('верно') ||
                  containerText.includes('correct');
    }
    
    console.log('Правильный ответ?', isCorrect);
    
    // Обновляем статистику
    userStats.totalQuestions++;
    
    if (isCorrect) {
      userStats.correctAnswers++;
      currentStreak++;
    } else {
      userStats.incorrectAnswers++;
      currentStreak = 0;
    }
    
    // Обновляем лучший результат
    if (currentStreak > userStats.bestScore) {
      userStats.bestScore = currentStreak;
    }
    
    // Обновляем интерфейс и сохраняем
    updateStats();
    saveStats();
    updateLeaderboard();
    
    console.log('Статистика обновлена:', userStats);
  }, 1000); // Увеличенная задержка для надежности
}

// Обработчик для кнопки перезапуска
function handleRestart(event) {
  // Проверяем возможные кнопки перезапуска
  const restartSelectors = [
    '.restart', '.start', '.reset', '.new-game',
    '#restart', '#start', '#new-game'
  ];
  
  let isRestartButton = restartSelectors.some(
    selector => event.target.matches(selector) || event.target.closest(selector)
  );
  
  // Проверяем по тексту кнопки
  if (!isRestartButton && event.target.tagName === 'BUTTON') {
    const buttonText = event.target.textContent.toLowerCase();
    isRestartButton = buttonText.includes('начать') || 
                      buttonText.includes('заново') ||
                      buttonText.includes('сначала') ||
                      buttonText.includes('restart') ||
                      buttonText.includes('start') ||
                      buttonText.includes('new game');
  }
  
  if (isRestartButton) {
    console.log('Перезапуск игры');
    currentStreak = 0;
  }
}

// Инициализация
function init() {
  console.log('Инициализация улучшений...');
  
  // Загружаем сохраненную статистику
  loadStats();
  
  // Создаем пользовательский интерфейс
  createStatsUI();
  createLeaderboardUI();
  
  // Добавляем обработчики событий
  document.addEventListener('click', handleAnswerClick);
  document.addEventListener('click', handleRestart);
  
  console.log('Улучшения инициализированы');
}

// Запуск инициализации с задержкой
setTimeout(init, 500);
