// Инициализация VK Bridge сразу в начале
let vkBridgeInstance = null;
if (typeof vkBridge !== 'undefined') {
    console.log('Пытаемся инициализировать VK Bridge (глобальный)');
    vkBridge.send('VKWebAppInit')
        .then(data => {
            console.log('VK Bridge успешно инициализирован (глобальный)', data);
            vkBridgeInstance = vkBridge;
        })
        .catch(error => {
            console.error('Ошибка инициализации VK Bridge (глобальный):', error);
        });
} else if (typeof window.vkBridge !== 'undefined') {
    console.log('Пытаемся инициализировать VK Bridge (window)');
    window.vkBridge.send('VKWebAppInit')
        .then(data => {
            console.log('VK Bridge успешно инициализирован (window)', data);
            vkBridgeInstance = window.vkBridge;
            window.vkBridgeInstance = vkBridgeInstance;
        })
        .catch(error => {
            console.error('Ошибка инициализации VK Bridge (window):', error);
        });
} else {
    console.warn('VK Bridge не найден при загрузке скрипта');
}

// Глобальные переменные
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let questionsForQuiz = []; // Массив для хранения выбранных вопросов
const totalQuestionsToShow = 25; // Количество вопросов для показа в одном тесте
let currentUserData = null; // Данные текущего пользователя
// Переменная vkBridgeInstance уже объявлена выше, поэтому второе объявление удалено

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

// Ждем полную загрузку страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM полностью загружен');
    
    // Проверка и загрузка вопросов
    async function loadQuestions() {
        // Если вопросы уже доступны, используем их
        if (typeof window.questions !== 'undefined' && Array.isArray(window.questions)) {
            console.log(`Вопросы уже загружены: ${window.questions.length} вопросов`);
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
            console.log('Вопросы успешно загружены, инициализация приложения...');
            initializeApp();
        } else {
            console.error('Не удалось загрузить вопросы ни по одному из путей');
            alert('Ошибка загрузки вопросов. Пожалуйста, проверьте файл questions.js и обновите страницу.');
        }
    }
    
    // Запускаем загрузку вопросов
    await loadQuestions();
});

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
    if (!userInfoElement) {
        console.error('Элемент userInfoElement не найден!');
        return;
    }
    
    console.log('Отображение информации о пользователе:', userData);
    currentUserData = userData; // Сохраняем данные пользователя
    
    if (userData && userData.photo_100) {
        userInfoElement.innerHTML = `
            <img src="${userData.photo_100}" alt="${userData.first_name}">
            <span>${userData.first_name}</span>
        `;
        console.log('Информация о пользователе успешно отображена');
    } else {
        console.warn('Данные пользователя неполные, невозможно отобразить аватар');
    }
}
    
    // Инициализируем анимации
if (window.QuizAnimations && window.QuizAnimations.enhancer) {
    window.QuizAnimations.enhancer.init();
    console.log('Анимации инициализированы');
}

    // Убедимся, что пульс отображается правильно
const pulseContainer = document.querySelector('.pulse-line-container');
if (pulseContainer && !pulseContainer.querySelector('.pulse-line-svg')) {
    // Если в контейнере пульса нет SVG, добавляем его
    pulseContainer.innerHTML = `
        <svg class="pulse-line-svg" viewBox="0 0 150 40" preserveAspectRatio="none">
            <path class="pulse-line-path" d="M0,20 L10,20 L15,20 L20,10 L25,30 L30,20 L35,20 L40,20 L45,20 L50,20 L55,10 L60,30 L65,20 L70,20 L75,20 L80,20 L85,20 L90,10 L95,30 L100,20 L105,20 L110,20 L115,20 L120,20 L125,10 L130,30 L135,20 L140,20 L150,20">
            </path>
        </svg>
    `;
    console.log('Добавлен SVG пульса в контейнер');
}

    // Убедимся, что информация о пользователе отображается
