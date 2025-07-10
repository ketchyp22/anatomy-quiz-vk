// ambulance-video-background.js - Многоисточниковая система видео фона
(function() {
    'use strict';
    
    console.log('🎬 Загружается продвинутая система медицинского видео фона...');

    // КОНФИГУРАЦИЯ ВИДЕО ИСТОЧНИКОВ
    const VIDEO_CONFIG = {
        // Основные видео с Pexels (в порядке приоритета)
        sources: [
            {
                id: 'medical_1',
                name: 'Медицинская лаборатория',
                url: 'https://videos.pexels.com/video-files/6687824/6687824-hd_1920_1080_25fps.mp4',
                fallback: 'https://videos.pexels.com/video-files/6687824/6687824-uhd_2560_1440_25fps.mp4'
            },
            {
                id: 'medical_2',
                name: 'Операционная',
                url: 'https://videos.pexels.com/video-files/6688264/6688264-hd_1920_1080_25fps.mp4',
                fallback: 'https://videos.pexels.com/video-files/6688264/6688264-uhd_2560_1440_25fps.mp4'
            },
            {
                id: 'medical_3',
                name: 'Медицинское оборудование',
                url: 'https://videos.pexels.com/video-files/6687713/6687713-hd_1920_1080_25fps.mp4',
                fallback: 'https://videos.pexels.com/video-files/6687713/6687713-uhd_2560_1440_25fps.mp4'
            },
            {
                id: 'medical_4',
                name: 'Хирургическая операция',
                url: 'https://videos.pexels.com/video-files/8944419/8944419-hd_1920_1080_25fps.mp4',
                fallback: 'https://videos.pexels.com/video-files/8944419/8944419-uhd_2560_1440_25fps.mp4'
            },
            {
                id: 'medical_5',
                name: 'Медицинская процедура',
                url: 'https://videos.pexels.com/video-files/8944400/8944400-hd_1920_1080_25fps.mp4',
                fallback: 'https://videos.pexels.com/video-files/8944400/8944400-uhd_2560_1440_25fps.mp4'
            }
        ],
        
        // Локальные файлы (высший приоритет если есть)
        localSources: [
            './ambulance-bg.mp4',
            './medical-bg.mp4',
            './hospital-bg.mp4'
        ],
        
        // Настройки
        randomSelection: true,  // Случайный выбор видео
        autoRetry: true,       // Автоматические повторы при ошибках
        maxRetries: 3,         // Максимум попыток загрузки
        retryDelay: 2000,      // Задержка между попытками (мс)
        fadeTransition: true,  // Плавные переходы между видео
        showNotifications: false // УБИРАЕМ УВЕДОМЛЕНИЯ НА ЭКРАНЕ
    };

    // Глобальные переменные системы
    let videoContainer = null;
    let currentVideo = null;
    let currentSourceIndex = 0;
    let retryCount = 0;
    let isInitialized = false;
    let availableSources = [];

    // Полная очистка предыдущих видео
    function clearAllVideos() {
        const selectors = [
            'video', 
            '[id*="video"]', 
            '[id*="background"]', 
            '[id*="medical"]', 
            '[id*="ambulance"]',
            '.video-container',
            '.video-background'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.tagName === 'VIDEO' || 
                    el.id.includes('video') || 
                    el.id.includes('background') || 
                    el.id.includes('medical') ||
                    el.id.includes('ambulance')) {
                    console.log('🗑️ Удаляем:', el.tagName, el.id || el.className);
                    el.remove();
                }
            });
        });
    }

    // Создание контейнера для видео
    function createVideoContainer() {
        clearAllVideos();

        videoContainer = document.createElement('div');
        videoContainer.id = 'medical-video-container';
        videoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -100;
            overflow: hidden;
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        `;

        document.body.insertBefore(videoContainer, document.body.firstChild);
        console.log('📦 Контейнер видео создан');
        return videoContainer;
    }

    // Подготовка списка источников
    function prepareVideoSources() {
        availableSources = [];
        
        // Добавляем локальные источники (высший приоритет)
        VIDEO_CONFIG.localSources.forEach(src => {
            availableSources.push({
                id: 'local_' + Date.now(),
                name: 'Локальное видео',
                url: src,
                type: 'local',
                priority: 1
            });
        });
        
        // Добавляем удаленные источники
        VIDEO_CONFIG.sources.forEach((src, index) => {
            availableSources.push({
                ...src,
                type: 'remote',
                priority: 2 + index
            });
        });
        
        // Перемешиваем если включена случайность
        if (VIDEO_CONFIG.randomSelection) {
            const remoteSources = availableSources.filter(s => s.type === 'remote');
            const localSources = availableSources.filter(s => s.type === 'local');
            
            // Перемешиваем только удаленные источники
            for (let i = remoteSources.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remoteSources[i], remoteSources[j]] = [remoteSources[j], remoteSources[i]];
            }
            
            availableSources = [...localSources, ...remoteSources];
        }
        
        console.log(`📝 Подготовлено ${availableSources.length} видео источников`);
        return availableSources;
    }

    // Создание видео элемента
    function createVideoElement(source) {
        const video = document.createElement('video');
        video.id = 'medical-background-video';
        video.src = source.url;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.crossOrigin = 'anonymous';
        
        video.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
            opacity: 0;
            transition: opacity ${VIDEO_CONFIG.fadeTransition ? '2s' : '0s'} ease-in-out;
            filter: blur(1px) brightness(0.5) contrast(1.1) saturate(0.9);
        `;

        return video;
    }

    // Обработчики событий видео
    function setupVideoHandlers(video, source) {
        video.addEventListener('loadeddata', function() {
            console.log(`✅ Видео загружено: ${source.name}`);
            this.style.opacity = '0.7';
            retryCount = 0; // Сбрасываем счетчик попыток при успехе
        });

        video.addEventListener('error', function(e) {
            console.error(`❌ Ошибка загрузки видео ${source.name}:`, e);
            handleVideoError(source);
        });

        video.addEventListener('canplaythrough', function() {
            console.log(`📺 Видео готово к воспроизведению: ${source.name}`);
            this.play().then(() => {
                console.log(`▶️ Воспроизведение началось: ${source.name}`);
            }).catch(err => {
                console.error('❌ Ошибка воспроизведения:', err);
                handleVideoError(source);
            });
        });

        video.addEventListener('loadstart', function() {
            console.log(`🔄 Начата загрузка: ${source.name}`);
        });

        video.addEventListener('stalled', function() {
            console.warn(`⏸️ Загрузка приостановлена: ${source.name}`);
            setTimeout(() => {
                if (this.readyState < 3) {
                    handleVideoError(source);
                }
            }, 10000); // Тайм-аут 10 секунд
        });
    }

    // Обработка ошибок видео
    function handleVideoError(failedSource) {
        console.warn(`⚠️ Ошибка с видео: ${failedSource.name}`);
        
        retryCount++;
        
        // Пробуем fallback версию если есть
        if (failedSource.fallback && retryCount <= VIDEO_CONFIG.maxRetries) {
            console.log(`🔄 Пробуем fallback для: ${failedSource.name}`);
            const fallbackSource = {
                ...failedSource,
                url: failedSource.fallback,
                name: failedSource.name + ' (Fallback)'
            };
            
            setTimeout(() => {
                loadVideo(fallbackSource);
            }, VIDEO_CONFIG.retryDelay);
            return;
        }
        
        // Переходим к следующему источнику
        currentSourceIndex++;
        retryCount = 0;
        
        if (currentSourceIndex < availableSources.length) {
            console.log(`➡️ Переключаемся на следующий источник...`);
            setTimeout(() => {
                loadVideo(availableSources[currentSourceIndex]);
            }, VIDEO_CONFIG.retryDelay);
        } else {
            console.error('❌ Все видео источники недоступны');
            showGradientBackground();
        }
    }

    // Показ градиентного фона при отсутствии видео
    function showGradientBackground() {
        console.log('🎨 Показываем градиентный фон вместо видео');
        
        if (videoContainer) {
            videoContainer.style.background = `
                linear-gradient(135deg, #667eea 0%, #764ba2 100%),
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(120, 219, 226, 0.3) 0%, transparent 50%)
            `;
            videoContainer.style.animation = 'gradientShift 15s ease infinite';
        }
    }

    // Загрузка конкретного видео
    function loadVideo(source) {
        if (!source || !videoContainer) {
            console.error('❌ Нет источника или контейнера для загрузки');
            return;
        }

        console.log(`🎬 Загружаем: ${source.name} (${source.url})`);

        // Удаляем предыдущее видео
        if (currentVideo) {
            currentVideo.style.opacity = '0';
            setTimeout(() => {
                if (currentVideo && currentVideo.parentNode) {
                    currentVideo.parentNode.removeChild(currentVideo);
                }
            }, 1000);
        }

        // Создаем новое видео
        currentVideo = createVideoElement(source);
        setupVideoHandlers(currentVideo, source);
        
        videoContainer.appendChild(currentVideo);
    }

    // Главная функция инициализации
    function initMedicalVideoBackground() {
        if (isInitialized) {
            console.log('⚠️ Видео фон уже инициализирован');
            return;
        }

        console.log('🚑 Инициализация медицинского видео фона...');
        
        createVideoContainer();
        prepareVideoSources();
        
        if (availableSources.length > 0) {
            currentSourceIndex = 0;
            loadVideo(availableSources[currentSourceIndex]);
        } else {
            console.error('❌ Нет доступных видео источников');
            showGradientBackground();
        }
        
        isInitialized = true;
        console.log('✅ Система медицинского видео инициализирована');
    }

    // Глобальные функции управления (БЕЗ УВЕДОМЛЕНИЙ)
    window.medicalVideoBackground = {
        // Информация о системе
        status: function() {
            const video = document.getElementById('medical-background-video');
            const container = document.getElementById('medical-video-container');
            
            const status = {
                initialized: isInitialized,
                container: !!container,
                video: !!video,
                playing: video && !video.paused,
                currentTime: video ? video.currentTime : 0,
                duration: video ? video.duration : 0,
                currentSource: availableSources[currentSourceIndex]?.name || 'None',
                totalSources: availableSources.length,
                retryCount: retryCount,
                readyState: video ? video.readyState : 0
            };
            
            console.table(status);
            return status;
        },
        
        // Перезапуск системы
        restart: function() {
            console.log('🔄 Перезапуск системы видео фона...');
            isInitialized = false;
            currentSourceIndex = 0;
            retryCount = 0;
            initMedicalVideoBackground();
        },
        
        // Переключение на следующее видео
        nextVideo: function() {
            if (availableSources.length === 0) {
                console.warn('⚠️ Нет доступных источников');
                return;
            }
            
            currentSourceIndex = (currentSourceIndex + 1) % availableSources.length;
            retryCount = 0;
            
            console.log(`➡️ Переключение на: ${availableSources[currentSourceIndex].name}`);
            loadVideo(availableSources[currentSourceIndex]);
        },
        
        // Случайное видео
        randomVideo: function() {
            if (availableSources.length === 0) {
                console.warn('⚠️ Нет доступных источников');
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * availableSources.length);
            currentSourceIndex = randomIndex;
            retryCount = 0;
            
            console.log(`🎲 Случайное видео: ${availableSources[currentSourceIndex].name}`);
            loadVideo(availableSources[currentSourceIndex]);
        },
        
        // Пауза/воспроизведение
        toggle: function() {
            const video = document.getElementById('medical-background-video');
            if (video) {
                if (video.paused) {
                    video.play().then(() => {
                        console.log('▶️ Воспроизведение возобновлено');
                    });
                } else {
                    video.pause();
                    console.log('⏸️ Воспроизведение приостановлено');
                }
            }
        },
        
        // Изменение настроек
        updateSettings: function(newSettings) {
            Object.assign(VIDEO_CONFIG, newSettings);
            console.log('⚙️ Настройки обновлены:', newSettings);
        },
        
        // Получение списка источников
        getSources: function() {
            return availableSources.map(source => ({
                name: source.name,
                type: source.type,
                priority: source.priority
            }));
        }
    };

    // Совместимость со старым API
    window.pexelsMedicalVideo = window.medicalVideoBackground;

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMedicalVideoBackground);
    } else {
        setTimeout(initMedicalVideoBackground, 100);
    }

    console.log('✅ Продвинутая система медицинского видео фона готова');
    console.log('🔧 Управление: window.medicalVideoBackground');

})();
