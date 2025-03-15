// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 25; // Количество вопросов для показа в одном тесте
let currentUserData = null; // Данные текущего пользователя
let vkBridgeInstance = null; // Экземпляр VK Bridge для использования в функциях
let currentCategory = 'general'; // Текущая категория вопросов (по умолчанию - общие)
let generalQuestions = []; // Массив для обычных вопросов
let difficultQuestions = []; // Массив для сложных вопросов

// Получение базового URL для правильного построения путей к файлам
function getBaseUrl() {
    // Получаем текущий URL страницы
    const currentUrl = window.location.href;
    // Извлекаем базовый URL (до последнего слеша в пути)
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    return baseUrl;
}

// Функция для проверки существования файла
function checkFileExists(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        };
        xhr.send();
    });
}

// Функция для динамической загрузки скрипта с вопросами
function loadQuestionsScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            console.log(`Скрипт успешно загружен: ${url}`);
            resolve(true);
        };
        script.onerror = () => {
            console.error(`Ошибка загрузки скрипта: ${url}`);
            reject(new Error(`Не удалось загрузить скрипт: ${url}`));
        };
        document.head.appendChild(script);
    });
}

// Функция загрузки JSON файла
async function loadQuestionsJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка загрузки JSON: ${url}`, error);
        return null;
    }
}

// Ждем полную загрузку страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM полностью загружен');
    
    // Проверка и загрузка вопросов
    async function loadQuestions() {
        // Если вопросы уже доступны, используем их
        if (typeof window.questions !== 'undefined' && Array.isArray(window.questions)) {
            console.log(`Вопросы уже загружены: ${window.questions.length} вопросов`);
            generalQuestions = window.questions; // Сохраняем обычные вопросы
            
            // Пытаемся загрузить сложные вопросы
            await loadDifficultQuestions();
            
            initializeApp();
            return;
        }
        
        console.log('Вопросы не найдены, пытаемся загрузить...');
        
        // Базовый URL для корректных путей
        const baseUrl = getBaseUrl();
        
        // Возможные пути к файлу с вопросами
        const possiblePaths = [
            'questions.js',
            './questions.js',
            `${baseUrl}questions.js`,
            '/questions.js',
            'js/questions.js',
            './js/questions.js',
            `${baseUrl}js/questions.js`
        ];
        
        // Добавляем timestamp для предотвращения кэширования
        const timestamp = new Date().getTime();
        const pathsWithTimestamp = possiblePaths.map(path => 
            path.includes('?') ? `${path}&t=${timestamp}` : `${path}?t=${timestamp}`
        );
        
        // Пробуем загрузить файл по разным путям
        let loaded = false;
        
        for (const path of pathsWithTimestamp) {
            try {
                console.log(`Пробуем загрузить вопросы по пути: ${path}`);
                
                // Сначала проверим, существует ли файл
                const exists = await checkFileExists(path);
                if (!exists) {
                    console.log(`Файл не найден по пути: ${path}`);
                    continue;
                }
                
                // Если файл существует, пробуем его загрузить
                await loadQuestionsScript(path);
                
                // Проверяем, загрузились ли вопросы
                if (typeof window.questions !== 'undefined' && Array.isArray(window.questions)) {
                    console.log(`Вопросы успешно загружены из: ${path}`);
                    generalQuestions = window.questions; // Сохраняем обычные вопросы
                    loaded = true;
                    break;
                } else {
                    console.log(`Файл загружен, но вопросы не определены: ${path}`);
                }
            } catch (error) {
                console.error(`Ошибка при загрузке: ${path}`, error);
            }
        }
        
        if (loaded) {
            console.log('Вопросы успешно загружены, пытаемся загрузить сложные вопросы...');
            
            // Пытаемся загрузить сложные вопросы
            await loadDifficultQuestions();
            
            console.log('Инициализация приложения...');
            initializeApp();
        } else {
            console.error('Не удалось загрузить вопросы ни по одному из путей');
            alert('Ошибка загрузки вопросов. Пожалуйста, проверьте файл questions.js и обновите страницу.');
        }
    }
    
    // Загрузка сложных вопросов
    async function loadDifficultQuestions() {
        const baseUrl = getBaseUrl();
        
        // Сначала проверяем, есть ли в window
        if (typeof window.difficultQuestions !== 'undefined' && Array.isArray(window.difficultQuestions)) {
            console.log(`Сложные вопросы найдены в window: ${window.difficultQuestions.length}`);
            difficultQuestions = window.difficultQuestions;
            return true;
        }
        
        // Возможные пути к файлу со сложными вопросами
        const possiblePaths = [
            'difficult-questions.json',
            './difficult-questions.json',
            `${baseUrl}difficult-questions.json`,
            '/difficult-questions.json',
            'js/difficult-questions.json',
            './js/difficult-questions.json',
            `${baseUrl}js/difficult-questions.json`
        ];
        
        // Пытаемся загрузить сложные вопросы по разным путям
        for (const path of possiblePaths) {
            try {
                console.log(`Пробуем загрузить сложные вопросы по пути: ${path}`);
                
                // Сначала проверим, существует ли файл
                const exists = await checkFileExists(path);
                if (!exists) {
                    console.log(`Файл не найден по пути: ${path}`);
                    continue;
                }
                
                // Если файл существует, пробуем его загрузить
                const questions = await loadQuestionsJSON(path);
                
                if (questions && Array.isArray(questions) && questions.length > 0) {
                    console.log(`Сложные вопросы успешно загружены из: ${path}`);
                    difficultQuestions = questions;
                    
                    // Активируем кнопку сложных вопросов
                    const difficultBtn = document.getElementById('difficult-btn');
                    if (difficultBtn) {
                        difficultBtn.disabled = false;
                    }
                    
                    return true;
                }
            } catch (error) {
                console.error(`Ошибка при загрузке сложных вопросов: ${path}`, error);
            }
        }
        
        console.warn('Не удалось загрузить сложные вопросы. Будут доступны только обычные вопросы.');
        return false;
    }
    
    // Запускаем загрузку вопросов
    await loadQuestions();
});

// Создание и добавление элементов интерфейса категорий
function createCategorySelector() {
    console.log('Создание селектора категорий');
    
    // Находим подходящее место для вставки
    const startScreen = document.getElementById('start-screen');
    const quizContainer = document.querySelector('.quiz-container') || document.querySelector('#quiz-container');
    
    if (!startScreen && !quizContainer) {
        console.error('Не найден контейнер для вставки переключателя категорий');
        return false;
    }
    
    // Создаем HTML для переключателя категорий
    const categorySelector = document.createElement('div');
    categorySelector.className = 'category-selector';
    categorySelector.innerHTML = `
        <div class="difficulty-container">
            <span id="difficulty-indicator">Сложность: обычная</span>
        </div>
        <div class="category-buttons">
            <button id="general-btn" class="category-btn active">Обычные вопросы</button>
            <button id="difficult-btn" class="category-btn" ${difficultQuestions.length === 0 ? 'disabled' : ''}>Сложные вопросы</button>
        </div>
    `;
    
    // Вставляем в начало контейнера
    const targetContainer = startScreen || quizContainer;
    
    // Находим подходящее место для вставки
    const title = targetContainer.querySelector('h2');
    if (title) {
        // Если есть заголовок, вставляем после него
        title.parentNode.insertBefore(categorySelector, title.nextSibling);
    } else {
        // Иначе вставляем в начало
        targetContainer.insertBefore(categorySelector, targetContainer.firstChild);
    }
    
    // Добавляем стили для переключателя категорий
    addCategoryStyles();
    
    return true;
}

// Добавление стилей для переключателя категорий
function addCategoryStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .category-selector {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .difficulty-container {
            margin-bottom: 10px;
        }
        
        #difficulty-indicator {
            font-weight: bold;
            color: #333;
        }
        
        .category-buttons {
            display: flex;
            gap: 10px;
        }
        
        .category-btn {
            padding: 10px 15px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .category-btn:hover:not([disabled]) {
            background-color: #e0e0e0;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .category-btn.active {
            background-color: #4CAF50;
            color: white;
            border-color: #3e8e41;
        }
        
        .category-btn[disabled] {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        /* Для темной темы VK */
        .vk-dark-theme .category-btn {
            background-color: #333;
            color: #ddd;
            border-color: #555;
        }
        
        .vk-dark-theme .category-btn:hover:not([disabled]) {
            background-color: #444;
        }
        
        .vk-dark-theme .category-btn.active {
            background-color: #5181b8;
            border-color: #4a76a8;
        }
        
        .vk-dark-theme #difficulty-indicator {
            color: #ddd;
        }
    `;
    document.head.appendChild(styleElement);
}

