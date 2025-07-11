// obstetrics-questions.js - Полная версия с 40 вопросами
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
        
        // Вопросы для режима Акушерство и гинекология - ОБЫЧНЫЙ УРОВЕНЬ (40 вопросов)
        const obstetricsQuestions = [
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
            }
        ];
        
        // Добавляем вопросы в общий массив
        obstetricsQuestions.forEach(question => {
            // Проверяем, нет ли дубликатов
            const existingQuestion = window.questions.find(q => q.id === question.id);
            if (!existingQuestion) {
                window.questions.push(question);
            }
        });
        
        // Устанавливаем флаг загрузки
        window.obstetricsQuestionsLoaded = true;
        
        console.log(`Модуль "Акушерство и гинекология": добавлено ${obstetricsQuestions.length} вопросов`);
        
        // Обновляем описание режима (если нужно)
        if (window.modeDescriptions) {
            window.modeDescriptions['obstetrics'] = 'Вопросы о ведении беременности, родов и женском репродуктивном здоровье';
        }
    }
    
    console.log('✅ Вопросы акушерства загружены БЕЗ создания дублирующих кнопок');
})();
