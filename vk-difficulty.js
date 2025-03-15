// vk-difficulty.js - Скрипт выбора сложности, адаптированный для VK
(function() {
    // Функция инициализации, запускается после загрузки основного приложения
    function initDifficultySelector() {
        console.log("Инициализация селектора сложности для VK");
        
        // Проверяем, существует ли стартовый экран
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) {
            console.error("Не найден стартовый экран");
            return false;
        }
        
        // Проверяем, существует ли кнопка старта
        const startButton = document.getElementById('start-quiz');
        if (!startButton) {
            console.error("Не найдена кнопка 'Начать тест'");
            return false;
        }
        
        // Создаем элемент для селектора сложности
        const difficultySelector = document.createElement('div');
        difficultySelector.innerHTML = `
            <div style="margin: 20px 0; text-align: center;">
                <h3 style="margin-bottom: 15px; font-size: 18px; color: #666666;">Выберите уровень сложности:</h3>
                <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 25px;">
                    <button id="normal-difficulty" style="padding: 10px 20px; border-radius: 30px; border: 2px solid #4a76a8; background-color: #4a76a8; color: white; font-weight: 600; cursor: pointer;">Обычный</button>
                    <button id="hard-difficulty" style="padding: 10px 20px; border-radius: 30px; border: 2px solid #4a76a8; background-color: transparent; color: #4a76a8; font-weight: 600; cursor: pointer;">Сложный</button>
                </div>
            </div>
        `;
        
        // Вставляем перед кнопкой старта
        startButton.parentNode.insertBefore(difficultySelector, startButton);
        
        // Получаем кнопки
        const normalButton = document.getElementById('normal-difficulty');
        const hardButton = document.getElementById('hard-difficulty');
        
        // Если кнопки успешно созданы, настраиваем функционал
        if (normalButton && hardButton) {
            setupDifficultyButtons(normalButton, hardButton);
            return true;
        } else {
            console.error("Не удалось создать кнопки выбора сложности");
            return false;
        }
    }
    
    // Настройка функционала кнопок
    function setupDifficultyButtons(normalButton, hardButton) {
        // Сохраняем оригинальные вопросы
        let originalQuestions = [];
        let hardQuestions = [];
        
        // Функция для сохранения оригинальных вопросов
        function saveOriginalQuestions() {
            if (window.questions && Array.isArray(window.questions) && window.questions.length > 0) {
                originalQuestions = [...window.questions];
                console.log(`Сохранены оригинальные вопросы: ${originalQuestions.length}`);
                
                // Создаем сложные вопросы
                createHardQuestions();
                return true;
            }
            return false;
        }
        
        // Функция для создания сложных вопросов
        function createHardQuestions() {
            if (originalQuestions.length === 0) return false;
            
            // Перемешиваем оригинальные вопросы
            hardQuestions = shuffleArray([...originalQuestions]).slice(0, 30);
            console.log(`Создан набор из ${hardQuestions.length} сложных вопросов`);
            
            // Активируем кнопку сложного режима
            if (hardButton) {
                hardButton.disabled = false;
            }
            
            return true;
        }
        
        // Функция перемешивания массива
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        // Обработчики кликов на кнопки
        normalButton.addEventListener('click', function() {
            // Проверяем наличие вопросов
            if (!saveOriginalQuestions()) return;
            
            // Визуальное выделение
            normalButton.style.backgroundColor = '#4a76a8';
            normalButton.style.color = 'white';
            hardButton.style.backgroundColor = 'transparent';
            hardButton.style.color = '#4a76a8';
            
            // Устанавливаем обычные вопросы
            window.questions = originalQuestions;
            console.log("Установлен обычный уровень сложности");
        });
        
        hardButton.addEventListener('click', function() {
            // Проверяем наличие вопросов
            if (!saveOriginalQuestions()) return;
            
            // Визуальное выделение
            hardButton.style.backgroundColor = '#4a76a8';
            hardButton.style.color = 'white';
            normalButton.style.backgroundColor = 'transparent';
            normalButton.style.color = '#4a76a8';
            
            // Устанавливаем сложные вопросы
            window.questions = hardQuestions;
            console.log("Установлен сложный уровень сложности");
        });
        
        // Сразу пытаемся сохранить оригинальные вопросы
        saveOriginalQuestions();
    }
    
    // Функция безопасного запуска, которая пытается инициализировать 
    // селектор сложности до тех пор, пока не удастся или не истечет время
    function safeInit(maxAttempts = 10, delay = 1000) {
        let attempts = 0;
        
        function tryInit() {
            attempts++;
            console.log(`Попытка инициализации селектора сложности: ${attempts}`);
            
            if (initDifficultySelector()) {
                console.log("Селектор сложности успешно инициализирован");
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(tryInit, delay);
            } else {
                console.error(`Не удалось инициализировать селектор сложности после ${maxAttempts} попыток`);
            }
        }
        
        // Начинаем попытки инициализации
        tryInit();
    }
    
    // Запускаем безопасную инициализацию после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                safeInit();
            }, 500);
        });
    } else {
        // DOM уже загружен
        setTimeout(function() {
            safeInit();
        }, 500);
    }
})();