// Инициализация обработчиков для кнопок категорий
function initCategoryButtons() {
    const generalBtn = document.getElementById('general-btn');
    const difficultBtn = document.getElementById('difficult-btn');
    
    if (generalBtn) {
        generalBtn.addEventListener('click', function() {
            changeCategory('general');
        });
    }
    
    if (difficultBtn) {
        difficultBtn.addEventListener('click', function() {
            changeCategory('difficult');
        });
    }
}

// Функция переключения категории
function changeCategory(category) {
    currentCategory = category;
    
    // Обновляем активную кнопку
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`${category}-btn`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Обновляем индикатор сложности
    const indicator = document.getElementById('difficulty-indicator');
    if (indicator) {
        indicator.textContent = `Сложность: ${category === 'general' ? 'обычная' : 'повышенная'}`;
    }
    
    console.log(`Категория изменена на: ${category}`);
}

// Инициализация приложения
function initializeApp() {
    // DOM элементы - проверяем их существование перед использованием
    const startScreen = document.getElementById('start-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const nextButton = document.getElementById('next-question');
    const scoreElement = document.getElementById('score');
    const userInfoElement = document.getElementById('user-info');
    const startQuizButton = document.getElementById('start-quiz');
    const shareResultsButton = document.getElementById('share-results');
    const restartQuizButton = document.getElementById('restart-quiz');

    // Проверяем наличие необходимых элементов
    if (!startScreen || !quizContainer || !resultsContainer || 
        !questionElement || !optionsElement || !progressBar) {
        console.error('Ошибка: Некоторые необходимые элементы не найдены в DOM');
    }

    // Создаем интерфейс для выбора категорий
    createCategorySelector();
    
    // Инициализируем обработчики для кнопок категорий
    initCategoryButtons();

    // Проверяем доступность VK Bridge
    let bridge = null;
    if (window.vkBridgeInstance) {
        console.log('VK Bridge найден через window.vkBridgeInstance');
        bridge = window.vkBridgeInstance;
    } else if (window.vkBridge) {
        console.log('VK Bridge найден через window.vkBridge');
        bridge = window.vkBridge;
    } else if (typeof vkBridge !== 'undefined') {
        console.log('VK Bridge найден через глобальную переменную vkBridge');
        bridge = vkBridge;
    }
    
    if (bridge) {
        initVKBridge(bridge);
    } else {
        console.warn('VK Bridge не определен. Переключение в гостевой режим.');
        showGuestMode();
    }

    // Гостевой режим для тестирования (если VK API недоступен)
    function showGuestMode() {
        if (!userInfoElement) return;
        
        currentUserData = {
            id: 'guest' + Math.floor(Math.random() * 10000),
            first_name: 'Гость',
            last_name: '',
            photo_100: 'https://vk.com/images/camera_100.png'
        };
        
        userInfoElement.innerHTML = `
            <img src="${currentUserData.photo_100}" alt="${currentUserData.first_name}">
            <span>${currentUserData.first_name}</span>
        `;
        
        console.log('Запущен гостевой режим с ID:', currentUserData.id);
    }

    // Отображение информации о пользователе
    function showUserInfo(userData) {
        if (!userInfoElement) return;
        
        currentUserData = userData; // Сохраняем данные пользователя
        
        if (userData && userData.photo_100) {
            userInfoElement.innerHTML = `
                <img src="${userData.photo_100}" alt="${userData.first_name}">
                <span>${userData.first_name}</span>
            `;
        }
    }

    // Начало квиза - проверяем наличие кнопки перед добавлением обработчика
    if (startQuizButton) {
        startQuizButton.addEventListener('click', startQuiz);
    } else {
        console.error('Ошибка: кнопка startQuizButton не найдена');
    }

    // Выбор случайных вопросов из общего пула
    function selectRandomQuestions() {
        // Выбираем вопросы в зависимости от текущей категории
        let sourceQuestions = [];
        
        if (currentCategory === 'general') {
            sourceQuestions = generalQuestions;
            console.log('Используем обычные вопросы');
        } else if (currentCategory === 'difficult') {
            sourceQuestions = difficultQuestions;
            console.log('Используем сложные вопросы');
        }
        
        // Проверяем, что массив вопросов не пуст
        if (!Array.isArray(sourceQuestions) || sourceQuestions.length === 0) {
            console.error(`Ошибка: массив вопросов категории ${currentCategory} пуст`);
            
            // Если сложные вопросы не загружены, используем обычные
            if (currentCategory === 'difficult' && Array.isArray(generalQuestions) && generalQuestions.length > 0) {
                console.warn('Переключаемся на обычные вопросы, так как сложные не доступны');
                sourceQuestions = generalQuestions;
                changeCategory('general');
            } else {
                return [];
            }
        }
        
        console.log(`Доступно ${sourceQuestions.length} вопросов, выбираем ${totalQuestionsToShow}`);
        
        // Определяем, сколько вопросов можно выбрать
        const numToSelect = Math.min(totalQuestionsToShow, sourceQuestions.length);
        
        // Перемешиваем и выбираем нужное количество
        const shuffled = shuffleArray(sourceQuestions);
        return shuffled.slice(0, numToSelect);
    }

    function startQuiz() {
        console.log("Начало квиза");
        
        if (!startScreen || !quizContainer) {
            console.error('Ошибка: не найдены необходимые элементы DOM');
            return;
        }
        
        startScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        
        // Выбираем случайные вопросы для текущего теста
        questionsForQuiz = selectRandomQuestions();
        
        console.log(`Выбрано ${questionsForQuiz.length} вопросов для квиза`);
        
        if (questionsForQuiz.length === 0) {
            console.error('Ошибка: не удалось загрузить вопросы для квиза');
            alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
            return;
        }
        
        loadQuestion();
    }

    // Загрузка вопроса
    function loadQuestion() {
        console.log(`Загрузка вопроса ${currentQuestion + 1} из ${questionsForQuiz.length}`);
        
        if (!questionElement || !optionsElement || !questionCounter || !progressBar) {
            console.error('Ошибка при загрузке вопроса: элементы не найдены');
            return;
        }
        
        if (!Array.isArray(questionsForQuiz) || questionsForQuiz.length === 0) {
            console.error('Ошибка при загрузке вопроса: массив вопросов пуст');
            return;
        }
        
        selectedOption = null;
        if (nextButton) nextButton.disabled = true;
        
        if (currentQuestion >= questionsForQuiz.length) {
            console.error('Ошибка: индекс текущего вопроса выходит за пределы массива');
            return;
        }
        
        const question = questionsForQuiz[currentQuestion];
        
        // Отображаем текст вопроса
        questionElement.textContent = question.question;
        
        // Обновление счетчика вопросов
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;
        
        // Обновление прогресс-бара
        const progress = ((currentQuestion) / questionsForQuiz.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Очистка предыдущих вариантов
        optionsElement.innerHTML = '';
        
        // Добавление новых вариантов
        if (Array.isArray(question.options)) {
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                optionElement.textContent = option;
                optionElement.dataset.index = index;
                optionElement.addEventListener('click', selectOption);
                optionsElement.appendChild(optionElement);
            });
        } else {
            console.error('Ошибка: варианты ответов не являются массивом');
        }
    }

    // Выбор варианта ответа
    function selectOption(e) {
        if (!nextButton) return;
        
        const selectedIndex = parseInt(e.target.dataset.index);
        selectedOption = selectedIndex;
        
        // Подсветка выбранного варианта
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        e.target.classList.add('selected');
        
        // Активация кнопки "Далее"
        nextButton.disabled = false;
    }

    // Переход к следующему вопросу - проверяем наличие кнопки перед добавлением обработчика
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (selectedOption === null || !Array.isArray(questionsForQuiz) || 
                currentQuestion >= questionsForQuiz.length) {
                return;
            }
            
            // Блокировка кнопки после клика
            nextButton.disabled = true;
            
            // Проверка ответа
            const correct = questionsForQuiz[currentQuestion].answer;
            if (selectedOption === correct) {
                score++;
            }
            
            // Подсветка правильного/неправильного ответа
            const options = document.querySelectorAll('.option');
            if (options[correct]) options[correct].classList.add('correct');
            if (selectedOption !== correct && options[selectedOption]) {
                options[selectedOption].classList.add('wrong');
            }
            
            // Блокировка выбора после проверки
            options.forEach(option => {
                option.removeEventListener('click', selectOption);
                option.style.pointerEvents = 'none';
            });
            
            // Задержка перед следующим вопросом
            setTimeout(() => {
                currentQuestion++;
                
                if (currentQuestion < questionsForQuiz.length) {
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 1500);  // 1.5 секунды, чтобы увидеть правильный ответ
        });
    }

    // Отображение результатов
    function showResults() {
        if (!quizContainer || !resultsContainer || !scoreElement) return;
        
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        
        let resultText;
        if (percentage >= 90) {
            resultText = 'Отлично! Вы эксперт в анатомии!';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
        }
        
        // Добавляем информацию о категории
        const categoryInfo = currentCategory === 'general' ? 'Обычные вопросы' : 'Сложные вопросы';
        
        scoreElement.innerHTML = `
            <p>Вы ответили правильно на ${score} из ${questionsForQuiz.length} вопросов</p>
            <p>${percentage}%</p>
            <p>${resultText}</p>
            <p class="category-info">Категория: ${categoryInfo}</p>
        `;
    }

    // Поделиться результатами - проверяем наличие кнопки перед добавлением обработчика
    if (shareResultsButton) {
        shareResultsButton.addEventListener('click', () => {
            const percentage = Math.round((score / questionsForQuiz.length) * 100);
            const categoryInfo = currentCategory === 'general' ? 'обычная сложность' : 'повышенная сложность';
            const message = `Я прошел Анатомический квиз (${categoryInfo}) и набрал ${percentage}%! Попробуй и ты!`;
            
            let bridge = null;
            if (window.vkBridgeInstance) {
                bridge = window.vkBridgeInstance;
            } else if (window.vkBridge) {
                bridge = window.vkBridge;
            } else if (typeof vkBridge !== 'undefined') {
                bridge = vkBridge;
            }
            
            if (bridge) {
                bridge.send('VKWebAppShare', {
                    message: message
                })
                .then(data => {
                    console.log('Поделились результатом:', data);
                })
                .catch(error => {
                    console.error('Ошибка при шеринге:', error);
                    alert(message);
                });
            } else {
                alert(message);
                console.warn('VK Bridge не определен. Используется альтернативное действие для "Поделиться".');
            }
        });
    }

    // Перезапуск квиза - проверяем наличие кнопки перед добавлением обработчика
    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', () => {
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (startScreen) startScreen.style.display = 'block';
        });
    }
}

