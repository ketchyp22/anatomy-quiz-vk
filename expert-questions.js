// expert-questions.js - Полностью исправленная версия без баннеров и с корректной работой
(function() {
    'use strict';
    
    console.log('🧠 Загружается экспертный пак вопросов...');

    document.addEventListener('DOMContentLoaded', function() {
        addExpertQuestions();
        addExpertMode();
        setTimeout(setupExpertButton, 1000);
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
            {
                id: PREFIX + '016',
                text: "При электротравме от источника переменного тока 50 Гц наиболее вероятен:",
                options: ["Фибрилляция желудочков", "Асистолия", "Желудочковая тахикардия", "АВ-блокада III степени"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '017',
                text: "Правило девяток Уоллеса для определения площади ожогов у взрослых: голова и шея составляют:",
                options: ["9%", "18%", "1%", "27%"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '018',
                text: "При подозрении на перелом основания черепа противопоказано:",
                options: ["Иммобилизация шейного отдела позвоночника", "Назогастральная интубация", "Оценка по шкале Глазго", "Контроль витальных функций"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '019',
                text: "Симптом Керера при травме печени характеризуется:",
                options: ["Болью в левом плече", "Болью в правом плече", "Ригидностью затылочных мышц", "Симптомом \"ваньки-встаньки\""],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '020',
                text: "При анафилактическом шоке препаратом первой линии является:",
                options: ["Адреналин в/м", "Преднизолон в/в", "Димедрол в/м", "Допамин в/в"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '021',
                text: "Синдром Ашермана характеризуется:",
                options: ["Внутриматочными синехиями", "Гиперпролактинемией", "Поликистозом яичников", "Эндометриозом"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '022',
                text: "Триада Мейгса включает:",
                options: ["Фиброму яичника, асцит, гидроторакс", "Эндометриоз, бесплодие, боли", "Миому матки, меноррагии, анемию", "Преэклампсию, отеки, протеинурию"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '023',
                text: "При эмболии околоплодными водами характерно все, КРОМЕ:",
                options: ["Внезапного коллапса", "ДВС-синдрома", "Дыхательной недостаточности", "Медленного прогрессирования"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '024',
                text: "Маневр Вудса при дистоции плечиков заключается в:",
                options: ["Ротации плода на 180 градусов", "Флексии бедер матери", "Эпизиотомии", "Давлении на дно матки"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '025',
                text: "Синдром исчезающего близнеца характеризуется:",
                options: ["Резорбцией одного плода при многоплодной беременности", "Внутриутробной задержкой роста одного близнеца", "Синдромом фето-фетальной трансфузии", "Сросшимися близнецами"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '026',
                text: "Парадоксальная эмболия возможна при наличии:",
                options: ["Дефекта межпредсердной перегородки", "Стеноза митрального клапана", "Коарктации аорты", "Тетрады Фалло"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '027',
                text: "Синдром Гудпасчера поражает преимущественно:",
                options: ["Почки и легкие", "Печень и селезенку", "Сердце и мозг", "Кишечник и поджелудочную железу"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '028',
                text: "Принцип Франка-Старлинга описывает зависимость:",
                options: ["Силы сокращения миокарда от степени его растяжения", "Частоты сердечных сокращений от температуры", "Сердечного выброса от возраста", "Артериального давления от положения тела"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '029',
                text: "Эффект Бора в гемоглобине заключается в:",
                options: ["Снижении сродства к кислороду при повышении pH", "Повышении сродства к кислороду при повышении pH", "Снижении сродства к кислороду при снижении pH", "Отсутствии влияния pH на сродство к кислороду"],
                correctOptionIndex: 2,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '030',
                text: "Синдром Зольингера-Эллисона обусловлен:",
                options: ["Гастриномой", "Инсулиномой", "Глюкагономой", "Соматостатиномой"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '031',
                text: "Закон Лапласа для сферического пузыря описывает зависимость:",
                options: ["Давления от радиуса и поверхностного натяжения", "Объема от температуры", "Скорости потока от вязкости", "Концентрации от времени"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '032',
                text: "Феномен Рейно наиболее характерен для:",
                options: ["Системной склеродермии", "Ревматоидного артрита", "Подагры", "Остеоартроза"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '033',
                text: "Триада Уипла включает:",
                options: ["Гипогликемию, соответствующую симптоматику, купирование симптомов введением глюкозы", "Лихорадку, суставные боли, диарею", "Головную боль, рвоту, нарушение зрения", "Одышку, отеки, увеличение печени"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '034',
                text: "Пентада Рейнольдса при холангите включает все, КРОМЕ:",
                options: ["Лихорадки", "Желтухи", "Болей в правом подреберье", "Мелены"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '035',
                text: "Закон Фика для диффузии газов учитывает все параметры, КРОМЕ:",
                options: ["Площади поверхности", "Толщины мембраны", "Коэффициента растворимости", "Температуры тела"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '036',
                text: "Синдром Шихана развивается вследствие:",
                options: ["Послеродового некроза гипофиза", "Аденомы гипофиза", "Травмы гипоталамуса", "Воспаления щитовидной железы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '037',
                text: "Эффект Доплера в медицине применяется для:",
                options: ["Измерения скорости кровотока", "Определения плотности костной ткани", "Визуализации мягких тканей", "Измерения температуры тела"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '038',
                text: "Синдром Стивенса-Джонсона представляет собой:",
                options: ["Токсический эпидермальный некролиз", "Врожденный порок сердца", "Дегенеративное заболевание ЦНС", "Нарушение свертывания крови"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '039',
                text: "Принцип работы пульсоксиметра основан на:",
                options: ["Различном поглощении света оксигемоглобином и дезоксигемоглобином", "Измерении электрической проводимости крови", "Анализе температуры кожи", "Подсчете пульсовых волн"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '040',
                text: "Синдром Марфана наследуется по типу:",
                options: ["Аутосомно-доминантному", "Аутосомно-рецессивному", "Х-сцепленному доминантному", "Х-сцепленному рецессивному"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '041',
                text: "Фармакокинетика первого порядка характеризуется:",
                options: ["Линейной зависимостью между дозой и концентрацией", "Насыщением ферментов метаболизма", "Постоянной скоростью элиминации", "Отсутствием зависимости от дозы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '042',
                text: "Синдром Вольфа-Паркинсона-Уайта обусловлен наличием:",
                options: ["Дополнительного проводящего пути", "Блокады ножки пучка Гиса", "Дилатации предсердий", "Гипертрофии желудочков"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '043',
                text: "Уравнение Хендерсона-Хазельбальха связывает:",
                options: ["pH, pKa и соотношение сопряженных кислота/основание", "Давление и объем газа", "Концентрацию и активность ионов", "Температуру и растворимость"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '044',
                text: "Синдром Дресслера развивается после:",
                options: ["Инфаркта миокарда", "Пневмонии", "Гастрита", "Цистита"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '045',
                text: "Закон Генри описывает:",
                options: ["Растворимость газа в жидкости при данном давлении", "Скорость диффузии через мембрану", "Осмотическое давление раствора", "Вязкость жидкости"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '046',
                text: "Синдром Антифосфолипидный характеризуется:",
                options: ["Тромбозами и невынашиванием беременности", "Кровотечениями и анемией", "Инфекциями и лихорадкой", "Судорогами и комой"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '047',
                text: "Принцип Доплера в кардиологии применяется для оценки:",
                options: ["Скорости и направления кровотока", "Толщины стенок сердца", "Ритма сердечных сокращений", "Объема сердечных камер"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '048',
                text: "Синдром Турнера характеризуется кариотипом:",
                options: ["45,X", "47,XXY", "47,XYY", "46,XX/46,XY"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '049',
                text: "Эффект Вентури в медицине используется в:",
                options: ["Небулайзерах и вентиляторах", "Рентгеновских аппаратах", "ЭКГ-мониторах", "Ультразвуковых сканерах"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '050',
                text: "Синдром Прадера-Вилли наследуется по типу:",
                options: ["Геномного импринтинга", "Аутосомно-доминантному", "Аутосомно-рецессивному", "Митохондриальному"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            }
        ];
        
        expertQuestions.forEach(question => {
            const existingQuestion = window.questions.find(q => q.id === question.id);
            if (!existingQuestion) {
                window.questions.push(question);
            }
        });
        
        console.log(`🧠 Добавлено ${expertQuestions.length} экспертных вопросов`);
    }
    
    function addExpertMode() {
        const expertQuestionsCount = Array.isArray(window.questions) 
            ? window.questions.filter(q => q.mode === 'expert').length 
            : 0;
        
        if (expertQuestionsCount === 0) {
            console.error('Экспертные вопросы не найдены');
            return;
        }
        
        const modeContainer = document.querySelector('.quiz-mode-selection');
        if (!modeContainer) {
            console.error('Контейнер для кнопок режимов не найден');
            return;
        }
        
        if (document.querySelector('.quiz-mode-btn[data-mode="expert"]')) {
            console.log('Кнопка экспертного режима уже существует');
            return;
        }
        
        const expertContainer = document.createElement('div');
        expertContainer.className = 'expert-mode-container';
        expertContainer.style.cssText = `
            margin-top: 25px;
            padding: 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
            position: relative;
            overflow: hidden;
        `;
        
        expertContainer.innerHTML = `
            <div style="
                color: white;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 10px;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            ">🧠 ЭКСПЕРТНЫЙ УРОВЕНЬ 🧠</div>
            <button class="quiz-mode-btn expert-mode-btn" data-mode="expert" style="
                width: 100%;
                background: rgba(255, 255, 255, 0.2) !important;
                color: white !important;
                border: 2px solid rgba(255, 255, 255, 0.5) !important;
                font-size: 18px !important;
                font-weight: 700 !important;
                padding: 15px 20px !important;
                border-radius: 15px !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
            ">
                ⚡ ВЫЗОВ ДЛЯ ПРОФЕССИОНАЛОВ ⚡
            </button>
            <div style="
                color: rgba(255, 255, 255, 0.9);
                font-size: 13px;
                text-align: center;
                margin-top: 8px;
                font-style: italic;
            ">
                50 сверхсложных вопросов для истинных экспертов медицины
            </div>
        `;
        
        modeContainer.appendChild(expertContainer);
        
        if (window.modeDescriptions) {
            window.modeDescriptions['expert'] = '🧠 Экстремально сложные вопросы для профессионалов с многолетним опытом. Только для истинных экспертов медицины!';
        }
        
        console.log('🔥 Экспертный режим добавлен');
    }
    
    function setupExpertButton() {
        const expertBtn = document.querySelector('.quiz-mode-btn[data-mode="expert"]');
        
        if (!expertBtn) {
            console.error('❌ Экспертная кнопка не найдена');
            return;
        }
        
        console.log('✅ Настраиваем экспертную кнопку');
        
        // Убираем все старые обработчики
        const newBtn = expertBtn.cloneNode(true);
        expertBtn.parentNode.replaceChild(newBtn, expertBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🧠 Экспертный режим выбран');
            
            // Снимаем активность со всех кнопок
            document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Активируем экспертную кнопку
            this.classList.add('active');
            
            // Устанавливаем переменные ТОЛЬКО для этого режима
            window.currentQuizMode = 'expert';
            window.currentDifficulty = 'expert';
            
            // Блокируем выбор сложности
            const difficultySection = document.querySelector('.difficulty-selection');
            if (difficultySection) {
                difficultySection.style.opacity = '0.5';
                difficultySection.style.pointerEvents = 'none';
            }
            
            // Показываем описание
            const modeDescription = document.getElementById('mode-description');
            if (modeDescription && window.modeDescriptions) {
                modeDescription.innerHTML = `
                    <div style="color: #ee5a24; font-weight: 600; font-size: 16px; margin-bottom: 8px;">
                        🧠 ЭКСПЕРТНЫЙ РЕЖИМ АКТИВИРОВАН
                    </div>
                    <div style="font-size: 14px;">
                        ${window.modeDescriptions['expert']}
                    </div>
                `;
                modeDescription.classList.add('active-description');
                modeDescription.style.cssText = `
                    background: linear-gradient(135deg, rgba(238, 90, 36, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%);
                    border-left: 4px solid #ee5a24;
                `;
            }
        });
        
        console.log('✅ Экспертная кнопка настроена');
    }
    
    // НЕ ПЕРЕХВАТЫВАЕМ selectQuestions - пусть работает как обычно!
    // Функция selectQuestions в app.js уже правильно обрабатывает экспертный режим
    
    console.log('✅ Экспертный пак загружен без навязчивых элементов');
    
})();
