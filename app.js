// app.js - Полная версия с исправлениями экспертного режима и шеринга

// Глобальная функция для показа гостевого режима
function showGuestMode() {
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

    const userInfoQuizElement = document.getElementById('user-info-quiz');
    if (userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userInfoElement.innerHTML;
    }

    console.log('Запущен гостевой режим с ID:', window.currentUserData.id);
}

// Применение темы VK
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
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Инициализация VK Bridge
function initVKBridge() {
    let bridge = null;

    if (typeof vkBridge !== 'undefined') {
        bridge = vkBridge;
    } else if (typeof window.vkBridge !== 'undefined') {
        bridge = window.vkBridge;
    } else {
        console.warn('VK Bridge не найден. Переключение в гостевой режим.');
        showGuestMode();
        return null;
    }

    try {
        bridge.send('VKWebAppInit')
            .then(() => {
                console.log('VK Bridge успешно инициализирован');
                window.vkBridgeInstance = bridge;
                return bridge.send('VKWebAppGetUserInfo');
            })
            .then((userData) => {
                console.log('Данные пользователя получены:', userData);
                window.currentUserData = userData;

                const userInfoElement = document.getElementById('user-info');
                if (userInfoElement) {
                    userInfoElement.innerHTML = `
                        <img src="${userData.photo_100}" alt="${userData.first_name}">
                        <span>${userData.first_name} ${userData.last_name || ''}</span>
                    `;
                }

                return bridge.send('VKWebAppGetConfig');
            })
            .then((config) => {
                console.log('Получена конфигурация приложения:', config);
                if (config && config.scheme) {
                    applyVKTheme(config.scheme);
                }
            })
            .catch((error) => {
                console.error('Ошибка при работе с VK Bridge:', error);
                showGuestMode();
            });

        bridge.subscribe((event) => {
            if (event.detail && event.detail.type === 'VKWebAppUpdateConfig') {
                applyVKTheme(event.detail.data.scheme);
            }
        });

        return bridge;
    } catch (e) {
        console.error('Критическая ошибка при работе с VK Bridge:', e);
        showGuestMode();
        return null;
    }
}

// Глобальные переменные
var currentQuestion = 0;
var score = 0;
var selectedOption = null;
var questionsForQuiz = [];
var totalQuestionsToShow = 10;
var currentUserData = null;
var currentQuizMode = 'anatomy';
var currentDifficulty = 'easy';
var vkBridgeInstance = null;
var appLink = window.location.href;

// DOM элементы
var startScreen, quizContainer, resultsContainer;
var questionElement, optionsElement, progressBar, questionCounter, nextButton, exitQuizButton;
var scoreElement, userInfoElement, userInfoQuizElement, startQuizButton;
var shareResultsButton, restartQuizButton;

// Ждем полную загрузку страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM полностью загружен');

    if (!window.questions) {
        console.error('Ошибка: переменная window.questions не определена. Убедитесь, что questions.js подключен.');
        alert('Не удалось загрузить вопросы. Пожалуйста, проверьте файл questions.js.');
        return;
    }

    vkBridgeInstance = initVKBridge();
    initializeApp();
});

