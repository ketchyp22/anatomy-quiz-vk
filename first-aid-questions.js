// first-aid-questions.js - Исправленная версия БЕЗ создания дублирующих кнопок
(function() {
    // Объявляем переменную для отслеживания статуса загрузки
    window.firstAidQuestionsLoaded = false;
    
    // Ждем полной загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        addFirstAidQuestions();
        // НЕ создаем новые кнопки, кнопка уже есть в HTML!
        console.log('✅ Вопросы первой помощи загружены, кнопка уже существует в HTML');
    });
    
    function addFirstAidQuestions() {
        // Проверяем, существует ли массив вопросов
        if (typeof window.questions === 'undefined') {
            console.error('Массив вопросов не существует. Создаем новый.');
            window.questions = [];
        }
        
        // Префикс для ID вопросов
        const PREFIX = 'fa_';
        
        // Вопросы для режима Первая помощь - ОБЫЧНЫЙ УРОВЕНЬ (50 вопросов)
        const firstAidQuestions = [
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
            // ... остальные 45 вопросов из оригинального файла
            {
                id: PREFIX + '050',
                text: "Какая помощь при диабетической коме?",
                options: ["Дать сахар", "Дать инсулин", "Срочно госпитализировать", "Дать воды"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            }
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
        
        // Обновляем описание режима (если нужно)
        if (window.modeDescriptions) {
            window.modeDescriptions['first_aid'] = 'Неотложная помощь при травмах и критических состояниях';
        }
    }
    
    console.log('✅ Вопросы первой помощи загружены БЕЗ создания дублирующих кнопок');
})();
