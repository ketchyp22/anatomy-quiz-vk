// difficult-questions-handler.js
(function() {
    // Глобальные переменные для хранения вопросов
    window.originalQuestions = [];
    window.difficultQuestions = [];
    
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
        window.originalEnsureVKBridge = window.ensureVKBridge;
        window.ensureVKBridge = function() {
            const result = window.originalEnsureVKBridge ? window.originalEnsureVKBridge() : null;
            
            if (result && typeof result.then === 'function') {
                // Если result уже Promise, просто возвращаем его
                return result;
            } else {
                // Иначе создаем Promise, который разрешается с найденным VK Bridge или null
                return new Promise((resolve) => {
                    if (typeof vkBridge !== 'undefined') {
                        resolve(vkBridge);
                    } else if (typeof window.vkBridge !== 'undefined') {
                        resolve(window.vkBridge);
                    } else {
                        resolve(null);
                    }
                });
            }
        };
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
                
                // Перехватываем оригинальную функцию selectOption
                patchOptionSelectionFunction();
                
                // Назначаем обработчики для кнопок выбора сложности
                setupDifficultyButtons();
                
                // Создаем событие о загрузке сложных вопросов
                const event = new CustomEvent('difficultQuestionsLoaded', { 
                    detail: { count: window.difficultQuestions.length } 
                });
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error('Ошибка при загрузке сложных вопросов:', error);
            });
    }
    
    // Функция для перехвата selectOption и nextButton
    function patchOptionSelectionFunction() {
        // Сохраняем ссылку на оригинальную функцию appendChild
        const originalAppendChild = Element.prototype.appendChild;
        
        // Перехватываем appendChild для отслеживания добавления вариантов ответа
        Element.prototype.appendChild = function(element) {
            // Вызываем оригинальную функцию
            const result = originalAppendChild.call(this, element);
            
            // Если добавляется элемент с классом 'option'
            if (element.classList && element.classList.contains('option')) {
                // Проверяем, есть ли у него обработчик клика
                const hasClickListener = element.onclick || 
                                        (element._events && element._events.click && element._events.click.length > 0);
                
                // Если нет обработчика, добавляем свой
                if (!hasClickListener) {
                    element.addEventListener('click', function(e) {
                        console.log('Выбран вариант:', this.textContent);
                        
                        // Устанавливаем выбранный вариант
                        window.selectedOption = parseInt(this.dataset.index);
                        
                        // Выделяем выбранный вариант
                        const options = document.querySelectorAll('.option');
                        options.forEach(opt => opt.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        // Активируем кнопку "Далее"
                        const nextButton = document.getElementById('next-question');
                        if (nextButton) nextButton.disabled = false;
                    });
                }
            }
            
            return result;
        };
        
        // Отслеживаем момент загрузки вопроса
        const originalLoadQuestion = window.loadQuestion;
        if (originalLoadQuestion) {
            window.loadQuestion = function() {
                // Вызываем оригинальную функцию
                originalLoadQuestion.apply(this, arguments);
                
                // Добавляем обработчики для вариантов ответа, если их нет
                setTimeout(function() {
                    const options = document.querySelectorAll('.option');
                    options.forEach(option => {
                        if (!option.onclick && !option._listeners) {
                            option.addEventListener('click', function() {
                                console.log('Выбран вариант через патч:', this.textContent);
                                
                                // Устанавливаем выбранный вариант
                                window.selectedOption = parseInt(this.dataset.index);
                                
                                // Выделяем выбранный вариант
                                const allOptions = document.querySelectorAll('.option');
                                allOptions.forEach(opt => opt.classList.remove('selected'));
                                this.classList.add('selected');
                                
                                // Активируем кнопку "Далее"
                                const nextButton = document.getElementById('next-question');
                                if (nextButton) nextButton.disabled = false;
                            });
                        }
                    });
                }, 200);
            };
        }
        
        // Переопределяем обработчик кнопки "Далее"
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'next-question' && !e.target.disabled) {
                handleNextButtonClick(e);
            }
        }, true);
    }
    
    // Обработчик нажатия кнопки "Далее"
    function handleNextButtonClick(e) {
        if (window.selectedOption === null || !Array.isArray(window.questionsForQuiz) || 
            window.currentQuestion >= window.questionsForQuiz.length) {
            return;
        }
        
        // Блокировка кнопки после клика
        e.target.disabled = true;
        
        // Получаем текущий вопрос
        const currentQuestionObj = window.questionsForQuiz[window.currentQuestion];
        
        // Проверка ответа - поддерживаем оба формата: correct и answer
        let correctAnswerIndex;
        if (currentQuestionObj.hasOwnProperty('correct')) {
            correctAnswerIndex = currentQuestionObj.correct;
        } else if (currentQuestionObj.hasOwnProperty('correctAnswer')) {
            correctAnswerIndex = currentQuestionObj.correctAnswer;
        } else if (currentQuestionObj.hasOwnProperty('answer')) {
            correctAnswerIndex = currentQuestionObj.answer;
        } else {
            console.error('Не найден правильный ответ в вопросе:', currentQuestionObj);
            correctAnswerIndex = 0; // По умолчанию
        }
        
        console.log('Проверка ответа:', window.selectedOption, 'правильный:', correctAnswerIndex);
        
        // Если правильный ответ совпадает с выбранным, увеличиваем счет
        if (window.selectedOption === correctAnswerIndex) {
            window.score++;
            console.log('Правильный ответ! Счет:', window.score);
        }
        
        // Подсветка правильного/неправильного ответа
        const options = document.querySelectorAll('.option');
        if (options[correctAnswerIndex]) options[correctAnswerIndex].classList.add('correct');
        if (window.selectedOption !== correctAnswerIndex && options[window.selectedOption]) {
            options[window.selectedOption].classList.add('wrong');
        }
        
        // Блокировка выбора после проверки
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Задержка перед следующим вопросом
        setTimeout(() => {
            window.currentQuestion++;
            
            if (window.currentQuestion < window.questionsForQuiz.length) {
                if (typeof window.loadQuestion === 'function') {
                    window.loadQuestion();
                }
            } else {
                if (typeof window.showResults === 'function') {
                    window.showResults();
                }
            }
        }, 1500);
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
                
                // Визуальное выделение
                normalButton.classList.add('active');
                hardButton.classList.remove('active');
            } else {
                console.warn("Оригинальные вопросы не найдены");
            }
        });
        
        // Обработчик для сложных вопросов
        hardButton.addEventListener('click', function() {
            if (window.difficultQuestions && window.difficultQuestions.length > 0) {
                window.questions = window.difficultQuestions;
                console.log('Установлен набор сложных вопросов:', window.questions.length);
                
                // Визуальное выделение
                hardButton.classList.add('active');
                normalButton.classList.remove('active');
            } else {
                console.warn("Сложные вопросы не загружены");
            }
        });
        
        console.log("Кнопки выбора сложности настроены");
    }
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', init);
    
    // Экспортируем функции для возможного использования извне
    window.DifficultQuestionsHandler = {
        loadQuestions: loadDifficultQuestions,
        setupButtons: setupDifficultyButtons
    };
})();
