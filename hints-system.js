// hints-system.js - Исправленная версия с правильной интеграцией
(function() {
    'use strict';
    
    console.log('💡 Загружается исправленный модуль подсказок...');

    // Конфигурация
    const CONFIG = {
        DAILY_HINTS: 3,
        HINTS_FOR_AD: 1,
        MAX_HINTS: 10,
        STORAGE_KEY: 'hintsData'
    };

    // Основной объект модуля
    window.HintsSystem = {
        hints: 0,
        lastBonusDate: null,
        initialized: false,
        currentQuestionAnswered: false,
        hintUsedForCurrentQuestion: false,
        
        init: function() {
            if (this.initialized) return;
            
            console.log('🚀 Инициализация системы подсказок');
            
            // Добавляем CSS анимации
            this.addAnimationStyles();
            
            this.loadData();
            this.createUI();
            this.checkDailyBonus();
            this.attachEventListeners();
            
            this.initialized = true;
        },

        // Добавляем необходимые CSS стили для анимаций
        addAnimationStyles: function() {
            if (document.getElementById('hints-animation-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'hints-animation-styles';
            style.textContent = `
                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .hint-cross {
                    animation: bounceIn 0.6s ease-out !important;
                }
            `;
            document.head.appendChild(style);
        },

        loadData: function() {
            try {
                const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    this.hints = data.hints || 0;
                    this.lastBonusDate = data.lastBonusDate || null;
                    console.log('📊 Загружены подсказки:', this.hints);
                } else {
                    this.hints = CONFIG.DAILY_HINTS;
                    this.saveData();
                }
            } catch (error) {
                console.error('Ошибка загрузки данных подсказок:', error);
                this.hints = CONFIG.DAILY_HINTS;
            }
        },

        saveData: function() {
            try {
                const data = {
                    hints: this.hints,
                    lastBonusDate: this.lastBonusDate
                };
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Ошибка сохранения подсказок:', error);
            }
        },

        createUI: function() {
            const hintsContainer = document.createElement('div');
            hintsContainer.id = 'hints-container';
            hintsContainer.className = 'hints-container';
            hintsContainer.innerHTML = `
                <div class="hints-widget">
                    <div class="hints-count">
                        <span class="hints-icon">💡</span>
                        <span class="hints-number">${this.hints}</span>
                    </div>
                    <button id="use-hint-btn" class="hint-button" style="display: none;">
                        50/50
                    </button>
                </div>
                <button id="daily-bonus-btn" class="daily-bonus-button">
                    <span class="bonus-icon">🎁</span>
                </button>
            `;
            
            document.body.appendChild(hintsContainer);
            this.createBonusModal();
            this.createGetHintsModal();
            this.updateUI();
        },

        createBonusModal: function() {
            const bonusModal = document.createElement('div');
            bonusModal.id = 'bonus-modal';
            bonusModal.className = 'bonus-modal';
            bonusModal.innerHTML = `
                <div class="bonus-modal-content">
                    <h2>🎁 Ежедневный бонус!</h2>
                    <div class="bonus-animation">
                        <div class="bonus-gift">🎁</div>
                        <div class="bonus-reveal">+${CONFIG.DAILY_HINTS} 💡</div>
                    </div>
                    <p>Вы получили ${CONFIG.DAILY_HINTS} подсказки!</p>
                    <button id="close-bonus-modal" class="bonus-modal-close">Отлично!</button>
                </div>
            `;
            
            document.body.appendChild(bonusModal);
        },

        createGetHintsModal: function() {
            const getHintsModal = document.createElement('div');
            getHintsModal.id = 'get-hints-modal';
            getHintsModal.className = 'hints-modal';
            getHintsModal.innerHTML = `
                <div class="hints-modal-content">
                    <h3>💡 Закончились подсказки!</h3>
                    <p>Получите дополнительные подсказки:</p>
                    <div class="hints-options">
                        <button id="watch-ad-btn" class="hints-option-btn">
                            <span class="option-icon">📺</span>
                            <span class="option-text">Посмотреть рекламу</span>
                            <span class="option-reward">+${CONFIG.HINTS_FOR_AD} подсказка</span>
                        </button>
                        <button id="wait-bonus-btn" class="hints-option-btn">
                            <span class="option-icon">⏰</span>
                            <span class="option-text">Ждать до завтра</span>
                            <span class="option-reward">+${CONFIG.DAILY_HINTS} подсказок</span>
                        </button>
                    </div>
                    <button id="close-hints-modal" class="hints-modal-close">Закрыть</button>
                </div>
            `;
            
            document.body.appendChild(getHintsModal);
        },

        updateUI: function() {
            const hintsNumber = document.querySelector('.hints-number');
            const hintButton = document.getElementById('use-hint-btn');
            
            if (hintsNumber) {
                hintsNumber.textContent = this.hints;
                hintsNumber.classList.add('hints-updated');
                setTimeout(() => hintsNumber.classList.remove('hints-updated'), 300);
            }
            
            if (hintButton) {
                const inQuiz = document.getElementById('quiz-container')?.style.display !== 'none';
                const hasHints = this.hints > 0;
                const canUseHint = inQuiz && hasHints && !this.currentQuestionAnswered && !this.hintUsedForCurrentQuestion;
                
                hintButton.style.display = canUseHint ? 'block' : 'none';
                hintButton.disabled = !canUseHint;
            }
        },

        checkDailyBonus: function() {
            const today = new Date().toDateString();
            const bonusButton = document.getElementById('daily-bonus-btn');
            
            if (!bonusButton) return;
            
            if (this.lastBonusDate !== today) {
                bonusButton.classList.add('bonus-available');
                bonusButton.title = 'Получить ежедневный бонус!';
            } else {
                bonusButton.classList.remove('bonus-available');
                bonusButton.title = 'Бонус уже получен сегодня';
            }
        },

        collectDailyBonus: function() {
            const today = new Date().toDateString();
            
            if (this.lastBonusDate === today) {
                this.showNotification('Вы уже получили бонус сегодня! Приходите завтра 🎁');
                return;
            }
            
            this.lastBonusDate = today;
            this.hints = Math.min(this.hints + CONFIG.DAILY_HINTS, CONFIG.MAX_HINTS);
            this.saveData();
            
            this.showBonusModal();
            this.updateUI();
            this.checkDailyBonus();
            
            console.log('🎁 Получен ежедневный бонус!');
        },

        // ИСПРАВЛЕННАЯ функция получения данных вопроса
        getCurrentQuestionData: function() {
            // Способ 1: Через глобальные переменные app.js
            if (window.getCurrentQuestionData && typeof window.getCurrentQuestionData === 'function') {
                const data = window.getCurrentQuestionData();
                if (data) {
                    console.log('✅ Данные вопроса получены через window.getCurrentQuestionData:', data);
                    return data;
                }
            }
            
            // Способ 2: Прямой доступ к глобальным переменным
            if (window.questionsForQuiz && typeof window.currentQuestion !== 'undefined') {
                const question = window.questionsForQuiz[window.currentQuestion];
                if (question) {
                    console.log('✅ Данные вопроса получены напрямую:', question);
                    return question;
                }
            }
            
            // Способ 3: Через DOM поиск
            const questionText = document.getElementById('question')?.textContent;
            if (questionText && window.questions) {
                const foundQuestion = window.questions.find(q => q.text === questionText);
                if (foundQuestion) {
                    console.log('✅ Данные вопроса найдены через поиск по тексту:', foundQuestion);
                    return foundQuestion;
                }
            }
            
            console.error('❌ Не удалось получить данные текущего вопроса');
            return null;
        },

        // ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ функция использования подсказки
        useHint: function() {
            console.log('💡 Попытка использовать подсказку...');
            
            if (this.hints <= 0) {
                console.log('❌ Нет подсказок');
                this.showGetHintsModal();
                return;
            }
            
            if (this.currentQuestionAnswered) {
                console.log('❌ Уже ответили на вопрос');
                this.showNotification('Подсказку можно использовать только до ответа!');
                return;
            }
            
            if (this.hintUsedForCurrentQuestion) {
                console.log('❌ Подсказка уже использована для этого вопроса');
                this.showNotification('Подсказка уже использована для этого вопроса!');
                return;
            }
            
            // Получаем все варианты ответов
            const options = document.querySelectorAll('.option');
            console.log('🔍 Найдено вариантов ответов:', options.length);
            
            // Получаем данные вопроса
            const questionData = this.getCurrentQuestionData();
            if (!questionData) {
                console.error('❌ Не удалось получить данные вопроса');
                this.showNotification('Ошибка: не удалось определить правильный ответ');
                return;
            }
            
            const correctIndex = questionData.correctOptionIndex;
            console.log('✅ Правильный ответ:', correctIndex);
            
            if (correctIndex === undefined || correctIndex < 0 || correctIndex >= options.length) {
                console.error('❌ Неверный индекс правильного ответа:', correctIndex);
                this.showNotification('Ошибка: неверный индекс правильного ответа');
                return;
            }
            
            // Создаем массив неправильных индексов
            const wrongIndices = [];
            for (let i = 0; i < options.length; i++) {
                if (i !== correctIndex) {
                    wrongIndices.push(i);
                }
            }
            
            console.log('❌ Неправильные варианты:', wrongIndices);
            
            if (wrongIndices.length < 2) {
                console.error('❌ Недостаточно неправильных вариантов для подсказки 50/50');
                this.showNotification('Ошибка: недостаточно вариантов для подсказки 50/50');
                return;
            }
            
            // Для подсказки 50/50 всегда убираем ровно 2 неправильных ответа
            const toHideCount = Math.min(2, wrongIndices.length);
            const toHide = this.shuffleArray(wrongIndices).slice(0, toHideCount);
            console.log('🚫 Скрываем варианты:', toHide);
            
            // Применяем подсказку с анимацией
            this.applyHintAnimation(options, toHide);
            
            // Списываем подсказку
            this.hints--;
            this.hintUsedForCurrentQuestion = true;
            this.saveData();
            this.updateUI();
            
            // Показываем анимацию использования
            this.showHintAnimation();
            
            console.log('✅ Подсказка 50/50 успешно использована');
            console.log('💡 Осталось подсказок:', this.hints);
        },

        // Новая функция для применения анимации подсказки
        applyHintAnimation: function(options, toHide) {
            console.log('🎬 Применяем анимацию для вариантов:', toHide);
            
            toHide.forEach((index, animationDelay) => {
                setTimeout(() => {
                    const option = options[index];
                    console.log(`🚫 Скрываем вариант ${index}:`, option.textContent);
                    
                    // Применяем стили для скрытого варианта
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
                        position: relative !important;
                    `;
                    
                    // Добавляем крестик, только если его еще нет
                    if (!option.querySelector('.hint-cross')) {
                        const cross = document.createElement('span');
                        cross.className = 'hint-cross';
                        cross.innerHTML = ' ❌';
                        cross.style.cssText = `
                            float: right !important;
                            color: #dc2626 !important;
                            font-weight: bold !important;
                            font-size: 20px !important;
                            animation: bounceIn 0.6s ease-out !important;
                            text-decoration: none !important;
                            margin-left: 10px !important;
                        `;
                        option.appendChild(cross);
                    }
                }, animationDelay * 300); // Увеличена задержка для лучшей видимости
            });
        },

        showBonusModal: function() {
            const modal = document.getElementById('bonus-modal');
            if (!modal) return;
            
            modal.classList.add('show');
            
            setTimeout(() => {
                const gift = modal.querySelector('.bonus-gift');
                const reveal = modal.querySelector('.bonus-reveal');
                if (gift) gift.classList.add('open');
                if (reveal) reveal.classList.add('show');
            }, 300);
        },

        showGetHintsModal: function() {
            const modal = document.getElementById('get-hints-modal');
            if (modal) {
                modal.classList.add('show');
            }
        },

        showHintAnimation: function() {
            const animation = document.createElement('div');
            animation.className = 'hint-use-animation';
            animation.innerHTML = '💡 50/50';
            animation.style.cssText = `
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
            `;
            
            document.body.appendChild(animation);
            
            setTimeout(() => {
                animation.style.opacity = '1';
                animation.style.transform = 'translate(-50%, -50%) scale(1.2)';
            }, 10);
            
            setTimeout(() => {
                animation.style.opacity = '0';
                animation.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => animation.remove(), 300);
            }, 1000);
        },

        showNotification: function(text) {
            const notification = document.createElement('div');
            notification.className = 'hints-notification';
            notification.textContent = text;
            notification.style.cssText = `
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
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(-50%) translateY(0)';
            }, 10);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(-50%) translateY(100px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },

        attachEventListeners: function() {
            document.addEventListener('click', (e) => {
                if (e.target && e.target.id === 'use-hint-btn') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.useHint();
                }
                
                if (e.target && (e.target.id === 'daily-bonus-btn' || e.target.closest('#daily-bonus-btn'))) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.collectDailyBonus();
                }
                
                if (e.target && e.target.id === 'close-bonus-modal') {
                    document.getElementById('bonus-modal').classList.remove('show');
                }
                
                if (e.target && e.target.id === 'close-hints-modal') {
                    document.getElementById('get-hints-modal').classList.remove('show');
                }
                
                if (e.target && e.target.id === 'watch-ad-btn') {
                    this.watchAdForHints();
                }
            });
            
            document.addEventListener('quizStarted', () => {
                console.log('🎮 Квиз начался');
                this.updateUI();
            });
            
            document.addEventListener('questionLoaded', () => {
                console.log('❓ Новый вопрос загружен');
                this.currentQuestionAnswered = false;
                this.hintUsedForCurrentQuestion = false;
                this.updateUI();
            });
            
            document.addEventListener('answerSelected', () => {
                console.log('✋ Ответ выбран');
                this.currentQuestionAnswered = true;
                this.updateUI();
            });
            
            document.addEventListener('quizCompleted', () => {
                console.log('🏁 Квиз завершен');
                const hintButton = document.getElementById('use-hint-btn');
                if (hintButton) {
                    hintButton.style.display = 'none';
                }
            });
        },

        watchAdForHints: async function() {
            const bridge = window.vkBridgeInstance || window.vkBridge;
            
            if (!bridge) {
                this.showNotification('Реклама недоступна в данный момент');
                return;
            }
            
            try {
                const result = await bridge.send('VKWebAppShowNativeAds', {
                    ad_format: 'reward'
                });
                
                if (result.result) {
                    this.hints = Math.min(this.hints + CONFIG.HINTS_FOR_AD, CONFIG.MAX_HINTS);
                    this.saveData();
                    this.updateUI();
                    
                    this.showNotification(`Получена ${CONFIG.HINTS_FOR_AD} подсказка!`);
                    document.getElementById('get-hints-modal').classList.remove('show');
                }
            } catch (error) {
                console.error('Ошибка показа рекламы:', error);
                this.showNotification('Не удалось загрузить рекламу');
            }
        },

        shuffleArray: function(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        },

        resetHintState: function() {
            this.currentQuestionAnswered = false;
            this.hintUsedForCurrentQuestion = false;
            this.updateUI();
            console.log('🔄 Состояние подсказки сброшено');
        },

        addHints: function(count = 1) {
            this.hints = Math.min(this.hints + count, CONFIG.MAX_HINTS);
            this.saveData();
            this.updateUI();
            console.log(`➕ Добавлено ${count} подсказок. Всего: ${this.hints}`);
        }
    };

    // Запускаем при загрузке
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.HintsSystem.init();
        }, 500);
    });

    // Функции для отладки
    window.debugHints = {
        useHint: () => window.HintsSystem.useHint(),
        addHints: (count) => window.HintsSystem.addHints(count),
        resetState: () => window.HintsSystem.resetHintState(),
        getState: () => ({
            hints: window.HintsSystem.hints,
            currentQuestionAnswered: window.HintsSystem.currentQuestionAnswered,
            hintUsedForCurrentQuestion: window.HintsSystem.hintUsedForCurrentQuestion,
            initialized: window.HintsSystem.initialized
        }),
        checkQuestionData: () => {
            return window.HintsSystem.getCurrentQuestionData();
        },
        forceUseHint: () => {
            // Принудительное использование подсказки для тестирования
            const options = document.querySelectorAll('.option');
            if (options.length >= 3) {
                const toHide = [0, 2]; // Скрываем первый и третий варианты для теста
                window.HintsSystem.applyHintAnimation(options, toHide);
                window.HintsSystem.showHintAnimation();
                console.log('🧪 Принудительно применена подсказка для тестирования');
            }
        }
    };

    console.log('✅ Исправленный модуль подсказок загружен');
    console.log('🐛 Доступны функции отладки: window.debugHints');

})();
