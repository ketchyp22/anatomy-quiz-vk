// difficulty-manager.js - Модуль для управления уровнями сложности квиза
(function() {
    // Переменные модуля
    let difficultyLevel = 'normal'; // По умолчанию - обычный уровень
    let hardQuestionsLoaded = false;
    let hardQuestions = [];
    let normalQuestions = []; // Сохраним оригинальные вопросы
    
    // Функция загрузки сложных вопросов
    async function loadHardQuestions() {
        try {
            const response = await fetch('difficult-questions.json');
            if (!response.ok) {
                throw new Error('Не удалось загрузить сложные вопросы');
            }
            hardQuestions = await response.json();
            hardQuestionsLoaded = true;
            console.log('Сложные вопросы успешно загружены:', hardQuestions.length);
            
            // Активируем кнопку сложного уровня
            const hardBtn = document.getElementById('hard-difficulty');
            if (hardBtn) {
                hardBtn.disabled = false;
                if (hardBtn.querySelector('.loading-spinner')) {
                    hardBtn.querySelector('.loading-spinner').remove();
                    hardBtn.textContent = 'Сложный';
                }
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка при загрузке сложных вопросов:', error);
            
            // Показываем ошибку на кнопке
            const hardBtn = document.getElementById('hard-difficulty');
            if (hardBtn) {
                hardBtn.textContent = 'Ошибка загрузки';
                hardBtn.classList.add('error');
            }
            
            return false;
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
        console.log('Инициализация менеджера сложности');
        
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
            loadHardQuestions();
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
    
    // Автоматический запуск после загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Проверяем наличие необходимых элементов
        if (document.getElementById('normal-difficulty') && document.getElementById('hard-difficulty')) {
            initDifficultyManager();
        } else {
            console.warn('Селектор сложности не найден, инициализация отложена');
            // Можем попробовать инициализировать позже, когда элементы появятся в DOM
        }
    });
})()
