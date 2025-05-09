// add-first-aid-mode.js - полностью неинвазивная версия
(function() {
    // Константы для режима "Первая помощь"
    const MODE_ID = 'first_aid';
    const MODE_TITLE = 'Первая помощь';
    
    // Запускаем инициализацию после полной загрузки страницы
    window.addEventListener('load', function() {
        console.log('Начало инициализации режима "Первая помощь"...');
        setTimeout(initFirstAidMode, 300); // Небольшая задержка для гарантии загрузки основного приложения
    });
    
    // Основная функция инициализации
    function initFirstAidMode() {
        // Проверяем, загружены ли вопросы первой помощи
        const firstAidQuestionsCount = countFirstAidQuestions();
        console.log(`Найдено ${firstAidQuestionsCount} вопросов для режима "Первая помощь"`);
        
        if (firstAidQuestionsCount === 0) {
            console.error('Вопросы для режима "Первая помощь" не найдены. Кнопка не будет добавлена.');
            return;
        }
        
        // Добавляем кнопку режима в интерфейс
        addModeButton();
        
        console.log('Инициализация режима "Первая помощь" завершена успешно');
    }
    
    // Функция подсчета вопросов для режима Первая помощь
    function countFirstAidQuestions() {
        if (!Array.isArray(window.questions)) {
            return 0;
        }
        
        return window.questions.filter(q => q.mode === MODE_ID).length;
    }
    
    // Функция добавления кнопки режима в интерфейс
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
        
        // Находим существующую кнопку для копирования стиля
        const existingButton = document.querySelector('.quiz-mode-btn');
        
        if (!existingButton) {
            console.error('Не найдены существующие кнопки режимов');
            return;
        }
        
        // Создаем новую кнопку, аналогичную существующим
        const button = document.createElement('button');
        button.className = 'quiz-mode-btn';
        button.setAttribute('data-mode', MODE_ID);
        button.textContent = MODE_TITLE;
        
        // ВАЖНО: Не добавляем никаких своих обработчиков событий и не меняем стили
        // Это позволит приложению обрабатывать новую кнопку так же, как и остальные
        
        // Добавляем кнопку в контейнер
        modeContainer.appendChild(button);
        
        // Добавляем описание режима для всплывающей подсказки
        addModeDescription();
        
        console.log('Кнопка режима "Первая помощь" успешно добавлена');
    }
    
    // Функция добавления описания режима для всплывающей подсказки
    function addModeDescription() {
        // Проверяем, существует ли в приложении обработчик описаний режимов
        const descriptionElement = document.getElementById('mode-description');
        
        if (!descriptionElement) {
            return; // Если нет элемента описания, ничего не делаем
        }
        
        // Ищем существующий объект описаний в приложении
        const descriptions = findDescriptionsObject();
        
        if (descriptions) {
            // Если нашли объект с описаниями, добавляем наше описание
            descriptions[MODE_ID] = 'Неотложная помощь при травмах, отравлениях и других состояниях';
            console.log('Описание режима "Первая помощь" добавлено в существующий объект');
        } else {
            // Иначе обрабатываем события наведения мыши самостоятельно
            handleDescriptionHover();
        }
    }
    
    // Поиск объекта с описаниями режимов в приложении
    function findDescriptionsObject() {
        // Проверяем глобальные переменные
        for (const key in window) {
            if (
                typeof window[key] === 'object' && 
                window[key] !== null &&
                typeof window[key]['anatomy'] === 'string' &&
                typeof window[key]['clinical'] === 'string'
            ) {
                return window[key];
            }
        }
        
        return null;
    }
    
    // Обработка наведения мыши для отображения описания
    function handleDescriptionHover() {
        const descriptionElement = document.getElementById('mode-description');
        
        if (!descriptionElement) {
            return;
        }
        
        // Добавляем обработчик только для нашей кнопки
        const button = document.querySelector(`.quiz-mode-btn[data-mode="${MODE_ID}"]`);
        
        if (button) {
            button.addEventListener('mouseover', function() {
                descriptionElement.textContent = 'Неотложная помощь при травмах, отравлениях и других состояниях';
                descriptionElement.classList.add('active-description');
            });
            
            button.addEventListener('mouseout', function() {
                descriptionElement.classList.remove('active-description');
            });
            
            console.log('Добавлены обработчики наведения для описания режима "Первая помощь"');
        }
    }
})();
