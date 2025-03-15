// vk-difficulty.js - Скрипт выбора сложности, адаптированный для VK
(function() {
    // Переменные модуля
    let difficultyLevel = 'normal'; // По умолчанию - обычный уровень
    let originalQuestions = []; // Сохраняем оригинальные вопросы
    let hardQuestions = []; // Сложные вопросы
    
    // Функция инициализации
    function initDifficultySelector() {
        console.log("Инициализация селектора сложности для VK");
        
        // Сохраняем оригинальные вопросы
        if (window.questions && Array.isArray(window.questions)) {
            originalQuestions = [...window.questions];
            console.log(`Сохранены оригинальные вопросы: ${originalQuestions.length}`);
            
            // Загружаем сложные вопросы из JSON-файла
            loadHardQuestionsFromJson();
        } else {
            console.warn('Вопросы не найдены при инициализации селектора сложности');
            
            // Добавляем обработчик, чтобы попытаться инициализировать позже
            document.addEventListener('questionsLoaded', function() {
                if (window.questions && Array.isArray(window.questions)) {
                    originalQuestions = [...window.questions];
                    console.log(`Сохранены оригинальные вопросы после события: ${originalQuestions.length}`);
                    loadHardQuestionsFromJson();
                }
            });
        }
        
        // Настраиваем кнопки выбора сложности
        setupDifficultyButtons();
    }
    
    // Функция для загрузки сложных вопросов из JSON-файла
    function loadHardQuestionsFromJson() {
        console.log('Загрузка сложных вопросов из JSON-файла...');
        
        fetch('difficult-questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ошибка! Статус: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    hardQuestions = data;
                    console.log(`Загружено ${hardQuestions.length} сложных вопросов из JSON-файла`);
                    
                    // Активируем кнопку сложного режима
                    const hardButton = document.getElementById('hard-difficulty');
                    if (hardButton) {
                        hardButton.disabled = false;
                    }
                } else {
                    throw new Error('Загруженные данные не являются массивом или пусты');
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке сложных вопросов:', error);
                console.log('Используем запасной вариант - создаем сложные вопросы из оригинальных');
                createHardQuestions();
            });
    }
    
    // Функция для создания сложных вопросов (запасной вариант)
    function createHardQuestions() {
        if (originalQuestions.length === 0) {
            console.warn('Не удалось создать сложные вопросы: оригинальные вопросы отсутствуют');
            return;
        }
        
        // Перемешиваем оригинальные вопросы
        hardQuestions = shuffleArray([...originalQuestions]);
        
        // Берем только часть вопросов для сложного режима
        hardQuestions = hardQuestions.slice(0, Math.min(30, originalQuestions.length));
        
        console.log(`Создан запасной набор из ${hardQuestions.length} сложных вопросов`);
        
        // Активируем кнопку сложного режима
        const hardButton = document.getElementById('hard-difficulty');
        if (hardButton) {
            hardButton.disabled = false;
        }
    }
    
    // Настройка кнопок выбора сложности
    function setupDifficultyButtons() {
        const normalButton = document.getElementById('normal-difficulty');
        const hardButton = document.getElementById('hard-difficulty');
        
        if (!normalButton || !hardButton) {
            console.warn('Кнопки выбора сложности не найдены в DOM');
            return;
        }
        
        // Обработчик для обычного уровня
        normalButton.addEventListener('click', function() {
            setDifficultyLevel('normal');
            
            // Визуальное выделение
            normalButton.classList.add('active');
            hardButton.classList.remove('active');
        });
        
        // Обработчик для сложного уровня
        hardButton.addEventListener('click', function() {
            setDifficultyLevel('hard');
            
            // Визуальное выделение
            hardButton.classList.add('active');
            normalButton.classList.remove('active');
        });
    }
    
    // Установка уровня сложности
    function setDifficultyLevel(level) {
        difficultyLevel = level;
        
        // Обновляем текущий набор вопросов
        if (level === 'hard') {
            if (hardQuestions.length > 0) {
                window.questions = hardQuestions;
                console.log('Установлен сложный уровень с использованием специального набора вопросов');
            } else {
                console.warn('Сложные вопросы не созданы, оставляем обычный набор');
            }
        } else {
            if (originalQuestions.length > 0) {
                window.questions = originalQuestions;
                console.log('Установлен обычный уровень с использованием оригинального набора вопросов');
            }
        }
        
        console.log(`Уровень сложности установлен: ${level}`);
    }
    
    // Функция перемешивания массива
    function shuffleArray(array) {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        
        return newArray;
    }
    
    // Экспортируем API для использования в других модулях
    window.difficultyManager = {
        init: initDifficultySelector,
        setLevel: setDifficultyLevel,
        getCurrentLevel: function() { return difficultyLevel; },
        areHardQuestionsLoaded: function() { return hardQuestions.length > 0; }
    };
    
    // Автоматическая инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initDifficultySelector, 100);
        });
    } else {
        // DOM уже загружен
        setTimeout(initDifficultySelector, 100);
    }
})();
