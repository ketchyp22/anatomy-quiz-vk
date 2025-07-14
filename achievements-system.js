// achievements-system.js - Основная система достижений для MedQuiz Pro
(function() {
    'use strict';
    
    console.log('🏆 Загружается система достижений MedQuiz Pro...');
    
    // Конфигурация системы
    const CONFIG = {
        STORAGE_KEY: 'medquiz_achievements',
        ANIMATION_DURATION: 4000,
        AUTO_SAVE: true
    };
    
    // Данные достижений (адаптированные из вашего файла)
    const ACHIEVEMENTS_DATA = [
        {
            id: 'first_steps',
            title: 'Первые шаги',
            description: 'Пройдите свой первый медицинский квиз',
            icon: '👨‍⚕️',
            rarity: 'common',
            points: 50,
            unlocked: false,
            progress: 0,
            category: 'basic',
            reward: 'Дополнительная подсказка'
        },
        {
            id: 'perfectionist',
            title: 'Перфекционист',
            description: 'Ответьте правильно на все 100% вопросов в любом режиме',
            icon: '💎',
            rarity: 'epic',
            points: 500,
            unlocked: false,
            progress: 0,
            category: 'skill',
            reward: '5 дополнительных подсказок'
        },
        {
            id: 'speed_demon',
            title: 'Скоростной демон',
            description: 'Пройдите квиз менее чем за 90 секунд с результатом 80%+',
            icon: '⚡',
            rarity: 'rare',
            points: 300,
            unlocked: false,
            progress: 0,
            category: 'speed',
            reward: 'Особая анимация'
        },
        {
            id: 'anatomy_master',
            title: 'Мастер анатомии',
            description: 'Пройдите 10 квизов по анатомии с результатом 85%+',
            icon: '🫀',
            rarity: 'rare',
            points: 400,
            unlocked: false,
            progress: 0,
            category: 'medical',
            reward: 'Титул "Анатом"'
        },
        {
            id: 'clinical_genius',
            title: 'Клинический гений',
            description: 'Достигните 95% в режиме клинического мышления',
            icon: '🧠',
            rarity: 'epic',
            points: 600,
            unlocked: false,
            progress: 73,
            category: 'medical',
            reward: 'Эксклюзивный значок'
        },
        {
            id: 'lifesaver',
            title: 'Спаситель жизней',
            description: 'Идеальный результат в 5 квизах по первой помощи',
            icon: '🚑',
            rarity: 'epic',
            points: 750,
            unlocked: false,
            progress: 60,
            category: 'medical',
            reward: 'Премиум тема'
        },
        {
            id: 'pharmacist',
            title: 'Великий фармацевт',
            description: 'Изучите все лекарственные препараты (50 квизов по фармакологии)',
            icon: '💊',
            rarity: 'legendary',
            points: 1000,
            unlocked: false,
            progress: 34,
            category: 'medical',
            reward: 'Легендарная рамка профиля'
        },
        {
            id: 'expert_legend',
            title: 'Легенда экспертов',
            description: 'Пройдите экспертный режим с результатом 98%+',
            icon: '👑',
            rarity: 'legendary',
            points: 1500,
            unlocked: false,
            progress: 0,
            category: 'expert',
            reward: 'Легендарный титул'
        },
        {
            id: 'medical_professor',
            title: 'Профессор медицины',
            description: 'Получите 90%+ во всех 6 режимах',
            icon: '🎓',
            rarity: 'mythic',
            points: 2000,
            unlocked: false,
            progress: 67,
            category: 'ultimate',
            reward: 'Мифический статус'
        },
        {
            id: 'quiz_marathon',
            title: 'Марафонец знаний',
            description: 'Пройдите 100 квизов подряд',
            icon: '🏃‍♂️',
            rarity: 'rare',
            points: 350,
            unlocked: false,
            progress: 45,
            category: 'endurance',
            reward: 'Значок выносливости'
        },
        {
            id: 'streak_master',
            title: 'Мастер серий',
            description: 'Достигните серии из 20 правильных ответов подряд',
            icon: '🔥',
            rarity: 'epic',
            points: 500,
            unlocked: false,
            progress: 0,
            category: 'skill',
            reward: 'Пламенная анимация'
        },
        {
            id: 'night_owl',
            title: 'Полуночник',
            description: 'Пройдите 10 квизов между 23:00 и 5:00',
            icon: '🦉',
            rarity: 'common',
            points: 150,
            unlocked: false,
            progress: 30,
            category: 'special',
            reward: 'Ночная тема'
        }
    ];
    
    // Основной класс системы достижений
    window.AchievementsSystem = {
        achievements: [],
        userStats: {
            totalAchievements: 0,
            completionRate: 0,
            rarestBadge: 'common',
            totalPoints: 0,
            totalQuizzes: 0,
            correctAnswers: 0
        },
        isInitialized: false,
        
        // Инициализация системы
        init: function() {
            if (this.isInitialized) {
                console.log('⚠️ Система достижений уже инициализирована');
                return;
            }
            
            console.log('🚀 Инициализация системы достижений');
            
            this.loadAchievements();
            this.calculateStats();
            this.isInitialized = true;
            
            console.log('✅ Система достижений готова');
            console.log(`📊 Статистика: ${this.userStats.totalAchievements} достижений разблокировано`);
        },
        
        // Загрузка достижений из localStorage
        loadAchievements: function() {
            try {
                const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    this.achievements = this.mergeAchievements(ACHIEVEMENTS_DATA, parsed);
                } else {
                    this.achievements = [...ACHIEVEMENTS_DATA];
                }
                console.log('📦 Достижения загружены');
            } catch (error) {
                console.error('❌ Ошибка загрузки достижений:', error);
                this.achievements = [...ACHIEVEMENTS_DATA];
            }
        },
        
        // Объединение базовых данных с сохраненными
        mergeAchievements: function(baseData, savedData) {
            return baseData.map(achievement => {
                const saved = savedData.find(s => s.id === achievement.id);
                if (saved) {
                    return { ...achievement, ...saved };
                }
                return achievement;
            });
        },
        
        // Сохранение достижений
        saveAchievements: function() {
            if (!CONFIG.AUTO_SAVE) return;
            
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.achievements));
                console.log('💾 Достижения сохранены');
            } catch (error) {
                console.error('❌ Ошибка сохранения достижений:', error);
            }
        },
        
        // Пересчет статистики
        calculateStats: function() {
            const unlockedAchievements = this.achievements.filter(a => a.unlocked);
            const totalCount = this.achievements.length;
            
            this.userStats.totalAchievements = unlockedAchievements.length;
            this.userStats.completionRate = Math.round((unlockedAchievements.length / totalCount) * 100);
            this.userStats.totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
            
            // Находим редчайший разблокированный значок
            const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
            const rarestUnlocked = unlockedAchievements.reduce((rarest, current) => {
                return rarityOrder[current.rarity] > rarityOrder[rarest.rarity] ? current : rarest;
            }, { rarity: 'common' });
            
            this.userStats.rarestBadge = this.getRarityName(rarestUnlocked.rarity);
        },
        
        // Разблокировка достижения
        unlockAchievement: function(achievementId) {
            const achievement = this.achievements.find(a => a.id === achievementId);
            
            if (!achievement) {
                console.error(`❌ Достижение ${achievementId} не найдено`);
                return false;
            }
            
            if (achievement.unlocked) {
                console.log(`⚠️ Достижение ${achievement.title} уже разблокировано`);
                return false;
            }
            
            // Разблокируем достижение
            achievement.unlocked = true;
            achievement.progress = 100;
            
            // Пересчитываем статистику
            this.calculateStats();
            
            // Сохраняем
            this.saveAchievements();
            
            // Показываем анимацию
            this.showAchievementUnlocked(achievement);
            
            console.log(`🏆 Достижение разблокировано: ${achievement.title}`);
            return true;
        },
        
        // Обновление прогресса достижения
        updateProgress: function(achievementId, progress) {
            const achievement = this.achievements.find(a => a.id === achievementId);
            
            if (!achievement || achievement.unlocked) {
                return false;
            }
            
            achievement.progress = Math.min(100, Math.max(0, progress));
            
            // Автоматически разблокируем при 100%
            if (achievement.progress >= 100) {
                this.unlockAchievement(achievementId);
            } else {
                this.saveAchievements();
            }
            
            return true;
        },
        
        // Показ экрана достижений
        showAchievements: function() {
            this.removeExistingModal();
            this.createAchievementsModal();
        },
        
        // Создание модального окна достижений
        createAchievementsModal: function() {
            const modal = document.createElement('div');
            modal.id = 'achievements-modal';
            modal.className = 'achievements-modal';
            modal.innerHTML = this.generateModalHTML();
            
            document.body.appendChild(modal);
            
            // Показываем с анимацией
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Настраиваем обработчики
            this.setupModalHandlers(modal);
        },
        
        // Генерация HTML для модального окна
        generateModalHTML: function() {
            const stats = this.userStats;
            const achievements = this.achievements;
            
            return `
                <div class="achievements-container">
                    <!-- Заголовок -->
                    <div class="achievements-header">
                        <h1 class="achievements-title">🏆 Достижения</h1>
                        <button class="achievements-close">✕</button>
                    </div>
                    
                    <!-- Статистика пользователя -->
                    <div class="user-stats">
                        <h2>Ваш прогресс</h2>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value">${stats.totalAchievements}/${achievements.length}</div>
                                <div class="stat-label">Получено достижений</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${stats.completionRate}%</div>
                                <div class="stat-label">Завершено</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${stats.rarestBadge}</div>
                                <div class="stat-label">Редчайший значок</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${stats.totalPoints.toLocaleString()}</div>
                                <div class="stat-label">Очки достижений</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Фильтры -->
                    <div class="achievements-filters">
                        <button class="filter-btn active" data-filter="all">Все достижения</button>
                        <button class="filter-btn" data-filter="unlocked">Получены</button>
                        <button class="filter-btn" data-filter="locked">Заблокированы</button>
                        <button class="filter-btn" data-filter="rare">Редкие</button>
                        <button class="filter-btn" data-filter="medical">Медицинские</button>
                    </div>
                    
                    <!-- Сетка достижений -->
                    <div class="achievements-grid">
                        ${achievements.map(achievement => this.generateAchievementCard(achievement)).join('')}
                    </div>
                    
                    <!-- Кнопки действий -->
                    <div class="achievement-actions">
                        <button class="action-btn" onclick="window.AchievementsSystem.shareAchievements()">
                            📤 Поделиться достижениями
                        </button>
                        <button class="action-btn secondary" onclick="window.AchievementsSystem.exportProgress()">
                            💾 Экспорт прогресса
                        </button>
                    </div>
                </div>
            `;
        },
        
        // Генерация карточки достижения
        generateAchievementCard: function(achievement) {
            const progressStyle = achievement.unlocked ? '--progress: 100%' : `--progress: ${achievement.progress}%`;
            const lockedClass = achievement.unlocked ? 'unlocked' : 'locked';
            
            return `
                <div class="achievement-card rarity-${achievement.rarity} ${lockedClass}" 
                     onclick="window.AchievementsSystem.showAchievementDetails('${achievement.id}')">
                    <div class="achievement-progress" style="${progressStyle}">
                        ${achievement.unlocked ? '✓' : achievement.progress + '%'}
                    </div>
                    <div class="achievement-icon rarity-${achievement.rarity}">
                        ${achievement.icon}
                    </div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-rarity rarity-${achievement.rarity}">
                        ${this.getRarityName(achievement.rarity)} • ${achievement.points} очков
                    </div>
                </div>
            `;
        },
        
        // Настройка обработчиков модального окна
        setupModalHandlers: function(modal) {
            // Закрытие модального окна
            const closeBtn = modal.querySelector('.achievements-close');
            closeBtn.addEventListener('click', () => this.closeModal(modal));
            
            // Закрытие по клику на фон
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
            
            // Фильтры
            const filterButtons = modal.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterAchievements(btn.dataset.filter);
                });
            });
            
            // ESC для закрытия
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('show')) {
                    this.closeModal(modal);
                }
            });
        },
        
        // Фильтрация достижений
        filterAchievements: function(filter) {
            const cards = document.querySelectorAll('.achievement-card');
            
            cards.forEach(card => {
                const achievement = this.achievements.find(a => 
                    card.onclick.toString().includes(a.id)
                );
                
                let show = true;
                
                switch(filter) {
                    case 'unlocked':
                        show = achievement.unlocked;
                        break;
                    case 'locked':
                        show = !achievement.unlocked;
                        break;
                    case 'rare':
                        show = ['epic', 'legendary', 'mythic'].includes(achievement.rarity);
                        break;
                    case 'medical':
                        show = achievement.category === 'medical';
                        break;
                    default:
                        show = true;
                }
                
                card.style.display = show ? 'block' : 'none';
            });
        },
        
        // Показ деталей достижения
        showAchievementDetails: function(achievementId) {
            const achievement = this.achievements.find(a => a.id === achievementId);
            if (!achievement) return;
            
            // Создаем модальное окно деталей
            this.createDetailsModal(achievement);
        },
        
        // Создание модального окна деталей
        createDetailsModal: function(achievement) {
            const existingDetails = document.querySelector('.achievement-details-modal');
            if (existingDetails) existingDetails.remove();
            
            const modal = document.createElement('div');
            modal.className = 'achievement-details-modal';
            modal.innerHTML = `
                <div class="details-content">
                    <div class="achievement-icon rarity-${achievement.rarity}" style="margin: 0 auto 20px;">
                        ${achievement.icon}
                    </div>
                    <h3>${achievement.title}</h3>
                    <p style="margin: 16px 0; opacity: 0.8;">${achievement.description}</p>
                    <div class="achievement-rarity rarity-${achievement.rarity}" style="margin: 16px auto;">
                        ${this.getRarityName(achievement.rarity)} • ${achievement.points} очков
                    </div>
                    <div style="margin: 20px 0; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px;">
                        ${achievement.unlocked ? 
                            `🎁 Награда получена: ${achievement.reward}` : 
                            `🔒 Награда за получение: ${achievement.reward}`
                        }
                    </div>
                    <button onclick="this.closest('.achievement-details-modal').remove()" 
                            style="margin-top: 20px; padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 12px; cursor: pointer;">
                        Закрыть
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        },
        
        // Показ анимации разблокированного достижения
        showAchievementUnlocked: function(achievement) {
            this.removeExistingUnlockModal();
            
            const modal = document.createElement('div');
            modal.className = 'achievement-unlock-modal';
            modal.innerHTML = `
                <div class="unlock-content">
                    <div style="font-size: 64px; margin-bottom: 20px; animation: bounceIn 1s ease-out;">🎉</div>
                    <h2 style="color: #ffd700; margin-bottom: 12px; font-size: 24px;">Достижение получено!</h2>
                    <div class="achievement-icon rarity-${achievement.rarity}" style="margin: 20px auto;">
                        ${achievement.icon}
                    </div>
                    <h3 style="margin-bottom: 8px; font-size: 20px;">${achievement.title}</h3>
                    <p style="opacity: 0.8; margin-bottom: 16px;">${achievement.description}</p>
                    <div class="achievement-rarity rarity-${achievement.rarity}">
                        ${this.getRarityName(achievement.rarity)} • +${achievement.points} очков
                    </div>
                    <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px;">
                        🎁 ${achievement.reward}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Автоматическое закрытие
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), 500);
                }
            }, CONFIG.ANIMATION_DURATION);
            
            // Показываем конфетти
            this.showConfetti();
        },
        
        // Анимация конфетти
        showConfetti: function() {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    this.createConfettiPiece();
                }, i * 50);
            }
        },
        
        // Создание частицы конфетти
        createConfettiPiece: function() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7'];
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                z-index: 9999;
                animation: confetti-fall ${Math.random() * 2 + 3}s linear forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        },
        
        // Поделиться достижениями
        shareAchievements: function() {
            const stats = this.userStats;
            const shareText = `🏆 Мои достижения в MedQuiz Pro:
✅ Получено: ${stats.totalAchievements}/${this.achievements.length} достижений
📊 Завершено: ${stats.completionRate}%
⭐ Очков: ${stats.totalPoints.toLocaleString()}
🎯 Проверь свои медицинские знания!`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Мои достижения в MedQuiz Pro',
                    text: shareText
                });
            } else {
                this.copyToClipboard(shareText);
                this.showNotification('Текст скопирован в буфер обмена!');
            }
        },
        
        // Экспорт прогресса
        exportProgress: function() {
            const data = {
                exportDate: new Date().toISOString(),
                achievements: this.achievements.map(a => ({
                    id: a.id,
                    title: a.title,
                    unlocked: a.unlocked,
                    progress: a.progress,
                    points: a.unlocked ? a.points : 0
                })),
                summary: this.userStats
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `medquiz_achievements_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showNotification('Прогресс экспортирован!');
        },
        
        // Вспомогательные методы
        getRarityName: function(rarity) {
            const names = {
                common: 'Обычное',
                rare: 'Редкое',
                epic: 'Эпическое',
                legendary: 'Легендарное',
                mythic: 'Мифическое'
            };
            return names[rarity] || 'Неизвестное';
        },
        
        copyToClipboard: function(text) {
            navigator.clipboard.writeText(text).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            });
        },
        
        showNotification: function(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },
        
        closeModal: function(modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        },
        
        removeExistingModal: function() {
            const existing = document.querySelector('#achievements-modal');
            if (existing) existing.remove();
        },
        
        removeExistingUnlockModal: function() {
            const existing = document.querySelector('.achievement-unlock-modal');
            if (existing) existing.remove();
        },
        
        // API методы
        getAchievementsList: function() {
            return [...this.achievements];
        },
        
        getUserStats: function() {
            return { ...this.userStats };
        },
        
        updateStats: function(newStats) {
            Object.assign(this.userStats, newStats);
            this.calculateStats();
            this.saveAchievements();
        },
        
        incrementCorrectAnswers: function() {
            this.userStats.correctAnswers++;
        },
        
        resetAchievements: function() {
            this.achievements = ACHIEVEMENTS_DATA.map(a => ({...a, unlocked: false, progress: 0}));
            this.calculateStats();
            this.saveAchievements();
        }
    };
    
    console.log('✅ Система достижений загружена');
})();
