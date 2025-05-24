// gamification.js - Модуль геймификации (не нарушает основной код)
(function() {
    'use strict';
    
    // Проверяем, что основное приложение загружено
    if (typeof window.questions === 'undefined') {
        console.warn('Gamification module: основное приложение не загружено');
        return;
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
            totalPlayTime: 0
        },
        
        // Загрузка статистики из localStorage
        loadStats: function() {
            const saved = localStorage.getItem('medicalQuizStats');
            if (saved) {
                this.stats = {...this.stats, ...JSON.parse(saved)};
            }
        },
        
        // Сохранение статистики
        saveStats: function() {
            localStorage.setItem('medicalQuizStats', JSON.stringify(this.stats));
        },
        
        // Инициализация модуля
        init: function() {
            console.log('🎮 Модуль геймификации запущен');
            this.loadStats();
            this.addStatsDisplay();
            this.hookIntoQuizEvents();
            this.loadSounds();
        },
        
        // Добавление дисплея статистики
        addStatsDisplay: function() {
            const startScreen = document.getElementById('start-screen');
            if (!startScreen) return;
            
            const statsContainer = document.createElement('div');
            statsContainer.id = 'gamification-stats';
            statsContainer.className = 'gamification-stats';
            statsContainer.innerHTML = `
                <div class="stats-card">
                    <div class="stat-item">
                        <span class="stat-number">${this.stats.totalQuizzes}</span>
                        <span class="stat-label">Пройдено тестов</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.stats.currentStreak}🔥</span>
                        <span class="stat-label">Текущая серия</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.stats.bestStreak}⭐</span>
                        <span class="stat-label">Лучшая серия</span>
                    </div>
                </div>
            `;
            
            // Вставляем после информации о пользователе
            const userInfo = startScreen.querySelector('.user-info');
            if (userInfo) {
                userInfo.parentNode.insertBefore(statsContainer, userInfo.nextSibling);
            } else {
                startScreen.insertBefore(statsContainer, startScreen.firstChild);
            }
        },
        
        // Подключение к событиям квиза
        hookIntoQuizEvents: function() {
            // Отслеживаем правильные ответы
            this.interceptOptionClick();
            // Отслеживаем завершение квиза
            this.interceptQuizComplete();
        },
        
        // Перехват кликов по вариантам ответов
        interceptOptionClick: function() {
            const originalShowResults = window.showResults;
            const self = this;
            
            // Сохраняем ссылку на оригинальную функцию, если она существует
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('option') && e.target.classList.contains('correct')) {
                    self.onCorrectAnswer();
                } else if (e.target.classList.contains('option') && e.target.classList.contains('wrong')) {
                    self.onWrongAnswer();
                }
            });
        },
        
        // Перехват завершения квиза
        interceptQuizComplete: function() {
            // Создаем кастомное событие для завершения квиза
            document.addEventListener('quizCompleted', (e) => {
                this.onQuizComplete(e.detail);
            });
        },
        
        // Обработка правильного ответа
        onCorrectAnswer: function() {
            this.stats.correctAnswers++;
            this.stats.currentStreak++;
            
            if (this.stats.currentStreak > this.stats.bestStreak) {
                this.stats.bestStreak = this.stats.currentStreak;
                this.showAchievement(`Новый рекорд! ${this.stats.bestStreak} правильных ответов подряд! 🏆`);
            }
            
            this.playSound('correct');
            this.showStreakIndicator();
            this.saveStats();
        },
        
        // Обработка неправильного ответа
        onWrongAnswer: function() {
            this.stats.currentStreak = 0;
            this.playSound('wrong');
            this.saveStats();
        },
        
        // Обработка завершения квиза
        onQuizComplete: function(results) {
            this.stats.totalQuizzes++;
            
            const percentage = results.percentage || 0;
            
            // Показываем конфетти для отличных результатов
            if (percentage >= 90 && this.settings.confettiEnabled) {
                this.showConfetti();
            }
            
            // Проверяем достижения
            this.checkAchievements(results);
            this.updateStatsDisplay();
            this.saveStats();
        },
        
        // Показ индикатора серии
        showStreakIndicator: function() {
            if (this.stats.currentStreak < 3) return;
            
            const indicator = document.createElement('div');
            indicator.className = 'streak-indicator';
            indicator.innerHTML = `🔥 ${this.stats.currentStreak} подряд!`;
            
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                indicator.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                indicator.classList.remove('show');
                setTimeout(() => document.body.removeChild(indicator), 300);
            }, 2000);
        },
        
        // Показ достижений
        showAchievement: function(text) {
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
                setTimeout(() => document.body.removeChild(achievement), 500);
            }, 3000);
        },
        
        // Конфетти
        showConfetti: function() {
            for (let i = 0; i < 50; i++) {
                this.createConfettiPiece();
            }
        },
        
        createConfettiPiece: function() {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = this.getRandomColor();
            confetti.style.animationDelay = Math.random() * 3 + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        },
        
        getRandomColor: function() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        
        // Загрузка звуков
        loadSounds: function() {
            this.sounds = {
                correct: this.createBeep(800, 0.1),
                wrong: this.createBeep(300, 0.2),
                achievement: this.createBeep(1200, 0.3)
            };
        },
        
        // Создание звукового сигнала
        createBeep: function(frequency, duration) {
            return function() {
                if (!window.Gamification.settings.soundEnabled) return;
                
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            };
        },
        
        // Воспроизведение звука
        playSound: function(type) {
            if (this.sounds && this.sounds[type]) {
                try {
                    this.sounds[type]();
                } catch (e) {
                    console.log('Не удалось воспроизвести звук:', e);
                }
            }
        },
        
        // Проверка достижений
        checkAchievements: function(results) {
            const percentage = results.percentage || 0;
            const newAchievements = [];
            
            // Достижения по проценту правильных ответов
            if (percentage === 100 && !this.stats.achievements.includes('perfectionist')) {
                this.stats.achievements.push('perfectionist');
                newAchievements.push('Перфекционист: 100% правильных ответов! 🎯');
            }
            
            if (percentage >= 90 && !this.stats.achievements.includes('expert')) {
                this.stats.achievements.push('expert');
                newAchievements.push('Эксперт: 90%+ правильных ответов! 🧠');
            }
            
            // Достижения по количеству пройденных тестов
            if (this.stats.totalQuizzes >= 10 && !this.stats.achievements.includes('dedicated')) {
                this.stats.achievements.push('dedicated');
                newAchievements.push('Целеустремленный: 10 пройденных тестов! 💪');
            }
            
            if (this.stats.totalQuizzes >= 50 && !this.stats.achievements.includes('veteran')) {
                this.stats.achievements.push('veteran');
                newAchievements.push('Ветеран: 50 пройденных тестов! 🏅');
            }
            
            // Показываем новые достижения
            newAchievements.forEach((achievement, index) => {
                setTimeout(() => {
                    this.showAchievement(achievement);
                    this.playSound('achievement');
                }, index * 1000);
            });
        },
        
        // Обновление дисплея статистики
        updateStatsDisplay: function() {
            const statsContainer = document.getElementById('gamification-stats');
            if (statsContainer) {
                const numbers = statsContainer.querySelectorAll('.stat-number');
                if (numbers[0]) numbers[0].textContent = this.stats.totalQuizzes;
                if (numbers[1]) numbers[1].textContent = this.stats.currentStreak + '🔥';
                if (numbers[2]) numbers[2].textContent = this.stats.bestStreak + '⭐';
            }
        },
        
        // Добавление мотивационных сообщений к результатам
        addMotivationalMessage: function(percentage) {
            let message = '';
            let icon = '';
            
            if (percentage === 100) {
                message = 'Невероятно! Идеальный результат! Вы настоящий профессионал!';
                icon = '🏆';
            } else if (percentage >= 90) {
                message = 'Превосходно! Вы демонстрируете глубокие знания!';
                icon = '🌟';
            } else if (percentage >= 80) {
                message = 'Отличная работа! Вы на правильном пути!';
                icon = '👏';
            } else if (percentage >= 70) {
                message = 'Хороший результат! Продолжайте изучать!';
                icon = '💪';
            } else if (percentage >= 50) {
                message = 'Неплохо! Есть куда расти, не останавливайтесь!';
                icon = '📚';
            } else {
                message = 'Начало положено! Практика - путь к совершенству!';
                icon = '🚀';
            }
            
            return { message, icon };
        }
    };
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Небольшая задержка для того, чтобы основное приложение успело загрузиться
        setTimeout(() => {
            window.Gamification.init();
        }, 100);
    });
    
    // Добавляем функцию для интеграции с основным приложением
    window.triggerQuizCompleted = function(score, total, percentage) {
        const event = new CustomEvent('quizCompleted', {
            detail: { score, total, percentage }
        });
        document.dispatchEvent(event);
    };
    
})();
