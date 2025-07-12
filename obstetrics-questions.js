// obstetrics-questions.js - Расширенная версия с 100 интересными вопросами
(function() {
    // Объявляем переменную для отслеживания статуса загрузки
    window.obstetricsQuestionsLoaded = false;
    
    // Ждем полной загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        addObstetricsQuestions();
        // НЕ создаем новые кнопки, кнопка уже есть в HTML!
        console.log('✅ Вопросы акушерства загружены, кнопка уже существует в HTML');
    });
    
    function addObstetricsQuestions() {
        // Проверяем, существует ли массив вопросов
        if (typeof window.questions === 'undefined') {
            console.error('Массив вопросов не существует. Создаем новый.');
            window.questions = [];
        }
        
        // Префикс для ID вопросов
        const PREFIX = 'obs_';
        
        // Вопросы для режима Акушерство и гинекология - ОБЫЧНЫЙ УРОВЕНЬ (100 вопросов)
        const obstetricsQuestions = [
            // ОРИГИНАЛЬНЫЕ 40 ВОПРОСОВ (001-040)
            {
                id: PREFIX + '001',
                text: "Какова продолжительность нормальной беременности?",
                options: ["36 недель", "40 недель", "42 недели", "44 недели"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '002',
                text: "Что такое гестационный возраст?",
                options: ["Возраст женщины на момент зачатия", "Возраст плода, отсчитываемый от момента зачатия", "Возраст плода, отсчитываемый от первого дня последней менструации", "Возраст новорожденного в первые дни после родов"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '003',
                text: "Какие изменения не характерны для первого триместра беременности?",
                options: ["Тошнота и рвота", "Увеличение молочных желез", "Шевеления плода", "Частое мочеиспускание"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '004',
                text: "Когда обычно начинаются шевеления плода у первородящих женщин?",
                options: ["8-10 недель", "12-14 недель", "18-20 недель", "24-26 недель"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '005',
                text: "Что из перечисленного является физиологическим изменением при беременности?",
                options: ["Снижение объема циркулирующей крови", "Увеличение сердечного выброса", "Повышение артериального давления", "Снижение частоты дыхания"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '006',
                text: "Какой гормон вырабатывается хорионом и используется для диагностики беременности?",
                options: ["Прогестерон", "Эстрадиол", "ХГЧ (хорионический гонадотропин)", "Пролактин"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '007',
                text: "На каком сроке беременности плод считается доношенным?",
                options: ["36-37 недель", "37-42 недели", "38-40 недель", "40-42 недели"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '008',
                text: "Что такое токсикоз первой половины беременности?",
                options: ["Повышение артериального давления", "Тошнота и рвота", "Отеки нижних конечностей", "Белок в моче"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '009',
                text: "Какая прибавка веса считается нормальной за всю беременность?",
                options: ["5-8 кг", "10-12 кг", "12-15 кг", "15-20 кг"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '010',
                text: "Что такое предлежание плаценты?",
                options: ["Неправильное расположение плода", "Расположение плаценты в области внутреннего зева шейки матки", "Отслойка плаценты", "Приращение плаценты"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '011',
                text: "Что является противопоказанием к грудному вскармливанию со стороны матери?",
                options: ["Мастит", "ВИЧ-инфекция", "Простуда", "Усталость"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '012',
                text: "Какова нормальная частота сердечных сокращений плода?",
                options: ["100-120 ударов в минуту", "120-160 ударов в минуту", "160-180 ударов в минуту", "180-200 ударов в минуту"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '013',
                text: "Что такое гестоз?",
                options: ["Токсикоз первой половины беременности", "Осложнение второй половины беременности с повышением давления", "Воспаление матки", "Кровотечение в родах"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '014',
                text: "Какая продолжительность менструального цикла считается нормальной?",
                options: ["21-35 дней", "25-30 дней", "28 дней", "30-35 дней"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '015',
                text: "Что такое овуляция?",
                options: ["Начало менструации", "Выход яйцеклетки из фолликула", "Оплодотворение", "Имплантация эмбриона"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '016',
                text: "На какой день менструального цикла обычно происходит овуляция при 28-дневном цикле?",
                options: ["7-й день", "14-й день", "21-й день", "28-й день"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '017',
                text: "Что такое кесарево сечение?",
                options: ["Ручное исследование матки", "Хирургическая операция извлечения плода через разрез в матке", "Стимуляция родовой деятельности", "Эпизиотомия"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '018',
                text: "Какой период беременности называется критическим для формирования органов плода?",
                options: ["Первый триместр", "Второй триместр", "Третий триместр", "Весь период беременности"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '019',
                text: "Что такое многоводие?",
                options: ["Избыточное количество околоплодных вод", "Недостаточное количество околоплодных вод", "Инфицирование околоплодных вод", "Изменение цвета околоплодных вод"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '020',
                text: "Что является показанием к экстренному кесареву сечению?",
                options: ["Переношенная беременность", "Выпадение пуповины", "Крупный плод", "Возраст первородящей старше 30 лет"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '021',
                text: "Что такое эклампсия?",
                options: ["Тяжелая форма гестоза с судорогами", "Кровотечение в родах", "Инфекция послеродового периода", "Разрыв матки"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '022',
                text: "Какая поза наиболее физиологична для родов?",
                options: ["Лежа на спине", "Лежа на боку", "Вертикальная", "На четвереньках"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '023',
                text: "Что такое послед?",
                options: ["Плацента с оболочками и пуповиной", "Околоплодные воды", "Слизистая пробка", "Плодный пузырь"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '024',
                text: "Когда рекомендуется первое прикладывание новорожденного к груди?",
                options: ["Через 6 часов после родов", "Через сутки после родов", "В первые 30 минут после рождения", "Через неделю после родов"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '025',
                text: "Что такое лохии?",
                options: ["Послеродовые выделения из матки", "Молозиво", "Околоплодные воды", "Менструальная кровь"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '026',
                text: "Какова нормальная продолжительность менструации?",
                options: ["1-2 дня", "3-7 дней", "7-10 дней", "10-14 дней"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '027',
                text: "Что такое аменорея?",
                options: ["Болезненная менструация", "Обильная менструация", "Отсутствие менструации", "Нерегулярная менструация"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '028',
                text: "Какой витамин особенно важен в первом триместре беременности для профилактики пороков развития?",
                options: ["Витамин А", "Витамин С", "Фолиевая кислота", "Витамин Е"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '029',
                text: "Что такое внематочная беременность?",
                options: ["Беременность двойней", "Имплантация плодного яйца вне полости матки", "Замершая беременность", "Преждевременная беременность"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '030',
                text: "Что такое миома матки?",
                options: ["Воспаление матки", "Доброкачественная опухоль из мышечной ткани матки", "Злокачественная опухоль матки", "Аномалия развития матки"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '031',
                text: "Какой метод контрацепции считается наиболее надежным?",
                options: ["Календарный метод", "Барьерные методы", "Гормональные контрацептивы", "Прерванный половой акт"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '032',
                text: "Что такое климакс?",
                options: ["Первая менструация", "Угасание функции яичников", "Воспаление яичников", "Киста яичника"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '033',
                text: "Какие осложнения может вызвать многоплодная беременность?",
                options: ["Преждевременные роды", "Анемия у матери", "Гестоз", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '034',
                text: "Что такое послеродовая депрессия?",
                options: ["Физическая слабость после родов", "Психическое расстройство после родов", "Снижение лактации", "Маточное кровотечение"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '035',
                text: "На каком сроке беременности обычно проводится первое плановое УЗИ?",
                options: ["6-8 недель", "10-14 недель", "18-22 недели", "32-36 недель"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '036',
                text: "Что такое эпизиотомия?",
                options: ["Разрез промежности для облегчения прохождения плода", "Разрез на животе", "Разрез шейки матки", "Осмотр с помощью зеркал"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '037',
                text: "Какой показатель оценивается по шкале Апгар у новорожденного?",
                options: ["Вес и рост", "Сердцебиение, дыхание, рефлексы, мышечный тонус, цвет кожи", "Уровень гемоглобина", "Размер головы"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '038',
                text: "Что такое гипогалактия?",
                options: ["Избыток грудного молока", "Недостаток грудного молока", "Воспаление молочной железы", "Застой молока"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '039',
                text: "Какие признаки указывают на начало родовой деятельности?",
                options: ["Регулярные схватки", "Излитие околоплодных вод", "Отхождение слизистой пробки", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '040',
                text: "Что такое инволюция матки?",
                options: ["Увеличение матки во время беременности", "Сокращение матки до первоначальных размеров после родов", "Воспаление матки", "Удаление матки"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            
            // НОВЫЕ 60 ВОПРОСОВ (041-100)
            {
                id: PREFIX + '041',
                text: "На каком сроке беременности формируется плацента?",
                options: ["6-8 недель", "10-12 недель", "14-16 недель", "18-20 недель"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '042',
                text: "Что такое дисменорея?",
                options: ["Отсутствие менструаций", "Болезненные менструации", "Обильные менструации", "Нерегулярные менструации"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '043',
                text: "Какой гормон отвечает за поддержание беременности в первом триместре?",
                options: ["Эстрадиол", "Прогестерон", "Тестостерон", "Кортизол"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '044',
                text: "Что такое полименорея?",
                options: ["Короткий менструальный цикл (менее 21 дня)", "Длинный менструальный цикл", "Обильные менструации", "Болезненные менструации"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '045',
                text: "На каком сроке беременности можно определить пол ребенка на УЗИ?",
                options: ["8-10 недель", "12-14 недель", "16-18 недель", "20-22 недели"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '046',
                text: "Что такое олигоменорея?",
                options: ["Редкие менструации", "Обильные менструации", "Болезненные менструации", "Нерегулярные менструации"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '047',
                text: "Какой гормон стимулирует сокращения матки во время родов?",
                options: ["Эстроген", "Прогестерон", "Окситоцин", "Пролактин"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '048',
                text: "Что такое меноррагия?",
                options: ["Отсутствие менструаций", "Болезненные менструации", "Обильные менструации", "Короткие менструации"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '049',
                text: "На каком сроке беременности рекомендуется второе плановое УЗИ?",
                options: ["14-16 недель", "18-22 недели", "26-28 недель", "32-34 недели"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '050',
                text: "Что такое метроррагия?",
                options: ["Межменструальные кровотечения", "Обильные менструации", "Отсутствие менструаций", "Болезненные менструации"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '051',
                text: "Какая нормальная масса тела новорожденного при доношенной беременности?",
                options: ["2000-2500 г", "2500-4000 г", "4000-4500 г", "4500-5000 г"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '052',
                text: "Что такое эндометрит?",
                options: ["Воспаление яичников", "Воспаление маточных труб", "Воспаление слизистой оболочки матки", "Воспаление шейки матки"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '053',
                text: "На каком сроке беременности рекомендуется третье плановое УЗИ?",
                options: ["26-28 недель", "30-32 недели", "32-36 недель", "38-40 недель"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '054',
                text: "Что такое кольпит?",
                options: ["Воспаление влагалища", "Воспаление матки", "Воспаление яичников", "Воспаление шейки матки"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '055',
                text: "Какая нормальная длина новорожденного при доношенной беременности?",
                options: ["40-45 см", "46-52 см", "53-58 см", "59-65 см"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '056',
                text: "Что такое эндометриоз?",
                options: ["Воспаление эндометрия", "Разрастание эндометрия вне полости матки", "Опухоль эндометрия", "Атрофия эндометрия"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '057',
                text: "Сколько периодов выделяют в родах?",
                options: ["2", "3", "4", "5"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '058',
                text: "Что такое аднексит?",
                options: ["Воспаление придатков матки", "Воспаление матки", "Воспаление влагалища", "Воспаление шейки матки"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '059',
                text: "Как называется первый период родов?",
                options: ["Период изгнания", "Период раскрытия", "Последовый период", "Период восстановления"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '060',
                text: "Что такое мастит?",
                options: ["Воспаление молочной железы", "Застой молока", "Трещины сосков", "Недостаток молока"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '061',
                text: "Как называется второй период родов?",
                options: ["Период раскрытия", "Период изгнания", "Последовый период", "Ранний послеродовый период"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '062',
                text: "Что такое лактостаз?",
                options: ["Воспаление молочной железы", "Застой молока в молочной железе", "Недостаток молока", "Избыток молока"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '063',
                text: "Как называется третий период родов?",
                options: ["Период изгнания", "Период восстановления", "Последовый период", "Ранний послеродовый период"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '064',
                text: "Что такое галакторея?",
                options: ["Отсутствие молока", "Патологическое выделение молока", "Застой молока", "Воспаление молочной железы"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '065',
                text: "Какова нормальная продолжительность первого периода родов у первородящих?",
                options: ["4-6 часов", "8-12 часов", "12-18 часов", "18-24 часа"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '066',
                text: "Что такое поликистоз яичников?",
                options: ["Воспаление яичников", "Множественные кисты в яичниках", "Отсутствие яичников", "Опухоль яичников"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '067',
                text: "Какова нормальная продолжительность второго периода родов у первородящих?",
                options: ["30 минут - 1 час", "1-2 часа", "2-3 часа", "3-4 часа"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '068',
                text: "Что такое вагинизм?",
                options: ["Воспаление влагалища", "Сухость влагалища", "Спазм мышц влагалища", "Опухоль влагалища"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '069',
                text: "Какова нормальная продолжительность третьего периода родов?",
                options: ["5-10 минут", "15-30 минут", "30-60 минут", "1-2 часа"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '070',
                text: "Что такое диспареуния?",
                options: ["Отсутствие полового влечения", "Болезненность при половом акте", "Нарушение оргазма", "Сухость влагалища"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '071',
                text: "На каком сроке беременности происходит имплантация эмбриона?",
                options: ["3-5 дней", "6-8 дней", "10-12 дней", "14-16 дней"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '072',
                text: "Что такое либидо?",
                options: ["Способность к оплодотворению", "Половое влечение", "Менструальная функция", "Способность к зачатию"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '073',
                text: "Когда начинает биться сердце у эмбриона?",
                options: ["3-4 недели", "5-6 недель", "7-8 недель", "9-10 недель"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '074',
                text: "Что такое фригидность?",
                options: ["Воспаление половых органов", "Снижение или отсутствие полового влечения", "Бесплодие", "Нарушение менструального цикла"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '075',
                text: "На каком сроке беременности формируется нервная трубка?",
                options: ["2-3 недели", "4-5 недель", "6-7 недель", "8-9 недель"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '076',
                text: "Что такое бартолинит?",
                options: ["Воспаление больших желез преддверия влагалища", "Воспаление яичников", "Воспаление матки", "Воспаление мочевого пузыря"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '077',
                text: "На каком сроке беременности заканчивается органогенез?",
                options: ["8 недель", "12 недель", "16 недель", "20 недель"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '078',
                text: "Что такое крауроз вульвы?",
                options: ["Воспаление вульвы", "Атрофические изменения вульвы", "Опухоль вульвы", "Травма вульвы"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '079',
                text: "Какое количество околоплодных вод считается нормальным к концу беременности?",
                options: ["500-800 мл", "800-1200 мл", "1200-1500 мл", "1500-2000 мл"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '080',
                text: "Что такое лейкоплакия вульвы?",
                options: ["Воспаление вульвы", "Белые пятна на вульве", "Опухоль вульвы", "Травма вульвы"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '081',
                text: "На каком сроке беременности плод считается жизнеспособным?",
                options: ["20 недель", "22 недели", "24 недели", "26 недель"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '082',
                text: "Что такое кондиломы?",
                options: ["Воспалительные образования", "Доброкачественные разрастания", "Злокачественные опухоли", "Кисты"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '083',
                text: "Какой объем крови теряется при нормальных родах?",
                options: ["100-200 мл", "250-400 мл", "450-600 мл", "650-800 мл"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '084',
                text: "Что такое папиллома?",
                options: ["Воспалительное заболевание", "Доброкачественная опухоль", "Злокачественная опухоль", "Киста"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '085',
                text: "Какова нормальная окружность головы новорожденного?",
                options: ["30-32 см", "32-34 см", "34-36 см", "36-38 см"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '086',
                text: "Что такое эрозия шейки матки?",
                options: ["Воспаление шейки матки", "Дефект эпителия шейки матки", "Опухоль шейки матки", "Киста шейки матки"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '087',
                text: "Какова нормальная окружность груди новорожденного?",
                options: ["30-32 см", "32-34 см", "34-36 см", "36-38 см"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '088',
                text: "Что такое полип шейки матки?",
                options: ["Воспаление шейки матки", "Доброкачественное разрастание слизистой", "Злокачественная опухоль", "Киста шейки матки"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '089',
                text: "На какой день после родов обычно приходит молоко?",
                options: ["1-2 день", "3-5 день", "6-7 день", "8-10 день"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '090',
                text: "Что такое дисплазия шейки матки?",
                options: ["Воспаление шейки матки", "Нарушение развития эпителия", "Опухоль шейки матки", "Травма шейки матки"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '091',
                text: "Сколько длится период лактации?",
                options: ["6 месяцев", "1 год", "1,5-2 года", "3 года"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '092',
                text: "Что такое лейкорея?",
                options: ["Кровянистые выделения", "Белые выделения из половых путей", "Гнойные выделения", "Отсутствие выделений"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '093',
                text: "Когда происходит полная инволюция матки после родов?",
                options: ["2-3 недели", "4-6 недель", "8-10 недель", "12-14 недель"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '094',
                text: "Что такое вульвит?",
                options: ["Воспаление наружных половых органов", "Воспаление влагалища", "Воспаление матки", "Воспаление яичников"],
                correctOptionIndex: 0,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '095',
                text: "Какова продолжительность послеродового периода?",
                options: ["2-3 недели", "4-6 недель", "8-10 недель", "12-14 недель"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '096',
                text: "Что такое молочница?",
                options: ["Бактериальная инфекция", "Грибковая инфекция", "Вирусная инфекция", "Паразитарная инфекция"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '097',
                text: "На каком сроке после родов возобновляются менструации при грудном вскармливании?",
                options: ["1-2 месяца", "3-4 месяца", "6-8 месяцев", "1 год"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '098',
                text: "Что такое трихомониаз?",
                options: ["Бактериальная инфекция", "Вирусная инфекция", "Протозойная инфекция", "Грибковая инфекция"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '099',
                text: "Сколько раз в день новорожденный должен получать грудное молоко?",
                options: ["4-6 раз", "6-8 раз", "8-12 раз", "12-15 раз"],
                correctOptionIndex: 2,
                mode: "obstetrics",
                difficulty: "easy"
            },
            {
                id: PREFIX + '100',
                text: "Что такое хламидиоз?",
                options: ["Вирусная инфекция", "Бактериальная инфекция", "Грибковая инфекция", "Протозойная инфекция"],
                correctOptionIndex: 1,
                mode: "obstetrics",
                difficulty: "easy"
            }
