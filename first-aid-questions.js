// first-aid-questions.js - обновленная версия с гарантированным добавлением вопросов
(function() {
    // Объявляем переменную для отслеживания статуса загрузки
    window.firstAidQuestionsLoaded = false;
    
    // Ждем полной загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        addFirstAidQuestions();
    });
    
    function addFirstAidQuestions() {
        // Проверяем, существует ли массив вопросов
        if (typeof window.questions === 'undefined') {
            console.error('Массив вопросов не существует. Создаем новый.');
            window.questions = [];
        }
        
        // Префикс для ID вопросов
        const PREFIX = 'fa_';
        
        // Вопросы для режима Первая помощь
        const firstAidQuestions = [
            // ПЕРВАЯ ПОМОЩЬ - ОБЫЧНЫЙ УРОВЕНЬ
            {
                id: PREFIX + '001',
                text: "Что необходимо сделать в первую очередь при артериальном кровотечении из конечности?",
                options: ["Наложить жгут", "Приложить холод", "Прижать артерию пальцем выше места кровотечения", "Обработать рану йодом"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '002',
                text: "Какое положение необходимо придать пострадавшему без сознания с сохраненным дыханием?",
                options: ["На спине с приподнятыми ногами", "На боку (устойчивое боковое положение)", "На спине с запрокинутой головой", "На животе"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '003',
                text: "Что нельзя делать при ожоге?",
                options: ["Охлаждать место ожога холодной водой", "Накладывать чистую повязку", "Смазывать ожог маслом или жиром", "Давать обильное питье"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '004',
                text: "Как правильно проводить сердечно-легочную реанимацию взрослому?",
                options: ["30 нажатий на грудину, затем 2 вдоха", "15 нажатий на грудину, затем 1 вдох", "5 нажатий на грудину, затем 1 вдох", "60 нажатий на грудину, затем 2 вдоха"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '005',
                text: "Какой должна быть глубина компрессий при СЛР взрослому человеку?",
                options: ["2-3 см", "4-5 см", "5-6 см", "7-8 см"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '006',
                text: "Что необходимо сделать при подозрении на перелом конечности?",
                options: ["Попытаться вправить кость", "Приложить тепло", "Иммобилизовать конечность", "Растереть место перелома"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '007',
                text: "Какой признак не характерен для артериального кровотечения?",
                options: ["Ярко-алый цвет крови", "Пульсирующая струя", "Быстрая кровопотеря", "Темный цвет крови"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '008',
                text: "Как оказать первую помощь при обмороке?",
                options: ["Уложить пострадавшего с приподнятыми ногами", "Положить на спину и приподнять голову", "Оставить сидеть и наклонить голову вперед", "Поставить на ноги и заставить ходить"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '009',
                text: "Какое действие следует предпринять при попадании инородного тела в дыхательные пути у взрослого человека?",
                options: ["Похлопать по спине и выполнить прием Геймлиха", "Дать выпить воды", "Вызвать рвоту", "Уложить пострадавшего и ждать бригаду скорой помощи"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '010',
                text: "Что делать в первую очередь при химическом ожоге кожи?",
                options: ["Нанести нейтрализующее вещество", "Промыть большим количеством воды", "Наложить стерильную повязку", "Смазать место ожога растительным маслом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            // Продолжите с остальными вопросами
            // ...
        ];
        
        // Добавляем вопросы в общий массив
        firstAidQuestions.forEach(question => {
            // Проверяем, нет ли дубликатов
            const existingQuestion = window.questions.find(q => q.id === question.id);
            if (!existingQuestion) {
                window.questions.push(question);
            }
        });
        
        // Устанавливаем флаг загрузки
        window.firstAidQuestionsLoaded = true;
        
        console.log(`Модуль "Первая помощь": добавлено ${firstAidQuestions.length} вопросов`);
        
        // ВАЖНОЕ ДОБАВЛЕНИЕ: автоматическое инициирование режима первой помощи
        // поскольку порядок загрузки скриптов все еще проблематичен
        setTimeout(addFirstAidMode, 500);
    }
    
    // Добавляем функцию создания режима напрямую из этого скрипта
    function addFirstAidMode() {
        // Проверяем, были ли добавлены вопросы
        const firstAidQuestionsCount = Array.isArray(window.questions) 
            ? window.questions.filter(q => q.mode === 'first_aid').length 
            : 0;
        
        if (firstAidQuestionsCount === 0) {
            console.error('Вопросы для режима "Первая помощь" не найдены, кнопка не будет добавлена');
            return;
        }
        
        // Находим контейнер для кнопок режимов
        const modeContainer = document.querySelector('.quiz-mode-selection');
        if (!modeContainer) {
            console.error('Контейнер для кнопок режимов не найден');
            return;
        }
        
        // Проверяем, нет ли уже кнопки первой помощи
        if (document.querySelector('.quiz-mode-btn[data-mode="first_aid"]')) {
            console.log('Кнопка режима "Первая помощь" уже существует');
            return;
        }
        
        // Создаем кнопку режима
        const button = document.createElement('button');
        button.className = 'quiz-mode-btn';
        button.setAttribute('data-mode', 'first_aid');
        button.textContent = 'Первая помощь';
        
        // Добавляем кнопку в контейнер
        modeContainer.appendChild(button);
        
        console.log('Кнопка режима "Первая помощь" успешно добавлена');
    }
})();
