// Улучшенный UI компонент
const UI = {
  // Отображение главного меню
  renderMainMenu: function() {
    // Проверка и обновление ежедневной активности
    this.checkDailyStreak();
    
    const mainContainer = document.getElementById('app');
    mainContainer.innerHTML = `
      <div class="quiz-container fade-in">
        <div class="app-header">
          <h1>Анатомия Человека</h1>
          <p>Проверьте свои знания о человеческом теле</p>
        </div>
        
        <div class="categories-container">
          ${anatomyQuiz.categories.map((category, index) => `
            <div class="category-card fade-in delay-${index + 1}" onclick="UI.startCategory(${category.id})">
              <div class="category-icon">${category.icon}</div>
              <h3>${category.name}</h3>
              <p>${category.questions.length} вопросов</p>
            </div>
          `).join('')}
        </div>
        
        <div class="stats-panel fade-in delay-4">
          <h3>Ваша статистика</h3>
          <div class="stats-card">
            <div class="stat-item">
              <div class="stat-value">${anatomyQuiz.userStats.correctAnswers}</div>
              <div class="stat-label">Правильных ответов</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${anatomyQuiz.userStats.totalQuestions}</div>
              <div class="stat-label">Всего вопросов</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${anatomyQuiz.userStats.categoriesCompleted}</div>
              <div class="stat-label">Категорий</div>
            </div>
          </div>
          ${this.renderAchievements()}
          ${anatomyQuiz.userStats.streakDays > 0 ? 
            `<div class="streak-info">
              <p>🔥 Вы играете ${anatomyQuiz.userStats.streakDays} ${this.getDayWord(anatomyQuiz.userStats.streakDays)} подряд!</p>
            </div>` : ''}
        </div>
        
        <button class="button fade-in delay-4" onclick="shareResults()">
          <span class="button-icon">📱</span> Поделиться результатами
        </button>
      </div>
    `;
  },
  
  // Метод для отображения достижений
  renderAchievements: function() {
    if (anatomyQuiz.userStats.achievements.length === 0) {
      return '<p>У вас пока нет достижений. Пройдите квиз, чтобы получить награды!</p>';
    }
    
    return `
      <div class="achievements-section">
        <h4>Ваши достижения:</h4>
        <div class="achievements-list">
          ${anatomyQuiz.userStats.achievements.map(achievement => {
            const achievementData = anatomyQuiz.achievements.find(a => a.id === achievement) || 
                                   { name: achievement, icon: "🏆" };
            return `
              <div class="achievement-item">
                <span class="achievement-icon">${achievementData.icon}</span>
                <span class="achievement-name">${achievementData.name}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },
  
  // Склонение слова "день"
  getDayWord: function(days) {
    if (days % 10 === 1 && days % 100 !== 11) {
      return "день";
    } else if ((days % 10 >= 2 && days % 10 <= 4) && (days % 100 < 10 || days % 100 >= 20)) {
      return "дня";
    } else {
      return "дней";
    }
  },
  
  // Проверка и обновление ежедневной активности
  checkDailyStreak: function() {
    const today = new Date().toDateString();
    const lastPlayed = anatomyQuiz.userStats.lastPlayed;
    
    if (!lastPlayed) {
      // Первый запуск
      anatomyQuiz.userStats.streakDays = 1;
      anatomyQuiz.userStats.lastPlayed = today;
    } else if (lastPlayed !== today) {
      const lastDate = new Date(lastPlayed);
      const currentDate = new Date(today);
      
      // Вычисляем разницу в днях
      const timeDiff = currentDate.getTime() - lastDate.getTime();
      const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
      
      if (dayDiff === 1) {
        // Последовательный день
        anatomyQuiz.userStats.streakDays += 1;
        
        // Проверка на достижение
        if (anatomyQuiz.userStats.streakDays >= 3 && 
            !anatomyQuiz.userStats.achievements.includes("daily_streak")) {
          anatomyQuiz.userStats.achievements.push("daily_streak");
          this.showAchievementNotification("Ежедневная активность");
        }
      } else if (dayDiff > 1) {
        // Пропущен день, сбрасываем счетчик
        anatomyQuiz.userStats.streakDays = 1;
      }
      
      anatomyQuiz.userStats.lastPlayed = today;
    }
    
    // Сохраняем данные
    this.saveUserStats();
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
      <div class="quiz-container fade-in">
        <h2>${currentCategory.name} ${currentCategory.icon}</h2>
        <div class="progress-bar">
          <div class="progress" style="width: ${(currentQuestionIndex / currentCategory.questions.length) * 100}%"></div>
        </div>
        <div class="question-card">
          <div class="question-number">Вопрос ${currentQuestionIndex + 1} из ${currentCategory.questions.length}</div>
          <p class="question-text">${currentQuestion.question}</p>
          <div class="options-container">
            ${currentQuestion.options.map((option, index) => `
              <div class="option fade-in delay-${index + 1}" onclick="UI.checkAnswer(${index})">
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
    this.showAnswerResult(isCorrect, currentQuestion.explanation, selectedIndex);
    
    // Сохраняем статистику
    this.saveUserStats();
  },
  
  // Отображение результата ответа
  showAnswerResult: function(isCorrect, explanation, selectedIndex) {
    const optionsElements = document.querySelectorAll('.option');
    const currentQuestion = currentCategory.questions[currentQuestionIndex];
    
    // Отмечаем выбранный ответ
    optionsElements[selectedIndex].classList.add('selected');
    
    // Отмечаем правильный ответ
    optionsElements[currentQuestion.correctAnswer].classList.add('correct-answer');
    
    // Если выбран неправильный ответ, отмечаем его красным
    if (!isCorrect) {
      optionsElements[selectedIndex].classList.add('wrong-answer');
    }
    
    // Добавляем объяснение
    const questionCard = document.querySelector('.question-card');
    const explanationDiv = document.createElement('div');
    explanationDiv.classList.add('explanation', 'fade-in');
    explanationDiv.innerHTML = `
      <p class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? '✓ Правильно!' : '✗ Неправильно'}</p>
      <p>${explanation}</p>
      <button class="button" onclick="UI.nextQuestion()">Далее</button>
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
    const isPerfect = percentage === 100;
    
    // Проверяем, была ли эта категория уже завершена
    const isNewCompletion = !anatomyQuiz.userStats.achievements.includes(`expert_${currentCategory.id}`);
    
    // Обновляем статистику категорий если это новое прохождение
    if (isNewCompletion) {
      anatomyQuiz.userStats.categoriesCompleted++;
    }
    
    // Проверяем достижения
    let newAchievements = [];
    
    if (isPerfect && isNewCompletion) {
      const achievement = `expert_${currentCategory.id}`;
      if (!anatomyQuiz.userStats.achievements.includes(achievement)) {
        anatomyQuiz.userStats.achievements.push(achievement);
        newAchievements.push("Эксперт в категории");
      }
    }
    
    // Проверяем завершение всех категорий
    const completedAllCategories = anatomyQuiz.categories.every(category => 
      anatomyQuiz.userStats.achievements.includes(`expert_${category.id}`)
    );
    
    if (completedAllCategories && !anatomyQuiz.userStats.achievements.includes("quiz_master")) {
      anatomyQuiz.userStats.achievements.push("quiz_master");
      newAchievements.push("Мастер анатомии");
    }
    
    // Сохраняем статистику
    this.saveUserStats();
    
    // Определяем сообщение результата
    let resultMessage = "";
    if (percentage < 40) {
      resultMessage = "Стоит повторить материал!";
    } else if (percentage < 70) {
      resultMessage = "Неплохой результат, но можно лучше!";
    } else if (percentage < 100) {
      resultMessage = "Отличный результат!";
    } else {
      resultMessage = "Идеально! Вы настоящий эксперт!";
    }
    
    mainContainer.innerHTML = `
      <div class="quiz-container">
        <div class="results-card fade-in">
          <h2>Результаты: ${currentCategory.name} ${currentCategory.icon}</h2>
          <div class="score-circle fade-in delay-1">
            <span class="score-text">${percentage}%</span>
          </div>
          <p class="result-message fade-in delay-2">${resultMessage}</p>
          <p class="fade-in delay-2">Вы ответили правильно на ${score} из ${currentCategory.questions.length} вопросов.</p>
          
          ${newAchievements.length > 0 ? 
            newAchievements.map(achievement => 
              `<div class="achievement fade-in delay-3">🏆 Новое достижение: ${achievement}!</div>`
            ).join('') : ''}
          
          <div class="buttons-container fade-in delay-4">
            <button class="button button-secondary" onclick="UI.renderMainMenu()">На главную</button>
            <button class="button button-success" onclick="UI.startCategory(${currentCategory.id})">Попробовать снова</button>
            <button class="button" onclick="shareResults()">Поделиться</button>
          </div>
        </div>
      </div>
    `;
  },
  
  // Показать уведомление о новом достижении
  showAchievementNotification: function(achievementName) {
    const achievementData = anatomyQuiz.achievements.find(a => a.name === achievementName) || 
                          { name: achievementName, icon: "🏆", description: "Новое достижение!" };
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification fade-in';
    notification.innerHTML = `
      <div class="achievement-notification-icon">${achievementData.icon}</div>
      <div class="achievement-notification-content">
        <div class="achievement-notification-title">Новое достижение!</div>
        <div class="achievement-notification-name">${achievementData.name}</div>
        <div class="achievement-notification-desc">${achievementData.description}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 5000);
  },
  
  // Сохранение статистики пользователя
  saveUserStats: function() {
    try {
      localStorage.setItem('anatomyQuizStats', JSON.stringify(anatomyQuiz.userStats));
    } catch (e) {
      console.error("Ошибка при сохранении статистики:", e);
    }
  },
  
  // Загрузка статистики пользователя
  loadUserStats: function() {
    try {
      const savedStats = localStorage.getItem('anatomyQuizStats');
      if (savedStats) {
        anatomyQuiz.userStats = JSON.parse(savedStats);
      }
    } catch (e) {
      console.error("Ошибка при загрузке статистики:", e);
    }
  }
};