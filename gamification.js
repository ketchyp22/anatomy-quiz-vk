// gamification.js - Исправленная система геймификации без дублирования элементов
(function() {
    'use strict';
    
    console.log('🎮 Загружается исправленная система геймификации...');
    
    // Проверяем поддержку localStorage
    function isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }
    
    // Создаем namespace для геймификации
    window.Gamification = {
        // Настройки
        settings: {
            soundEnabled: true,
            animationsEnabled: true,
            confettiEnabled: true
        },
        
        // Статистика пользователя
        stats: {
            totalQuizzes: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            achievements: [],
            totalPlayTime: 0,
            lastSession: null
        },
        
        // Флаги для отслеживания состояния
        initialized: false,
        statsContainer: null,
        
        // Загрузка статистики из localStorage
        loadStats: function() {
            if (!isLocalStorageAvailable()) {
                console.warn('localStorage недоступен, статистика не будет сохраняться');
                return;
            }
            
            try {
                const saved = localStorage.getItem('medicalQuizGameStats');
                if (saved) {
                    const parsedStats = JSON.parse(saved);
                    this.stats = {...this.stats, ...parsedStats};
                    console.log('📊 Статистика загружена:', this.stats);
                } else {
                    console.log('📊 Новый пользователь, создаем статистику');
                }
            } catch (e) {
                console.error('Ошибка загрузки статистики:', e);
            }
        },
        
        // Сохранение статистики
        saveStats: function() {
            if (!isLocalStorageAvailable()) return;
            
            try {
                this.stats.lastSession = Date.now();
                localStorage.setItem('medicalQuizGameStats', JSON.stringify(this.stats));
                console.log('💾 Статистика сохранена');
            } catch (e) {
                console.error('Ошибка сохранения статистики:', e);
            }
        },
        
        // Инициализация модуля
        init: function() {
            if (this.initialized) {
                console.log('⚠️ Геймификация уже инициализирована');
                return;
            }
            
            console.log('🚀 Инициализация модуля геймификации');
            this.loadStats();
            this.updateExistingStatsDisplay();
            this.loadSounds();
            this.setupEventListeners();
            this.initialized = true;
            
            // Сохраняем статистику при закрытии страницы
            window.addEventListener('beforeunload', () => {
                this.saveStats();
            });
        },
        
        // Обновление существующего дисплея статистики
        updateExistingStatsDisplay: function() {
            // Ищем существующие элементы статистики в HTML
            const statNumbers = document.querySelectorAll('.stat-number');
            
            if (statNumbers.length >= 3) {
                // Обновляем существующие элементы
                statNumbers[0].textContent = this.stats.totalQuizzes;
                statNumbers[1].textContent = this.stats.currentStreak + '🔥';
                statNumbers[2].textContent = this.stats.bestStreak + '⭐';
                
                // Если есть четвертый элемент (средний процент)
                if (statNumbers[3]) {
                    const avgPercentage = this.calculateAveragePercentage();
                    statNumbers[3].textContent = avgPercentage + '%';
                }
                
                console.log('📊 Существующая статистика обновлена');
            } else {
                console.warn('⚠️ Элементы статистики не найдены в HTML');
            }
        },
        
        // Расчет среднего процента
        calculateAveragePercentage: function() {
            if (this.stats.totalQuizzes === 0) return 0;
            // Примерный расчет на основе правильных ответов
            const estimatedTotal = this.stats.totalQuizzes * 10; // Предполагаем 10 вопросов на квиз
            const percentage = Math.round((this.stats.correctAnswers / estimatedTotal) * 100);
            return isNaN(percentage) ? 0 : Math.min(percentage, 100);
        },
        
        // Настройка обработчиков событий
        setupEventListeners: function() {
            // События квиза
            document.addEventListener('quizStarted', () => {
                console.log('🎮 Квиз начался');
            });
            
            document.addEventListener('answerResult', (event) => {
                if (event.detail.correct) {
                    this.onCorrectAnswer();
                } else {
                    this.onWrongAnswer();
                }
            });
            
            document.addEventListener('quizCompleted', (event) => {
                this.onQuizComplete(event.detail);
            });
        },
        
        // Обработка правильного ответа
        onCorrectAnswer: function() {
            console.log('✅ Правильный ответ!');
            this.stats.correctAnswers++;
            this.stats.currentStreak++;
            
            if (this.stats.currentStreak > this.stats.bestStreak) {
                this.stats.bestStreak = this.stats.currentStreak;
                this.showAchievement(`Новый рекорд! ${this.stats.bestStreak} правильных ответов подряд! 🏆`);
            }
            
            this.playSound('correct');
            
            // Показываем индикатор серии, если серия больше 2
            if (this.stats.currentStreak >= 3) {
                this.showStreakIndicator();
            }
            
            this.updateExistingStatsDisplay();
            this.saveStats();
        },
        
        // Обработка неправильного ответа
        onWrongAnswer: function() {
            console.log('❌ Неправильный ответ');
            if (this.stats.currentStreak > 0) {
                this.stats.currentStreak = 0;
                this.playSound('wrong');
                this.updateExistingStatsDisplay();
                this.saveStats();
            }
        },
        
        // Обработка завершения квиза
        onQuizComplete: function(results) {
            console.log('🏁 Квиз завершен:', results);
            this.stats.totalQuizzes++;
            
            const percentage = results.percentage || 0;
            
            // Показываем конфетти для отличных результатов
            if (percentage >= 90 && this.settings.confettiEnabled) {
                setTimeout(() => this.showConfetti(), 500);
            }
            
            // Проверяем достижения
            this.checkAchievements(results);
            this.updateExistingStatsDisplay();
            this.saveStats();
        },
        
        // Показ индикатора серии
        showStreakIndicator: function() {
            // Удаляем предыдущий индикатор, если есть
            const existing = document.querySelector('.streak-indicator');
            if (existing) {
                existing.remove();
            }
            
            const indicator = document.createElement('div');
            indicator.className = 'streak-indicator';
            indicator.innerHTML = `🔥 ${this.stats.currentStreak} подряд!`;
            indicator.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                transform: translateX(150%);
                transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                z-index: 1000;
                border: 2px solid rgba(255, 255, 255, 0.3);
            `;
            
            document.body.appendChild(indicator);
            
            // Показываем индикатор
            setTimeout(() => {
                indicator.style.transform = 'translateX(0)';
            }, 100);
            
            // Скрываем через 3 секунды
            setTimeout(() => {
                indicator.style.transform = 'translateX(150%)';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 300);
            }, 3000);
        },
        
        // Показ достижений
        showAchievement: function(text) {
            // Удаляем предыдущее достижение, если есть
            const existing = document.querySelector('.achievement-popup');
            if (existing) {
                existing.remove();
            }
            
            const achievement = document.createElement('div');
            achievement.className = 'achievement-popup';
            achievement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
                z-index: 1001;
                transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border: 3px solid rgba(255, 255, 255, 0.5);
                max-width: 350px;
                text-align: center;
                color: #8b5a00;
            `;
            
            achievement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                    <div style="font-size: 48px; animation: bounce 1s infinite;">🏆</div>
                    <div style="font-size: 18px; font-weight: 600; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); line-height: 1.4;">
                        ${text}
                    </div>
                </div>
            `;
            
            // Добавляем анимацию bounce
            if (!document.getElementById('achievement-styles')) {
                const style = document.createElement('style');
                style.id = 'achievement-styles';
                style.textContent = `
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-10px); }
                        60% { transform: translateY(-5px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(achievement);
            
            setTimeout(() => {
                achievement.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
            
            setTimeout(() => {
                achievement.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => {
                    if (achievement.parentNode) {
                        achievement.parentNode.removeChild(achievement);
                    }
                }, 500);
            }, 4000);
            
            // Звук достижения
            this.playSound('achievement');
        },
        
        // Конфетти
        showConfetti: function() {
            console.log('🎊 Показываем конфетти!');
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    this.createConfettiPiece();
                }, i * 50);
            }
        },
        
        createConfettiPiece: function() {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${this.getRandomColor()};
                top: -10px;
                left: ${Math.random() * 100}%;
                z-index: 999;
                animation: confetti-fall ${Math.random() * 2 + 3}s linear forwards;
                pointer-events: none;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            // Добавляем анимацию падения, если её нет
            if (!document.getElementById('confetti-styles')) {
                const style = document.createElement('style');
                style.id = 'confetti-styles';
                style.textContent = `
                    @keyframes confetti-fall {
                        to {
                            transform: translateY(calc(100vh + 10px)) rotate(720deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        },
        
        getRandomColor: function() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        
        // Загрузка звуков
        loadSounds: function() {
            this.sounds = {
                correct: () => this.createBeep(800, 0.1),
                wrong: () => this.createBeep(300, 0.2),
                achievement: () => this.createBeep(1200, 0.3)
            };
        },
        
        // Создание звукового сигнала
        createBeep: function(frequency, duration) {
            if (!this.settings.soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log('Не удалось воспроизвести звук:', e);
            }
        },
        
        // Воспроизведение звука
        playSound: function(type) {
            if (this.sounds && this.sounds[type]) {
                try {
                    this.sounds[type]();
                } catch (e) {
                    console.log('Ошибка воспроизведения звука:', e);
                }
            }
        },
        
        // Проверка достижений
        checkAchievements: function(results) {
            const percentage = results.percentage || 0;
            const newAchievements = [];
            
            // Проверяем, не получено ли уже достижение
            const hasAchievement = (id) => this.stats.achievements.includes(id);
            
            // Достижения по проценту правильных ответов
            if (percentage === 100 && !hasAchievement('perfectionist')) {
                this.stats.achievements.push('perfectionist');
                newAchievements.push('Перфекционист: 100% правильных ответов! 🎯');
            }
            
            if (percentage >= 90 && !hasAchievement('expert')) {
                this.stats.achievements.push('expert');
                newAchievements.push('Эксперт: 90%+ правильных ответов! 🧠');
            }
            
            // Достижения по количеству пройденных тестов
            if (this.stats.totalQuizzes >= 5 && !hasAchievement('beginner')) {
                this.stats.achievements.push('beginner');
                newAchievements.push('Новичок: 5 пройденных тестов! 📚');
            }
            
            if (this.stats.totalQuizzes >= 10 && !hasAchievement('dedicated')) {
                this.stats.achievements.push('dedicated');
                newAchievements.push('Целеустремленный: 10 пройденных тестов! 💪');
            }
            
            if (this.stats.totalQuizzes >= 25 && !hasAchievement('veteran')) {
                this.stats.achievements.push('veteran');
                newAchievements.push('Ветеран: 25 пройденных тестов! 🏅');
            }
            
            // Достижения по серии
            if (this.stats.bestStreak >= 5 && !hasAchievement('streak_master')) {
                this.stats.achievements.push('streak_master');
                newAchievements.push('Мастер серий: 5+ правильных ответов подряд! 🔥');
            }
            
            // Показываем новые достижения с задержкой
            newAchievements.forEach((achievement, index) => {
                setTimeout(() => {
                    this.showAchievement(achievement);
                }, (index + 1) * 1500);
            });
        },
        
        // Функция для сброса статистики (для тестирования)
        resetStats: function() {
            if (confirm('Вы уверены, что хотите сбросить всю статистику?')) {
                this.stats = {
                    totalQuizzes: 0,
                    correctAnswers: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    achievements: [],
                    totalPlayTime: 0,
                    lastSession: null
                };
                this.saveStats();
                this.updateExistingStatsDisplay();
                console.log('📊 Статистика сброшена');
            }
        }
    };
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.Gamification.init();
        }, 800); // Задержка для загрузки интерфейса
    });
    
    // Функции для отладки
    window.debugGamefication = {
        getStats: () => window.Gamification.stats,
        
        resetStats: () => window.Gamification.resetStats(),
        
        testCorrect: () => {
            window.Gamification.onCorrectAnswer();
        },
        
        testWrong: () => {
            window.Gamification.onWrongAnswer();
        },
        
        testComplete: (percentage = 85) => {
            window.Gamification.onQuizComplete({
                score: 8,
                total: 10,
                percentage: percentage
            });
        },
        
        testAchievement: () => {
            window.Gamification.showAchievement('Тестовое достижение! 🎉');
        },
        
        testConfetti: () => {
            window.Gamification.showConfetti();
        },
        
        addQuizzes: (count) => {
            window.Gamification.stats.totalQuizzes += count;
            window.Gamification.updateExistingStatsDisplay();
            window.Gamification.saveStats();
        }
    };
    
    console.log('✅ Исправленная система геймификации загружена');
    console.log('🐛 Отладка: window.debugGamefication');
    
})();
