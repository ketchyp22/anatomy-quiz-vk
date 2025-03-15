// Конфигурация VK Mini Apps
const vkConfig = {
    // Инициализация VK Mini Apps
    init: function() {
        if (typeof vkBridge !== 'undefined') {
            // Инициализация VK Bridge
            vkBridge.send('VKWebAppInit')
                .then(data => {
                    console.log('VK Bridge успешно инициализирован', data);
                })
                .catch(error => {
                    console.error('Ошибка инициализации VK Bridge:', error);
                });
                
            // Подписка на события VK Bridge
            vkBridge.subscribe(event => {
                console.log('VK Bridge event:', event);
                
                if (event.detail.type === 'VKWebAppUpdateConfig') {
                    // Обработка смены темы и других параметров интерфейса
                    this.applyTheme(event.detail.data);
                }
            });
            
            return true;
        } else {
            console.error('VK Bridge SDK не найден. Убедитесь, что скрипт подключен правильно.');
            return false;
        }
    },
    
    // Получение данных пользователя
    getUserInfo: function() {
        if (typeof vkBridge !== 'undefined') {
            return vkBridge.send('VKWebAppGetUserInfo')
                .then(data => {
                    console.log('Получены данные пользователя:', data);
                    return data;
                })
                .catch(error => {
                    console.error('Ошибка получения данных пользователя:', error);
                    throw error;
                });
        } else {
            return Promise.reject('VK Bridge SDK не найден');
        }
    },
    
    // Поделиться результатами
    shareResults: function(message) {
        if (typeof vkBridge !== 'undefined') {
            return vkBridge.send('VKWebAppShare', { message: message })
                .then(data => {
                    console.log('Успешно поделились:', data);
                    return data;
                })
                .catch(error => {
                    console.error('Ошибка при попытке поделиться:', error);
                    throw error;
                });
        } else {
            return Promise.reject('VK Bridge SDK не найден');
        }
    },
    
    // Применение темы VK
    applyTheme: function(configData) {
        // Проверяем, есть ли данные о теме
        if (!configData || !configData.scheme) return;
        
        // Определяем тему
        const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(configData.scheme);
        
        // Получаем корневой элемент для добавления класса темы
        const root = document.documentElement;
        
        // Добавляем или удаляем класс темной темы
        if (isDarkTheme) {
            root.classList.add('vk-dark-theme');
        } else {
            root.classList.remove('vk-dark-theme');
        }
    }
};

// Экспорт конфигурации для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = vkConfig;
}

// Автоматическая инициализация при загрузке скрипта
document.addEventListener('DOMContentLoaded', function() {
    vkConfig.init();
});
