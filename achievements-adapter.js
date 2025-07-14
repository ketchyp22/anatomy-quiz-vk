// achievements-adapter.js - Связующее звено между MedQuiz Pro и системой достижений
(function() {
    'use strict';
    
    console.log('🏆 Загружается адаптер системы достижений...');
    
    // Ждем инициализации основного приложения
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initAchievementsAdapter, 1000);
    });
    
    function initAchievementsAdapter() {
        console.log('🔗 Инициализация адаптера достижений');
        
        // Проверяем доступность систем
        if (!window.AchievementsSystem) {
            console.error('❌ AchievementsSystem не найдена');
            return;
        }
        
        if (!window.Gamification) {
            console.warn('⚠️ Gamification не найдена - адаптер будет работать автономно');
        }
        
        // Инициализируем систему достижений
        window.AchievementsSystem.init();
        
        // Настраиваем интеграцию с геймификацией
        setupGamificationIntegration();
        
        // Настраиваем события квиза
        setupQuizEvents();
        
        // Добавляем кнопку достижений в интерфейс
        addAchievementsButton();
        
        console.log('✅ Адаптер достижений готов');
    }
    
    // Интеграция с системой геймификации
    function setupGamificationIntegration() {
        if (!window.Gamification) return;
        
        // Синхронизируем статистику
        const gamificationStats = window.Gamification.stats;
        const achievementsStats = window.AchievementsSystem.getUserStats();
        
        // Обновляем статистику достижений на основе геймификации
        if (gamificationStats.totalQuizzes > achievementsStats.totalQuizzes) {
            window.AchievementsSystem.updateStats({
                totalQuizzes: gamificationStats.totalQuizzes,
                correctAnswers: gamificationStats.correctAnswers || 0,
                bestStreak: gamificationStats.bestStreak || 0
            });
        }
        
        console.log('🔗 Интеграция с геймификацией настроена');
    }
    
    // Настройка событий квиза
    function setupQuizEvents() {
        // Событие начала квиза
        document.addEventListener('quizStarted', function(event) {
            console.log('🎮 Квиз начался - обновляем достижения');
            const { mode, difficulty } = event.detail;
            
            // Можем добавить логику для начала квиза
        });
        
        // Событие правильного ответа
        document.addEventListener('answerResult', function(event) {
            const { correct, selectedIndex, correctIndex } = event.detail;
            
            if (correct) {
                // Обновляем статистику правильных ответов
                window.AchievementsSystem.incrementCorrectAnswers();
                console.log('✅ Правильный ответ зафиксирован в достижениях');
            }
        });
        
        // Событие завершения квиза
        document.addEventListener('quizCompleted', function(event) {
            const { score, total, percentage, mode, difficulty } = event.detail;
            
            console.log('🏁 Квиз завершен - проверяем достижения');
            
            // Обновляем статистику
            window.AchievementsSystem.updateStats({
                totalQuizzes: window.AchievementsSystem.getUserStats().totalQuizzes + 1,
                correctAnswers: window.AchievementsSystem.getUserStats().correctAnswers + score
            });
            
            // Проверяем достижения
            checkQuizCompletionAchievements(score, total, percentage, mode, difficulty);
        });
        
        console.log('📡 События квиза настроены');
    }
    
    // Проверка достижений при завершении квиза
    function checkQuizCompletionAchievements(score, total, percentage, mode, difficulty) {
        const achievements = [];
        
        // Проверяем достижение "Первые шаги"
        if (window.AchievementsSystem.getUserStats().totalQuizzes === 1) {
            achievements.push('first_steps');
        }
        
        // Проверяем достижение "Перфекционист"
        if (percentage === 100) {
            achievements.push('perfectionist');
        }
        
        // Проверяем достижение "Мастер анатомии"
        if (mode === 'anatomy' && percentage >= 85) {
            const anatomyCount = getAnatomyQuizCount();
            if (anatomyCount >= 10) {
                achievements.push('anatomy_master');
            }
        }
        
        // Проверяем достижение "Спаситель жизней"
        if (mode === 'first_aid' && percentage === 100) {
            const firstAidPerfectCount = getFirstAidPerfectCount();
            if (firstAidPerfectCount >= 5) {
                achievements.push('lifesaver');
            }
        }
        
        // Проверяем достижение "Легенда экспертов"
        if (mode === 'expert' && percentage >= 98) {
            achievements.push('expert_legend');
        }
        
        // Разблокируем достижения
        achievements.forEach(id => {
            window.AchievementsSystem.unlockAchievement(id);
        });
        
        // Проверяем серийные достижения
        checkStreakAchievements();
        
        // Проверяем количественные достижения
        checkQuantityAchievements();
    }
    
    // Проверка серийных достижений
    function checkStreakAchievements() {
        const streak = window.Gamification ? window.Gamification.stats.currentStreak : 0;
        
        if (streak >= 20) {
            window.AchievementsSystem.unlockAchievement('streak_master');
        }
    }
    
    // Проверка количественных достижений
    function checkQuantityAchievements() {
        const stats = window.AchievementsSystem.getUserStats();
        
        // Марафонец знаний (100 квизов)
        if (stats.totalQuizzes >= 100) {
            window.AchievementsSystem.unlockAchievement('quiz_marathon');
        }
        
        // Профессор медицины (мастерство во всех режимах)
        if (checkAllModesMastery()) {
            window.AchievementsSystem.unlockAchievement('medical_professor');
        }
    }
    
    // Добавление кнопки достижений в интерфейс
    function addAchievementsButton() {
        // Проверяем, не добавлена ли кнопка уже
        if (document.querySelector('#achievements-button')) {
            return;
        }
        
        // Создаем кнопку
        const button = document.createElement('button');
        button.id = 'achievements-button';
        button.innerHTML = '🏆 Достижения';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #8b5a00;
            border: none;
            padding: 12px 20px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        // Добавляем эффекты наведения
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)';
        });
        
        // Обработчик клика
        button.addEventListener('click', function() {
            window.AchievementsSystem.showAchievements();
        });
        
        // Добавляем в DOM
        document.body.appendChild(button);
        
        console.log('🏆 Кнопка достижений добавлена');
    }
    
    // Вспомогательные функции для подсчета специальных достижений
    function getAnatomyQuizCount() {
        // В реальном приложении это должно браться из статистики
        // Пока возвращаем случайное число для демонстрации
        return Math.floor(Math.random() * 15) + 5;
    }
    
    function getFirstAidPerfectCount() {
        // В реальном приложении это должно браться из статистики
        return Math.floor(Math.random() * 8) + 2;
    }
    
    function checkAllModesMastery() {
        // Проверяем, есть ли 90%+ результаты во всех 6 режимах
        // В реальном приложении это должно браться из детальной статистики
        const stats = window.AchievementsSystem.getUserStats();
        return stats.totalQuizzes >= 30; // Упрощенная проверка
    }
    
    // API для внешнего использования
    window.AchievementsAdapter = {
        // Принудительная проверка достижений
        forceCheckAchievements: function() {
            checkQuantityAchievements();
            checkStreakAchievements();
            console.log('🔍 Принудительная проверка достижений выполнена');
        },
        
        // Разблокировка конкретного достижения
        unlockSpecific: function(achievementId) {
            window.AchievementsSystem.unlockAchievement(achievementId);
        },
        
        // Получение статистики
        getStats: function() {
            return window.AchievementsSystem.getUserStats();
        },
        
        // Демо-функция для разблокировки случайного достижения
        unlockRandom: function() {
            const lockedAchievements = window.AchievementsSystem.getAchievementsList()
                .filter(a => !a.unlocked);
            
            if (lockedAchievements.length > 0) {
                const random = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
                window.AchievementsSystem.unlockAchievement(random.id);
                console.log('🎲 Разблокировано случайное достижение:', random.title);
            } else {
                console.log('🏆 Все достижения уже разблокированы!');
            }
        },
        
        // Сброс всех достижений (для тестирования)
        resetAll: function() {
            if (confirm('Сбросить все достижения? Это действие нельзя отменить.')) {
                window.AchievementsSystem.resetAchievements();
                console.log('🔄 Все достижения сброшены');
            }
        }
    };
    
    console.log('✅ Адаптер достижений загружен');
    console.log('🔧 Доступные команды: window.AchievementsAdapter');
})();
