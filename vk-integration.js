// Интеграция с VK для Анатомического Квиза
const VKIntegration = {
  // Инициализация VK Mini Apps
  init: function(successCallback = null, errorCallback = null) {
    // Проверяем, доступен ли VK API
    if (typeof window.VK === 'undefined') {
      // Загружаем VK API
      const script = document.createElement('script');
      script.src = 'https://vk.com/js/api/openapi.js?169';
      script.onload = () => {
        this._initVKApp(successCallback, errorCallback);
      };
      script.onerror = () => {
        if (errorCallback) {
          errorCallback('Не удалось загрузить VK API');
        }
      };
      document.head.appendChild(script);
    } else {
      this._initVKApp(successCallback, errorCallback);
    }
  },
  
  // Внутренний метод инициализации VK Mini Apps
  _initVKApp: function(successCallback, errorCallback) {
    try {
      // Инициализируем VK Mini Apps
      window.vkBridge.send('VKWebAppInit')
        .then(data => {
          console.log('VK Mini Apps инициализирован', data);
          if (successCallback) {
            successCallback(data);
          }
        })
        .catch(error => {
          console.error('Ошибка инициализации VK Mini Apps', error);
          if (errorCallback) {
            errorCallback(error);
          }
        });
    } catch (e) {
      console.error('Ошибка инициализации VK Mini Apps', e);
      if (errorCallback) {
        errorCallback(e);
      }
    }
  },
  
  // Получение данных пользователя
  getUserInfo: function(callback) {
    if (typeof window.vkBridge === 'undefined') {
      callback(null, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    window.vkBridge.send('VKWebAppGetUserInfo')
      .then(data => {
        callback(data);
      })
      .catch(error => {
        console.error('Ошибка получения данных пользователя', error);
        callback(null, error);
      });
  },
  
  // Показать рекламу
  showAds: function(callback) {
    if (typeof window.vkBridge === 'undefined') {
      callback(false, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    window.vkBridge.send('VKWebAppShowNativeAds', {ad_format: 'interstitial'})
      .then(data => {
        callback(true, data);
      })
      .catch(error => {
        console.error('Ошибка показа рекламы', error);
        callback(false, error);
      });
  },
  
  // Поделиться результатами
  shareResults: function(message, attachments = [], callback = null) {
    if (typeof window.vkBridge === 'undefined') {
      if (callback) callback(false, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    window.vkBridge.send('VKWebAppShare', {
      message: message,
      attachments: attachments.join(',')
    })
      .then(data => {
        if (callback) callback(true, data);
      })
      .catch(error => {
        console.error('Ошибка при отправке поста', error);
        if (callback) callback(false, error);
      });
  },
  
  // Добавить в избранное
  addToFavorites: function(callback) {
    if (typeof window.vkBridge === 'undefined') {
      callback(false, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    window.vkBridge.send('VKWebAppAddToFavorites')
      .then(data => {
        callback(true, data);
      })
      .catch(error => {
        console.error('Ошибка добавления в избранное', error);
        callback(false, error);
      });
  },
  
  // Пригласить друзей
  inviteFriends: function(callback) {
    if (typeof window.vkBridge === 'undefined') {
      callback(false, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    window.vkBridge.send('VKWebAppShowInviteBox')
      .then(data => {
        callback(true, data);
      })
      .catch(error => {
        console.error('Ошибка отправки приглашений', error);
        callback(false, error);
      });
  },
  
  // Сохранение данных в VK Storage
  saveData: function(key, value, callback) {
    if (typeof window.vkBridge === 'undefined') {
      callback(false, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    window.vkBridge.send('VKWebAppStorageSet', {
      key: key,
      value: strValue
    })
      .then(data => {
        callback(true, data);
      })
      .catch(error => {
        console.error(`Ошибка сохранения данных [${key}]`, error);
        callback(false, error);
      });
  },
  
  // Загрузка данных из VK Storage
  loadData: function(keys, callback) {
    if (typeof window.vkBridge === 'undefined') {
      callback(null, new Error('VK Bridge не инициализирован'));
      return;
    }
    
    const keysArray = Array.isArray(keys) ? keys : [keys];
    
    window.vkBridge.send('VKWebAppStorageGet', {
      keys: keysArray
    })
      .then(data => {
        const results = {};
        if (data.keys) {
          data.keys.forEach(item => {
            try {
              // Пытаемся распарсить как JSON
              results[item.key] = JSON.parse(item.value);
            } catch (e) {
              // Если не получается, оставляем как строку
              results[item.key] = item.value;
            }
          });
        }
        callback(results);
      })
      .catch(error => {
        console.error(`Ошибка загрузки данных [${keys.join(', ')}]`, error);
        callback(null, error);
      });
  },
  
  // Загрузить прогресс пользователя
  loadUserProgress: function(callback) {
    this.loadData(['user_stats', 'user_settings'], (data, error) => {
      if (error) {
        callback(null, error);
        return;
      }
      
      const userProgress = {
        stats: data.user_stats || null,
        settings: data.user_settings || null
      };
      
      callback(userProgress);
    });
  },
  
  // Сохранить прогресс пользователя
  saveUserProgress: function(stats, settings, callback) {
    const saveOperations = [
      new Promise((resolve, reject) => {
        this.saveData('user_stats', stats, (success, error) => {
          if (success) resolve();
          else reject(error);
        });
      }),
      new Promise((resolve, reject) => {
        this.saveData('user_settings', settings, (success, error) => {
          if (success) resolve();
          else reject(error);
        });
      })
    ];
    
    Promise.all(saveOperations)
      .then(() => {
        callback(true);
      })
      .catch(error => {
        console.error('Ошибка сохранения прогресса', error);
        callback(false, error);
      });
  },
  
  // Показать лидерборд
  showLeaderboard: function(userResult) {
    if (typeof window.vkBridge === 'undefined') {
      console.error('VK Bridge не инициализирован');
      return;
    }
    
    window.vkBridge.send('VKWebAppShowLeaderBoardBox', {
      user_result: userResult
    })
      .then(data => {
        console.log('Лидерборд показан', data);
      })
      .catch(error => {
        console.error('Ошибка показа лидерборда', error);
      });
  },
  
  // Отправить событие о вовлечении пользователя (для внутренней аналитики VK)
  trackUserEngagement: function(action, extraParams = {}) {
    if (typeof window.vkBridge === 'undefined') {
      console.error('VK Bridge не инициализирован');
      return;
    }
    
    try {
      const params = Object.assign({ 
        action: action,
        timestamp: Date.now()
      }, extraParams);
      
      window.vkBridge.send('VKWebAppTrackEvent', {
        type: 'user_engagement',
        data: params
      });
    } catch (e) {
      console.error('Ошибка отправки события', e);
    }
  }
};
