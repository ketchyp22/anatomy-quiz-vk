// first-aid-questions.js - Полная версия с 40 вопросами
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
        
        // Вопросы для режима Первая помощь - ОБЫЧНЫЙ УРОВЕНЬ (40 вопросов)
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
                text: "Что нужно сделать при переломе открытого типа?",
                options: ["Вправить кость на место", "Остановить кровотечение и наложить шину", "Промыть рану водой", "Наложить тугую повязку"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '007',
                text: "Какой основной признак клинической смерти?",
                options: ["Отсутствие пульса на сонной артерии", "Бледность кожи", "Отсутствие дыхания", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '008',
                text: "Что делать при попадании инородного тела в дыхательные пути?",
                options: ["Дать воды", "Выполнить прием Геймлиха", "Положить на бок", "Сделать искусственное дыхание"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '009',
                text: "При каком виде кровотечения кровь темная, вытекает равномерной струей?",
                options: ["Артериальном", "Венозном", "Капиллярном", "Паренхиматозном"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '010',
                text: "Как оказать помощь при обмороке?",
                options: ["Дать понюхать нашатырный спирт", "Придать горизонтальное положение с приподнятыми ногами", "Дать горячий чай", "Сделать искусственное дыхание"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '011',
                text: "Что характерно для артериального кровотечения?",
                options: ["Кровь темно-красная, вытекает медленно", "Кровь алая, бьет фонтаном", "Кровь сочится по всей поверхности раны", "Кровь смешанного характера"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '012',
                text: "Какой должна быть частота компрессий при СЛР?",
                options: ["60-80 в минуту", "80-100 в минуту", "100-120 в минуту", "120-140 в минуту"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '013',
                text: "При каком виде шока наблюдается падение артериального давления из-за кровопотери?",
                options: ["Кардиогенном", "Гиповолемическом", "Анафилактическом", "Болевом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '014',
                text: "Что нужно сделать при укусе змеи?",
                options: ["Прижечь место укуса", "Наложить жгут", "Обеспечить покой, обильное питье", "Сделать надрезы"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '015',
                text: "Как помочь при солнечном ударе?",
                options: ["Перенести в тень, охладить голову", "Дать горячее питье", "Растереть спиртом", "Поставить горчичники"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '016',
                text: "Что делать при химическом ожоге кислотой?",
                options: ["Обработать щелочью", "Смыть большим количеством воды", "Нанести масло", "Присыпать содой"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '017',
                text: "Признаки перелома ребер:",
                options: ["Боль при дыхании", "Деформация грудной клетки", "Крепитация", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '018',
                text: "При переохлаждении нельзя:",
                options: ["Согревать теплым питьем", "Растирать снегом", "Укутывать", "Перенести в теплое место"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '019',
                text: "Основной принцип иммобилизации при переломе:",
                options: ["Фиксировать место перелома", "Фиксировать два сустава выше и ниже перелома", "Фиксировать только один сустав", "Туго забинтовать"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '020',
                text: "При ожоге 2 степени образуются:",
                options: ["Покраснение кожи", "Пузыри с жидкостью", "Струп", "Обугливание тканей"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '021',
                text: "Что является признаком сотрясения головного мозга?",
                options: ["Головная боль", "Тошнота, рвота", "Потеря сознания", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '022',
                text: "При гипогликемической коме нужно:",
                options: ["Дать сладкое", "Дать инсулин", "Ничего не давать", "Дать соленое"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '023',
                text: "Транспортировка при переломе позвоночника:",
                options: ["На мягких носилках", "На жестких носилках на спине", "В сидячем положении", "На боку"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '024',
                text: "При электротравме в первую очередь нужно:",
                options: ["Начать реанимацию", "Обесточить пострадавшего", "Полить водой", "Дать сердечные капли"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '025',
                text: "Признаком внутреннего кровотечения является:",
                options: ["Бледность кожи", "Частый слабый пульс", "Снижение давления", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '026',
                text: "При вывихе нельзя:",
                options: ["Фиксировать конечность", "Вправлять вывих", "Дать обезболивающее", "Приложить холод"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '027',
                text: "Помощь при носовом кровотечении:",
                options: ["Запрокинуть голову", "Наклонить голову вперед, зажать нос", "Положить на спину", "Дать горячее питье"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '028',
                text: "При анафилактическом шоке развивается:",
                options: ["Повышение давления", "Резкое падение давления", "Замедление пульса", "Повышение температуры"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '029',
                text: "Что делать при подозрении на отравление?",
                options: ["Вызвать рвоту", "Промыть желудок", "Дать слабительное", "Все зависит от вида отравления"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '030',
                text: "При ранении живота с выпадением органов нужно:",
                options: ["Вправить органы", "Накрыть влажной салфеткой", "Промыть рану", "Наложить тугую повязку"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '031',
                text: "Признаки утопления в пресной воде:",
                options: ["Розовая пена изо рта", "Синюшность кожи", "Остановка дыхания", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '032',
                text: "При переломе ключицы руку фиксируют:",
                options: ["Повязкой Дезо", "Косыночной повязкой", "Шиной Крамера", "Любым способом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '033',
                text: "Первая помощь при стенокардии:",
                options: ["Нитроглицерин под язык", "Горчичники на грудь", "Массаж сердца", "Искусственное дыхание"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '034',
                text: "При отморожении нельзя:",
                options: ["Растирать снегом", "Согревать теплом", "Дать горячее питье", "Укутать"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '035',
                text: "Помощь при эпилептическом припадке:",
                options: ["Удерживать больного", "Разжимать зубы", "Обеспечить безопасность, не удерживать", "Дать воды"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '036',
                text: "При травме глаза нужно:",
                options: ["Промыть водой", "Наложить повязку на оба глаза", "Удалить инородное тело", "Закапать капли"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '037',
                text: "Признаки клинической смерти:",
                options: ["Отсутствие пульса", "Отсутствие дыхания", "Отсутствие сознания", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '038',
                text: "При пневмотораксе пострадавшему придают положение:",
                options: ["Лежа на спине", "Лежа на боку", "Полусидя", "Лежа на животе"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '039',
                text: "Помощь при коллапсе:",
                options: ["Придать горизонтальное положение с приподнятыми ногами", "Посадить", "Дать нитроглицерин", "Сделать массаж сердца"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '040',
                text: "При диабетической коме характерен запах:",
                options: ["Аммиака", "Ацетона", "Алкоголя", "Нет запаха"],
                correctOptionIndex: 1,
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
