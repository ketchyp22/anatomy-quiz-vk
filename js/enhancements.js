// Безопасная версия enhancements.js
// Весь код обернут в try-catch блоки для предотвращения блокировки основного приложения
(function() {
  try {
    console.log('Инициализация улучшений Анатомического квиза (безопасный режим)');
    
    // Глобальные переменные - внутри замыкания, чтобы не загрязнять глобальную область видимости
    var userStats = {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      bestScore: 0
    };
    
    // Текущая серия правильных ответов
    var currentStreak = 0;
    
    // ===== ФУНКЦИИ СТАТИСТИКИ =====
    
    // Загружаем сохраненную статистику
    function loadUserStats() {
      try {
        var savedStats = localStorage.getItem('anatomy-quiz-stats');
        if (savedStats) {
          userStats = JSON.parse(savedStats);
          console.log('Загружена статистика');
        }
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    }
    
    // Сохраняем статистику
    function saveUserStats() {
      try {
        localStorage.setItem('anatomy-quiz-stats', JSON.stringify(userStats));
      } catch (error) {
        console.error('Ошибка при сохранении статистики:', error);
      }
    }
    
    // Обновляем отображаемую статистику
    function updateStatsPanel() {
      try {
        var totalElement = document.getElementById('total-questions');
        var correctElement = document.getElementById('correct-answers');
        var rateElement = document.getElementById('success-rate');
        var bestElement = document.getElementById('best-score');
        
        if (totalElement && correctElement && rateElement && bestElement) {
          totalElement.textContent = userStats.totalQuestions;
          correctElement.textContent = userStats.correctAnswers;
          
          var successRate = userStats.totalQuestions > 0 
            ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100) 
            : 0;
          
          rateElement.textContent = successRate + '%';
          bestElement.textContent = userStats.bestScore;
        }
      } catch (error) {
        console.error('Ошибка при обновлении панели статистики:', error);
      }
    }
    
    // ===== UI КОМПОНЕНТЫ =====
    
    // Создаем панель статистики
    function createStatsPanel() {
      try {
        // Удаляем существующие панели, если они есть
        var existingPanels = document.querySelectorAll('.stats-panel');
        for (var i = 0; i < existingPanels.length; i++) {
          existingPanels[i].parentNode.removeChild(existingPanels[i]);
        }
        
        var statsPanel = document.createElement('div');
        statsPanel.className = 'stats-panel';
        statsPanel.style.cssText = [
          'width: 100%',
          'max-width: 500px',
          'margin: 15px auto',
          'border-radius: 8px',
          'background-color: #fff',
          'box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1)',
          'overflow: hidden'
        ].join(';');
        
        statsPanel.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background-color: #4a76a8; color: white;">
            <h3 style="margin: 0; font-weight: 500; font-size: 16px;">Ваша статистика</h3>
            <button id="stats-toggle" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0 5px;">▼</button>
          </div>
          <div id="stats-content" style="padding: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e7e8ec;">
              <span>Всего вопросов:</span>
              <span id="total-questions">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e7e8ec;">
              <span>Правильных ответов:</span>
              <span id="correct-answers">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e7e8ec;">
              <span>Процент успеха:</span>
              <span id="success-rate">0%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Лучшая серия:</span>
              <span id="best-score">0</span>
            </div>
          </div>
        `;
        
        // Вставляем перед main или в container
        var mainElement = document.querySelector('.main');
        if (mainElement && mainElement.parentElement) {
          mainElement.parentElement.insertBefore(statsPanel, mainElement);
        } else {
          var container = document.querySelector('.container');
          if (container) {
            container.appendChild(statsPanel);
          } else {
            document.body.appendChild(statsPanel);
          }
        }
        
        // Добавляем функциональность сворачивания/разворачивания
        var toggleBtn = document.getElementById('stats-toggle');
        var content = document.getElementById('stats-content');
        
        if (toggleBtn && content) {
          toggleBtn.addEventListener('click', function() {
            if (content.style.display === 'none') {
              content.style.display = 'block';
              toggleBtn.textContent = '▼';
            } else {
              content.style.display = 'none';
              toggleBtn.textContent = '▲';
            }
          });
        }
      } catch (error) {
        console.error('Ошибка при создании панели статистики:', error);
      }
    }
    
    // Создаем панель рейтинга
    function createLeaderboardPanel() {
      try {
        // Удаляем существующие панели, если они есть
        var existingPanels = document.querySelectorAll('.leaderboard-panel');
        for (var i = 0; i < existingPanels.length; i++) {
          existingPanels[i].parentNode.removeChild(existingPanels[i]);
        }
        
        var leaderboardPanel = document.createElement('div');
        leaderboardPanel.className = 'leaderboard-panel';
        leaderboardPanel.style.cssText = [
          'width: 100%',
          'max-width: 500px',
          'margin: 15px auto',
          'border-radius: 8px',
          'background-color: #fff',
          'box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1)',
          'overflow: hidden'
        ].join(';');
        
        leaderboardPanel.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background-color: #4a76a8; color: white;">
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
        
        // Добавляем после stats-panel или перед main
        var statsPanel = document.querySelector('.stats-panel');
        if (statsPanel && statsPanel.parentElement) {
          statsPanel.parentElement.insertBefore(leaderboardPanel, statsPanel.nextSibling);
        } else {
          var mainElement = document.querySelector('.main');
          if (mainElement && mainElement.parentElement) {
            mainElement.parentElement.insertBefore(leaderboardPanel, mainElement);
          } else {
            var container = document.querySelector('.container');
            if (container) {
              container.appendChild(leaderboardPanel);
            } else {
              document.body.appendChild(leaderboardPanel);
            }
          }
        }
        
        // Добавляем функциональность сворачивания/разворачивания
        var toggleBtn = document.getElementById('leaderboard-toggle');
        var content = document.getElementById('leaderboard-content');
        
        if (toggleBtn && content) {
          toggleBtn.addEventListener('click', function() {
            if (content.style.display === 'none') {
              content.style.display = 'block';
              toggleBtn.textContent = '▼';
            } else {
              content.style.display = 'none';
              toggleBtn.textContent = '▲';
            }
          });
        }
        
        // Обработчик для кнопки обновления
        var refreshBtn = document.getElementById('leaderboard-refresh');
        if (refreshBtn) {
          refreshBtn.addEventListener('click', updateLeaderboard);
        }
        
        // Обновляем таблицу лидеров
        updateLeaderboard();
      } catch (error) {
        console.error('Ошибка при создании панели рейтинга:', error);
      }
    }
    
    // Обновляем таблицу лидеров
    function updateLeaderboard() {
      try {
        var leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;
        
        leaderboardList.innerHTML = '<div style="text-align: center; color: #818c99; padding: 20px 0;">Загрузка...</div>';
        
        // Имитация загрузки с задержкой
        setTimeout(function() {
          try {
            // Демо-данные
            var demoLeaderboard = [
              { name: 'Иван П.', score: 95 },
              { name: 'Мария С.', score: 90 },
              { name: 'Алексей К.', score: 85 },
              { name: 'Елена В.', score: 80 },
              { name: 'Дмитрий Ж.', score: 75 }
            ];
            
            // Добавляем данные пользователя
            var leaderboardData = demoLeaderboard.slice();
            if (userStats.bestScore > 0) {
              leaderboardData.push({
                name: 'Вы', 
                score: userStats.bestScore,
                isCurrentUser: true
              });
              
              // Сортируем по убыванию результата
              leaderboardData.sort(function(a, b) {
                return b.score - a.score;
              });
            }
            
            // Формируем HTML
            var html = '';
            for (var i = 0; i < leaderboardData.length; i++) {
              var player = leaderboardData[i];
              var itemStyle = 'display: flex; padding: 10px; border-bottom: 1px solid #e7e8ec;';
              
              if (player.isCurrentUser) {
                itemStyle += 'background-color: rgba(81, 129, 184, 0.1); font-weight: 500;';
              }
              
              if (i === leaderboardData.length - 1) {
                itemStyle += 'border-bottom: none;';
              }
              
              html += '<div style="' + itemStyle + '">';
              html += '<div style="width: 30px; text-align: center; font-weight: 700;">' + (i + 1) + '</div>';
              html += '<div style="flex-grow: 1; padding: 0 10px;">' + player.name + '</div>';
              html += '<div style="width: 60px; text-align: right; font-weight: 500;">' + player.score + '</div>';
              html += '</div>';
            }
            
            leaderboardList.innerHTML = html;
          } catch (innerError) {
            console.error('Ошибка при обновлении списка лидеров:', innerError);
            leaderboardList.innerHTML = '<div style="text-align: center; color: #818c99; padding: 20px 0;">Ошибка загрузки</div>';
          }
        }, 500);
      } catch (error) {
        console.error('Ошибка при обновлении таблицы лидеров:', error);
      }
    }
    
    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    
    // Настраиваем слушатели для квиза
    function setupQuizListeners() {
      try {
        // Получаем контейнер с вариантами ответов
        var optionsContainer = document.getElementById('options');
        
        if (optionsContainer) {
          // Слушаем клики на вариантах ответов
          optionsContainer.addEventListener('click', function(event) {
            try {
              // Находим элемент варианта ответа
              var optionElement = null;
              
              if (event.target.classList.contains('option')) {
                optionElement = event.target;
              } else if (event.target.parentElement && event.target.parentElement.classList.contains('option')) {
                optionElement = event.target.parentElement;
              }
              
              if (!optionElement) return;
              
              // Определяем, является ли ответ правильным с задержкой
              setTimeout(function() {
                try {
                  var isCorrect = optionElement.classList.contains('correct');
                  
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
                  
                  // Обновляем UI и сохраняем данные
                  updateStatsPanel();
                  saveUserStats();
                } catch (innerError) {
                  console.error('Ошибка при обработке ответа:', innerError);
                }
              }, 500);
            } catch (clickError) {
              console.error('Ошибка при обработке клика:', clickError);
            }
          });
        }
        
        // Обработчик кнопки перезапуска
        var restartButton = document.getElementById('restart-quiz');
        if (restartButton) {
          restartButton.addEventListener('click', function() {
            try {
              currentStreak = 0; // Сбрасываем текущую серию
            } catch (error) {
              console.error('Ошибка при перезапуске:', error);
            }
          });
        }
        
        // Обработчик кнопки начала
        var startButton = document.getElementById('start-quiz');
        if (startButton) {
          startButton.addEventListener('click', function() {
            try {
              currentStreak = 0; // Сбрасываем текущую серию
            } catch (error) {
              console.error('Ошибка при старте:', error);
            }
          });
        }
      } catch (error) {
        console.error('Ошибка при настройке слушателей:', error);
      }
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ =====
    
    // Основная функция инициализации
    function initialize() {
      try {
        console.log('Запуск инициализации...');
        
        // Загружаем сохраненную статистику
        loadUserStats();
        
        // Создаем UI
        createStatsPanel();
        createLeaderboardPanel();
        
        // Обновляем данные в UI
        updateStatsPanel();
        
        // Настраиваем слушатели событий
        setupQuizListeners();
        
        console.log('Инициализация успешно завершена');
      } catch (error) {
        console.error('Ошибка при инициализации:', error);
      }
    }
    
    // Запуск инициализации
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initialize, 500);
      });
    } else {
      setTimeout(initialize, 500);
    }
    
  } catch (mainError) {
    console.error('Критическая ошибка в модуле улучшений:', mainError);
  }
})()
