// hints-system.js - Модуль подсказок 50/50
(function() {
    'use strict';
    
    console.log('💡 Загружается модуль подсказок...');

    // Конфигурация
    const CONFIG = {
        DAILY_HINTS: 3,        // Подсказок в день
        HINTS_FOR_AD: 1,       // Подсказок за рекламу
        MAX_HINTS: 10,         // Максимум подсказок
        STORAGE_KEY: 'hintsData'
    };

    // Основной объект модуля
    window.HintsSystem = {
        hints: 0,
        lastBonusDate: null,
        initialized: false,
        currentQuestionAnswered: false,
        
        // Инициализация
        init: function() {
            if (this.initialized) return;
            
            console.log('🚀 Инициализация системы подсказок');
            
            // Загружаем данные
            this.loadData();
            
            // Создаем UI
            this.createUI();
            
            // Проверяем ежедневный бонус
            this.checkDailyBonus();
            
            // Слушаем события
            this.attachEventListeners();
            
            this.initialized = true;
        },

        // Загрузка данных
        loadData: function() {
            try {
                const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    this.hints = data.hints || 0;
                    this.lastBonusDate = data.lastBonusDate || null;
                    console.log('📊 Загружены подсказки:', this.hints);
                } else {
                    // Первый запуск - даем стартовые подсказки
                    this.hints = CONFIG.DAILY_HINTS;
                    this.saveData();
                }
            } catch (error) {
                console.error('Ошибка загрузки данных подсказок:', error);
                this.hints = CONFIG.DAILY_HINTS;
            }
        },

        // Сохранение данных
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

        // Создание интерфейса
        createUI: function() {
            // Создаем контейнер для подсказок
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
            
            // Создаем модальное окно для ежедневного бонуса
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
            
            // Модальное окно для получения подсказок
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
            
            this.updateUI();
        },

        // Обновление интерфейса
        updateUI: function() {
            const hintsNumber = document.querySelector('.hints-number');
            const hintButton = document.getElementById('use-hint-btn');
            
            if (hintsNumber) {
                hintsNumber.textContent = this.hints;
                hintsNumber.classList.add('hints-updated');
                setTimeout(() => hintsNumber.classList.remove('hints-updated'), 300);
            }
            
            // Показываем/скрываем кнопку подсказки
            if (hintButton) {
                const inQuiz = document.getElementById('quiz-container')?.style.display !== 'none';
                const hasHints = this.hints > 0;
                const canUseHint = inQuiz && hasHints && !this.currentQuestionAnswered;
                
                hintButton.style.display = canUseHint ? 'block' : 'none';
                hintButton.disabled = !canUseHint;
            }
        },

        // Проверка ежедневного бонуса
        checkDailyBonus: function() {
            const today = new Date().toDateString();
            const bonusButton = document.getElementById('daily-bonus-btn');
            
            if (this.lastBonusDate !== today) {
                // Можно получить бонус
                bonusButton.classList.add('bonus-available');
                bonusButton.title = 'Получить ежедневный бонус!';
            } else {
                // Бонус уже получен
                bonusButton.classList.remove('bonus-available');
                bonusButton.title = 'Бонус уже получен сегодня';
            }
        },

        // Получение ежедневного бонуса
        collectDailyBonus: function() {
            const today = new Date().toDateString();
            
            if (this.lastBonusDate === today) {
                this.showNotification('Вы уже получили бонус сегодня! Приходите завтра 🎁');
                return;
            }
            
            // Даем бонус
            this.lastBonusDate = today;
            this.hints = Math.min(this.hints + CONFIG.DAILY_HINTS, CONFIG.MAX_HINTS);
            this.saveData();
            
            // Показываем анимацию
            this.showBonusModal();
            
            // Обновляем UI
            this.updateUI();
            this.checkDailyBonus();
            
            console.log('🎁 Получен ежедневный бонус!');
        },

        // Использование подсказки
        useHint: function() {
            if (this.hints <= 0) {
                this.showGetHintsModal();
                return;
            }
            
            if (this.currentQuestionAnswered) {
                this.showNotification('Подсказку можно использовать только до ответа!');
                return;
            }
            
            // Получаем все варианты ответов
            const options = document.querySelectorAll('.option');
            if (options.length !== 4) return;
            
            // Находим правильный ответ
            const correctIndex = window.questionsForQuiz[window.currentQuestion].correctOptionIndex;
            
            // Создаем массив неправильных индексов
            const wrongIndices = [];
            for (let i = 0; i < options.length; i++) {
                if (i !== correctIndex) {
                    wrongIndices.push(i);
                }
            }
            
            // Перемешиваем и выбираем 2 для скрытия
            const toHide = this.shuffleArray(wrongIndices).slice(0, 2);
            
            // Скрываем неправильные ответы
            toHide.forEach(index => {
                options[index].classList.add('hint-disabled');
                options[index].style.opacity = '0.3';
                options[index].style.pointerEvents = 'none';
                options[index].innerHTML = `<span style="text-decoration: line-through;">${options[index].textContent}</span>`;
            });
            
            // Списываем подсказку
            this.hints--;
            this.saveData();
            this.updateUI();
            
            // Анимация использования
            this.showHintAnimation();
            
            // Отключаем кнопку подсказки для этого вопроса
            document.getElementById('use-hint-btn').style.display = 'none';
            
            console.log('💡 Использована подсказка 50/50');
        },

        // Показ модального окна бонуса
        showBonusModal: function() {
            const modal = document.getElementById('bonus-modal');
            modal.classList.add('show');
            
            // Анимация подарка
            setTimeout(() => {
                modal.querySelector('.bonus-gift').classList.add('open');
                modal.querySelector('.bonus-reveal').classList.add('show');
            }, 300);
        },

        // Показ модального окна получения подсказок
        showGetHintsModal: function() {
            const modal = document.getElementById('get-hints-modal');
            modal.classList.add('show');
        },

        // Анимация использования подсказки
        showHintAnimation: function() {
            const animation = document.createElement('div');
            animation.className = 'hint-use-animation';
            animation.innerHTML = '💡 50/50';
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
            notification.className = 'hints-notification';
            notification.textContent = text;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },

        // Обработчики событий
        attachEventListeners: function() {
            // Кнопка использования подсказки
            document.getElementById('use-hint-btn')?.addEventListener('click', () => {
                this.useHint();
            });
            
            // Кнопка ежедневного бонуса
            document.getElementById('daily-bonus-btn')?.addEventListener('click', () => {
                this.collectDailyBonus();
            });
            
            // Закрытие модалок
            document.getElementById('close-bonus-modal')?.addEventListener('click', () => {
                document.getElementById('bonus-modal').classList.remove('show');
            });
            
            document.getElementById('close-hints-modal')?.addEventListener('click', () => {
                document.getElementById('get-hints-modal').classList.remove('show');
            });
            
            // Просмотр рекламы
            document.getElementById('watch-ad-btn')?.addEventListener('click', () => {
                this.watchAdForHints();
            });
            
            // Слушаем события квиза
            document.addEventListener('quizStarted', () => {
                this.updateUI();
            });
            
            document.addEventListener('questionLoaded', () => {
                this.currentQuestionAnswered = false;
                this.updateUI();
            });
            
            document.addEventListener('answerSelected', () => {
                this.currentQuestionAnswered = true;
                this.updateUI();
            });
            
            document.addEventListener('quizCompleted', () => {
                document.getElementById('use-hint-btn').style.display = 'none';
            });
        },

        // Просмотр рекламы за подсказки
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
                    // Даем подсказку за рекламу
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

        // Вспомогательная функция перемешивания
        shuffleArray: function(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }
    };

    // Запускаем при загрузке
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.HintsSystem.init();
        }, 500);
    });

})();