// Инициализация приложения
function initializeApp() {
    // Получаем DOM элементы
    startScreen = document.getElementById('start-screen');
    quizContainer = document.getElementById('quiz-container');
    resultsContainer = document.getElementById('results-container');
    questionElement = document.getElementById('question');
    optionsElement = document.getElementById('options');
    progressBar = document.getElementById('progress-bar');
    questionCounter = document.getElementById('question-counter');
    nextButton = document.getElementById('next-question');
    exitQuizButton = document.getElementById('exit-quiz');
    scoreElement = document.getElementById('score');
    userInfoElement = document.getElementById('user-info');
    userInfoQuizElement = document.getElementById('user-info-quiz');
    startQuizButton = document.getElementById('start-quiz');
    shareResultsButton = document.getElementById('share-results');
    restartQuizButton = document.getElementById('restart-quiz');

    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const quizModeButtons = document.querySelectorAll('.quiz-mode-btn');

    if (!startScreen || !quizContainer || !resultsContainer ||
        !questionElement || !optionsElement || !progressBar) {
        console.error('Ошибка: Некоторые необходимые элементы не найдены в DOM');
    }

    if (!vkBridgeInstance && !window.vkBridgeInstance) {
        console.warn('VK Bridge не определен. Переключение в гостевой режим.');
        showGuestMode();
    }

    // Выбор уровня сложности
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (currentQuizMode === 'expert') {
                return; // Экспертный режим имеет фиксированную сложность
            }
            
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.difficulty;
            console.log('Выбран уровень сложности:', currentDifficulty);
        });
    });

    // ИСПРАВЛЕННЫЙ выбор режима квиза - БЕЗ ДВОЙНОГО ТАПА
    quizModeButtons.forEach(button => {
        // Используем touchstart для мобильных и click для десктопа
        const eventType = 'ontouchstart' in window ? 'touchstart' : 'click';
        
        button.addEventListener(eventType, function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Выбран режим:', this.dataset.mode);
            
            quizModeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentQuizMode = this.dataset.mode;
            
            if (currentQuizMode === 'expert') {
                currentDifficulty = 'expert';
                console.log('🧠 ЭКСПЕРТНЫЙ РЕЖИМ АКТИВИРОВАН');
                
                // Блокируем выбор сложности
                const difficultySection = document.querySelector('.difficulty-selection');
                if (difficultySection) {
                    difficultySection.style.opacity = '0.5';
                    difficultySection.style.pointerEvents = 'none';
                }
                
                // УБИРАЕМ показ уведомления в центре экрана
                // showExpertNotification(); - УДАЛЕНО
                
            } else {
                // Возвращаем возможность выбора сложности
                const difficultySection = document.querySelector('.difficulty-selection');
                if (difficultySection) {
                    difficultySection.style.opacity = '1';
                    difficultySection.style.pointerEvents = 'auto';
                }
                
                const activeDifficultyBtn = document.querySelector('.difficulty-btn.active');
                if (activeDifficultyBtn) {
                    currentDifficulty = activeDifficultyBtn.dataset.difficulty;
                }
            }
        });
    });

    if (startQuizButton) {
        startQuizButton.addEventListener('click', startQuiz);
    }

    if (exitQuizButton) {
        exitQuizButton.addEventListener('click', resetQuiz);
    }

    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', resetQuiz);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
    }

    // ИСПРАВЛЕННЫЙ обработчик шеринга
    if (shareResultsButton) {
        shareResultsButton.addEventListener('click', shareResults);
    }
}

// Сброс квиза
function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    questionsForQuiz = [];

    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (startScreen) startScreen.style.display = 'block';

    if (progressBar) progressBar.style.width = '0%';
    if (questionElement) questionElement.textContent = '';
    if (optionsElement) optionsElement.innerHTML = '';

    if (currentQuizMode !== 'expert') {
        const difficultySection = document.querySelector('.difficulty-selection');
        if (difficultySection) {
            difficultySection.style.opacity = '1';
            difficultySection.style.pointerEvents = 'auto';
        }
    }

    if (window.HintsSystem && window.HintsSystem.resetHintState) {
        window.HintsSystem.resetHintState();
    }
}

// ИСПРАВЛЕННАЯ функция выбора вопросов
function selectQuestions() {
    if (!Array.isArray(window.questions)) {
        console.error('Ошибка: переменная window.questions не является массивом');
        return [];
    }
    
    console.log(`🎯 Выбор вопросов режима ${currentQuizMode}, сложность ${currentDifficulty}`);

    let filteredQuestions = [];

    if (currentQuizMode === 'expert') {
        // Для экспертного режима используем ВСЕ экспертные вопросы
        filteredQuestions = window.questions.filter(q => q.mode === 'expert');
        console.log(`🧠 Найдено ${filteredQuestions.length} экспертных вопросов`);
        
        // Возвращаем ВСЕ экспертные вопросы перемешанными
        return shuffleArray(filteredQuestions);
    } else {
        // Для обычных режимов используем стандартную логику
        filteredQuestions = window.questions.filter(q =>
            q.mode === currentQuizMode && q.difficulty === currentDifficulty
        );
        console.log(`📚 Найдено ${filteredQuestions.length} вопросов для режима ${currentQuizMode}, сложность ${currentDifficulty}`);
    }

    if (filteredQuestions.length === 0) {
        console.warn(`⚠️ Нет вопросов для режима ${currentQuizMode} и сложности ${currentDifficulty}. Используем все вопросы.`);
        return shuffleArray(window.questions).slice(0, totalQuestionsToShow);
    }

    if (filteredQuestions.length <= totalQuestionsToShow) {
        console.log(`📊 Доступно только ${filteredQuestions.length} вопросов для выбранного режима и сложности`);
        return shuffleArray(filteredQuestions);
    }

    return shuffleArray(filteredQuestions).slice(0, totalQuestionsToShow);
}

