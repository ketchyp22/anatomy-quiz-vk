// categories-loader.js - изолированный модуль для загрузки категорий вопросов
(function() {
    // Переменные, доступные только внутри этого модуля
    let difficultQuestionsLoaded = false;
    let difficultQuestions = [];
    
    // Проверка наличия основного API приложения
    if (!window.quizApp) {
        console.error('Quiz App API не найден. Расширение категорий не может быть загружено.');
        return;
    }
    
    // Функция загрузки сложных вопросов
    async function loadDifficultQuestions() {
        try {
            const response = await fetch('difficult-questions.json');
            if (!response.ok) {
                throw new Error('Не удалось загрузить сложные вопросы');
            }
            difficultQuestions = await response.json();
            difficultQuestionsLoaded = true;
            console.log('Сложные вопросы успешно загружены');
            
            // Активируем кнопку сложных вопросов только после успешной загрузки
            document.getElementById('difficult-btn').disabled = false;
            
            return true;
        } catch (error) {
            console.error('Ошибка при загрузке сложных вопросов:', error);
            return false;
        }
    }
    
    // Функция переключения категории
    function switchToCategory(category) {
        if (category === 'difficult') {
            if (!difficultQuestionsLoaded) {
                console.warn('Сложные вопросы еще не загружены');
                return false;
            }
            // Используем API основного приложения для установки новых вопросов
            window.quizApp.setQuestions(difficultQuestions);
            
            // Обновим индикатор сложности, если он существует
            const difficultyIndicator = document.getElementById('difficulty-indicator');
            if (difficultyIndicator) {
                difficultyIndicator.textContent = 'Сложность: повышенная';
            }
            
            return true;
        } else if (category === 'general') {
            // Возвращаемся к стандартным вопросам
            window.quizApp.resetToDefaultQuestions();
            
            // Обновим индикатор сложности, если он существует
            const difficultyIndicator = document.getElementById('difficulty-indicator');
            if (difficultyIndicator) {
                difficultyIndicator.textContent = 'Сложность: обычная';
            }
            
            return true;
        }
        
        return false;
    }
    
    // Инициализация интерфейса категорий
    function initializeCategoryUI() {
        // Создаем контейнер для переключателя категорий
        const categorySelector = document.createElement('div');
        categorySelector.className = 'category-selector';
        categorySelector.innerHTML = `
            <div class="difficulty-container">
                <span id="difficulty-indicator">Сложность: обычная</span>
            </div>
            <div class="category-buttons">
                <button id="general-btn" class="category-btn active">Обычные вопросы</button>
                <button id="difficult-btn" class="category-btn" disabled>Сложные вопросы</button>
            </div>
        `;
        
        // Находим подходящее место для вставки
        const quizContainer = document.querySelector('.quiz-container') || document.querySelector('.app-container');
        if (quizContainer) {
            quizContainer.insertBefore(categorySelector, quizContainer.firstChild);
            
            // Добавляем обработчики событий для кнопок
            document.getElementById('general-btn').addEventListener('click', function() {
                setActiveButton('general');
                switchToCategory('general');
                window.quizApp.restartQuiz();
            });
            
            document.getElementById('difficult-btn').addEventListener('click', function() {
                setActiveButton('difficult');
                switchToCategory('difficult');
                window.quizApp.restartQuiz();
            });
            
            // Загружаем сложные вопросы после инициализации UI
            loadDifficultQuestions();
        } else {
            console.error('Не найден контейнер для вставки переключателя категорий');
        }
    }
    
    // Помощник для установки активной кнопки
    function setActiveButton(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${category}-btn`).classList.add('active');
    }
    
    // Добавляем стили для переключателя категорий
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
        `;
        document.head.appendChild(styleElement);
    }
    
    // Проверяем, что API приложения загружен и готов
    function checkAppReady() {
        if (window.quizApp && window.quizApp.isInitialized) {
            console.log('Quiz App готов, инициализируем категории');
            addCategoryStyles();
            initializeCategoryUI();
        } else {
            console.log('Ожидание инициализации Quiz App...');
            setTimeout(checkAppReady, 100); // Проверяем каждые 100 мс
        }
    }
    
    // Расширяем API основного приложения
    if (!window.quizApp) {
        window.quizApp = {};
    }
    
    // Добавляем методы, необходимые для переключения категорий,
    // только если они еще не определены
    if (!window.quizApp.setQuestions) {
        window.quizApp.setQuestions = function(newQuestions) {
            console.warn('setQuestions: Метод вызван, но не реализован в основном приложении');
            // Метод будет переопределен в основном приложении
        };
    }
    
    if (!window.quizApp.resetToDefaultQuestions) {
        window.quizApp.resetToDefaultQuestions = function() {
            console.warn('resetToDefaultQuestions: Метод вызван, но не реализован в основном приложении');
            // Метод будет переопределен в основном приложении
        };
    }
    
    if (!window.quizApp.restartQuiz) {
        window.quizApp.restartQuiz = function() {
            console.warn('restartQuiz: Метод вызван, но не реализован в основном приложении');
            // Метод будет переопределен в основном приложении
        };
    }
    
    // Начинаем проверку готовности приложения
    document.addEventListener('DOMContentLoaded', checkAppReady);
})();
