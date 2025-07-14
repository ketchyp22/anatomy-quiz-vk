// achievements-system.js - Полностью исправленная система достижений для MedQuiz Pro
(function() {
    'use strict';
    
    console.log('🏆 Загружается исправленная система достижений MedQuiz Pro...');
    
    // Конфигурация системы
    const CONFIG = {
        STORAGE_KEY: 'medquiz_achievements',
        ANIMATION_DURATION: 4000,
        AUTO_SAVE: true
    };
    
    // Данные достижений
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
                        <button class="action-btn" onclick="window.AchievementsSystem.shareAchievementsFixed()">
                            📤 Поделиться достижениями
                        </button>
                        <button class="action-btn secondary" onclick="window.AchievementsSystem.copyProgress()">
                            📋 Скопировать прогресс
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
        
        // ИСПРАВЛЕННАЯ функция поделиться достижениями (без скачивания файла)
        shareAchievementsFixed: function() {
            console.log('📤 Поделиться достижениями (исправленная версия)');
            
            const stats = this.userStats;
            const shareText = `🏆 Мои достижения в MedQuiz Pro:
✅ Получено: ${stats.totalAchievements}/${this.achievements.length} достижений
📊 Завершено: ${stats.completionRate}%
⭐ Очков: ${stats.totalPoints.toLocaleString()}
🎯 Проверь свои медицинские знания!`;

            // Создаем модальное окно для выбора способа шеринга
            this.showShareModal(shareText);
        },
        
        // Создание модального окна для шеринга
        showShareModal: function(shareText) {
            const existingModals = document.querySelectorAll('.achievements-share-modal');
            existingModals.forEach(modal => modal.remove());

            const modal = document.createElement('div');
            modal.className = 'achievements-share-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            const vkBridge = window.vkBridgeInstance || window.vkBridge;
            const hasVKBridge = !!vkBridge;

            const content = document.createElement('div');
            content.style.cssText = `
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 24px;
                padding: 32px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.3);
                transform: scale(0.9) translateY(-20px);
                transition: all 0.3s ease;
            `;

            const achievementEmoji = this.getAchievementEmoji(this.userStats.completionRate);

            content.innerHTML = `
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 56px; margin-bottom: 12px;">${achievementEmoji}</div>
                    <h3 style="margin: 0 0 8px 0; color: #1a202c; font-size: 24px; font-weight: 700;">
                        Поделиться достижениями
                    </h3>
                    <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); 
                               color: #8b5a00; padding: 12px 20px; border-radius: 16px; 
                               font-weight: 600; margin: 16px 0;">
                        ${this.userStats.totalAchievements}/${this.achievements.length} достижений (${this.userStats.completionRate}%)
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                    ${hasVKBridge ? `
                        <button id="share-vk-message" style="
                            padding: 14px 20px;
                            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                            color: white;
                            border: none;
                            border-radius: 16px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            💬 Отправить в VK
                        </button>
                        
                        <button id="share-vk-wall" style="
                            padding: 14px 20px;
                            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                            color: white;
                            border: none;
                            border-radius: 16px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            📝 На стену VK
                        </button>
                    ` : ''}
                    
                    <button id="share-copy-text" style="
                        padding: 14px 20px;
                        background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                        color: white;
                        border: none;
                        border-radius: 16px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        📋 Скопировать текст
                    </button>
                </div>
                
                <button id="share-close" style="
                    width: 100%;
                    padding: 12px;
                    background: #6b7280;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                ">
                    Закрыть
                </button>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            // Показываем модальное окно с анимацией
            setTimeout(() => {
                modal.style.opacity = '1';
                content.style.transform = 'scale(1) translateY(0)';
            }, 10);

            // Обработчики событий
            const closeModal = () => {
                modal.style.opacity = '0';
                content.style.transform = 'scale(0.9) translateY(-20px)';
                setTimeout(() => modal.remove(), 300);
            };

            // VK шеринг
            if (hasVKBridge) {
                content.querySelector('#share-vk-message').onclick = async () => {
                    closeModal();
                    await this.shareVKMessage(shareText, vkBridge);
                };
                
                content.querySelector('#share-vk-wall').onclick = async () => {
                    closeModal();
                    await this.shareVKWall(shareText, vkBridge);
                };
            }
            
            // Копирование текста
            content.querySelector('#share-copy-text').onclick = () => {
                closeModal();
                this.copyTextToClipboard(shareText);
            };
            
            // Закрытие модального окна
            content.querySelector('#share-close').onclick = closeModal;
            
            // Закрытие по клику на фон
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };
        },
        
        // Отправка сообщения в VK
        shareVKMessage: async function(text, bridge) {
            console.log('💬 Отправляем сообщение в VK');
            
            try {
                const result = await bridge.send('VKWebAppShare', {
                    text: text
                });
                
                console.log('✅ Сообщение отправлено:', result);
                this.showNotification('💬 Сообщение отправлено!');
                
            } catch (error) {
                console.error('❌ Ошибка отправки сообщения:', error);
                
                if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
                    this.showNotification('ℹ️ Отправка отменена');
                } else {
                    this.showNotification('❌ Не удалось отправить. Текст скопирован в буфер.');
                    setTimeout(() => this.copyTextToClipboard(text), 1000);
                }
            }
        },
        
        // Публикация на стене VK
        shareVKWall: async function(text, bridge) {
            console.log('📝 Публикуем на стене VK');
            
            try {
                const result = await bridge.send('VKWebAppShowWallPostBox', {
                    message: text
                });
                
                console.log('✅ Запись опубликована:', result);
                this.showNotification('📝 Запись опубликована на стене!');
                
            } catch (error) {
                console.error('❌ Ошибка публикации:', error);
                
                if (error.error_type === 'client_error' && error.error_data?.error_reason === 'User denied') {
                    this.showNotification('ℹ️ Публикация отменена');
                } else {
                    this.showNotification('❌ Не удалось опубликовать. Текст скопирован в буфер.');
                    setTimeout(() => this.copyTextToClipboard(text), 1000);
                }
            }
        },
        
        // Копирование текста в буфер обмена
        copyTextToClipboard: function(text) {
            console.log('📋 Копируем текст в буфер обмена');
            
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        this.showNotification('📋 Текст скопирован в буфер обмена!');
                    }).catch(() => {
                        this.fallbackCopyText(text);
                    });
                } else {
                    this.fallbackCopyText(text);
                }
            } catch (error) {
                console.error('Ошибка копирования:', error);
                this.fallbackCopyText(text);
            }
        },
        
        // Резервный способ копирования
        fallbackCopyText: function(text) {
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                textArea.style.top = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    this.showNotification('📋 Текст скопирован!');
                } else {
                    this.showCopyModal(text);
                }
            } catch (error) {
                console.error('Резервное копирование не удалось:', error);
                this.showCopyModal(text);
            }
        },
        
        // Показ модального окна для ручного копирования
        showCopyModal: function(text) {
            const modal = document.createElement('div');
            modal.className = 'copy-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20001;
            `;
            
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 420px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            `;
            
            dialog.innerHTML = `
                <h3 style="margin: 0 0 20px 0; color: #333; font-size: 22px;">📤 Скопировать достижения</h3>
                <p style="color: #666; margin-bottom: 18px; line-height: 1.5;">
                    Выделите и скопируйте текст:
                </p>
                <textarea readonly id="copy-textarea" style="
                    width: 100%; 
                    height: 140px; 
                    padding: 16px; 
                    border: 2px solid #e2e8f0; 
                    border-radius: 12px; 
                    font-size: 14px; 
                    resize: none; 
                    margin-bottom: 20px;
                    font-family: inherit;
                    line-height: 1.4;
                    background: #f8fafc;
                ">${text}</textarea>
                <div style="display: flex; gap: 12px;">
                    <button onclick="this.parentElement.parentElement.parentElement.querySelector('#copy-textarea').select(); document.execCommand('copy'); this.closest('.copy-modal').remove(); window.AchievementsSystem.showNotification('📋 Текст скопирован!');" style="
                        flex: 1;
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                        color: white; 
                        border: none; 
                        padding: 14px 20px; 
                        border-radius: 12px; 
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 15px;
                    ">📋 Скопировать</button>
                    <button onclick="this.closest('.copy-modal').remove();" style="
                        flex: 1;
                        background: #6b7280; 
                        color: white; 
                        border: none; 
                        padding: 14px 20px; 
                        border-radius: 12px; 
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 15px;
                    ">Закрыть</button>
                </div>
            `;
            
            modal.appendChild(dialog);
            document.body.appendChild(modal);
            
            // Автовыделение текста
            const textarea = dialog.querySelector('#copy-textarea');
            textarea.onclick = () => textarea.select();
            
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
        },
        
        // ИСПРАВЛЕННАЯ функция копирования прогресса (без скачивания файла)
        copyProgress: function() {
            console.log('📋 Копируем прогресс достижений в текстовом виде');
            
            const stats = this.userStats;
            const unlockedAchievements = this.achievements.filter(a => a.unlocked);
            
            let progressText = `🏆 Мой прогресс в MedQuiz Pro
📅 Дата: ${new Date().toLocaleDateString('ru-RU')}

📊 ОБЩАЯ СТАТИСТИКА:
✅ Получено достижений: ${stats.totalAchievements}/${this.achievements.length}
📈 Процент завершения: ${stats.completionRate}%
⭐ Общее количество очков: ${stats.totalPoints.toLocaleString()}
🏅 Редчайший значок: ${stats.rarestBadge}

🏆 РАЗБЛОКИРОВАННЫЕ ДОСТИЖЕНИЯ:
`;

            if (unlockedAchievements.length > 0) {
                unlockedAchievements.forEach(achievement => {
                    progressText += `${achievement.icon} ${achievement.title} (${achievement.points} очков)\n`;
                });
            } else {
                progressText += 'Пока нет разблокированных достижений\n';
            }
            
            progressText += `\n🔒 ЗАБЛОКИРОВАННЫЕ ДОСТИЖЕНИЯ:
`;
            
            const lockedAchievements = this.achievements.filter(a => !a.unlocked);
            lockedAchievements.forEach(achievement => {
                progressText += `${achievement.icon} ${achievement.title} (${achievement.progress}%)\n`;
            });
            
            progressText += `\n💪 Проверь свои медицинские знания в MedQuiz Pro!`;
            
            // Копируем в буфер обмена
            this.copyTextToClipboard(progressText);
        },
        
        // Получение эмодзи для достижения
        getAchievementEmoji: function(completionRate) {
            if (completionRate >= 90) return '🏆';
            if (completionRate >= 70) return '🌟';
            if (completionRate >= 50) return '🎉';
            if (completionRate >= 30) return '👏';
            if (completionRate >= 10) return '📚';
            return '🚀';
        },
        
        // Показ уведомлений
        showNotification: function(message) {
            // Удаляем существующие уведомления
            const existing = document.querySelectorAll('.achievements-notification');
            existing.forEach(notif => notif.remove());
            
            const notification = document.createElement('div');
            notification.className = 'achievements-notification';
            notification.style.cssText = `
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
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 400);
            }, 4000);
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
            if (confirm('Вы уверены, что хотите сбросить все достижения? Это действие нельзя отменить.')) {
                this.achievements = ACHIEVEMENTS_DATA.map(a => ({...a, unlocked: false, progress: 0}));
                this.calculateStats();
                this.saveAchievements();
                this.showNotification('🔄 Все достижения сброшены');
                console.log('🔄 Все достижения сброшены');
            }
        }
    };
    
    console.log('✅ Исправленная система достижений загружена (без скачиваний файлов)');
})();