// Начало квиза
function startQuiz() {
    console.log("🚀 Начало квиза");
    
    document.dispatchEvent(new CustomEvent('quizStarted', {
        detail: {
            mode: currentQuizMode,
            difficulty: currentDifficulty
        }
    }));
    
    if (!startScreen || !quizContainer) {
        console.error('Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    console.log(`🎯 Запуск квиза режима ${currentQuizMode}, сложность ${currentDifficulty}`);

    questionsForQuiz = selectQuestions();
    console.log(`📝 Выбрано ${questionsForQuiz.length} вопросов для квиза`);

    if (questionsForQuiz.length === 0) {
        console.error('Ошибка: не удалось загрузить вопросы для квиза');
        alert('Не удалось загрузить вопросы. Пожалуйста, обновите страницу.');
        return;
    }

    if (userInfoElement && userInfoQuizElement) {
        userInfoQuizElement.innerHTML = userInfoElement.innerHTML;
    }

    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    console.log(`📖 Загрузка вопроса ${currentQuestion + 1} из ${questionsForQuiz.length}`);
    
    document.dispatchEvent(new CustomEvent('questionLoaded', {
        detail: {
            questionIndex: currentQuestion,
            totalQuestions: questionsForQuiz.length,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));
    
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

    questionElement.textContent = question.text;
    questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questionsForQuiz.length}`;
    const progress = ((currentQuestion) / questionsForQuiz.length) * 100;
    progressBar.style.width = `${progress}%`;

    optionsElement.innerHTML = '';
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

    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    e.target.classList.add('selected');

    document.dispatchEvent(new CustomEvent('answerSelected', {
        detail: {
            selectedIndex: selectedIndex,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));

    nextButton.disabled = false;
}

// Переход к следующему вопросу
function nextQuestion() {
    if (selectedOption === null || !Array.isArray(questionsForQuiz) ||
        currentQuestion >= questionsForQuiz.length) {
        return;
    }

    nextButton.disabled = true;

    const correct = questionsForQuiz[currentQuestion].correctOptionIndex;
    const isCorrect = selectedOption === correct;
    
    if (isCorrect) {
        score++;
    }

    document.dispatchEvent(new CustomEvent('answerResult', {
        detail: { 
            correct: isCorrect,
            selectedIndex: selectedOption,
            correctIndex: correct,
            questionData: questionsForQuiz[currentQuestion]
        }
    }));

    const options = document.querySelectorAll('.option');
    
    if (options[correct]) {
        options[correct].classList.add('correct');
    }
    if (selectedOption !== correct && options[selectedOption]) {
        options[selectedOption].classList.add('wrong');
    }

    options.forEach(option => {
        option.removeEventListener('click', selectOption);
        option.style.pointerEvents = 'none';
    });

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questionsForQuiz.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Отображение результатов
function showResults() {
    if (!quizContainer || !resultsContainer || !scoreElement) {
        console.error('Ошибка: не найдены необходимые элементы DOM');
        return;
    }
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    const percentage = Math.round((score / questionsForQuiz.length) * 100);

    const difficultyBadge = document.getElementById('difficulty-badge');
    if (difficultyBadge) {
        if (currentQuizMode === 'expert') {
            difficultyBadge.textContent = '🧠 ЭКСПЕРТНЫЙ УРОВЕНЬ';
            difficultyBadge.classList.add('expert');
            difficultyBadge.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            difficultyBadge.style.color = 'white';
        } else {
            difficultyBadge.textContent = currentDifficulty === 'hard' ? 'Сложный уровень' : 'Обычный уровень';
            if (currentDifficulty === 'hard') {
                difficultyBadge.classList.add('hard');
            } else {
                difficultyBadge.classList.remove('hard');
            }
        }
    }

    const modeBadge = document.getElementById('mode-badge');
    if (modeBadge) {
        let modeText = 'Анатомия';
        if (currentQuizMode === 'clinical') modeText = 'Клиническое мышление';
        if (currentQuizMode === 'pharmacology') modeText = 'Фармакология';
        if (currentQuizMode === 'first_aid') modeText = 'Первая помощь';
        if (currentQuizMode === 'obstetrics') modeText = 'Акушерство';
        if (currentQuizMode === 'expert') modeText = '🧠 ЭКСПЕРТ';
        modeBadge.textContent = modeText;
    }

    const percentageElement = document.getElementById('percentage');
    if (percentageElement) {
        percentageElement.textContent = percentage;
    }
    
    const correctAnswersElement = document.getElementById('correct-answers');
    if (correctAnswersElement) {
        correctAnswersElement.textContent = score;
    }
    
    const totalQuestionsElement = document.getElementById('total-questions-result');
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = questionsForQuiz.length;
    }

    const scorePercentageElement = document.querySelector('.score-percentage');
    if (scorePercentageElement) {
        scorePercentageElement.classList.remove('excellent', 'good', 'average', 'poor');
        if (percentage >= 90) {
            scorePercentageElement.classList.add('excellent');
        } else if (percentage >= 70) {
            scorePercentageElement.classList.add('good');
        } else if (percentage >= 50) {
            scorePercentageElement.classList.add('average');
        } else {
            scorePercentageElement.classList.add('poor');
        }
    }

    const scoreTextElement = document.querySelector('.score-text');
    if (scoreTextElement) {
        let resultText;
        if (currentQuizMode === 'expert') {
            if (percentage >= 90) {
                resultText = '🧠 НЕВЕРОЯТНО! Вы - истинный эксперт медицины!';
            } else if (percentage >= 70) {
                resultText = '🔥 Отличный результат для экспертного уровня!';
            } else if (percentage >= 50) {
                resultText = '💪 Хороший уровень, но есть куда расти!';
            } else {
                resultText = '📚 Экспертный уровень очень сложен, продолжайте изучать!';
            }
        } else {
            if (percentage >= 90) {
                resultText = 'Великолепно! Вы настоящий эксперт!';
            } else if (percentage >= 70) {
                resultText = 'Хороший результат! Вы хорошо знаете предмет!';
            } else if (percentage >= 50) {
                resultText = 'Неплохо! Но есть над чем поработать.';
            } else {
                resultText = 'Стоит подучить материал, но вы уже на пути к знаниям!';
            }
        }
        scoreTextElement.innerHTML = `<span class="result-text">${resultText}</span>`;
    }

    document.dispatchEvent(new CustomEvent('quizCompleted', {
        detail: { 
            score: score, 
            total: questionsForQuiz.length, 
            percentage: percentage,
            mode: currentQuizMode,
            difficulty: currentDifficulty
        }
    }));
}

// ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ функция шеринга
function shareResults() {
    console.log('📤 Функция shareResults вызвана');
    
    const percentage = Math.round((score / questionsForQuiz.length) * 100);
    let modeText = 'Анатомия';
    if (currentQuizMode === 'clinical') modeText = 'Клиническое мышление';
    if (currentQuizMode === 'pharmacology') modeText = 'Фармакология';
    if (currentQuizMode === 'first_aid') modeText = 'Первая помощь';
    if (currentQuizMode === 'obstetrics') modeText = 'Акушерство';
    if (currentQuizMode === 'expert') modeText = '🧠 ЭКСПЕРТНЫЙ УРОВЕНЬ';
    
    const difficultyText = currentQuizMode === 'expert' ? 'экспертный уровень' : 
                          (currentDifficulty === 'hard' ? 'сложный уровень' : 'обычный уровень');
    const message = `Я прошел Медицинский квиз (${modeText}, ${difficultyText}) и набрал ${percentage}%! Попробуй и ты!`;

    console.log('📤 Сообщение для шеринга:', message);

    const bridge = vkBridgeInstance || window.vkBridgeInstance;
    
    if (!bridge) {
        console.warn('VK Bridge не определен. Показываем текст для копирования.');
        showShareText(message);
        return;
    }

    console.log('📤 VK Bridge найден, пробуем поделиться...');
    useSimpleShare(bridge, message);
}

// Функция шеринга через VK
function useSimpleShare(bridge, message) {
    console.log('📤 Отправляем через VKWebAppShare...');
    
    bridge.send('VKWebAppShare', { 
        link: window.location.href,
        text: message 
    })
        .then(data => {
            console.log('✅ Поделились результатом:', data);
            showShareSuccess();
        })
        .catch(error => {
            console.error('❌ Ошибка при шеринге:', error);
            showShareText(message);
        });
}

// Показать текст для копирования
function showShareText(message) {
    // Добавляем стили если их нет
    if (!document.getElementById('share-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'share-modal-styles';
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideIn { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.8); display: flex; align-items: center;
        justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white; border-radius: 20px; padding: 30px; max-width: 400px;
        width: 90%; text-align: center; animation: slideIn 0.3s ease;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #333;">📤 Поделиться результатом</h3>
        <textarea readonly style="width: 100%; height: 120px; padding: 15px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; resize: none; margin-bottom: 20px;">${message}</textarea>
        <button onclick="copyToClipboard('${message.replace(/'/g, "\\'")}'); this.parentElement.parentElement.remove();" style="background: #5a67d8; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; margin-right: 10px;">📋 Скопировать</button>
        <button onclick="this.parentElement.parentElement.remove();" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer;">Закрыть</button>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Показать успешное уведомление
function showShareSuccess() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #10B981;
        color: white; padding: 15px 20px; border-radius: 10px;
        z-index: 10001; animation: slideInRight 0.3s ease;
    `;
    notification.textContent = '✅ Результат отправлен!';
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Функция копирования в буфер обмена
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showShareSuccess();
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showShareSuccess();
    }
}

// Глобальные функции для доступа из других модулей
window.getCurrentQuestion = function() {
    return currentQuestion;
};

window.getQuestionsForQuiz = function() {
    return questionsForQuiz;
};

window.getCurrentQuestionData = function() {
    if (questionsForQuiz && currentQuestion < questionsForQuiz.length) {
        return questionsForQuiz[currentQuestion];
    }
    return null;
};

window.setExpertMode = function() {
    window.currentQuizMode = 'expert';
    window.currentDifficulty = 'expert';
    currentQuizMode = 'expert';
    currentDifficulty = 'expert';
    console.log('🧠 Экспертный режим установлен глобально');
};

window.getQuizMode = function() {
    return {
        mode: currentQuizMode,
        difficulty: currentDifficulty,
        globalMode: window.currentQuizMode,
        globalDifficulty: window.currentDifficulty
    };
};

// Функции для отладки
window.debugQuiz = {
    getCurrentQuestion: () => currentQuestion,
    getQuestionsForQuiz: () => questionsForQuiz,
    getCurrentQuestionData: () => window.getCurrentQuestionData(),
    getScore: () => score,
    getSelectedOption: () => selectedOption,
    getCurrentMode: () => currentQuizMode,
    getCurrentDifficulty: () => currentDifficulty,
    
    testExpertMode: () => {
        currentQuizMode = 'expert';
        currentDifficulty = 'expert';
        window.currentQuizMode = 'expert';
        window.currentDifficulty = 'expert';
        console.log('🧠 Экспертный режим активирован для тестирования');
        const expertQuestions = selectQuestions();
        console.log(`Найдено ${expertQuestions.length} экспертных вопросов:`, expertQuestions);
    },
    
    checkExpertQuestions: () => {
        const expertQuestions = window.questions ? window.questions.filter(q => q.mode === 'expert') : [];
        console.log(`🧠 Всего экспертных вопросов в базе: ${expertQuestions.length}`);
        return expertQuestions;
    },
    
    forceExpertMode: () => {
        window.setExpertMode();
        const expertBtn = document.querySelector('.expert-mode-btn, .quiz-mode-btn[data-mode="expert"]');
        if (expertBtn) {
            document.querySelectorAll('.quiz-mode-btn').forEach(btn => btn.classList.remove('active'));
            expertBtn.classList.add('active');
            
            const difficultySection = document.querySelector('.difficulty-selection');
            if (difficultySection) {
                difficultySection.style.opacity = '0.5';
                difficultySection.style.pointerEvents = 'none';
            }
        }
        console.log('🧠 Экспертный режим принудительно активирован');
    },
    
    skipToResults: () => {
        score = Math.floor(Math.random() * questionsForQuiz.length);
        showResults();
    },
    
    resetQuiz: () => resetQuiz(),
    
    getState: () => ({
        currentQuestion,
        score,
        selectedOption,
        currentQuizMode,
        currentDifficulty,
        questionsCount: questionsForQuiz.length,
        expertQuestionsAvailable: window.questions ? window.questions.filter(q => q.mode === 'expert').length : 0
    })
};

console.log('✅ app.js загружен с исправлениями экспертного режима и шеринга');
console.log('🐛 Доступны функции отладки: window.debugQuiz');
