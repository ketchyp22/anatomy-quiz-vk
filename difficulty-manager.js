// difficulty-manager.js - Модуль для управления уровнями сложности квиза
(function() {
    // Переменные модуля
    let difficultyLevel = 'normal'; // По умолчанию - обычный уровень
    let hardQuestionsLoaded = false;
    let hardQuestions = [];
    let normalQuestions = []; // Сохраним оригинальные вопросы
    let isOfflineMode = false; // Флаг автономного режима
    
    // Проверка доступности VK Bridge
    function checkVKBridgeAvailability() {
        try {
            if (typeof window.vkBridge !== 'undefined' || typeof window.vkBridgeInstance !== 'undefined') {
                return true;
            }
            return false;
        } catch (e) {
            console.log('VK Bridge недоступен, работаем в автономном режиме');
            return false;
        }
    }
    
    // Функция загрузки сложных вопросов
    async function loadHardQuestions() {
        try {
            // Проверяем, доступны ли сложные вопросы в localStorage
            const cachedQuestions = localStorage.getItem('hardQuestions');
            if (cachedQuestions) {
                try {
                    hardQuestions = JSON.parse(cachedQuestions);
                    hardQuestionsLoaded = true;
                    console.log('Сложные вопросы загружены из localStorage:', hardQuestions.length);
                    activateHardButton();
                    return true;
                } catch (e) {
                    console.warn('Ошибка при загрузке сложных вопросов из localStorage', e);
                    // Продолжаем загрузку с сервера
                }
            }
            
            // Загружаем с сервера
            const response = await fetch('difficult-questions.json');
            if (!response.ok) {
                throw new Error('Не удалось загрузить сложные вопросы');
            }
            
            hardQuestions = await response.json();
            hardQuestionsLoaded = true;
            console.log('Сложные вопросы успешно загружены с сервера:', hardQuestions.length);
            
            // Кэшируем вопросы в localStorage для офлайн-режима
            try {
                localStorage.setItem('hardQuestions', JSON.stringify(hardQuestions));
                console.log('Сложные вопросы кэшированы в localStorage');
            } catch (e) {
                console.warn('Не удалось сохранить вопросы в localStorage', e);
            }
            
            activateHardButton();
            return true;
        } catch (error) {
            console.error('Ошибка при загрузке сложных вопросов:', error);
            
            // Попробуем создать заглушку с меньшим набором сложных вопросов
            if (window.questions && Array.isArray(window.questions)) {
                console.log('Создаем заглушку для сложных вопросов');
                // Возьмем последние 30 вопросов из основного набора как "сложные"
                hardQuestions = window.questions.slice(-30);
                hardQuestionsLoaded = true;
                activateHardButton(true); // true = это заглушка
                return true;
            }
            
            showErrorOnHardButton();
            return false;
        }
    }
    
    // Активация кнопки сложного режима
    function activateHardButton(isStub = false) {
        const hardBtn = document.getElementById('hard-difficulty');
        if (hardBtn) {
            hardBtn.disabled = false;
            
            // Удаляем спиннер загрузки, если он есть
            if (hardBtn.querySelector('.loading-spinner')) {
                hardBtn.querySelector('.loading-spinner').remove();
            }
            
            // Обновляем текст кнопки
            hardBtn.textContent = isStub ? 'Сложный (демо)' : 'Сложный';
            
            // Удаляем класс ошибки, если он был
            hardBtn.classList.remove('error');
        }
    }
    
    // Показываем ошибку на кнопке
    function showErrorOnHardButton() {
        const hardBtn = document.getElementById('hard-difficulty');
        if (hardBtn) {
            hardBtn.disabled = true;
            hardBtn.textContent = 'Недоступно';
            hardBtn.classList.add('error');
            
            if (hardBtn.querySelector('.loading-spinner')) {
                hardBtn.querySelector('.loading-spinner').remove();
            }
        }
    }
    
    // Функция переключения уровня сложности
    function setDifficultyLevel(level) {
        // Проверяем, если выбран сложный уровень, загружены ли вопросы
        if (level === 'hard' && !hardQuestionsLoaded) {
            console.warn('Сложные вопросы еще не загружены');
            return false;
        }
        
        // Сохраняем текущий уровень сложности
        difficultyLevel = level;
        
        // Сохраняем в localStorage для запоминания выбора
        try {
            localStorage.setItem('difficultyLevel', level);
        } catch (e) {
            console.warn('Не удалось сохранить уровень сложности в localStorage', e);
        }
        
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
    
    // Восстановление последнего выбранного уровня сложности
    function restoreLastDifficulty() {
        try {
            const lastLevel = localStorage.getItem('difficultyLevel');
            if (lastLevel && (lastLevel === 'normal' || (lastLevel === 'hard' && hardQuestionsLoaded))) {
                console.log(`Восстановление последнего уровня сложности: ${lastLevel}`);
                setDifficultyLevel(lastLevel);
            }
        } catch (e) {
            console.warn('Ошибка при восстановлении уровня сложности', e);
        }
    }
    
    // Инициализация модуля
    function initDifficultyManager() {
        console.log('Инициализация менеджера сложности');
        
        // Проверяем доступность VK Bridge
        isOfflineMode = !checkVKBridgeAvailability();
        if (isOfflineMode) {
            console.log('Работаем в автономном режиме');
        }
        
        // Подготавливаем кнопки выбора сложности
        const normalBtn = document.getElementById('normal-difficulty');
        const hardBtn = document.getElementById('hard-difficulty');
        
        if (normalBtn && hardBtn) {
            // Добавляем индикатор загрузки к кнопке сложного уровня
            hardBtn.disabled = true;
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            spinner.textContent = '⌛';
            hardBtn.textContent = 'Загрузка ';
            hardBtn.appendChild(spinner);
            
            // Обработчик для обычного уровня
            normalBtn.addEventListener('click', function() {
                setDifficultyLevel('normal');
            });
            
            // Обработчик для сложного уровня
            hardBtn.addEventListener('click', function() {
                if (hardQuestionsLoaded) {
                    setDifficultyLevel('hard');
                } else {
                    console.warn('Сложные вопросы еще загружаются');
                }
            });
            
            // Начинаем загрузку сложных вопросов
            loadHardQuestions().then(() => {
                // После загрузки восстанавливаем последний выбранный уровень
                restoreLastDifficulty();
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
        areHardQuestionsLoaded: function() { return hardQuestionsLoaded; },
        isOfflineMode: function() { return isOfflineMode; }
    };
    
    // Автоматический запуск после загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Даем небольшую задержку для загрузки других скриптов
        setTimeout(function() {
            // Проверяем наличие необходимых элементов
            if (document.getElementById('normal-difficulty') && document.getElementById('hard-difficulty')) {
                initDifficultyManager();
            } else {
                console.warn('Селектор сложности не найден, инициализация отложена');
                
                // Пробуем инициализировать позже, когда элементы могут появиться в DOM
                setTimeout(function() {
                    if (document.getElementById('normal-difficulty') && document.getElementById('hard-difficulty')) {
                        initDifficultyManager();
                    } else {
                        console.error('Селектор сложности не найден даже после ожидания');
                    }
                }, 2000);
            }
        }, 500);
    });
})();
