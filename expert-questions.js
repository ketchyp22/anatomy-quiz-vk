// expert-questions.js - Исправленная версия БЕЗ создания дублирующих кнопок
(function() {
    'use strict';
    
    console.log('🧠 Загружается экспертный пак вопросов...');

    document.addEventListener('DOMContentLoaded', function() {
        addExpertQuestions();
        // НЕ создаем новые кнопки, кнопка уже есть в HTML!
        console.log('✅ Экспертные вопросы загружены, кнопка уже существует в HTML');
    });
    
    function addExpertQuestions() {
        if (typeof window.questions === 'undefined') {
            console.error('Массив вопросов не существует. Создаем новый.');
            window.questions = [];
        }
        
        const PREFIX = 'expert_';
        
        const expertQuestions = [
            {
                id: PREFIX + '001',
                text: "Какие структуры НЕ входят в состав ромбовидной ямки (дно IV желудочка)?",
                options: ["Ядра лицевого нерва", "Ядра тройничного нерва", "Ядра подъязычного нерва", "Ядра зрительного нерва"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '002',
                text: "Синдром Горнера возникает при поражении какой структуры?",
                options: ["Верхнего шейного симпатического ганглия", "Блуждающего нерва", "Диафрагмального нерва", "Возвратного гортанного нерва"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '003',
                text: "Какая артерия является ветвью a. cerebri media и кровоснабжает область Брока?",
                options: ["A. cerebri anterior", "A. temporalis superficialis", "A. operculofrontalis", "A. basilaris"],
                correctOptionIndex: 2,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '004',
                text: "Клетки Пуркинье мозжечка получают возбуждающие сигналы от:",
                options: ["Только от лазящих волокон", "Только от параллельных волокон", "От лазящих и параллельных волокон", "От звездчатых клеток"],
                correctOptionIndex: 2,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '005',
                text: "Пентада Кантрелла включает все перечисленные пороки развития, КРОМЕ:",
                options: ["Дефекта межжелудочковой перегородки", "Расщелины грудины", "Дефекта диафрагмы", "Атрезии пищевода"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '006',
                text: "Парадокс Робин-Гуда при церебральной гипертензии характеризуется:",
                options: ["Перераспределением крови от здоровых зон к ишемизированным", "Перераспределением крови от ишемизированных зон к здоровым", "Равномерным распределением кровотока", "Спазмом всех церебральных сосудов"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '007',
                text: "Синдром Труссо при панкреатическом раке проявляется:",
                options: ["Мигрирующим тромбофлебитом", "Желудочно-кишечным кровотечением", "Механической желтухой", "Сахарным диабетом"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '008',
                text: "Феномен Артюса представляет собой реакцию гиперчувствительности:",
                options: ["I типа (анафилактическую)", "II типа (цитотоксическую)", "III типа (иммунокомплексную)", "IV типа (клеточно-опосредованную)"],
                correctOptionIndex: 2,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '009',
                text: "Симптом Мерфи положителен при:",
                options: ["Остром аппендиците", "Остром холецистите", "Остром панкреатите", "Прободной язве"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '010',
                text: "Гипонатриемия разведения чаще всего связана с:",
                options: ["Избыточной секрецией АДГ", "Недостаточностью альдостерона", "Почечной недостаточностью", "Диарейным синдромом"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '011',
                text: "Цитохром P450 3A4 преимущественно метаболизирует какой процент всех лекарственных препаратов?",
                options: ["25%", "40%", "60%", "80%"],
                correctOptionIndex: 2,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '012',
                text: "Механизм действия бортезомиба заключается в:",
                options: ["Ингибировании протеасом", "Блокаде микротрубочек", "Ингибировании топоизомеразы II", "Алкилировании ДНК"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '013',
                text: "Антидот при отравлении этиленгликолем:",
                options: ["Налоксон", "Фомепизол", "Флумазенил", "Атропин"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '014',
                text: "Фармакологический антагонизм варфарина осуществляется:",
                options: ["Витамином К", "Протамина сульфатом", "Дефероксамином", "N-ацетилцистеином"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '015',
                text: "Ингибитор PARP (поли-АДФ-рибозо-полимераза) олапариб применяется при:",
                options: ["Раке молочной железы с мутацией BRCA", "Хронической сердечной недостаточности", "Болезни Альцгеймера", "Ревматоидном артрите"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            // ... добавляем остальные вопросы
            {
                id: PREFIX + '050',
                text: "Синдром Прадера-Вилли наследуется по типу:",
                options: ["Геномного импринтинга", "Аутосомно-доминантному", "Аутосомно-рецессивному", "Митохондриальному"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            }
        ];
        
        // Добавляем вопросы в массив
        expertQuestions.forEach(question => {
            const existingQuestion = window.questions.find(q => q.id === question.id);
            if (!existingQuestion) {
                window.questions.push(question);
            }
        });
        
        console.log(`🧠 Добавлено ${expertQuestions.length} экспертных вопросов`);
        
        // Обновляем описание режима (если нужно)
        if (window.modeDescriptions) {
            window.modeDescriptions['expert'] = '🧠 Экстремально сложные вопросы для профессионалов с многолетним опытом. Только для истинных экспертов медицины!';
        }
    }
    
    console.log('✅ Экспертный пак загружен БЕЗ создания дублирующих кнопок');
    
})();
