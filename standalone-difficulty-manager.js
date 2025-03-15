// standalone-difficulty-manager.js - Автономный модуль для управления уровнями сложности квиза
(function() {
    // Переменные модуля
    let difficultyLevel = 'normal'; // По умолчанию - обычный уровень
    let hardQuestionsLoaded = false;
    let hardQuestions = [];
    let normalQuestions = []; // Сохраним оригинальные вопросы
    
    // Функция для создания демо-набора сложных вопросов из имеющихся
    function createDemoHardQuestions() {
        if (!window.questions || !Array.isArray(window.questions) || window.questions.length < 30) {
            console.error('Не удалось создать демо-набор сложных вопросов: недостаточно вопросов');
            return false;
        }
        
        // Просто берем часть существующих вопросов для демо
        const allQuestions = [...window.questions];
        
        // Перемешиваем вопросы для случайного выбора
        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }
        
        // Берем только 30 вопросов для демо
        hardQuestions = allQuestions.slice(0, 30);
        hardQuestionsLoaded = true;
        
        console.log('Создан демо-набор сложных вопросов:', hardQuestions.length);
        return true;
    }
    
    // Активация кнопки сложного режима
    function activateHardButton(isDemoMode = false) {
        const hardBtn = document.getElementById('hard-difficulty');
        if (hardBtn) {
            hardBtn.disabled = false;
            
            // Удаляем спиннер загрузки, если он есть
            if (hardBtn.querySelector('.loading-spinner')) {
                hardBtn.querySelector('.loading-spinner').remove();
            }
            
            // Обновляем текст кнопки
            hardBtn.textContent = isDemoMode ? 'Сложный (демо)' : 'Сложный';
            
            // Удаляем класс ошибки, если он был
            hardBtn.classList.remove('error');
        }
    }
    
    // Функция переключения уровня сложности
    function setDifficultyLevel(level) {
        // Проверяем, если выбран сложный уровень, загружены ли вопросы
        if (level === 'hard' && !hardQuestionsLoaded) {
            console.warn('Сложные вопросы не загружены, переход к демо-режиму');
            
            // Попытка создать демо-набор
            if (!createDemoHardQuestions()) {
                return false;
            }
            
            // Активируем кнопку в демо-режиме
            activateHardButton(true);
        }
        
        // Сохраняем текущий уровень сложности
        difficultyLevel = level;
        
        // Обновляем интерфейс
        updateDifficultyUI(level);
        
        // Если уровень сложный, меняем набор вопросов
        if (level === 'hard') {
            // Сохраняем оригинальные вопросы, если еще не сохранены
            if (normalQuestions.length === 0 && window.questions) {
                normalQuestions = [...window.questions];
            }
            // Устанавливаем сложные вопросы
            window.questions = hardQuestions;
        } else {
            // Возвращаем обычные вопросы
            if (normalQuestions.length > 0) {
                window.questions = normalQuestions;
            }
        }
        
        console.log(`Установлен уровень сложности: ${level}`);
        return true;
    }
    
    // Обновление UI в соответствии с уровнем сложности
    function updateDifficultyUI(level) {
        // Обновляем активную кнопку
        const normalBtn = document.getElementById('normal-difficulty');
        const hardBtn = document.getElementById('hard-difficulty');
        
        if (normalBtn && hardBtn) {
            if (level === 'normal') {
                normalBtn.classList.add('active');
                hardBtn.classList.remove('active');
            } else {
                normalBtn.classList.remove('active');
                hardBtn.classList.add('active');
            }
        }
        
        // Обновляем индикатор сложности в контейнере с вопросами
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            // Удаляем старый индикатор, если есть
            const oldIndicator = quizContainer.querySelector('.difficulty-indicator');
            if (oldIndicator) {
                oldIndicator.remove();
            }
            
            // Добавляем новый индикатор
            const indicator = document.createElement('div');
            indicator.className = `difficulty-indicator ${level}`;
            indicator.textContent = level === 'normal' ? 'Обычный уровень' : 'Сложный уровень';
            quizContainer.appendChild(indicator);
        }
    }
    
    // Инициализация модуля
    function initDifficultyManager() {
        console.log('Инициализация автономного менеджера сложности');
        
        // Проверяем наличие вопросов перед созданием демо-набора
        if (window.questions && Array.isArray(window.questions)) {
            createDemoHardQuestions();
        } else {
            console.warn('Основной набор вопросов не найден, демо-режим будет недоступен');
        }
        
        // Подготавливаем кнопки выбора сложности
        const normalBtn = document.getElementById('normal-difficulty');
        const hardBtn = document.getElementById('hard-difficulty');
        
        if (normalBtn && hardBtn) {
            // Активируем кнопки
            normalBtn.disabled = false;
            if (hardQuestionsLoaded) {
                activateHardButton(true); // Всегда демо-режим в standalone версии
            } else {
                hardBtn.disabled = true;
                hardBtn.textContent = 'Недоступно';
            }
            
            // Обработчик для обычного уровня
            normalBtn.addEventListener('click', function() {
                setDifficultyLevel('normal');
            });
            
            // Обработчик для сложного уровня
            hardBtn.addEventListener('click', function() {
                if (hardQuestionsLoaded) {
                    setDifficultyLevel('hard');
                } else {
                    console.warn('Сложные вопросы недоступны');
                    alert('Сложный режим недоступен в автономном режиме.');
                }
            });
        } else {
            console.error('Не найдены кнопки выбора сложности');
        }
    }
    
    // Экспортируем API для внешнего использования
    window.difficultyManager = {
        init: initDifficultyManager,
        setLevel: setDifficultyLevel,
        getCurrentLevel: function() { return difficultyLevel; },
        areHardQuestionsLoaded: function() { return hardQuestionsLoaded; }
    };
    
    // Функция для поиска и создания элементов селектора сложности
    function createDifficultySelector() {
        // Проверяем, существует ли уже селектор
        if (document.getElementById('normal-difficulty') && document.getElementById('hard-difficulty')) {
            return true;
        }
        
        // Ищем кнопку начала квиза
        const startButton = document.getElementById('start-quiz');
        if (!startButton) {
            console.error('Не найдена кнопка start-quiz');
            return false;
        }
        
        // Получаем родительский элемент
        const parentElement = startButton.parentElement;
        if (!parentElement) {
            console.error('Не найден родительский элемент для кнопки start-quiz');
            return false;
        }
        
        // Создаем HTML селектора сложности
        const selectorHTML = `
            <div class="difficulty-selector">
                <h3>Выберите уровень сложности:</h3>
                <div class="difficulty-buttons">
                    <button id="normal-difficulty" class="difficulty-btn active">Обычный</button>
                    <button id="hard-difficulty" class="difficulty-btn">Сложный</button>
                </div>
            </div>
        `;
        
        // Вставляем HTML перед кнопкой старта
        startButton.insertAdjacentHTML('beforebegin', selectorHTML);
        
        // Добавляем CSS стили, если их нет
        if (!document.querySelector('style#difficulty-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'difficulty-styles';
            styleElement.textContent = `
                /* Стили для селектора сложности */
                .difficulty-selector {
                    margin: 20px 0;
                    text-align: center;
                }
                
                .difficulty-selector h3 {
                    margin-bottom: 15px;
                    font-size: 18px;
                    color: var(--secondary-text, #666666);
                }
                
                .difficulty-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .difficulty-btn {
                    padding: 10px 20px;
                    border-radius: 30px;
                    border: 2px solid var(--btn-primary-bg, #4a76a8);
                    background-color: transparent;
                    color: var(--btn-primary-bg, #4a76a8);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .difficulty-btn:hover {
                    background-color: rgba(74, 118, 168, 0.1);
                    transform: translateY(-2px);
                }
                
                .difficulty-btn.active {
                    background-color: var(--btn-primary-bg, #4a76a8);
                    color: white;
                }
                
                .difficulty-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                /* Стили для индикатора сложности */
                .difficulty-indicator {
                    display: inline-block;
                    padding: 4px 10px;
                    background-color: var(--btn-primary-bg, #4a76a8);
                    color: white;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    position: absolute;
                    top: 15px;
                    right: 15px;
                }
                
                .difficulty-indicator.hard {
                    background-color: #e53935;
                }
                
                /* Значок сложности на странице результатов */
                .difficulty-badge {
                    display: inline-block;
                    padding: 5px 12px;
                    background-color: var(--btn-primary-bg, #4a76a8);
                    color: white;
                    border-radius: 15px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                
                .difficulty-badge.hard {
                    background-color: #e53935;
                }
                
                /* Адаптивность для мобильных устройств */
                @media (max-width: 480px) {
                    .difficulty-buttons {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .difficulty-btn {
                        width: 80%;
                        margin: 0 auto;
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        return true;
    }
    
    // Автоматический запуск после загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Даем небольшую задержку для загрузки других скриптов
        setTimeout(function() {
            // Создаем селектор сложности, если его нет
            if (createDifficultySelector()) {
                initDifficultyManager();
            } else {
                console.warn('Не удалось создать селектор сложности');
            }
        }, 500);
    });
})();
