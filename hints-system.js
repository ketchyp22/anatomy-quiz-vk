// hints-system.js - Полностью новая система подсказок без дублирования элементов
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
            
            console.log('🚀 Инициализация системы подсказок');
            
            this.loadHintsData();
            this.addStyles();
            this.createInterface();
            this.setupEventListeners();
            this.checkDailyBonus();
            
            this.isInitialized = true;
            console.log('✅ Система подсказок готова');
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

        // Добавление стилей
        addStyles: function() {
            if (document.getElementById('hints-system-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'hints-system-styles';
            style.textContent = `
                /* Виджет подсказок */
                .hints-widget {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 24px;
                    padding: 10px 16px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                }

                .hints-widget:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
                }

                .hints-count {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #1f2937;
                    font-weight: 600;
                    font-size: 16px;
                }

                .hints-number {
                    min-width: 20px;
                    text-align: center;
                    font-size: 18px;
                    transition: all 0.3s ease;
                }

                .hints-number.updated {
                    transform: scale(1.2);
                    color: #059669;
                }

                .hint-button {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                    white-space: nowrap;
                }

                .hint-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
                }

                .hint-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .daily-bonus-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    font-size: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .daily-bonus-btn:hover {
                    transform: scale(1.1) rotate(5deg);
                }

                .daily-bonus-btn.available {
                    animation: bonusPulse 2s infinite;
                }

                @keyframes bonusPulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    }
                    50% { 
                        transform: scale(1.05); 
                        box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5);
                    }
                }

                /* Модальные окна */
                .hints-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .hints-modal.show {
                    opacity: 1;
                    visibility: visible;
                }

                .hints-modal-content {
                    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 24px;
                    padding: 32px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                    transform: scale(0.9) translateY(-20px);
                    transition: transform 0.3s ease;
                }

                .hints-modal.show .hints-modal-content {
                    transform: scale(1) translateY(0);
                }

                .hints-modal h3 {
                    margin: 0 0 16px 0;
                    color: #1f2937;
                    font-size: 24px;
                    font-weight: 700;
                }

                .hints-modal p {
                    color: #6b7280;
                    margin-bottom: 24px;
                    line-height: 1.6;
                }

                .modal-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .modal-button {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .modal-button.primary {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .modal-button.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                }

                .modal-button.secondary {
                    background: #f1f5f9;
                    color: #475569;
                    border: 2px solid #e2e8f0;
                }

                .modal-button.secondary:hover {
                    background: #e2e8f0;
                }

                /* Уведомления */
                .hints-notification {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 16px;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 10001;
                    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
                    max-width: 300px;
                    transform: translateX(100%);
                    transition: transform 0.4s ease;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .hints-notification.show {
                    transform: translateX(0);
                }

                /* Анимация использования подсказки */
                .hint-animation {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 48px;
                    font-weight: bold;
                    color: #f59e0b;
                    opacity: 0;
                    z-index: 9999;
                    transition: all 0.4s ease;
                    text-shadow: 0 4px 20px rgba(245, 158, 11, 0.5);
                    pointer-events: none;
                }

                .hint-animation.show {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2);
                }

                /* Отключенные варианты ответов */
                .option.hint-disabled {
                    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
                    color: #991b1b !important;
                    cursor: not-allowed !important;
                    border: 2px dashed #f87171 !important;
                    opacity: 0.6 !important;
                    transform: scale(0.95) !important;
                    pointer-events: none !important;
                    text-decoration: line-through !important;
                    position: relative !important;
                    transition: all 0.3s ease !important;
                }

                .option.hint-disabled::after {
                    content: '❌';
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 18px;
                    animation: hintCrossAppear 0.5s ease-out;
                }

                @keyframes hintCrossAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0) rotate(-180deg);
                    }
                    50% {
                        transform: scale(1.2) rotate(0deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }

                /* Адаптивность */
                @media (max-width: 768px) {
                    .hints-widget {
                        top: 10px;
                        right: 10px;
                        padding: 8px 12px;
                    }
                    
                    .hints-count {
                        font-size: 14px;
                    }
                    
                    .hint-button {
                        padding: 6px 10px;
                        font-size: 12px;
                    }
                    
                    .daily-bonus-btn {
                        width: 36px;
                        height: 36px;
                        font-size: 16px;
                    }
                    
                    .hints-modal-content {
                        margin: 0 10px;
                        padding: 24px;
                    }
                    
                    .hints-notification {
                        top: 60px;
                        right: 10px;
                        max-width: 250px;
                        font-size: 13px;
                        padding: 12px 16px;
                    }
                }
            `;
            document.head.appendChild(style);
        },

        // Создание интерфейса
        createInterface: function() {
            // Удаляем существующие элементы подсказок
            this.removeExistingElements();
            
            // Создаем основной виджет
            const widget = document.createElement('div');
            widget.className = 'hints-widget';
            widget.innerHTML = `
                <div class="hints-count">
                    <span>💡</span>
                    <span class="hints-number">${this.hintsCount}</span>
                </div>
                <button id="hint-use-btn" class="hint-button" style="display: none;">
                    50/50
                </button>
                <button id="daily-bonus-btn" class="daily-bonus-btn">
                    🎁
                </button>
            `;
            
            document.body.appendChild(widget);
            
            // Создаем модальные окна
            this.createModals();
            
            console.log('🎨 Интерфейс подсказок создан');
        },

        // Удаление существующих элементов
        removeExistingElements: function() {
            const selectors = [
                '.hints-widget',
                '.hints-container',
                '#hints-container',
                '.daily-bonus-btn',
                '#daily-bonus-btn',
                '.hints-modal',
                '#hints-modal',
                '#bonus-modal'
            ];
            
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            });
        },

        // Создание модальных окон
        createModals: function() {
            // Модальное окно бонуса
            const bonusModal = document.createElement('div');
            bonusModal.id = 'bonus-modal';
            bonusModal.className = 'hints-modal';
            bonusModal.innerHTML = `
                <div class="hints-modal-content">
                    <h3>🎁 Ежедневный бонус!</h3>
                    <p>Вы получили ${HINTS_CONFIG.DAILY_HINTS} подсказки!</p>
                    <div class="modal-buttons">
                        <button class="modal-button primary" onclick="window.HintsSystem.closeBonusModal()">
                            Отлично!
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(bonusModal);

            // Модальное окно получения подсказок
            const hintsModal = document.createElement('div');
            hintsModal.id = 'hints-modal';
            hintsModal.className = 'hints-modal';
            hintsModal.innerHTML = `
                <div class="hints-modal-content">
                    <h3>💡 Закончились подсказки!</h3>
                    <p>Получите дополнительные подсказки:</p>
                    <div class="modal-buttons">
                        <button class="modal-button primary" onclick="window.HintsSystem.watchAd()">
                            📺 Посмотреть рекламу (+${HINTS_CONFIG.HINTS_FOR_AD})
                        </button>
                        <button class="modal-button secondary" onclick="window.HintsSystem.closeHintsModal()">
                            Закрыть
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(hintsModal);
        },

        // Настройка обработчиков событий
        setupEventListeners: function() {
            // Обработчики кликов
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
                console.log('🎮 Квиз начался - обновляем интерфейс подсказок');
                this.updateInterface();
            });
            
            document.addEventListener('questionLoaded', () => {
                console.log('❓ Новый вопрос загружен');
                this.resetHintState();
                this.updateInterface();
            });
            
            document.addEventListener('answerSelected', () => {
                console.log('✋ Ответ выбран');
                this.questionAnswered = true;
                this.updateInterface();
            });
            
            document.addEventListener('quizCompleted', () => {
                console.log('🏁 Квиз завершен');
                this.hideHintButton();
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
                
                hintButton.style.display = canUse ? 'inline-block' : 'none';
                hintButton.disabled = !canUse;
            }
        },

        // Скрытие кнопки подсказки
        hideHintButton: function() {
            const hintButton = document.getElementById('hint-use-btn');
            if (hintButton) {
                hintButton.style.display = 'none';
            }
        },

        // Сброс состояния подсказки для нового вопроса
        resetHintState: function() {
            this.questionAnswered = false;
            this.hintUsedThisQuestion = false;
        },

        // Получение данных текущего вопроса
        getCurrentQuestionData: function() {
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
            const questionData = this.getCurrentQuestionData();
            if (!questionData) {
                this.showNotification('Не удалось определить правильный ответ');
                return;
            }
            
            const correctIndex = questionData.correctOptionIndex;
            console.log('✅ Правильный ответ под индексом:', correctIndex);
            
            if (correctIndex === undefined || correctIndex < 0 || correctIndex >= optionElements.length) {
                this.showNotification('Ошибка: неверный индекс правильного ответа');
                return;
            }
            
            // Находим неправильные ответы
            const wrongIndexes = [];
            for (let i = 0; i < optionElements.length; i++) {
                if (i !== correctIndex) {
                    wrongIndexes.push(i);
                }
            }
            
            if (wrongIndexes.length < 2) {
                this.showNotification('Недостаточно неправильных ответов для подсказки');
                return;
            }
            
            // Выбираем 2 случайных неправильных ответа для скрытия
            const shuffled = this.shuffleArray([...wrongIndexes]);
            const toHide = shuffled.slice(0, 2);
            
            console.log('🚫 Скрываем ответы:', toHide);
            
            // Применяем скрытие
            this.hideOptions(optionElements, toHide);
            
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
                setTimeout(() => {
                    if (animation.parentNode) {
                        animation.parentNode.removeChild(animation);
                    }
                }, 400);
            }, 1200);
        },

        // Показ уведомления
        showNotification: function(text) {
            // Удаляем существующие уведомления
            const existing = document.querySelectorAll('.hints-notification');
            existing.forEach(notif => notif.remove());
            
            const notification = document.createElement('div');
            notification.className = 'hints-notification';
            notification.textContent = text;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 400);
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
            this.resetHintState();
            this.updateInterface();
            console.log('🔄 Состояние сброшено');
        }
    };

    // Автоинициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.HintsSystem.initialize();
        }, 1000); // Увеличенная задержка для полной загрузки интерфейса
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
        
        question: () => window.HintsSystem.getCurrentQuestionData(),
        
        testHint: () => {
            // Имитируем начало квиза
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.style.display = 'block';
            }
            
            // Сбрасываем состояние
            window.HintsSystem.resetHintState();
            window.HintsSystem.updateInterface();
            
            console.log('🧪 Тестовый режим подсказок активирован');
        },
        
        createTestOptions: () => {
            const optionsContainer = document.getElementById('options');
            if (!optionsContainer) {
                console.error('Контейнер опций не найден');
                return;
            }
            
            optionsContainer.innerHTML = `
                <div class="option">Вариант A - правильный</div>
                <div class="option">Вариант B - неправильный</div>
                <div class="option">Вариант C - неправильный</div>
                <div class="option">Вариант D - неправильный</div>
            `;
            
            // Устанавливаем тестовые данные вопроса
            window.questionsForQuiz = [{
                text: "Тестовый вопрос",
                correctOptionIndex: 0,
                options: ["Вариант A", "Вариант B", "Вариант C", "Вариант D"]
            }];
            window.currentQuestion = 0;
            
            console.log('🧪 Созданы тестовые варианты ответов');
        },
        
        showInterface: () => {
            window.HintsSystem.createInterface();
        },
        
        hideInterface: () => {
            window.HintsSystem.removeExistingElements();
        }
    };

    console.log('✅ Новая система подсказок загружена');
    console.log('🐛 Отладка: window.debugHints');
    console.log('🧪 Тест: window.debugHints.testHint()');

})();