if (userInfoElement && (!userInfoElement.innerHTML || userInfoElement.innerHTML.trim() === '')) {
    console.log('Элемент пользователя пуст, активируем гостевой режим');
    showGuestMode();
}
    
    // Начало квиза - проверяем наличие кнопки перед добавлением обработчика
    if (startQuizButton) {
        startQuizButton.addEventListener('click', startQuiz);
    } else {
        console.error('Ошибка: кнопка startQuizButton не найдена');
    }

    // Выбор случайных вопросов из общего пула
    function selectRandomQuestions() {
        // Проверяем, что window.questions существует и является массивом
        if (!Array.isArray(window.questions)) {
            console.error('Ошибка: переменная window.questions не является массивом');
            return [];
        }
        
        console.log(`Доступно ${window.questions.length} вопросов, выбираем ${totalQuestionsToShow}`);
        
        // Перемешиваем и выбираем нужное количество
        const shuffled = shuffleArray(window.questions);
        return shuffled.slice(0, totalQuestionsToShow);
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
    
    // Определяем текущий уровень сложности
    let currentDifficulty = 'normal';
    if (window.difficultyManager && typeof window.difficultyManager.getCurrentLevel === 'function') {
        currentDifficulty = window.difficultyManager.getCurrentLevel();
    }
    
    console.log(`Запуск квиза с уровнем сложности: ${currentDifficulty}`);
    
    // Выбираем случайные вопросы для текущего теста
    questionsForQuiz = selectRandomQuestions();
    
    console.log(`Выбрано ${questionsForQuiz.length} вопросов для квиза`);
    
    if (questionsForQuiz.length === 0) {
        console.error('Ошибка: не удалось загрузить вопросы для квиза');
        alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
        return;
    }
    
    // Добавляем индикатор сложности в контейнер квиза
    if (currentDifficulty === 'hard') {
        const indicator = document.createElement('div');
        indicator.className = 'difficulty-indicator hard';
        indicator.textContent = 'Сложный уровень';
        quizContainer.appendChild(indicator);
    }
    
    loadQuestion();
}

    // Загрузка вопроса
    function loadQuestion() {
        console.log(`Загрузка вопроса ${currentQuestion + 1} из ${totalQuestionsToShow}`);
        
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
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${totalQuestionsToShow}`;
        
        // Обновление прогресс-бара
        const progress = ((currentQuestion) / totalQuestionsToShow) * 100;
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
            const correct = questionsForQuiz[currentQuestion].correct;
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
    if (!quizContainer || !resultsContainer) {
        console.error('Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    // Определяем текущий уровень сложности
    let currentDifficulty = 'normal';
    if (window.difficultyManager && typeof window.difficultyManager.getCurrentLevel === 'function') {
        currentDifficulty = window.difficultyManager.getCurrentLevel();
    }
    
    // Используем улучшенное отображение результатов, если доступно
    if (window.EnhancedResults && typeof window.EnhancedResults.showResults === 'function') {
        window.EnhancedResults.showResults(score, questionsForQuiz.length, currentDifficulty);
    } else {
        // Запасной вариант, если улучшенный модуль недоступен
        const percentage = Math.round((score / questionsForQuiz.length) * 100);
        
        const difficultyText = currentDifficulty === 'hard' ? 
            '<div class="difficulty-badge hard">Сложный уровень</div>' : 
            '<div class="difficulty-badge">Обычный уровень</div>';
        
        let resultText;
        if (percentage >= 90) {
            resultText = currentDifficulty === 'hard' ? 
                'Великолепно! Вы настоящий эксперт в анатомии!' : 
                'Отлично! Вы эксперт в анатомии!';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
        } else {
            resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
        }
        
        scoreElement.innerHTML = `
            ${difficultyText}
            <p>Вы ответили правильно на ${score} из ${questionsForQuiz.length} вопросов</p>
            <p>${percentage}%</p>
            <p>${resultText}</p>
        `;
    }
}

    // Поделиться результатами - проверяем наличие кнопки перед добавлением обработчика
    if (shareResultsButton) {
        shareResultsButton.addEventListener('click', () => {
            const percentage = Math.round((score / questionsForQuiz.length) * 100);
            const message = `Я прошел Анатомический квиз и набрал ${percentage}%! Попробуй и ты!`;
            
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
            startQuiz();
        });
    }
}

// Функция для инициализации VK Bridge
function initVKBridge(bridge) {
    try {
        // Инициализация VK Bridge и цепочка промисов
        bridge.send('VKWebAppInit')
            .then(data => {
                console.log('VK Bridge успешно инициализирован:', data);
                // Сразу после успешной инициализации получаем данные пользователя
                return bridge.send('VKWebAppGetUserInfo');
            })
            .then(userData => {
                console.log('Данные пользователя получены:', userData);
                // Немедленно отображаем информацию о пользователе
                const userInfoElement = document.getElementById('user-info');
                if (userInfoElement) {
                    userInfoElement.innerHTML = `
                        <img src="${userData.photo_100}" alt="${userData.first_name}">
                        <span>${userData.first_name} ${userData.last_name || ''}</span>
                    `;
                    console.log('Информация о пользователе добавлена в DOM');
                }
                // Затем получаем конфигурацию
                return bridge.send('VKWebAppGetConfig');
            })
            .then(config => {
                console.log('Получена конфигурация приложения:', config);
                if (config && config.scheme) {
                    applyVKTheme(config.scheme);
                }
            })
            .catch(error => {
                console.error('Ошибка при работе с VK Bridge:', error);
                showGuestMode();
            });
        
        // Подписка на события VK Bridge
        bridge.subscribe(event => {
            if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });
    } catch (e) {
        console.error('Критическая ошибка при работе с VK Bridge:', e);
        showGuestMode();
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

// Функция для проверки доступности VK Bridge и его повторной инициализации при необходимости
function ensureVKBridge() {
    console.log('Проверка доступности VK Bridge...');
    
    // Проверяем наличие VK Bridge в разных местах
    if (typeof vkBridge !== 'undefined') {
        console.log('VK Bridge найден как глобальная переменная');
        return vkBridge;
    } else if (typeof window.vkBridge !== 'undefined') {
        console.log('VK Bridge найден через window.vkBridge');
        return window.vkBridge;
    }
    
    console.warn('VK Bridge не найден, пробуем загрузить его динамически');
    
    // Пробуем загрузить VK Bridge, если он недоступен
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js';
        script.onload = () => {
            console.log('VK Bridge успешно загружен динамически');
            
            if (typeof window.vkBridge !== 'undefined') {
                // Инициализируем VK Bridge после загрузки
                window.vkBridge.send('VKWebAppInit')
                    .then(() => {
                        console.log('VK Bridge инициализирован после динамической загрузки');
                        resolve(window.vkBridge);
                    })
                    .catch((error) => {
                        console.error('Ошибка инициализации VK Bridge после загрузки:', error);
                        reject(error);
                    });
            } else {
                console.error('VK Bridge не найден даже после загрузки скрипта');
                reject(new Error('VK Bridge недоступен'));
            }
        };
        script.onerror = (error) => {
            console.error('Ошибка при загрузке VK Bridge:', error);
            reject(error);
        };
        document.head.appendChild(script);
    }).catch((error) => {
        console.error('Не удалось загрузить VK Bridge:', error);
        
        // Важное исправление - вызываем функцию гостевого режима,
        // но проверяем сначала, существует ли она в глобальной области
        console.warn('VK Bridge не удалось инициализировать, работаем в гостевом режиме');
        
        // Создаем глобальную функцию showGuestMode, если ее еще нет
        if (typeof window.showGuestMode !== 'function') {
            window.showGuestMode = function() {
                const userInfoElement = document.getElementById('user-info');
                if (!userInfoElement) return;
                
                window.currentUserData = {
                    id: 'guest' + Math.floor(Math.random() * 10000),
                    first_name: 'Гость',
                    last_name: '',
                    photo_100: 'https://vk.com/images/camera_100.png'
                };
                
                userInfoElement.innerHTML = `
                    <img src="${window.currentUserData.photo_100}" alt="${window.currentUserData.first_name}">
                    <span>${window.currentUserData.first_name}</span>
                `;
                
                console.log('Запущен гостевой режим с ID:', window.currentUserData.id);
            };
        }
        
        // Теперь безопасно вызываем функцию
        if (typeof window.showGuestMode === 'function') {
            window.showGuestMode();
        }
        
        return null; // Возвращаем null, чтобы код продолжил работу в гостевом режиме
    });
}

// Функция для установки файлов cookie для VK
function setVKCookies() {
    // Устанавливаем необходимые cookie для работы с VK
    document.cookie = "remixlang=0; path=/; secure";
    document.cookie = "remixstlid=0; path=/; secure";
    document.cookie = "remixflash=0; path=/; secure";
    document.cookie = "remixscreen_depth=24; path=/; secure";
    console.log('VK cookies установлены');
}

// Вызываем функции при загрузке страницы
window.addEventListener('load', function() {
    setVKCookies();
    
    // Делаем функцию showGuestMode глобальной, чтобы ее можно было вызвать из любого места
    if (typeof window.showGuestMode !== 'function' && 
        typeof initializeApp === 'function') {
        
        // Находим определение функции showGuestMode внутри initializeApp
        // и делаем копию для глобального использования
        window.showGuestMode = function() {
            const userInfoElement = document.getElementById('user-info');
            if (!userInfoElement) return;
            
            window.currentUserData = {
                id: 'guest' + Math.floor(Math.random() * 10000),
                first_name: 'Гость',
                last_name: '',
                photo_100: 'https://vk.com/images/camera_100.png'
            };
            
            userInfoElement.innerHTML = `
                <img src="${window.currentUserData.photo_100}" alt="${window.currentUserData.first_name}">
                <span>${window.currentUserData.first_name}</span>
            `;
            
            console.log('Запущен гостевой режим с ID:', window.currentUserData.id);
        };
    }
    
    // Дополнительная попытка инициализации VK Bridge, если он не был инициализирован ранее
    if (!vkBridgeInstance) {
        ensureVKBridge().then(bridge => {
            if (bridge) {
                vkBridgeInstance = bridge;
                window.vkBridgeInstance = bridge;
                initVKBridge(bridge);
            } else {
                console.warn('VK Bridge не удалось инициализировать, работаем в гостевом режиме');
                if (typeof window.showGuestMode === 'function') {
                    window.showGuestMode();
                }
            }
        });
    }

    // Функция для принудительного получения информации о пользователе
function forceGetUserInfo() {
    console.log('Запуск принудительного получения информации о пользователе');
    
    let bridge = null;
    if (window.vkBridgeInstance) {
        bridge = window.vkBridgeInstance;
    } else if (window.vkBridge) {
        bridge = window.vkBridge;
    } else if (typeof vkBridge !== 'undefined') {
        bridge = vkBridge;
    }
    
    if (!bridge) {
        console.error('VK Bridge не доступен для принудительного получения информации');
        return;
    }
    
    // Принудительно вызываем API для получения информации о пользователе
    bridge.send('VKWebAppGetUserInfo')
        .then(userData => {
            console.log('FORCE: Данные пользователя получены:', userData);
            
            const userInfoElement = document.getElementById('user-info');
            if (userInfoElement) {
                userInfoElement.innerHTML = `
                    <img src="${userData.photo_100}" alt="${userData.first_name}">
                    <span>${userData.first_name} ${userData.last_name || ''}</span>
                `;
                console.log('FORCE: Данные пользователя добавлены в DOM');
            }
        })
        .catch(error => {
            console.error('FORCE: Ошибка получения данных:', error);
        });
}

// Запускаем принудительное получение данных через 2 секунды
setTimeout(forceGetUserInfo, 2000);
});
