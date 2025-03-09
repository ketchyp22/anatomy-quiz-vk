// Интеграция с ВКонтакте
const bridge = window.vkBridge; // Определяем переменную bridge

const VKIntegration = {
  // Инициализация приложения
  init: function() {
    // Инициализируем VK Bridge
    bridge.send('VKWebAppInit')
      .then(data => {
        console.log('VK Bridge инициализирован', data);
        
        // Загружаем информацию о пользователе
        this.loadUserInfo();
      })
      .catch(error => {
        console.error('Ошибка инициализации VK Bridge:', error);
      });
      
    // Настраиваем отслеживание событий
    bridge.subscribe(event => {
      if (event.detail.type === 'VKWebAppViewRestore') {
        // Обновляем UI при восстановлении приложения
        UI.renderMainMenu();
      }
    });
  },
  
  // Загрузка информации о пользователе
  loadUserInfo: function() {
    bridge.send('VKWebAppGetUserInfo')
      .then(data => {
        console.log('Информация о пользователе получена', data);
        // Сохраняем имя пользователя для приветствия
        if (data && data.first_name) {
          this.userName = data.first_name;
          // Если есть элемент приветствия, обновляем его
          const greetingElement = document.querySelector('.user-greeting');
          if (greetingElement) {
            greetingElement.textContent = `Привет, ${this.userName}!`;
          }
        }
      })
      .catch(error => {
        console.error('Ошибка получения информации о пользователе:', error);
      });
  },
  
  // Функция для добавления приложения в избранное
  addToFavorites: function() {
    bridge.send('VKWebAppAddToFavorites')
      .then(data => {
        console.log('Приложение добавлено в избранное', data);
        // Показываем благодарственное сообщение
        if (UI && UI.showNotification) {
          UI.showNotification('Спасибо, что добавили нас в избранное! 💙');
        }
      })
      .catch(error => {
        console.error('Ошибка добавления в избранное:', error);
      });
  },
  
  // Расшаривание результатов
  shareResults: function() {
    const percentage = Math.round((anatomyQuiz.userStats.correctAnswers / anatomyQuiz.userStats.totalQuestions) * 100) || 0;
    
    let message = '';
    
    if (currentCategory) {
      // Если делимся из результатов категории
      const categoryPercentage = Math.round((score / currentCategory.questions.length) * 100);
      message = `Я прошел тест по теме "${currentCategory.name}" в квизе по анатомии и набрал ${categoryPercentage}%! Попробуй свои силы!`;
    } else {
      // Если делимся общими результатами
      message = `Я прошел квиз по анатомии и ответил правильно на ${anatomyQuiz.userStats.correctAnswers} из ${anatomyQuiz.userStats.totalQuestions} вопросов (${percentage}%)! Проверь свои знания об организме человека!`;
      
      // Добавляем информацию о достижениях, если они есть
      if (anatomyQuiz.userStats.achievements.length > 0) {
        message += `\n\nМои достижения: ${anatomyQuiz.userStats.achievements.length} 🏆`;
      }
    }
    
    bridge.send('VKWebAppShare', {
      message: message
    })
    .then(data => {
      console.log('Результат успешно опубликован', data);
      if (UI && UI.showNotification) {
        UI.showNotification('Спасибо, что поделились результатом! 👍');
      }
    })
    .catch(error => {
      console.error('Ошибка при публикации:', error);
      if (UI && UI.showNotification) {
        UI.showNotification('Не удалось поделиться результатом 😔', 'error');
      }
    });
  },
  
  // Показать рекламу
  showAd: function(onComplete) {
    bridge.send('VKWebAppShowNativeAds', {ad_format: 'interstitial'})
      .then(data => {
        console.log('Реклама показана', data);
        if (onComplete) onComplete(true);
      })
      .catch(error => {
        console.error('Ошибка показа рекламы:', error);
        if (onComplete) onComplete(false);
      });
  },
  
  // Пригласить друзей
  inviteFriends: function() {
    bridge.send('VKWebAppShowInviteBox', {})
      .then(data => {
        console.log('Приглашение отправлено', data);
        if (UI && UI.showNotification) {
          UI.showNotification('Спасибо за приглашение друзей! 🎉');
        }
      })
      .catch(error => {
        console.error('Ошибка отправки приглашения:', error);
      });
  },
  
  // Запрос у пользователя разрешения на отправку уведомлений
  requestNotificationsPermission: function() {
    bridge.send('VKWebAppAllowNotifications')
      .then(data => {
        if (data.result) {
          console.log('Разрешения на уведомления получены');
          if (UI && UI.showNotification) {
            UI.showNotification('Теперь вы будете получать уведомления о новых вопросах! 🔔');
          }
        } else {
          console.log('Пользователь отклонил запрос на уведомления');
        }
      })
      .catch(error => {
        console.error('Ошибка запроса разрешений на уведомления:', error);
      });
  },
  
  // Отправка сообщения в сообщество
  joinCommunity: function() {
    // Замените YOUR_GROUP_ID на ID вашего сообщества
    bridge.send('VKWebAppJoinGroup', { group_id: 'YOUR_GROUP_ID' })
      .then(data => {
        console.log('Пользователь вступил в сообщество', data);
        if (UI && UI.showNotification) {
          UI.showNotification('Спасибо, что присоединились к нашему сообществу! 👋');
        }
      })
      .catch(error => {
        console.error('Ошибка при вступлении в сообщество:', error);
      });
  }
};

// Улучшенная функция для публикации результатов
function shareResults() {
  VKIntegration.shareResults();
}

// Показывать рекламу после каждой завершенной категории
function showAdAfterCategory(callback) {
  // Показываем рекламу с 50% вероятностью, чтобы не раздражать пользователей
  if (Math.random() > 0.5) {
    VKIntegration.showAd(callback);
  } else if (callback) {
    callback(true);
  }
}
