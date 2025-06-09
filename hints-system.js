// hints-system.js - Полностью новая версия системы подсказок 50/50
(function() {
    'use strict';
    
    console.log('💡 Загружается новая система подсказок...');

    // Конфигурация
    const HINTS_CONFIG = {
        DAILY_HINTS: 3,
        HINTS_FOR_AD: 1,
        MAX_HINTS: 10,
        STORAGE_KEY: 'medicalQuizHints'
    };

    // Главный объект системы подсказок
    window.HintsSystem = {
        // Свойства
        hintsCount: 0,
        lastBonusDate: null,
        isInitialized: false,
        questionAnswered: false,
        hintUsedThisQuestion: false,
        
        // Инициализация системы
        initialize: function() {
            if (this.isInitialized) {
                console.log('⚠️ Система подсказок уже инициализирована');
                return;
            }
            
            console.log('🚀 Инициализация новой системы подсказок');
            
            this.loadHintsData();
            this.createUserInterface();
            this.setupEventListeners();
            this.checkDailyBonus();
            
            this.isInitialized = true;
            console.log('✅ Система подсказок инициализирована');
        },

        // Загрузка данных из localStorage
        loadHintsData: function() {
            try {
                const savedData = localStorage.getItem(HINTS_CONFIG.STORAGE_KEY);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    this.hintsCount = data.hints || 0;
                    this.lastBonusDate = data.lastBonus || null;
                } else {
                    this.hintsCount = HINTS_CONFIG.DAILY_HINTS;
                    this.saveHintsData();
                }
                console.log('📊 Загружено подсказок:', this.hintsCount);
            } catch (error) {
                console.error('❌ Ошибка загрузки данных:', error);
                this.hintsCount = HINTS_CONFIG.DAILY_HINTS;
            }
        },

        // Сохранение данных
        saveHintsData: function() {
            try {
                const dataToSave = {
                    hints: this.hintsCount,
                    lastBonus: this.lastBonusDate
                };
                localStorage.setItem(HINTS_CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
            } catch (error) {
                console.error('❌ Ошибка сохранения:', error);
            }
        },

        // Создание пользовательского интерфейса
        createUserInterface: function() {
            // Добавляем стили
            this.addStyles();
            
            // Создаем контейнер подсказок
            const hintsContainer = this.createHintsContainer();
            document.body.appendChild(hintsContainer);
            
            // Создаем модальные окна
            this.createBonusModal();
            this.createHintsModal();
            
            this.updateInterface();
        },

        // Добавление CSS стилей
        addStyles: function() {
            if (document.getElementById('hints-styles')) return;
            
            const styleElement = document.createElement('style');
            styleElement.id = 'hints-styles';
            styleElement.textContent = `
                .hints-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                .hints-widget {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 8px 15px;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }
                
                .hints-count {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-weight: 600;
                    color: #333;
                }
                
                .hints-number {
                    font-size: 18px;
                    min-width: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                
                .hints-number.updated {
                    transform: scale(1.3);
                    color: #10B981;
                }
                
                .hint-button {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }
                
                .hint-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
                }
                
                .hint-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .daily-bonus-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    font-size: 24px;
                }
                
                .daily-bonus-btn:hover {
                    transform: scale(1.1);
                }
                
                .daily-bonus-btn.available {
                    animation: bonusPulse 2s infinite;
                }
                
                @keyframes bonusPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .modal.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }
                
                .modal.show .modal-content {
                    transform: scale(1);
                }
                
                .modal-button {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    margin: 10px 5px;
                    transition: all 0.3s ease;
                }
                
                .modal-button:hover {
                    background: #5856eb;
                    transform: translateY(-2px);
                }
                
                .notification {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    font-weight: 500;
                    z-index: 3000;
                    transition: transform 0.3s ease;
                    max-width: 90%;
                    text-align: center;
                }
                
                .notification.show {
                    transform: translateX(-50%) translateY(0);
                }
                
                .option.hint-disabled {
                    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
                    color: #991b1b !important;
                    cursor: not-allowed !important;
                    border: 2px dashed #f87171 !important;
                    opacity: 0.6 !important;
                    transform: scale(0.95) !important;
                    pointer-events: none !important;
                    text-decoration: line-through !important;
                    transition: all 0.3s ease !important;
                    position: relative !important;
                }
                
                .hint-cross {
                    float: right !important;
                    color: #dc2626 !important;
                    font-weight: bold !important;
                    font-size: 20px !important;
                    text-decoration: none !important;
                    margin-left: 10px !important;
                    animation: bounceIn 0.6s ease-out !important;
                }
                
                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.3); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                .hint-animation {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 48px;
                    font-weight: bold;
                    color: #f59e0b;
                    opacity: 0;
                    z-index: 3000;
                    transition: all 0.3s ease;
                    text-shadow: 0 4px 20px rgba(245, 158, 11, 0.5);
                }
                
                .hint-animation.show {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2);
                }
            `;
            document.head.appendChild(styleElement);
        },

        // Создание контейнера подсказок
        createHintsContainer: function() {
            const container = document.createElement('div');
            container.className = 'hints-container';
            container.innerHTML = `
                <div class="hints-widget">
                    <div class="hints-count">
                        <span>💡</span>
                        <span class="hints-number">${this.hintsCount}</span>
                    </div>
                    <button id="hint-use-btn" class="hint-button" style="display: none;">
                        50/50
                    </button>
                </div>
                <button id="daily-bonus-btn" class="daily-bonus-btn">
                    🎁
                </button>
            `;
            return container;
        },

        // Создание модального окна бонуса
        createBonusModal: function() {
            const modal = document.createElement('div');
            modal.id = 'bonus-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>🎁 Ежедневный бонус!</h2>
                    <p>Вы получили ${HINTS_CONFIG.DAILY_HINTS} подсказки!</p>
                    <button class="modal-button" onclick="window.HintsSystem.closeBonusModal()">
                        Отлично!
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        },

        // Создание модального окна получения подсказок
        createHintsModal: function() {
            const modal = document.createElement('div');
            modal.id = 'hints-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>💡 Закончились подсказки!</h3>
                    <p>Получите дополнительные подсказки:</p>
                    <button class="modal-button" onclick="window.HintsSystem.watchAd()">
                        📺 Посмотреть рекламу (+${HINTS_CONFIG.HINTS_FOR_AD})
                    </button>
                    <button class="modal-button" onclick="window.HintsSystem.closeHintsModal()">
                        Закрыть
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        },

        // Обновление интерфейса
        updateInterface: function() {
            const hintsNumber = document.querySelector('.hints-number');
            const hintButton = document.getElementById('hint-use-btn');
            
            if (hintsNumber) {
                hintsNumber.textContent = this.hintsCount;
                hintsNumber.classList.add('updated');
                setTimeout(() => hintsNumber.classList.remove('updated'), 300);
            }
            
            if (hintButton) {
                const inQuiz = document.getElementById('quiz-container')?.style.display !== 'none';
                const hasHints = this.hintsCount > 0;
                const canUse = inQuiz && hasHints && !this.questionAnswered && !this.hintUsedThisQuestion;
                
                hintButton.style.display = canUse ? 'block' : 'none';
                hintButton.disabled = !canUse;
            }
        },

        // Настройка обработчиков событий
        setupEventListeners: function() {
            // Кнопка использования подсказки
            document.addEventListener('click', (event) => {
                if (event.target.id === 'hint-use-btn') {
                    event.preventDefault();
                    this.useHint();
                }
                
                if (event.target.id === 'daily-bonus-btn') {
                    event.preventDefault();
                    this.collectDailyBonus();
                }
            });
            
            // События квиза
            document.addEventListener('quizStarted', () => {
                console.log('🎮 Квиз начался');
                this.updateInterface();
            });
            
            document.addEventListener('questionLoaded', () => {
                console.log('❓ Новый вопрос');
                this.questionAnswered = false;
                this.hintUsedThisQuestion = false;
                this.updateInterface();
            });
            
            document.addEventListener('answerSelected', () => {
                console.log('✋ Ответ выбран');
                this.questionAnswered = true;
                this.updateInterface();
            });
            
            document.addEventListener('quizCompleted', () => {
                console.log('🏁 Квиз завершен');
                const button = document.getElementById('hint-use-btn');
                if (button) button.style.display = 'none';
            });
        },

        // Проверка ежедневного бонуса
        checkDailyBonus: function() {
            const today = new Date().toDateString();
            const bonusButton = document.getElementById('daily-bonus-btn');
            
            if (bonusButton) {
                if (this.lastBonusDate !== today) {
                    bonusButton.classList.add('available');
                    bonusButton.title = 'Получить ежедневный бонус!';
                } else {
                    bonusButton.classList.remove('available');
                    bonusButton.title = 'Бонус уже получен сегодня';
                }
            }
        },

        // Получение ежедневного бонуса
        collectDailyBonus: function() {
            const today = new Date().toDateString();
            
            if (this.lastBonusDate === today) {
                this.showNotification('Вы уже получили бонус сегодня! 🎁');
                return;
            }
            
            this.lastBonusDate = today;
            this.hintsCount = Math.min(this.hintsCount + HINTS_CONFIG.DAILY_HINTS, HINTS_CONFIG.MAX_HINTS);
            this.saveHintsData();
            this.updateInterface();
            this.checkDailyBonus();
            
            this.showBonusModal();
            console.log('🎁 Получен ежедневный бонус!');
        },

        // Получение данных текущего вопроса
        getCurrentQuestionInfo: function() {
            // Метод 1: Через глобальные функции
            if (window.getCurrentQuestionData) {
                const data = window.getCurrentQuestionData();
                if (data) return data;
            }
            
            // Метод 2: Прямой доступ к переменным
            if (window.questionsForQuiz && typeof window.currentQuestion !== 'undefined') {
                const question = window.questionsForQuiz[window.currentQuestion];
                if (question) return question;
            }
            
            // Метод 3: Поиск по тексту вопроса
            const questionText = document.getElementById('question')?.textContent;
            if (questionText && window.questions) {
                const found = window.questions.find(q => q.text === questionText);
                if (found) return found;
            }
            
            return null;
        },

        // ОСНОВНАЯ ФУНКЦИЯ: Использование подсказки 50/50
        useHint: function() {
            console.log('💡 Использование подсказки 50/50...');
            
            // Проверки
            if (this.hintsCount <= 0) {
                this.showHintsModal();
                return;
            }
            
            if (this.questionAnswered) {
                this.showNotification('Подсказку можно использовать только до ответа!');
                return;
            }
            
            if (this.hintUsedThisQuestion) {
                this.showNotification('Подсказка уже использована для этого вопроса!');
                return;
            }
            
            // Получаем варианты ответов
            const optionElements = document.querySelectorAll('.option');
            console.log('🔍 Найдено вариантов:', optionElements.length);
            
            if (optionElements.length < 3) {
                this.showNotification('Недостаточно вариантов ответов');
                return;
            }
            
            // Получаем данные вопроса
            const questionInfo = this.getCurrentQuestionInfo();
            if (!questionInfo) {
                this.showNotification('Не удалось определить правильный ответ');
                return;
            }
            
            const correctAnswerIndex = questionInfo.correctOptionIndex;
            console.log('✅ Правильный ответ под индексом:', correctAnswerIndex);
            
            if (correctAnswerIndex === undefined || correctAnswerIndex < 0 || correctAnswerIndex >= optionElements.length) {
                this.showNotification('Ошибка: неверный индекс правильного ответа');
                return;
            }
            
            // Находим неправильные ответы
            const wrongAnswerIndexes = [];
            for (let i = 0; i < optionElements.length; i++) {
                if (i !== correctAnswerIndex) {
                    wrongAnswerIndexes.push(i);
                }
            }
            
            console.log('❌ Неправильные ответы:', wrongAnswerIndexes);
            
            if (wrongAnswerIndexes.length < 2) {
                this.showNotification('Недостаточно неправильных ответов для подсказки');
                return;
            }
            
            // Выбираем 2 случайных неправильных ответа для скрытия
            const shuffledWrong = this.shuffleArray([...wrongAnswerIndexes]);
            const indexesToHide = shuffledWrong.slice(0, 2);
            
            console.log('🚫 Скрываем ответы:', indexesToHide);
            
            // Применяем скрытие
            this.hideOptions(optionElements, indexesToHide);
            
            // Обновляем состояние
            this.hintsCount--;
            this.hintUsedThisQuestion = true;
            this.saveHintsData();
            this.updateInterface();
            
            // Показываем анимацию
            this.showHintAnimation();
            
            console.log('✅ Подсказка применена! Осталось:', this.hintsCount);
        },

        // Скрытие вариантов ответов
        hideOptions: function(optionElements, indexesToHide) {
            indexesToHide.forEach((index, delay) => {
                setTimeout(() => {
                    const option = optionElements[index];
                    
                    option.classList.add('hint-disabled');
                    option.style.cssText = `
                        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
                        color: #991b1b !important;
                        cursor: not-allowed !important;
                        border: 2px dashed #f87171 !important;
                        opacity: 0.6 !important;
                        transform: scale(0.95) !important;
                        pointer-events: none !important;
                        text-decoration: line-through !important;
                        transition: all 0.3s ease !important;
                    `;
                    
                    // Добавляем крестик
                    if (!option.querySelector('.hint-cross')) {
                        const cross = document.createElement('span');
                        cross.className = 'hint-cross';
                        cross.textContent = ' ❌';
                        cross.style.cssText = `
                            float: right !important;
                            color: #dc2626 !important;
                            font-weight: bold !important;
                            font-size: 20px !important;
                            text-decoration: none !important;
                            margin-left: 10px !important;
                        `;
                        option.appendChild(cross);
                    }
                    
                    console.log(`🚫 Скрыт вариант ${index}: "${option.textContent}"`);
                }, delay * 300);
            });
        },

        // Перемешивание массива
        shuffleArray: function(array) {
            const result = [...array];
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
        },

        // Показ анимации использования подсказки
        showHintAnimation: function() {
            const animation = document.createElement('div');
            animation.className = 'hint-animation';
            animation.textContent = '💡 50/50';
            document.body.appendChild(animation);
            
            setTimeout(() => animation.classList.add('show'), 10);
            setTimeout(() => {
                animation.classList.remove('show');
                setTimeout(() => animation.remove(), 300);
            }, 1000);
        },

        // Показ уведомления
        showNotification: function(text) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = text;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },

        // Показ модального окна бонуса
        showBonusModal: function() {
            const modal = document.getElementById('bonus-modal');
            if (modal) modal.classList.add('show');
        },

        // Закрытие модального окна бонуса
        closeBonusModal: function() {
            const modal = document.getElementById('bonus-modal');
            if (modal) modal.classList.remove('show');
        },

        // Показ модального окна подсказок
        showHintsModal: function() {
            const modal = document.getElementById('hints-modal');
            if (modal) modal.classList.add('show');
        },

        // Закрытие модального окна подсказок
        closeHintsModal: function() {
            const modal = document.getElementById('hints-modal');
            if (modal) modal.classList.remove('show');
        },

        // Просмотр рекламы
        watchAd: async function() {
            const bridge = window.vkBridgeInstance || window.vkBridge;
            
            if (!bridge) {
                this.showNotification('Реклама недоступна');
                return;
            }
            
            try {
                const result = await bridge.send('VKWebAppShowNativeAds', {
                    ad_format: 'reward'
                });
                
                if (result.result) {
                    this.hintsCount = Math.min(this.hintsCount + HINTS_CONFIG.HINTS_FOR_AD, HINTS_CONFIG.MAX_HINTS);
                    this.saveHintsData();
                    this.updateInterface();
                    this.closeHintsModal();
                    this.showNotification(`Получена ${HINTS_CONFIG.HINTS_FOR_AD} подсказка!`);
                }
            } catch (error) {
                console.error('Ошибка показа рекламы:', error);
                this.showNotification('Не удалось загрузить рекламу');
            }
        },

        // Добавление подсказок (для отладки)
        addHints: function(count = 1) {
            this.hintsCount = Math.min(this.hintsCount + count, HINTS_CONFIG.MAX_HINTS);
            this.saveHintsData();
            this.updateInterface();
            console.log(`➕ Добавлено ${count} подсказок. Всего: ${this.hintsCount}`);
        },

        // Сброс состояния (для отладки)
        resetState: function() {
            this.questionAnswered = false;
            this.hintUsedThisQuestion = false;
            this.updateInterface();
            console.log('🔄 Состояние сброшено');
        }
    };

    // Автоинициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.HintsSystem.initialize();
        }, 500);
    });

    // Функции для отладки
    window.debugHints = {
        use: () => window.HintsSystem.useHint(),
        add: (count) => window.HintsSystem.addHints(count),
        reset: () => window.HintsSystem.resetState(),
        info: () => ({
            hints: window.HintsSystem.hintsCount,
            answered: window.HintsSystem.questionAnswered,
            used: window.HintsSystem.hintUsedThisQuestion,
            initialized: window.HintsSystem.isInitialized
        }),
        question: () => window.HintsSystem.getCurrentQuestionInfo()
    };

    console.log('✅ Новая система подсказок загружена');
    console.log('🐛 Отладка: window.debugHints');

})();
