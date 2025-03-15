// vk-params.js - Обработка параметров запуска VK Mini Apps
(function() {
    // Получение параметров запуска из URL
    function getStartParams() {
        console.log('Получение параметров запуска VK Mini App');
        
        const urlParams = new URLSearchParams(window.location.search);
        const vkParams = {
            vk_user_id: urlParams.get('vk_user_id'),
            vk_app_id: urlParams.get('vk_app_id'),
            vk_is_app_user: urlParams.get('vk_is_app_user'),
            vk_are_notifications_enabled: urlParams.get('vk_are_notifications_enabled'),
            vk_language: urlParams.get('vk_language'),
            vk_platform: urlParams.get('vk_platform'),
            sign: urlParams.get('sign')
        };
        
        // Проверка наличия параметров
        const hasParams = vkParams.vk_user_id && vkParams.vk_app_id && vkParams.sign;
        
        if (hasParams) {
            console.log('Параметры запуска VK получены:', vkParams);
        } else {
            console.warn('Параметры запуска VK отсутствуют или неполные');
        }
        
        // Сохраняем параметры для дальнейшего использования
        window.vkStartParams = vkParams;
        window.isVKApp = hasParams;
        
        return vkParams;
    }
    
    // Функция для отправки событий аналитики
    function sendStatEvent(event_name, event_params) {
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'interstitial' })
                .then(data => console.log('Interstitial available:', data.result))
                .catch(error => console.log('Interstitial error:', error));
                
            vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'reward' })
                .then(data => console.log('Reward available:', data.result))
                .catch(error => console.log('Reward error:', error));
                
            vkBridge.send('VKWebAppStatEvent', { 
                app_id: window.vkStartParams.vk_app_id,
                event_name: event_name,
                event_params: event_params
            })
            .then(data => console.log('Stat event sent', data))
            .catch(error => console.error('Stat event error', error));
        }
    }
    
    // Экспортируем API
    window.vkParams = {
        get: getStartParams,
        sendStat: sendStatEvent
    };
    
    // Автоматически получаем параметры при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', getStartParams);
    } else {
        getStartParams();
    }
})();
