// vk-bridge-helper.js - Надежная инициализация VK Bridge
(function() {
    // Глобальный объект для работы с VK Bridge
    window.vkBridgeHelper = {
        // Инициализированный экземпляр VK Bridge
        instance: null,
        
        // Статус инициализации
        initialized: false,
        
        // Функция для инициализации VK Bridge
        init: function() {
            console.log('Инициализация VK Bridge Helper...');
            
            // Проверяем доступность VK Bridge
            if (typeof window.vkBridge !== 'undefined') {
                console.log('VK Bridge найден в window.vkBridge');
                this.instance = window.vkBridge;
            } else if (typeof vkBridge !== 'undefined') {
                console.log('VK Bridge найден как глобальная переменная');
                this.instance = vkBridge;
                window.vkBridge = vkBridge; // Сохраняем в window для совместимости
            } else {
                console.error('VK Bridge не найден! Приложение будет работать в гостевом режиме.');
                return false;
            }
            
            // Выполняем инициализацию
            try {
                this.instance.send('VKWebAppInit')
                    .then(data => {
                        console.log('VK Bridge успешно инициализирован:', data);
                        this.initialized = true;
                        this.applyTheme();
                        this.getUserInfo();
                        
                        // Вызываем событие для оповещения других скриптов
                        const event = new Event('vkBridgeInitialized');
                        document.dispatchEvent(event);
                    })
                    .catch(error => {
                        console.error('Ошибка инициализации VK Bridge:', error);
                    });
                
                // Подписываемся на изменения темы
                this.instance.subscribe(event => {
                    if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                        this.applyTheme(event.detail.data.scheme);
                    }
                });
                
                return true;
            } catch (error) {
                console.error('Критическая ошибка при работе с VK Bridge:', error);
                return false;
            }
        },
        
        // Применение темы ВКонтакте
        applyTheme: function(scheme) {
            // Если схема не передана, пытаемся получить ее
            if (!scheme && this.instance) {
                this.instance.send('VKWebAppGetConfig')
                    .then(config => {
                        if (config && config.scheme) {
                            this.applyThemeInternal(config.scheme);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка получения конфигурации:', error);
                    });
            } else if (scheme) {
                this.applyThemeInternal(scheme);
            }
        },
        
        // Внутренняя функция применения темы
        applyThemeInternal: function(scheme) {
            console.log('Применяется тема:', scheme);
            const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
            document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
        },
        
        // Получение информации о пользователе
        getUserInfo: function() {
            if (!this.instance) return null;
            
            return this.instance.send('VKWebAppGetUserInfo')
                .then(userData => {
                    console.log('Данные пользователя получены:', userData);
                    
                    // Сохраняем данные пользователя
                    window.currentUserData = userData;
                    
                    // Отображаем информацию о пользователе, если есть функция
                    if (typeof window.showUserInfo === 'function') {
                        window.showUserInfo(userData);
                    }
                    
                    return userData;
                })
                .catch(error => {
                    console.error('Ошибка получения данных пользователя:', error);
                    
                    // Активируем гостевой режим, если есть функция
                    if (typeof window.showGuestMode === 'function') {
                        window.showGuestMode();
                    }
                    
                    return null;
                });
        },
        
        // Функция для работы с API VK
        callAPI: function(method, params) {
            if (!this.instance) return Promise.reject('VK Bridge не инициализирован');
            
            return this.instance.send('VKWebAppCallAPIMethod', {
                method: method,
                params: {
                    v: '5.131',
                    ...params
                }
            });
        },
        
        // Простой способ поделиться
        share: function(message) {
            if (!this.instance) {
                alert(message);
                return Promise.reject('VK Bridge не инициализирован');
            }
            
            return this.instance.send('VKWebAppShare', { message: message });
        }
    };
    
    // Автоматически инициализируем при загрузке скрипта
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.vkBridgeHelper.init();
        });
    } else {
        // DOM уже загружен
        window.vkBridgeHelper.init();
    }
})();
