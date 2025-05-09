// add-first-aid-mode.js - простая и неинвазивная версия
(function() {
    // Константы для режима "Первая помощь"
    const MODE_ID = 'first_aid';
    const MODE_TITLE = 'Первая помощь';
    
    // Глобальный флаг для отслеживания инициализации
    window.firstAidModeInitialized = false;
    
    // Ждем полной загрузки страницы
    window.addEventListener('load', function() {
        // Отложенная инициализация
        setTimeout(initFirstAidMode, 800);
    });
    
    // Функция для проверки вопросов с повторными попытками
    function initFirstAidMode() {
        console.log('Проверка наличия вопросов для режима "Первая помощь"...');
        
        // Проверяем наличие вопросов первой помощи
        const questionsCount = countFirstAidQuestions();
        console.log(`Найдено ${questionsCount} вопросов для режима "Первая помощь"`);
        
        if (questionsCount > 0) {
            // Добавляем кнопку режима
            addModeButton();
            // Устанавливаем флаг инициализации
            window.firstAidModeInitialized = true;
        } else {
            // Если вопросы не найдены, пробуем еще раз через секунду
            console.log('Вопросы для режима "Первая помощь" не найдены. Повторная попытка через 1 секунду.');
            setTimeout(function() {
                const retryCount = countFirstAidQuestions();
                console.log(`Повторная проверка: найдено ${retryCount} вопросов для режима "Первая помощь"`);
                
                if (retryCount > 0) {
                    addModeButton();
                    window.firstAidModeInitialized = true;
                } else {
                    console.error('Вопросы для режима "Первая помощь" не обнаружены после повторной попытки. Убедитесь, что first-aid-questions.js корректно загружается.');
                }
            }, 1000);
        }
    }
    
    // Функция подсчета вопросов для режима Первая помощь
    function countFirstAidQuestions() {
        // Проверяем существование массива вопросов
        if (!Array.isArray(window.questions)) {
            console.log('Массив вопросов не инициализирован');
            return 0;
        }
        
        // Подсчитываем вопросы с режимом "first_aid"
        return window.questions.filter(q => q.mode === MODE_ID).length;
    }
    
    // Функция добавления кнопки режима
    function addModeButton() {
        // Находим контейнер для кнопок выбора режима
        const modeContainer = document.querySelector('.quiz-mode-selection');
        if (!modeContainer) {
            console.error('Контейнер для кнопок режимов не найден');
            return;
        }
        
        // Проверяем, не добавлена ли уже кнопка режима
        if (document.querySelector(`.quiz-mode-btn[data-mode="${MODE_ID}"]`)) {
            console.log('Кнопка режима "Первая помощь" уже существует');
            return;
        }
        
        // Создаем новую кнопку (в стиле существующих)
        const button = document.createElement('button');
        button.className = 'quiz-mode-btn';
        button.setAttribute('data-mode', MODE_ID);
        button.textContent = MODE_TITLE;
        
        // Устанавливаем специальный цвет для кнопки первой помощи (опционально)
        button.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
        button.style.color = 'white';
        
        // Добавляем кнопку в контейнер
        modeContainer.appendChild(button);
        
        // Добавляем описание для всплывающей подсказки (если применимо)
        addModeDescription();
        
        console.log('Кнопка режима "Первая помощь" успешно добавлена');
    }
    
    // Функция добавления описания режима
    function addModeDescription() {
        // Добавляем описание, если оно еще не существует
        if (window.modeDescriptions && !window.modeDescriptions[MODE_ID]) {
            window.modeDescriptions[MODE_ID] = 'Неотложная помощь при травмах, отравлениях и других состояниях';
            console.log('Описание режима "Первая помощь" добавлено');
        }
    }
})();
