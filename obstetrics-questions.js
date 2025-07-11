// obstetrics-questions.js - Исправленная версия БЕЗ создания дублирующих кнопок
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
        
        // Вопросы для режима Акушерство и гинекология - ОБЫЧНЫЙ УРОВЕНЬ
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
            // ... остальные 25 вопросов из оригинального файла
            {
                id: PREFIX + '030',
                text: "Что такое миома матки?",
                options: ["Воспаление матки", "Доброкачественная опухоль из мышечной ткани матки", "Злокачественная опухоль матки", "Аномалия развития матки"],
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
