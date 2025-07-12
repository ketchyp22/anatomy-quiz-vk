// expert-questions.js - ИСПРАВЛЕННАЯ версия с немедленной загрузкой
(function() {
    'use strict';
    
    console.log('🧠 Загружается экспертный пак вопросов...');
    
    // Функция загрузки экспертных вопросов
    function addExpertQuestions() {
        console.log('🔧 Начинаем загрузку экспертных вопросов...');
        
        if (typeof window.questions === 'undefined') {
            console.error('❌ Массив вопросов не существует. Создаем новый.');
            window.questions = [];
        }
        
        console.log('📊 Количество вопросов ДО загрузки экспертных:', window.questions.length);
        
        const PREFIX = 'expert_';
        
        const expertQuestions = [
            // ПЕРВЫЕ 22 ВОПРОСА (ОРИГИНАЛЬНЫЕ)
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
                text: "Синдром Золлингера-Эллисона характеризуется:",
                options: ["Гипосекрецией соляной кислоты", "Гиперсекрецией гастрина опухолью", "Атрофией слизистой желудка", "Дефицитом фактора Касла"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '017',
                text: "Какой медиатор является основным в патогенезе кардиогенного шока?",
                options: ["Норадреналин", "Фактор некроза опухоли альфа", "Интерлейкин-1", "Простагландин E2"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '018',
                text: "Мутация гена JAK2 V617F наиболее характерна для:",
                options: ["Хронического миелолейкоза", "Истинной полицитемии", "Острого лимфобластного лейкоза", "Множественной миеломы"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '019',
                text: "Синдром Бадда-Киари представляет собой:",
                options: ["Тромбоз воротной вены", "Тромбоз печеночных вен", "Цирроз печени", "Стеатогепатит"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '020',
                text: "Какой механизм лежит в основе синдрома Гительмана?",
                options: ["Дефект натрий-хлорного котранспортера в дистальных канальцах", "Дефект натрий-калий-хлорного котранспортера в петле Генле", "Дефект эпителиального натриевого канала", "Дефект аквапорина-2"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '021',
                text: "Антифосфолипидный синдром характеризуется наличием:",
                options: ["Антител к кардиолипину", "Волчаночного антикоагулянта", "Антител к β2-гликопротеину I", "Всего перечисленного"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '022',
                text: "Болезнь Фабри обусловлена дефицитом фермента:",
                options: ["α-галактозидазы А", "β-глюкозидазы", "Арилсульфатазы А", "Гексозаминидазы А"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            
            // НОВЫЕ 78 ВОПРОСОВ (023-100)
            {
                id: PREFIX + '023',
                text: "Синдром Барттера характеризуется дефектом в:",
                options: ["Проксимальных канальцах", "Восходящем колене петли Генле", "Дистальных извитых канальцах", "Собирательных трубочках"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '024',
                text: "Какой белок участвует в патогенезе болезни Альцгеймера?",
                options: ["α-синуклеин", "Тау-белок", "Прионный белок", "Хантингтин"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '025',
                text: "Синдром Марфана связан с дефектом:",
                options: ["Коллагена I типа", "Фибриллина-1", "Эластина", "Коллагена III типа"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '026',
                text: "HLA-B27 наиболее часто ассоциирован с:",
                options: ["Ревматоидным артритом", "Анкилозирующим спондилитом", "Системной красной волчанкой", "Псориатическим артритом"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '027',
                text: "Критерии Джонса применяются для диагностики:",
                options: ["Эндокардита", "Ревматической лихорадки", "Миокардита", "Перикардита"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '028',
                text: "Синдром Вегенера (гранулематоз с полиангиитом) характеризуется:",
                options: ["c-ANCA позитивностью", "p-ANCA позитивностью", "Антителами к базальной мембране", "Криоглобулинемией"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '029',
                text: "Болезнь Вильсона-Коновалова связана с нарушением метаболизма:",
                options: ["Железа", "Меди", "Цинка", "Марганца"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '030',
                text: "Синдром POEMS включает все, КРОМЕ:",
                options: ["Полинейропатии", "Органомегалии", "Эндокринопатии", "Артропатии"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '031',
                text: "Рецептор CD20 является мишенью для:",
                options: ["Ритуксимаба", "Трастузумаба", "Бевацизумаба", "Цетуксимаба"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '032',
                text: "Синдром удлиненного интервала QT может быть вызван:",
                options: ["Гипокалиемией", "Гипомагниемией", "Антиаритмиками III класса", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '033',
                text: "Болезнь Гоше обусловлена дефицитом:",
                options: ["Глюкоцереброзидазы", "Сфингомиелиназы", "Галактоцереброзидазы", "α-галактозидазы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '034',
                text: "Синдром Черджа-Стросс (эозинофильный гранулематоз с полиангиитом) характеризуется:",
                options: ["Эозинофилией", "Бронхиальной астмой", "p-ANCA позитивностью", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '035',
                text: "Мутация FLT3 наиболее часто встречается при:",
                options: ["Остром миелоидном лейкозе", "Хроническом лимфолейкозе", "Множественной миеломе", "Лимфоме Ходжкина"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '036',
                text: "Синдром Клайнфельтера характеризуется кариотипом:",
                options: ["45,X", "47,XXY", "47,XYY", "46,XX/46,XY"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '037',
                text: "Болезнь Крейтцфельдта-Якоба вызывается:",
                options: ["Вирусом", "Прионом", "Бактерией", "Паразитом"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '038',
                text: "Синдром Шегрена характеризуется поражением:",
                options: ["Слюнных желез", "Слезных желез", "Суставов", "Всего перечисленного"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '039',
                text: "Трансплантация гемопоэтических стволовых клеток НЕ показана при:",
                options: ["Остром лейкозе", "Апластической анемии", "Множественной миеломе", "Гемофилии А"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '040',
                text: "Мутация EGFR наиболее часто встречается при:",
                options: ["Аденокарциноме легкого", "Плоскоклеточном раке легкого", "Мелкоклеточном раке легкого", "Мезотелиоме"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '041',
                text: "Синдром Гудпасчера характеризуется:",
                options: ["Антителами к базальной мембране", "Иммунными комплексами", "Т-клеточной инфильтрацией", "Васкулитом"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '042',
                text: "Болезнь Тея-Сакса обусловлена дефицитом:",
                options: ["Гексозаминидазы А", "β-глюкозидазы", "α-галактозидазы", "Сфингомиелиназы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '043',
                text: "Синдром Кабуки характеризуется:",
                options: ["Умственной отсталостью", "Характерными чертами лица", "Задержкой роста", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '044',
                text: "CD34+ клетки являются:",
                options: ["Зрелыми лимфоцитами", "Гемопоэтическими стволовыми клетками", "Эритроцитами", "Тромбоцитами"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '045',
                text: "Синдром Бругада характеризуется:",
                options: ["Удлинением интервала QT", "Элевацией ST в V1-V3", "Дельта-волной", "Блокадой левой ножки"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '046',
                text: "Мутация в гене SCN5A может вызывать:",
                options: ["Синдром Бругада", "Синдром удлиненного QT", "Катехоламинергическую полиморфную ВТ", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '047',
                text: "Болезнь Ниманна-Пика типа С характеризуется накоплением:",
                options: ["Холестерина", "Сфингомиелина", "Цереброзидов", "Ганглиозидов"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '048',
                text: "Синдром DiGeorge связан с делецией:",
                options: ["Хромосомы 15q11-q13", "Хромосомы 22q11.2", "Хромосомы 7q11.23", "Хромосомы 11p13"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '049',
                text: "Онкоген MYC наиболее часто амплифицирован при:",
                options: ["Лимфоме Беркитта", "Множественной миеломе", "Нейробластоме", "Раке молочной железы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '050',
                text: "Синдром Турнера характеризуется кариотипом:",
                options: ["47,XXY", "45,X", "47,XYY", "46,XX/46,XY"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '051',
                text: "Болезнь Краббе обусловлена дефицитом:",
                options: ["Галактоцереброзидазы", "Глюкоцереброзидазы", "Сфингомиелиназы", "Гексозаминидазы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '052',
                text: "Синдром антифосфолипидных антител может проявляться:",
                options: ["Тромбозами", "Повторными выкидышами", "Тромбоцитопенией", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '053',
                text: "Мутация в гене RET ассоциирована с:",
                options: ["Множественной эндокринной неоплазией 2 типа", "Синдромом Ли-Фраумени", "Наследственным раком молочной железы", "Семейным аденоматозным полипозом"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '054',
                text: "Синдром Прадера-Вилли характеризуется:",
                options: ["Гипотонией", "Гипогонадизмом", "Гиперфагией", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '055',
                text: "CD3 является маркером:",
                options: ["Т-лимфоцитов", "В-лимфоцитов", "NK-клеток", "Моноцитов"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '056',
                text: "Болезнь Хантингтона характеризуется:",
                options: ["Экспансией CAG-повторов", "Аутосомно-доминантным наследованием", "Хореей", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '057',
                text: "Синдром Робина характеризуется:",
                options: ["Микрогнатией", "Расщелиной неба", "Глоссоптозом", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '058',
                text: "Мутация KRAS наиболее часто встречается при:",
                options: ["Раке поджелудочной железы", "Колоректальном раке", "Раке легкого", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '059',
                text: "Синдром Ангельмана связан с:",
                options: ["Делецией 15q11-q13 материнского происхождения", "Импринтингом", "Мутацией UBE3A", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '060',
                text: "CD19 является маркером:",
                options: ["Т-лимфоцитов", "В-лимфоцитов", "NK-клеток", "Плазматических клеток"],
                correctOptionIndex: 1,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '061',
                text: "Болезнь Помпе обусловлена дефицитом:",
                options: ["α-глюкозидазы", "β-глюкозидазы", "Гликогенфосфорилазы", "Глюкозо-6-фосфатазы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '062',
                text: "Синдром Вильямса-Бойрена связан с делецией:",
                options: ["7q11.23", "22q11.2", "15q11-q13", "11p13"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '063',
                text: "Онкосупрессор RB1 инактивирован при:",
                options: ["Ретинобластоме", "Остеосаркоме", "Раке молочной железы", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '064',
                text: "Синдром Бекуита-Видемана характеризуется:",
                options: ["Макросомией", "Макроглоссией", "Гипогликемией", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '065',
                text: "CD56 является маркером:",
                options: ["NK-клеток", "Т-лимфоцитов", "В-лимфоцитов", "Моноцитов"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '066',
                text: "Болезнь Мак-Ардла обусловлена дефицитом:",
                options: ["Мышечной фосфорилазы", "Фосфофруктокиназы", "α-глюкозидазы", "Дебранчинг-фермента"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '067',
                text: "Синдром CHARGE включает:",
                options: ["Колобому", "Пороки сердца", "Атрезию хоан", "Все перечисленное"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '068',
                text: "Мутация IDH1/IDH2 наиболее часто встречается при:",
                options: ["Глиомах низкой степени злокачественности", "Глиобластомах", "Менингиомах", "Аденомах гипофиза"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '069',
                text: "Синдром Нунан характеризуется:",
                options: ["Низким ростом", "Пороками сердца", "Характерными чертами лица", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '070',
                text: "CD138 является маркером:",
                options: ["Плазматических клеток", "Т-лимфоцитов", "В-лимфоцитов", "Дендритных клеток"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '071',
                text: "Болезнь Андерсена обусловлена дефицитом:",
                options: ["Бранчинг-фермента", "Дебранчинг-фермента", "Фосфорилазы", "α-глюкозидазы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '072',
                text: "Синдром Ретта связан с мутацией в гене:",
                options: ["MECP2", "FMR1", "UBE3A", "CDKL5"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '073',
                text: "Мутация BRAF V600E наиболее часто встречается при:",
                options: ["Меланоме", "Папиллярном раке щитовидной железы", "Волосатоклеточном лейкозе", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '074',
                text: "Синдром Корнелии де Ланге характеризуется:",
                options: ["Характерными чертами лица", "Задержкой роста", "Пороками развития конечностей", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '075',
                text: "CD117 (c-kit) является маркером:",
                options: ["Гастроинтестинальных стромальных опухолей", "Мастоцитов", "Гемопоэтических стволовых клеток", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '076',
                text: "Болезнь Форбса обусловлена дефицитом:",
                options: ["Дебранчинг-фермента", "Бранчинг-фермента", "Фосфорилазы", "Фосфофруктокиназы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '077',
                text: "Синдром Смита-Лемли-Опица связан с дефектом:",
                options: ["Синтеза холестерина", "Метаболизма фенилаланина", "β-окисления жирных кислот", "Цикла мочевины"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '078',
                text: "Мутация в гене TP53 встречается при:",
                options: ["Синдроме Ли-Фраумени", "50% всех злокачественных опухолей", "Колоректальном раке", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '079',
                text: "Синдром Рубинштейна-Тайби характеризуется:",
                options: ["Широкими большими пальцами", "Характерными чертами лица", "Умственной отсталостью", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '080',
                text: "CD15 является маркером:",
                options: ["Клеток Рид-Штернберга", "Гранулоцитов", "Моноцитов", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '081',
                text: "Болезнь Хирса обусловлена дефицитом:",
                options: ["Фосфофруктокиназы", "Пируваткиназы", "Альдолазы", "Триозофосфатизомеразы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '082',
                text: "Синдром Вольфа-Хиршхорна связан с делецией:",
                options: ["4p16.3", "5p15", "11p13", "13q14"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '083',
                text: "Мутация ALK наиболее часто встречается при:",
                options: ["Анапластической лимфоме", "Раке легкого", "Нейробластоме", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '084',
                text: "Синдром кошачьего крика связан с делецией:",
                options: ["5p15", "4p16", "22q11", "7q11"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '085',
                text: "CD30 является маркером:",
                options: ["Клеток Рид-Штернберга", "Анапластических лимфом", "Эмбриональных карцином", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '086',
                text: "Болезнь Тарую обусловлена дефицитом:",
                options: ["Фосфофруктокиназы", "Пируваткиназы", "Гексокиназы", "Глюкозо-6-фосфатдегидрогеназы"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '087',
                text: "Синдром Миллера-Дикера характеризуется:",
                options: ["Лиссэнцефалией", "Характерными чертами лица", "Делецией 17p13.3", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '088',
                text: "Мутация c-MYC наиболее характерна для:",
                options: ["Лимфомы Беркитта", "Множественной миеломы", "Рака молочной железы", "Рака легкого"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '089',
                text: "Синдром Джейкобсена связан с делецией:",
                options: ["11q23", "11p13", "4p16", "5p15"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '090',
                text: "CD68 является маркером:",
                options: ["Макрофагов", "Гистиоцитов", "Клеток Лангерганса", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '091',
                text: "Болезнь фон Гирке обусловлена дефицитом:",
                options: ["Глюкозо-6-фосфатазы", "α-глюкозидазы", "Фосфорилазы", "Дебранчинг-фермента"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '092',
                text: "Синдром Патау характеризуется:",
                options: ["Трисомией 13", "Голопрозэнцефалией", "Микрофтальмией", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '093',
                text: "Мутация EGFR чаще встречается при:",
                options: ["Аденокарциноме легкого у некурящих", "Плоскоклеточном раке легкого", "Мелкоклеточном раке легкого", "Крупноклеточном раке легкого"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '094',
                text: "Синдром Эдвардса характеризуется:",
                options: ["Трисомией 18", "Характерными чертами лица", "Пороками сердца", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '095',
                text: "CD1a является маркером:",
                options: ["Клеток Лангерганса", "Кортикальных тимоцитов", "Дендритных клеток", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '096',
                text: "Болезнь Коксаки обусловлена дефицитом:",
                options: ["Дегидрогеназы пируватдегидрогеназного комплекса", "α-кетоглутаратдегидрогеназы", "Фумаразы", "Сукцинил-КоА-синтазы"],
                correctOptionIndex: 2,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '097',
                text: "Синдром Дауна ассоциирован с повышенным риском:",
                options: ["Острого лимфобластного лейкоза", "Болезни Альцгеймера", "Пороков сердца", "Всего перечисленного"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '098',
                text: "Мутация HER2 (ERBB2) наиболее часто встречается при:",
                options: ["Раке молочной железы", "Раке желудка", "Раке яичников", "Всех перечисленных"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '099',
                text: "Синдром Ди Джорджи характеризуется:",
                options: ["Иммунодефицитом", "Гипокальциемией", "Пороками сердца", "Всем перечисленным"],
                correctOptionIndex: 3,
                mode: "expert",
                difficulty: "expert"
            },
            {
                id: PREFIX + '100',
                text: "CD45 является маркером:",
                options: ["Всех лейкоцитов", "Только лимфоцитов", "Только моноцитов", "Только гранулоцитов"],
                correctOptionIndex: 0,
                mode: "expert",
                difficulty: "expert"
            }
        ];
        
        // Добавляем вопросы в общий массив
        expertQuestions.forEach(question => {
            // Проверяем, нет ли дубликатов
            const existingQuestion = window.questions.find(q => q.id === question.id);
            if (!existingQuestion) {
                window.questions.push(question);
            }
        });
        
        console.log(`✅ Добавлено ${expertQuestions.length} экспертных вопросов`);
        console.log(`📊 Всего вопросов в базе: ${window.questions.length}`);
        
        // Проверяем добавленные вопросы
        const addedExpert = window.questions.filter(q => q.mode === 'expert').length;
        console.log(`✔️ Проверка: найдено ${addedExpert} экспертных вопросов`);
    }
    
    // ВЫЗЫВАЕМ ФУНКЦИЮ НЕМЕДЛЕННО
    addExpertQuestions();
    
    // Также добавляем в DOMContentLoaded как резерв
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addExpertQuestions);
    }
    
    // Экспортируем функцию в глобальную область
    window.addExpertQuestions = addExpertQuestions;
    
    console.log('🎯 Экспертные вопросы загружены');
