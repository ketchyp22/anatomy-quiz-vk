// difficulty-toggle.js - Улучшенный переключатель сложности для медицинского квиза
(function() {
    // Добавляем стили для переключателя сложности
    function addToggleStyles() {
        // Проверяем, что стили еще не добавлены
        if (document.getElementById('improved-toggle-styles')) {
            return;
        }
        
        // Создаем элемент стилей
        const styleElement = document.createElement('style');
        styleElement.id = 'improved-toggle-styles';
        
        // Добавляем CSS
        styleElement.textContent = `
            /* Стили для улучшенного переключателя сложности */
            .difficulty-toggle {
                display: flex;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 4px;
                position: relative;
                overflow: hidden;
                min-width: 180px;
                height: 36px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                margin: 0 auto;
            }
            
            /* Опции переключателя */
            .difficulty-option {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 28px;
                border-radius: 22px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                position: relative;
                z-index: 2;
                color: rgba(255, 255, 255, 0.7);
                transition: color 0.3s;
                text-align: center;
                min-width: 70px;
                padding: 0 8px;
                user-select: none;
            }
            
            /* Слайдер, который перемещается внутри переключателя */
            .difficulty-slider {
                position: absolute;
                height: 28px;
                border-radius: 22px;
                background-color: #4a76a8;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                z-index: 1;
                top: 4px;
            }
            
            /* Настройки для обычного уровня */
            .difficulty-toggle[data-level="normal"] .difficulty-slider {
                left: 4px;
                width: calc(50% - 4px);
            }
            
            /* Настройки для сложного уровня */
            .difficulty-toggle[data-level="hard"] .difficulty-slider {
                left: calc(50% + 0px);
                width: calc(50% - 4px);
                background-color: #e9573f;
            }
            
            /* Стили активной опции */
            .difficulty-toggle .difficulty-option {
                opacity: 0.8;
            }
            
            .difficulty-toggle[data-level="normal"] .difficulty-option:first-child, 
            .difficulty-toggle[data-level="hard"] .difficulty-option:last-child {
                color: #ffffff;
                font-weight: 600;
                opacity: 1;
            }
            
            /* Темная тема (если она используется) */
            .vk-dark-theme .difficulty-toggle {
                background-color: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            /* Убираем старые стили кнопок */
            .difficulty-btn {
                display: none;
            }
            
            /* Дополнительные стили для совместимости с текущим UI */
            .difficulty-selector {
                margin: 20px 0;
                text-align: center;
                width: 100%;
            }
            
            .difficulty-buttons {
                display: flex;
                justify-content: center;
                margin-bottom: 25px;
            }
            
            /* Медиа-запрос для мобильных устройств */
            @media (max-width: 480px) {
                .difficulty-toggle {
                    min-width: 150px;
                    height: 32px;
                }
                
                .difficulty-option {
                    height: 24px;
                    font-size: 13px;
                }
                
                .difficulty-slider {
                    height: 24px;
                    top: 4px;
                }
            }
        `;
        
        // Добавляем стили в документ
        document.head.appendChild(styleElement);
        console.log('Добавлены стили для улучшенного переключателя сложности');
    }
    
    // Создаем HTML для переключателя
    function createToggleHTML() {
        return `
            <div class="difficulty-toggle" data-level="normal">
                <div class="difficulty-option">Обычный</div>
                <div class="difficulty-option">Сложный</div>
                <div class="difficulty-slider"></div>
            </div>
        `;
    }
    
    // Заменяем старые кнопки на новый переключатель
    function replaceButtonsWithToggle() {
        // Находим контейнер с кнопками сложности
        const difficultyButtons = document.querySelector('.difficulty-buttons');
        
        if (!difficultyButtons) {
            console.warn('Контейнер с кнопками сложности не найден');
            return;
        }
        
        // Заменяем содержимое контейнера на новый переключатель
        difficultyButtons.innerHTML = createToggleHTML();
        
        // Получаем ссылку на новый переключатель
        const toggle = difficultyButtons.querySelector('.difficulty-toggle');
        
        // Добавляем обработчик события клика
        if (toggle) {
            toggle.addEventListener('click', handleToggleClick);
            console.log('Кнопки сложности заменены на улучшенный переключатель');
        }
    }
    
    // Обработчик клика по переключателю
    function handleToggleClick(event) {
        // Получаем текущий уровень сложности
        const currentLevel = this.dataset.level;
        
        // Переключаем на противоположный уровень
        const newLevel = currentLevel === 'normal' ? 'hard' : 'normal';
        
        // Устанавливаем новый уровень
        this.dataset.level = newLevel;
        
        console.log(`Сложность изменена: ${newLevel}`);
        
        // Обновляем сложность в менеджере сложности, если он существует
        if (window.difficultyManager && typeof window.difficultyManager.setLevel === 'function') {
            window.difficultyManager.setLevel(newLevel);
        }
        
        // Проигрываем звук клика, если доступен
        if (window.SoundEffects && typeof window.SoundEffects.playSound === 'function') {
            window.SoundEffects.playSound('click');
        }
        
        // Обновляем классы для старых кнопок (для совместимости)
        updateLegacyButtons(newLevel);
        
        // Предотвращаем всплытие события
        event.stopPropagation();
    }
    
    // Обновляем классы для старых кнопок (для совместимости)
    function updateLegacyButtons(level) {
        const normalButton = document.getElementById('normal-difficulty');
        const hardButton = document.getElementById('hard-difficulty');
        
        if (normalButton && hardButton) {
            if (level === 'normal') {
                normalButton.classList.add('active');
                hardButton.classList.remove('active');
            } else {
                normalButton.classList.remove('active');
                hardButton.classList.add('active');
            }
        }
    }
    
    // Инициализация модуля
    function init() {
        console.log('Инициализация улучшенного переключателя сложности');
        
        // Добавляем стили
        addToggleStyles();
        
        // Если DOM уже загружен, заменяем кнопки
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(replaceButtonsWithToggle, 300);
        } else {
            // Иначе ждем загрузки DOM
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(replaceButtonsWithToggle, 300);
            });
        }
        
        // Дополнительно ждем полной загрузки страницы
        window.addEventListener('load', function() {
            setTimeout(replaceButtonsWithToggle, 500);
        });
        
        // Экспортируем методы для возможного использования из других модулей
        window.difficultyToggle = {
            init: init,
            replace: replaceButtonsWithToggle,
            createHTML: createToggleHTML
        };
    }
    
    // Запускаем инициализацию
    init();
})();
