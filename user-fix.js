// user-fix-final.js - Окончательная исправленная версия
(function() {
    'use strict';
    
    console.log('🔧 Загружается финальное исправление пользователя...');

    // Функция применения темы VK (добавляем в глобальную область)
    window.applyVKTheme = function(scheme) {
        console.log('🎨 Применяется тема VK:', scheme);
        const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
        
        if (isDarkTheme) {
            document.documentElement.classList.add('vk-dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('vk-dark-theme');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    };

    // Глобальная функция инициализации VK Bridge
    window.initVKBridge = function() {
        let bridge = null;

        // Находим VK Bridge
        if (typeof vkBridge !== 'undefined') {
            bridge = vkBridge;
        } else if (typeof window.vkBridge !== 'undefined') {
            bridge = window.vkBridge;
        } else {
            console.warn('VK Bridge не найден. Переключение в гостевой режим.');
            setTimeout(() => {
                if (window.showGuestMode) window.showGuestMode();
            }, 500);
            return null;
        }

        try {
            // Инициализируем VK Bridge
            bridge.send('VKWebAppInit')
                .then(() => {
                    console.log('VK Bridge успешно инициализирован');
                    window.vkBridgeInstance = bridge;
                    
                    // Добавляем задержку перед получением данных пользователя
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(bridge.send('VKWebAppGetUserInfo'));
                        }, 500);
                    });
                })
                .then((userData) => {
                    console.log('Данные пользователя получены:', userData);
                    
                    // Проверяем валидность данных
                    if (userData && userData.id && userData.first_name) {
                        // Сохраняем данные пользователя
                        window.currentUserData = userData;
                        if (window.updateUserInfo) {
                            window.updateUserInfo(userData);
                        }
                    } else {
                        console.warn('Получены неполные данные пользователя:', userData);
                        if (window.showGuestMode) window.showGuestMode();
                        return;
                    }

                    // Получаем конфигурацию приложения
                    return bridge.send('VKWebAppGetConfig');
                })
                .then((config) => {
                    console.log('Получена конфигурация приложения:', config);
                    if (config && config.scheme && window.applyVKTheme) {
                        window.applyVKTheme(config.scheme);
                    }
                })
                .catch((error) => {
                    console.error('Ошибка при работе с VK Bridge:', error);
                    if (window.showGuestMode) window.showGuestMode();
                });

            // Подписываемся на события
            bridge.subscribe((event) => {
                if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                    if (window.applyVKTheme) {
                        window.applyVKTheme(event.detail.data.scheme);
                    }
                }
            });

            return bridge;
        } catch (e) {
            console.error('Критическая ошибка при работе с VK Bridge:', e);
            if (window.showGuestMode) window.showGuestMode();
            return null;
        }
    };

    // Глобальная функция обновления информации о пользователе
    window.updateUserInfo = function(userData) {
        if (!userData || !userData.first_name) {
            console.warn('Неполные данные пользователя для обновления интерфейса');
            return;
        }
        
        const userHTML = `
            <img src="${userData.photo_100 || 'https://vk.com/images/camera_100.png'}" 
                 alt="${userData.first_name}" 
                 onerror="this.src='https://vk.com/images/camera_100.png'">
            <span>${userData.first_name} ${userData.last_name || ''}</span>
        `;
        
        const userInfoElement = document.getElementById('user-info');
        const userInfoQuizElement = document.getElementById('user-info-quiz');
        
        if (userInfoElement) {
            userInfoElement.innerHTML = userHTML;
            userInfoElement.classList.add('loaded');
        }
        
        if (userInfoQuizElement) {
            userInfoQuizElement.innerHTML = userHTML;
            userInfoQuizElement.classList.add('loaded');
        }
        
        console.log('Информация о пользователе обновлена в интерфейсе');
    };

    // Глобальная функция гостевого режима
    window.showGuestMode = function() {
        const userData = {
            id: 'guest_' + Date.now(),
            first_name: 'Гость',
            last_name: '',
            photo_100: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM1YTY3ZDgiLz48cGF0aCBkPSJNNTAgMzBjNS41IDAgMTAgNC41IDEwIDEwcy00LjUgMTAtMTAgMTAtMTAtNC41LTEwLTEwIDQuNS0xMCAxMC0xMHptMCAzMGMxMC41IDAgMjAgNS41IDIwIDEwdjVIMzB2LTVjMC00LjUgOS41LTEwIDIwLTEweiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
        };

        // Сохраняем данные пользователя
        window.currentUserData = userData;
        
        if (window.updateUserInfo) {
            window.updateUserInfo(userData);
        }
        
        console.log('Запущен гостевой режим с ID:', userData.id);
    };

    // Функция для принудительного обновления данных пользователя
    window.forceUpdateUserInfo = function() {
        const bridge = window.vkBridgeInstance || window.vkBridge;
        
        if (!bridge) {
            console.warn('VK Bridge недоступен для обновления данных пользователя');
            if (window.showGuestMode) window.showGuestMode();
            return;
        }
        
        console.log('Принудительное обновление данных пользователя...');
        
        bridge.send('VKWebAppGetUserInfo')
            .then((userData) => {
                console.log('Данные пользователя обновлены:', userData);
                if (userData && userData.id && userData.first_name) {
                    window.currentUserData = userData;
                    if (window.updateUserInfo) {
                        window.updateUserInfo(userData);
                    }
                } else {
                    if (window.showGuestMode) window.showGuestMode();
                }
            })
            .catch((error) => {
                console.error('Ошибка при принудительном обновлении:', error);
                if (window.showGuestMode) window.showGuestMode();
            });
    };

    // Автоматическая попытка обновления через 3 секунды после загрузки
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (!window.currentUserData || window.currentUserData.first_name === 'Гость') {
                console.log('Пользователь не загружен, пробуем принудительное обновление...');
                if (window.forceUpdateUserInfo) {
                    window.forceUpdateUserInfo();
                }
            }
        }, 3000);
    });

    // Минимальные отладочные функции
    window.debugUser = {
        getCurrentUser: () => {
            console.log('Текущий пользователь:', window.currentUserData);
            return window.currentUserData;
        },
        
        forceUpdate: () => {
            if (window.forceUpdateUserInfo) window.forceUpdateUserInfo();
        },
        
        showGuest: () => {
            if (window.showGuestMode) window.showGuestMode();
        },
        
        checkVK: () => {
            const bridge = window.vkBridgeInstance || window.vkBridge;
            console.log('VK Bridge доступен:', !!bridge);
            return !!bridge;
        }
    };

    console.log('✅ Финальное исправление пользователя загружено');
})();
