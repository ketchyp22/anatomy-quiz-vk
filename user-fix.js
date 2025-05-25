// user-fix.js - Исправленная версия без ошибок
(function() {
    'use strict';
    
    console.log('🔧 Загружается исправление пользователя v2...');

    // Исправленная функция применения темы VK
    function applyVKTheme(scheme) {
        console.log('🎨 Применяется тема VK:', scheme);
        const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
        
        if (isDarkTheme) {
            document.documentElement.classList.add('vk-dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('vk-dark-theme');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    // Исправленная функция инициализации VK Bridge
    function initVKBridge() {
        let bridge = null;

        // Находим VK Bridge
        if (typeof vkBridge !== 'undefined') {
            bridge = vkBridge;
        } else if (typeof window.vkBridge !== 'undefined') {
            bridge = window.vkBridge;
        } else {
            console.warn('VK Bridge не найден. Переключение в гостевой режим.');
            setTimeout(showGuestMode, 500);
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
                        // Обновляем глобальную переменную
                        if (window.currentUserData !== undefined) {
                            window.currentUserData = userData;
                        } else {
                            currentUserData = userData;
                        }
                        updateUserInfo(userData);
                    } else {
                        console.warn('Получены неполные данные пользователя:', userData);
                        showGuestMode();
                        return;
                    }

                    // Получаем конфигурацию приложения
                    return bridge.send('VKWebAppGetConfig');
                })
                .then((config) => {
                    console.log('Получена конфигурация приложения:', config);
                    if (config && config.scheme) {
                        applyVKTheme(config.scheme);
                    }
                })
                .catch((error) => {
                    console.error('Ошибка при работе с VK Bridge:', error);
                    
                    // Если ошибка связана с получением данных пользователя, пробуем еще раз
                    if (error.error_data && error.error_data.error_code === 3) {
                        console.log('Пробуем получить данные пользователя повторно...');
                        setTimeout(() => {
                            retryGetUserInfo(bridge);
                        }, 1000);
                    } else {
                        showGuestMode();
                    }
                });

            // Подписываемся на события
            bridge.subscribe((event) => {
                if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                    applyVKTheme(event.detail.data.scheme);
                }
            });

            return bridge;
        } catch (e) {
            console.error('Критическая ошибка при работе с VK Bridge:', e);
            showGuestMode();
            return null;
        }
    }

    // Функция повторной попытки получения данных пользователя
    function retryGetUserInfo(bridge, attempts = 0) {
        if (attempts >= 3) {
            console.warn('Не удалось получить данные пользователя после 3 попыток');
            showGuestMode();
            return;
        }
        
        bridge.send('VKWebAppGetUserInfo')
            .then((userData) => {
                console.log('Данные пользователя получены при повторной попытке:', userData);
                
                if (userData && userData.id && userData.first_name) {
                    // Обновляем глобальную переменную
                    if (window.currentUserData !== undefined) {
                        window.currentUserData = userData;
                    } else {
                        currentUserData = userData;
                    }
                    updateUserInfo(userData);
                } else {
                    console.warn('Повторно получены неполные данные, попытка', attempts + 1);
                    setTimeout(() => {
                        retryGetUserInfo(bridge, attempts + 1);
                    }, 1000);
                }
            })
            .catch((error) => {
                console.error('Ошибка при повторной попытке получения данных:', error);
                setTimeout(() => {
                    retryGetUserInfo(bridge, attempts + 1);
                }, 1000);
            });
    }

    // Функция обновления информации о пользователе
    function updateUserInfo(userData) {
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
    }

    // Функция гостевого режима
    function showGuestMode() {
        const userData = {
            id: 'guest_' + Date.now(),
            first_name: 'Гость',
            last_name: '',
            photo_100: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM1YTY3ZDgiLz48cGF0aCBkPSJNNTAgMzBjNS41IDAgMTAgNC41IDEwIDEwcy00LjUgMTAtMTAgMTAtMTAtNC41LTEwLTEwIDQuNS0xMCAxMC0xMHptMCAzMGMxMC41IDAgMjAgNS41IDIwIDEwdjVIMzB2LTVjMC00LjUgOS41LTEwIDIwLTEweiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
        };

        // Обновляем глобальную переменную
        if (window.currentUserData !== undefined) {
            window.currentUserData = userData;
        } else {
            currentUserData = userData;
        }

        updateUserInfo(userData);
        console.log('Запущен гостевой режим с ID:', userData.id);
    }

    // Функция для принудительного обновления данных пользователя
    function forceUpdateUserInfo() {
        const bridge = window.vkBridgeInstance || window.vkBridge;
        
        if (!bridge) {
            console.warn('VK Bridge недоступен для обновления данных пользователя');
            showGuestMode();
            return;
        }
        
        console.log('Принудительное обновление данных пользователя...');
        
        bridge.send('VKWebAppGetUserInfo')
            .then((userData) => {
                console.log('Данные пользователя обновлены:', userData);
                if (userData && userData.id && userData.first_name) {
                    // Обновляем глобальную переменную
                    if (window.currentUserData !== undefined) {
                        window.currentUserData = userData;
                    } else {
                        currentUserData = userData;
                    }
                    updateUserInfo(userData);
                } else {
                    showGuestMode();
                }
            })
            .catch((error) => {
                console.error('Ошибка при принудительном обновлении:', error);
                showGuestMode();
            });
    }

    // Экспортируем функции для использования в других скриптах
    window.initVKBridge = initVKBridge;
    window.updateUserInfo = updateUserInfo;
    window.showGuestMode = showGuestMode;
    window.forceUpdateUserInfo = forceUpdateUserInfo;

    // Добавляем функции для отладки (минимальные)
    window.debugUser = {
        getCurrentUser: () => {
            const user = window.currentUserData || currentUserData;
            console.log('Текущий пользователь:', user);
            return user;
        },
        
        forceUpdate: () => {
            forceUpdateUserInfo();
        },
        
        showGuest: () => {
            showGuestMode();
        },
        
        checkVK: () => {
            const bridge = window.vkBridgeInstance || window.vkBridge;
            console.log('VK Bridge доступен:', !!bridge);
            return !!bridge;
        }
    };

    // Автоматическая попытка обновления через 3 секунды после загрузки
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const user = window.currentUserData || currentUserData;
            if (!user || user.first_name === 'Гость') {
                console.log('Пользователь не загружен, пробуем принудительное обновление...');
                forceUpdateUserInfo();
            }
        }, 3000);
    });

    console.log('✅ Исправленное отображение пользователя загружено');
})();
