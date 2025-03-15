// difficult-questions-handler.js
(function() {
    // Глобальные переменные для хранения вопросов
    window.originalQuestions = [];
    window.difficultQuestions = [];
    
    // Проверка, работаем ли мы внутри VK или по прямой ссылке
    const isVKEnvironment = (window.location.hostname.indexOf('vk.com') !== -1) || 
                           (typeof vkBridge !== 'undefined') || 
                           (typeof window.vkBridge !== 'undefined');
    
    console.log("Работаем в среде VK:", isVKEnvironment);
    
    // Функция инициализации обработчика
    function init() {
        console.log("Инициализация обработчика сложных вопросов");
        
        // Исправление ошибки VK Bridge
        fixVKBridgeError();
        
        // Таймер для проверки доступности оригинальных вопросов
        const checkQuestionsInterval = setInterval(function() {
            if (window.questions && Array.isArray(window.questions)) {
                clearInterval(checkQuestionsInterval);
                console.log("Найдены оригинальные вопросы, можно продолжать");
                
                // Сохраняем оригинальные вопросы
                window.originalQuestions = [...window.questions];
                console.log('Сохранены оригинальные вопросы:', window.originalQuestions.length);
                
                // Загружаем сложные вопросы
                loadDifficultQuestions();
            }
        }, 100);
        
        // Прекращаем проверку через 5 секунд, если вопросы так и не загрузились
        setTimeout(function() {
            clearInterval(checkQuestionsInterval);
            if (!window.originalQuestions.length) {
                console.warn("Не удалось дождаться загрузки оригинальных вопросов");
                loadDifficultQuestions();
            }
        }, 5000);
    }
    
    // Исправление ошибки VK Bridge
    function fixVKBridgeError() {
        // Перехватываем вызовы ensureVKBridge().then
        const originalEnsureVKBridge = window.ensureVKBridge;
        if (originalEnsureVKBridge) {
            window.ensureVKBridge = function() {
                const result = originalEnsureVKBridge();
                
                if (result && typeof result.then === 'function') {
                    // Если результат - Promise, возвращаем его
                    return result;
                } else {
                    // Иначе оборачиваем результат в Promise
                    return new Promise((resolve) => {
                        resolve(result);
                    });
                }
            };
        }
    }
    
    // Функция загрузки сложных вопросов
    function loadDifficultQuestions() {
        console.log("Загрузка сложных вопросов из JSON");
        
        fetch('difficult-questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ошибка! Статус: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('Загруженные данные не являются массивом или пусты');
                }
                
                console.log("Получено", data.length, "сложных вопросов");
                
                // Нормализуем формат сложных вопросов
                window.difficultQuestions = data.map(question => {
                    // Создаем копию вопроса
                    const normalizedQuestion = {...question};
                    
                    // Если в вопросе есть поле answer, копируем его в correct
                    if (normalizedQuestion.hasOwnProperty('answer')) {
                        normalizedQuestion.correct = normalizedQuestion.answer;
                        normalizedQuestion.correctAnswer = normalizedQuestion.answer;
                    }
                    
                    return normalizedQuestion;
                });
                
                console.log(`Загружено и нормализовано ${window.difficultQuestions.length} сложных вопросов`);
                
                // Добавляем патч для проверки правильных ответов
                patchAnswerChecking();
                
                // Назначаем обработчики для кнопок выбора сложности
                setupDifficultyButtons();
                
                // Создаем событие о загрузке сложных вопросов
                const event = new CustomEvent('difficultQuestionsLoaded', { 
                    detail: { count: window.difficultQuestions.length } 
                });
                document.dispatchEvent(event);
                
                // Проверяем на наличие двух окон и исправляем, если это нужно
                setTimeout(fixDuplicateUI, 500);
            })
            .catch(error => {
                console.error('Ошибка при загрузке сложных вопросов:', error);
            });
    }
    
    // Функция для исправления дублирования пользовательского интерфейса
    function fixDuplicateUI() {
        // Проверяем, не находимся ли мы во ВКонтакте
        if (isVKEnvironment) {
            console.log("Работаем в среде VK, пропускаем проверку дублирования UI");
            return;
        }
        
        console.log("Проверяем на наличие дублирующихся элементов интерфейса");
        
        // Проверяем, есть ли несколько контейнеров с вопросами
        const quizContainers = document.querySelectorAll('#quiz-container');
        if (quizContainers.length > 1) {
            console.log("Обнаружено дублирование контейнера вопросов:", quizContainers.length);
            
            // Оставляем только первый контейнер
            for (let i = 1; i < quizContainers.length; i++) {
                quizContainers[i].remove();
            }
        }
        
        // Проверяем, есть ли несколько стартовых экранов
        const startScreens = document.querySelectorAll('#start-screen');
        if (startScreens.length > 1) {
            console.log("Обнаружено дублирование стартового экрана:", startScreens.length);
            
            // Оставляем только первый экран
            for (let i = 1; i < startScreens.length; i++) {
                startScreens[i].remove();
            }
        }
        
        // Проверяем, есть ли несколько контейнеров с результатами
        const resultsContainers = document.querySelectorAll('#results-container');
        if (resultsContainers.length > 1) {
            console.log("Обнаружено дублирование контейнера результатов:", resultsContainers.length);
            
            // Оставляем только первый контейнер
            for (let i = 1; i < resultsContainers.length; i++) {
                resultsContainers[i].remove();
            }
        }
        
        console.log("Проверка дублирования UI завершена");
    }
    
    // Патчим функцию проверки ответов для работы с обоими форматами
    function patchAnswerChecking() {
        // Отслеживаем нажатия на кнопку "Далее"
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'next-question' && !e.target.disabled) {
                // Проверяем текущий вопрос
                if (window.questionsForQuiz && window.currentQuestion < window.questionsForQuiz.length) {
                    const currentQuestionObj = window.questionsForQuiz[window.currentQuestion];
                    
                    // Если в вопросе нет поля correct, но есть answer, добавляем его
                    if (!currentQuestionObj.hasOwnProperty('correct') && 
                        currentQuestionObj.hasOwnProperty('answer')) {
                        console.log('Добавляем поле correct для текущего вопроса');
                        currentQuestionObj.correct = currentQuestionObj.answer;
                    }
                }
            }
        }, true);
    }
    
    // Функция для настройки кнопок выбора сложности
    function setupDifficultyButtons() {
        const normalButton = document.getElementById('normal-difficulty');
        const hardButton = document.getElementById('hard-difficulty');
        
        if (!normalButton || !hardButton) {
            console.warn('Кнопки выбора сложности не найдены');
            return;
        }
        
        console.log("Настройка кнопок выбора сложности");
        
        // Обработчик для обычных вопросов
        normalButton.addEventListener('click', function() {
            if (window.originalQuestions && window.originalQuestions.length > 0) {
                window.questions = window.originalQuestions;
                console.log('Установлен набор обычных вопросов:', window.questions.length);
            } else {
                console.warn("Оригинальные вопросы не найдены");
            }
        });
        
        // Обработчик для сложных вопросов
        hardButton.addEventListener('click', function() {
            if (window.difficultQuestions && window.difficultQuestions.length > 0) {
                window.questions = window.difficultQuestions;
                console.log('Установлен набор сложных вопросов:', window.questions.length);
            } else {
                console.warn("Сложные вопросы не загружены");
            }
        });
        
        console.log("Кнопки выбора сложности настроены");
    }
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', init);
    
    // Дополнительная проверка после полной загрузки страницы
    window.addEventListener('load', function() {
        setTimeout(fixDuplicateUI, 1000);
    });
    
    // Экспортируем функции для возможного использования извне
    window.DifficultQuestionsHandler = {
        loadQuestions: loadDifficultQuestions,
        setupButtons: setupDifficultyButtons,
        fixUI: fixDuplicateUI
    };
})();