// Функция для инициализации VK Bridge
function initVKBridge(bridge) {
    try {
        // Сохраняем экземпляр для использования в других функциях
        vkBridgeInstance = bridge;
        
        // Инициализация VK Bridge
        bridge.send('VKWebAppInit')
            .then(data => {
                console.log('VK Bridge успешно инициализирован:', data);
                
                // Получаем конфигурацию приложения для применения темы
                bridge.send('VKWebAppGetConfig')
                    .then(config => {
                        console.log('Получена конфигурация приложения:', config);
                        if (config && config.scheme) {
                            applyVKTheme(config.scheme);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка получения конфигурации:', error);
                    });
                
                // Получаем данные пользователя
                bridge.send('VKWebAppGetUserInfo')
                    .then(userData => {
                        console.log('Данные пользователя получены:', userData);
                        if (typeof showUserInfo === 'function') {
                            showUserInfo(userData);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка получения данных пользователя:', error);
                        if (typeof showGuestMode === 'function') {
                            showGuestMode();
                        }
                    });
            })
            .catch(error => {
                console.error('Ошибка инициализации VK Bridge:', error);
                if (typeof showGuestMode === 'function') {
                    showGuestMode();
                }
            });
        
        // Подписка на события VK Bridge для отслеживания темы
        bridge.subscribe(event => {
            if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });
    } catch (e) {
        console.error('Критическая ошибка при работе с VK Bridge:', e);
        if (typeof showGuestMode === 'function') {
            showGuestMode();
        }
    }
}

// Обработка темы VK
function applyVKTheme(scheme) {
    console.log('Применяется тема:', scheme);
    const isDarkTheme = ['space_gray', 'vkcom_dark'].includes(scheme);
    document.documentElement.classList.toggle('vk-dark-theme', isDarkTheme);
}

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffleArray(array) {
    if (!Array.isArray(array) || array.length === 0) {
        console.error('Ошибка: shuffleArray получил неверный массив');
        return [];
    }
    
    const newArray = [...array]; // Создаем копию массива
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    return newArray;
}
