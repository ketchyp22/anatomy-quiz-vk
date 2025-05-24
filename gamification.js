// gamification.js - Исправленный модуль геймификации
(function() {
    'use strict';
    
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
                console.log('💾 Статистика сохранена:', this.stats);
            } catch (e) {
                console.error('Ошибка сохранения статистики:', e);
            }
        },
        
        // Инициализация модуля
        init: function() {
            if (this.initialized) {
                console.log('Геймификация уже инициализирована');
                return;
            }
            
            console.log('🎮 Инициализация модуля геймификации');
            this.loadStats();
            this.addStatsDisplay();
            this.loadSounds();
            this.initialized = true;
            
            // Сохраняем статистику при закрытии страницы
            window.addEventListener('beforeunload', () => {
                this.saveStats();
            });
        },
        
        // Добавление дисплея статистики
        addStatsDisplay: function() {
            const startScreen = document.getElementById('start-screen');
            if (!startScreen) {
                console.warn('Не найден start-screen для добавления статистики');
                return;
            }
            
            // Проверяем, не добавлена ли уже статистика
            if (document.getElementById('gamification-stats')) {
                console.log('Статистика уже добавлена');
                return;
            }
            
            const statsContainer = document.createElement('div');
            statsContainer.id = 'gamification-stats';
            statsContainer.className = 'gamification-stats';
            statsContainer.innerHTML = `
                <div class="stats-card">
                    <div class="stat-item">
                        <span class="stat-number" id="total-quizzes-stat">${this.stats.totalQuizzes}</span>
                        <span class="stat-label">Пройдено тестов</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="current-streak-stat">${this.stats.currentStreak}🔥</span>
                        <span class="stat-label">Текущая серия</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="best-streak-stat">${this.stats.bestStreak}⭐</span>
                        <span class="stat-label">Лучшая серия</span>
                    </div>
                </div>
            `;
            
            // Вставляем после информации о пользователе
            const userInfo = startScreen.querySelector('.user-info');
            if (userInfo && userInfo.nextSibling) {
                startScreen.insertBefore(statsContainer, userInfo.nextSibling);
            } else if (userInfo) {
                userInfo.parentNode.appendChild(statsContainer);
            } else {
                // Если нет user-info, вставляем в начало
                startScreen.insertBefore(statsContainer, startScreen.firstChild);
            }
            
            this.statsContainer = statsContainer;
            console.log('📊 Дисплей статистики добавлен');
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
            
            this.updateStatsDisplay();
            this.saveStats();
        },
        
        // Обработка неправильного ответа
        onWrongAnswer: function() {
            console.log('❌ Неправильный ответ');
            if (this.stats.currentStreak > 0) {
                this.stats.currentStreak = 0;
                this.playSound('wrong');
                this.updateStatsDisplay();
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
            this.updateStatsDisplay();
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
            
            document.body.appendChild(indicator);
            
            // Показываем индикатор
            setTimeout(() => {
                indicator.classList.add('show');
            }, 100);
            
            // Скрываем через 3 секунды
            setTimeout(() => {
                indicator.classList.remove('show');
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
            achievement.innerHTML = `
                <div class="achievement-content">
                    <div class="achievement-icon">🏆</div>
                    <div class="achievement-text">${text}</div>
                </div>
            `;
            
            document.body.appendChild(achievement);
            
            setTimeout(() => {
                achievement.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                achievement.classList.remove('show');
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
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = this.getRandomColor();
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
            
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
        
        // Обновление дисплея статистики
        updateStatsDisplay: function() {
            const totalElement = document.getElementById('total-quizzes-stat');
            const currentStreakElement = document.getElementById('current-streak-stat');
            const bestStreakElement = document.getElementById('best-streak-stat');
            
            if (totalElement) {
                totalElement.textContent = this.stats.totalQuizzes;
            }
            if (currentStreakElement) {
                currentStreakElement.textContent = this.stats.currentStreak + '🔥';
            }
            if (bestStreakElement) {
                bestStreakElement.textContent = this.stats.bestStreak + '⭐';
            }
            
            console.log('📊 Статистика обновлена в интерфейсе');
        },
        
        // Добавление мотивационных сообщений к результатам
        addMotivationalMessage: function(percentage) {
            let message = '';
            let icon = '';
            
            if (percentage === 100) {
                message = 'Невероятно! Идеальный результат! Вы настоящий профессионал!';
                icon = '🏆';
            } else if (percentage >= 90) {
                message = 'Превосходно! Вы демонстрируете глубокие знания медицины!';
                icon = '🌟';
            } else if (percentage >= 80) {
                message = 'Отличная работа! Вы на правильном пути к мастерству!';
                icon = '👏';
            } else if (percentage >= 70) {
                message = 'Хороший результат! Продолжайте изучать - успех близко!';
                icon = '💪';
            } else if (percentage >= 50) {
                message = 'Неплохо для начала! Практика приведет к совершенству!';
                icon = '📚';
            } else {
                message = 'Каждый эксперт когда-то был новичком. Не сдавайтесь!';
                icon = '🚀';
            }
            
            return { message, icon };
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
                this.updateStatsDisplay();
                console.log('📊 Статистика сброшена');
            }
        }
    };
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.Gamification.init();
        }, 500);
    });
    
    // Добавляем функцию для интеграции с основным приложением
    window.triggerQuizCompleted = function(score, total, percentage) {
        const event = new CustomEvent('quizCompleted', {
            detail: { score, total, percentage }
        });
        document.dispatchEvent(event);
        
        // Также напрямую уведомляем геймификацию
        if (window.Gamification && window.Gamification.initialized) {
            window.Gamification.onQuizComplete({ score, total, percentage });
        }
    };
    
})();
