// Добавьте этот код в начало app.js или создайте отдельный файл user-fix.js

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
        showGuestMode();
        return null;
    }

    try {
        // Инициализируем VK Bridge
        bridge.send('VKWebAppInit')
            .then(() => {
                console.log('VK Bridge успешно инициализирован');
                window.vkBridgeInstance = bridge;
                
                // ИСПРАВЛЕНИЕ: добавляем задержку перед получением данных пользователя
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
                    currentUserData = userData;
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
                currentUserData = userData;
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

// Исправленная функция обновления информации о пользователе
function updateUserInfo(userData) {
    const userInfoElement = document.getElementById('user-info');
    const userInfoQuizElement = document.getElementById('user-info-quiz');
    
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
    
    if (userInfoElement) {
        userInfoElement.innerHTML = userHTML;
        userInfoElement.style.display = 'flex';
    }
    
    if (userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userHTML;
        userInfoQuizElement.style.display = 'flex';
    }
    
    console.log('Информация о пользователе обновлена в интерфейсе');
}

// Исправленная функция гостевого режима
function showGuestMode() {
    const userInfoElement = document.getElementById('user-info');
    if (!userInfoElement) return;

    // Создаем более привлекательные данные гостя
    currentUserData = {
        id: 'guest_' + Date.now(),
        first_name: 'Гость',
        last_name: '',
        photo_100: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM1YTY3ZDgiLz4KPHN2ZyB4PSIyNSIgeT0iMjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzEzLjEgMiAxNCAyLjkgMTQgNEMxNCA1LjEgMTMuMSA2IDEyIDZDMTAuOSA2IDEwIDUuMSAxMCA0QzEwIDIuOSAxMC45IDIgMTIgMlpNMjEgOVYyMkgxNVYxM0g5VjIySDNWOUgxWlY3SDIzVjlIMjFaIi8+Cjwvc3ZnPgo8L3N2Zz4K'
    };

    updateUserInfo(currentUserData);
    
    console.log('Запущен гостевой режим с ID:', currentUserData.id);
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
                currentUserData = userData;
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

// Добавляем функцию для отладки
window.debugUser = {
    getCurrentUser: () => {
        console.log('Текущий пользователь:', currentUserData);
        return currentUserData;
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
        if (bridge) {
            console.log('Тип VK Bridge:', typeof bridge);
        }
        return !!bridge;
    }
};

// Автоматическая попытка обновления через 3 секунды после загрузки
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (!currentUserData || currentUserData.first_name === 'Гость') {
            console.log('Пользователь не загружен, пробуем принудительное обновление...');
            forceUpdateUserInfo();
        }
    }, 3000);
});

console.log('🔧 Исправление отображения пользователя загружено');
