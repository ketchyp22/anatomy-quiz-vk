// first-aid-questions.js - Расширенная версия с 100 интересными вопросами
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
        
        // Вопросы для режима Первая помощь - ОБЫЧНЫЙ УРОВЕНЬ (100 вопросов)
        const firstAidQuestions = [
            // ОРИГИНАЛЬНЫЕ 40 ВОПРОСОВ (001-040)
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
            },
            
            // НОВЫЕ 60 ВОПРОСОВ (041-100)
            {
                id: PREFIX + '041',
                text: "Какое время наложения жгута зимой?",
                options: ["30 минут", "1 час", "1,5 часа", "2 часа"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '042',
                text: "При ожоге щелочью нужно промывать:",
                options: ["Слабым раствором кислоты", "Большим количеством воды", "Содовым раствором", "Не промывать"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '043',
                text: "При попадании инородного тела в глаз нельзя:",
                options: ["Тереть глаз", "Промывать водой", "Закапывать капли", "Накладывать повязку"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '044',
                text: "Признак закрытого перелома:",
                options: ["Видна кость", "Деформация конечности", "Кровотечение", "Нагноение"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '045',
                text: "При укусе пчелы в первую очередь нужно:",
                options: ["Приложить холод", "Удалить жало", "Дать антигистаминное", "Обработать спиртом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '046',
                text: "При попадании кислоты на кожу нужно:",
                options: ["Нейтрализовать щелочью", "Смыть большим количеством воды", "Промокнуть салфеткой", "Обработать спиртом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '047',
                text: "Что такое черепно-мозговая травма?",
                options: ["Перелом черепа", "Повреждение мозга", "Ушиб головы", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '048',
                text: "При обморожении 1 степени кожа:",
                options: ["Бледная", "Красная", "Синюшная", "Черная"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '049',
                text: "При оказании помощи утопающему сначала нужно:",
                options: ["Начать реанимацию", "Извлечь воду из легких", "Обеспечить проходимость дыхательных путей", "Вызвать скорую"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '050',
                text: "При подозрении на инсульт нужно:",
                options: ["Дать лекарства", "Уложить с приподнятой головой", "Дать воды", "Растереть виски"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '051',
                text: "Что нельзя делать при растяжении связок?",
                options: ["Прикладывать холод", "Фиксировать сустав", "Прогревать", "Обеспечить покой"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '052',
                text: "При травме позвоночника пострадавшего переворачивают:",
                options: ["Одним человеком", "Двумя людьми", "Тремя людьми как единое целое", "Переворачивать нельзя"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '053',
                text: "Первая помощь при приступе бронхиальной астмы:",
                options: ["Уложить горизонтально", "Придать положение сидя", "Дать воды", "Растереть грудь"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '054',
                text: "При ушибе в первые сутки применяют:",
                options: ["Тепло", "Холод", "Массаж", "Согревающие мази"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '055',
                text: "При отравлении угарным газом пострадавшего нужно:",
                options: ["Дать понюхать нашатырь", "Вынести на свежий воздух", "Дать горячий чай", "Заставить двигаться"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '056',
                text: "Что делать при попадании инородного тела в ухо?",
                options: ["Попытаться извлечь", "Промыть водой", "Ничего не делать, обратиться к врачу", "Постучать по голове"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '057',
                text: "При болях в сердце нужно:",
                options: ["Дать валидол или нитроглицерин", "Дать анальгин", "Растереть грудь", "Положить горчичники"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '058',
                text: "При попадании щелочи в глаз промывают:",
                options: ["Слабым раствором кислоты", "Чистой водой", "Содовым раствором", "Чаем"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '059',
                text: "При тепловом ударе нельзя:",
                options: ["Охлаждать голову", "Давать горячее питье", "Перенести в тень", "Снять лишнюю одежду"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '060',
                text: "При переломе костей таза пострадавшего транспортируют:",
                options: ["Сидя", "На боку", "На спине с согнутыми ногами", "На животе"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '061',
                text: "Что такое шок?",
                options: ["Потеря сознания", "Нарушение кровообращения", "Остановка дыхания", "Судороги"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '062',
                text: "При отравлении грибами нужно:",
                options: ["Дать слабительное", "Промыть желудок", "Дать молоко", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '063',
                text: "При алкогольном отравлении нельзя:",
                options: ["Промывать желудок", "Давать кофе", "Укладывать на бок", "Давать адсорбенты"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '064',
                text: "При переломе ребер повязка:",
                options: ["Не накладывается", "Тугая на выдохе", "Тугая на вдохе", "Свободная"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '065',
                text: "При ранении шеи опасно:",
                options: ["Кровотечение", "Воздушная эмболия", "Повреждение нервов", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '066',
                text: "При обмороке нельзя:",
                options: ["Давать нашатырь", "Сажать пострадавшего", "Обеспечивать приток воздуха", "Брызгать водой на лицо"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '067',
                text: "При ожоге кипятком нужно:",
                options: ["Смазать маслом", "Охладить водой", "Проколоть пузыри", "Обработать спиртом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '068',
                text: "При подозрении на внутреннее кровотечение нужно:",
                options: ["Дать обезболивающее", "Приложить холод на живот", "Дать питье", "Согреть больного"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '069',
                text: "При истерическом припадке нужно:",
                options: ["Удерживать больного", "Дать понюхать нашатырь", "Создать спокойную обстановку", "Облить холодной водой"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '070',
                text: "При переломе нижней челюсти нужно:",
                options: ["Зафиксировать челюсть", "Дать обезболивающее", "Следить за дыханием", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '071',
                text: "При ранении грудной клетки с открытым пневмотораксом накладывают:",
                options: ["Давящую повязку", "Окклюзионную повязку", "Спиральную повязку", "Не накладывают повязку"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '072',
                text: "При обморожении согревание должно быть:",
                options: ["Быстрым", "Постепенным", "Интенсивным", "Не требуется"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '073',
                text: "При укусе клеща его нужно:",
                options: ["Выдернуть быстро", "Удалить аккуратно поворотами", "Прижечь", "Смазать маслом"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '074',
                text: "При попадании бензина в желудок нужно:",
                options: ["Вызвать рвоту", "Не вызывать рвоту", "Дать молоко", "Дать слабительное"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '075',
                text: "При переломе костей носа нельзя:",
                options: ["Прикладывать холод", "Тампонировать нос", "Запрокидывать голову", "Останавливать кровотечение"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '076',
                text: "При ожоге глаз сваркой нужно:",
                options: ["Промыть водой", "Закапать капли", "Наложить повязку", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '077',
                text: "При отравлении кислотами нельзя:",
                options: ["Промывать желудок", "Давать молоко", "Вызывать рвоту", "Давать воду"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '078',
                text: "При судорогах у ребенка нужно:",
                options: ["Держать крепко", "Разжимать зубы", "Обеспечить безопасность", "Давать лекарства"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '079',
                text: "При переломе позвоночника в шейном отделе фиксируют:",
                options: ["Только голову", "Голову и шею", "Всю спину", "Не фиксируют"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '080',
                text: "При кровотечении из уха нельзя:",
                options: ["Тампонировать ухо", "Наложить повязку", "Придать положение на больной бок", "Обратиться к врачу"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '081',
                text: "При ранении живота нельзя:",
                options: ["Давать пить", "Накладывать повязку", "Укладывать с согнутыми ногами", "Обезболивать"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '082',
                text: "При гипертоническом кризе нужно:",
                options: ["Придать горизонтальное положение", "Придать полусидячее положение", "Дать нитроглицерин", "Дать анальгин"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '083',
                text: "При подозрении на перелом черепа нельзя:",
                options: ["Поворачивать голову", "Давать лекарства", "Промывать раны", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '084',
                text: "При отеке Квинке в первую очередь нужно:",
                options: ["Дать антигистаминное", "Обеспечить проходимость дыхательных путей", "Приложить холод", "Вызвать скорую"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '085',
                text: "При синдроме длительного сдавления нельзя:",
                options: ["Освобождать конечность быстро", "Накладывать жгут выше сдавления", "Давать обильное питье", "Обезболивать"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '086',
                text: "При коме неизвестной этиологии нельзя:",
                options: ["Давать лекарства через рот", "Поворачивать на бок", "Следить за дыханием", "Вызывать скорую"],
                correctOptionIndex: 0,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '087',
                text: "При ожоге дыхательных путей характерно:",
                options: ["Охриплость голоса", "Затрудненное дыхание", "Ожоги вокруг рта", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '088',
                text: "При переломе лодыжки нужно:",
                options: ["Снять обувь", "Зафиксировать не снимая обувь", "Попытаться встать", "Разработать сустав"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '089',
                text: "При отравлении парами краски нужно:",
                options: ["Дать молоко", "Вынести на воздух", "Промыть желудок", "Дать активированный уголь"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '090',
                text: "При ранении сонной артерии кровотечение останавливают:",
                options: ["Жгутом", "Пальцевым прижатием", "Давящей повязкой", "Положением тела"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '091',
                text: "При попадании инородного тела в нос нужно:",
                options: ["Попытаться извлечь", "Высморкаться", "Ничего не делать, к врачу", "Промыть водой"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '092',
                text: "При болевом шоке нужно:",
                options: ["Дать обезболивающее", "Обеспечить покой", "Согреть", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '093',
                text: "При переломе грудины опасно:",
                options: ["Повреждение сердца", "Повреждение легких", "Внутреннее кровотечение", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '094',
                text: "При укусе ядовитой змеи нельзя:",
                options: ["Отсасывать яд", "Прижигать рану", "Накладывать жгут", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '095',
                text: "При травматической ампутации нужно:",
                options: ["Остановить кровотечение", "Сохранить отчлененную часть", "Обработать культю", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '096',
                text: "При ожоге негашеной известью нельзя:",
                options: ["Удалить известь", "Промывать водой", "Обработать маслом", "Наложить повязку"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '097',
                text: "При подозрении на внематочную беременность нельзя:",
                options: ["Давать обезболивающие", "Прикладывать тепло", "Давать питье", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '098',
                text: "При родах вне медучреждения нужно:",
                options: ["Ускорить роды", "Тянуть за ребенка", "Обеспечить стерильность", "Все перечисленное"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '099',
                text: "При приступе почечной колики нужно:",
                options: ["Приложить холод", "Приложить тепло", "Дать мочегонное", "Ограничить жидкость"],
                correctOptionIndex: 1,
                mode: "first_aid",
                difficulty: "easy"
            },
            {
                id: PREFIX + '100',
                text: "При массовых поражениях в первую очередь помогают:",
                options: ["Тяжелопострадавшим", "Легкопострадавшим", "Пострадавшим средней тяжести", "По очереди поступления"],
                correctOptionIndex: 2,
                mode: "first_aid",
                difficulty: "easy"
            }
