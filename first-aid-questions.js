// first-aid-questions.js - обновленная версия с 50 вопросами обычного уровня
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
            {
                id: PREFIX + '011',
                text: "Какая частота компрессий грудной клетки при проведении СЛР?",
                options: ["60-80 в минуту", "80-100 в минуту", "100-120 в минуту", "120-140 в минуту"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '012',
                text: "Что необходимо сделать при носовом кровотечении?",
                options: ["Запрокинуть голову назад", "Наклонить голову вперед и прижать крылья носа", "Лечь горизонтально", "Приложить тепло к переносице"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '013',
                text: "Какой должна быть продолжительность промывания глаз при попадании химических веществ?",
                options: ["1-2 минуты", "5-10 минут", "15-20 минут", "30 минут"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '014',
                text: "Что является признаком венозного кровотечения?",
                options: ["Ярко-алая кровь, бьющая фонтаном", "Темно-вишневая кровь, вытекающая непрерывной струей", "Кровь сочится равномерно", "Пульсирующая струя крови"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '015',
                text: "При каком виде перелома кожные покровы остаются неповрежденными?",
                options: ["Открытый перелом", "Закрытый перелом", "Осколочный перелом", "Компрессионный перелом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '016',
                text: "Что необходимо сделать при подозрении на черепно-мозговую травму?",
                options: ["Дать обезболивающее", "Обеспечить покой и приложить холод к голове", "Немедленно поднять пострадавшего", "Дать пить воду"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '017',
                text: "Какая температура воды оптимальна для промывания ожога?",
                options: ["Ледяная", "Холодная (15-18°C)", "Комнатная (20-25°C)", "Теплая"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '018',
                text: "Что нельзя делать при обморожении?",
                options: ["Растирать пораженный участок снегом", "Постепенно согревать", "Наложить сухую повязку", "Дать теплое питье"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '019',
                text: "Как оказать помощь при тепловом ударе?",
                options: ["Дать горячий чай", "Перенести в прохладное место и приложить холод", "Энергично растереть кожу", "Дать алкоголь"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '020',
                text: "Что должно быть в автомобильной аптечке первой помощи?",
                options: ["Только лекарственные препараты", "Только перевязочные материалы", "Перевязочные материалы и средства для остановки кровотечения", "Хирургические инструменты"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '021',
                text: "На какое максимальное время можно накладывать жгут в теплое время года?",
                options: ["30 минут", "1 час", "1,5 часа", "2 часа"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '022',
                text: "Что необходимо сделать при попадании инородного тела в глаз?",
                options: ["Попытаться извлечь предмет", "Тереть глаз", "Промыть глаз чистой водой", "Закапать капли"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '023',
                text: "Какой признак указывает на остановку сердца?",
                options: ["Учащенное дыхание", "Отсутствие пульса на сонной артерии", "Повышенная температура", "Покраснение кожи"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '024',
                text: "Что делать при укусе собаки?",
                options: ["Прижечь рану", "Промыть рану и обратиться к врачу", "Наложить жгут", "Ничего не делать"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '025',
                text: "Как помочь при приступе бронхиальной астмы?",
                options: ["Дать воды", "Помочь принять лекарство и обеспечить доступ воздуха", "Уложить горизонтально", "Сделать массаж"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '026',
                text: "Что характерно для капиллярного кровотечения?",
                options: ["Алая кровь фонтаном", "Темная кровь струей", "Кровь сочится по всей поверхности раны", "Пульсирующая струя"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '027',
                text: "При каком отравлении нельзя вызывать рвоту?",
                options: ["Отравление грибами", "Отравление кислотами и щелочами", "Отравление алкоголем", "Пищевое отравление"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '028',
                text: "Что необходимо делать при электротравме?",
                options: ["Сразу оттащить пострадавшего руками", "Обесточить источник тока", "Полить водой", "Дать лекарство"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '029',
                text: "Как определить, что у человека перелом ребер?",
                options: ["Боль при дыхании и движении", "Головокружение", "Тошнота", "Повышение температуры"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '030',
                text: "Что делать при вывихе сустава?",
                options: ["Попытаться вправить", "Иммобилизовать и приложить холод", "Растереть", "Нагреть"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '031',
                text: "Какая помощь при попадании едкого вещества в рот?",
                options: ["Проглотить молоко", "Прополоскать рот водой и выплюнуть", "Вызвать рвоту", "Дать хлеб"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '032',
                text: "При каких условиях можно транспортировать пострадавшего?",
                options: ["В любом состоянии", "После оказания первой помощи", "Только в сознании", "Только при легких травмах"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '033',
                text: "Что нужно сделать при болях в сердце?",
                options: ["Дать нитроглицерин и вызвать скорую", "Положить под язык аспирин", "Сделать массаж сердца", "Дать горячий чай"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '034',
                text: "Как помочь при аллергической реакции?",
                options: ["Дать антигистаминный препарат", "Растереть кожу", "Приложить тепло", "Дать алкоголь"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '035',
                text: "Что делать при укусе пчелы?",
                options: ["Выдавить жало", "Удалить жало и приложить холод", "Прижечь место укуса", "Ничего не делать"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '036',
                text: "Как остановить сильное венозное кровотечение?",
                options: ["Наложить жгут", "Наложить давящую повязку", "Прижать артерию", "Приложить лед"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '037',
                text: "Что делать при ранении живота?",
                options: ["Вправить выпавшие органы", "Накрыть рану стерильной салфеткой", "Дать воды", "Дать обезболивающее"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '038',
                text: "При каком состоянии нужно немедленно начать СЛР?",
                options: ["Обморок", "Клиническая смерть", "Кома", "Шок"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '039',
                text: "Что нельзя делать при травме позвоночника?",
                options: ["Иммобилизовать", "Поворачивать и сгибать пострадавшего", "Вызвать скорую", "Обеспечить покой"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '040',
                text: "Как оказать помощь при эпилептическом припадке?",
                options: ["Удерживать пострадавшего", "Оберегать от травм, не удерживать", "Разжать зубы", "Дать воды"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '041',
                text: "Что делать при отравлении угарным газом?",
                options: ["Дать молоко", "Вынести на свежий воздух", "Дать обезболивающее", "Согреть пострадавшего"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '042',
                text: "Какой признак внутреннего кровотечения?",
                options: ["Повышение давления", "Бледность, слабость, жажда", "Повышение температуры", "Покраснение кожи"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '043',
                text: "Что делать при попадании насекомого в ухо?",
                options: ["Попытаться извлечь пинцетом", "Закапать теплое масло", "Промыть ухо водой", "Постучать по голове"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '044',
                text: "Как помочь при инсульте?",
                options: ["Дать лекарства", "Уложить с приподнятой головой и вызвать скорую", "Дать воды", "Сделать массаж"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '045',
                text: "Что характерно для солнечного удара?",
                options: ["Переохлаждение", "Перегревание головы", "Отравление", "Кровотечение"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '046',
                text: "Как помочь при приступе стенокардии?",
                options: ["Дать валидол под язык", "Положить горизонтально", "Дать воды", "Сделать массаж"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '047',
                text: "Что нужно делать при травме глаза?",
                options: ["Промыть водой", "Закрыть повязкой и обратиться к врачу", "Закапать капли", "Потереть глаз"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '048',
                text: "При каком кровотечении накладывается жгут?",
                options: ["Венозном", "Капиллярном", "Артериальном", "Паренхиматозном"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '049',
                text: "Что делать при обширном ожоге?",
                options: ["Смазать маслом", "Наложить сухую стерильную повязку", "Проколоть пузыри", "Промыть спиртом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
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
