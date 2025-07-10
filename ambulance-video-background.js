// ambulance-video-background.js - Локальные видео файлы
(function() {
    'use strict';
    
    console.log('🎬 Загружается система локальных медицинских видео...');

    // ЛОКАЛЬНЫЕ ВИДЕО ФАЙЛЫ
    const LOCAL_VIDEOS = [
        {
            id: 'local_video_1',
            name: 'Медицинское видео 1',
            path: './video1.mp4'
        },
        {
            id: 'local_video_2',
            name: 'Медицинское видео 2',
            path: './video2.mp4'
        },
        {
            id: 'local_video_3',
            name: 'Медицинское видео 3',
            path: './video3.mp4'
        }
    ];

    // Настройки системы
    const CONFIG = {
        randomSelection: true,      // Случайный выбор видео
        fallbackChain: true,       // Цепочка fallback при ошибках
        vkCompatibility: true,     // Совместимость с VK
        maxRetries: 2,             // Максимум попыток на видео
        retryDelay: 2000,          // Задержка между попытками
        showNotifications: false,   // БЕЗ уведомлений
        timeoutMs: 8000            // Тайм-аут загрузки
    };

    let videoContainer = null;
    let currentVideo = null;
    let currentVideoIndex = 0;
    let retryCount = 0;
    let isInitialized = false;
    let isVKEnvironment = false;

    // Определение VK окружения
    function detectVKEnvironment() {
        const vkIndicators = [
            window.location.hostname.includes('vk.com'),
            window.location.hostname.includes('vk.me'),
            typeof window.vkBridge !== 'undefined',
            document.referrer.includes('vk.com'),
            navigator.userAgent.includes('VKApp'),
            window.parent !== window
        ];
        
        isVKEnvironment = vkIndicators.some(Boolean);
        console.log('🔍 VK окружение:', isVKEnvironment ? 'ОБНАРУЖЕНО' : 'НЕ ОБНАРУЖЕНО');
        
        return isVKEnvironment;
    }

    // Очистка существующих видео
    function clearExistingElements() {
        const selectors = [
            'video', 
            '[id*="video"]', 
            '[id*="background"]', 
            '[id*="medical"]',
            '[id*="ambulance"]',
            '[id*="local"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.tagName === 'VIDEO' || 
                    el.id.match(/(video|background|medical|ambulance|local)/i)) {
                    console.log('🗑️ Удаляем:', el.tagName, el.id || 'без ID');
                    el.remove();
                }
            });
        });
    }

    // Создание контейнера
    function createVideoContainer() {
        clearExistingElements();

        videoContainer = document.createElement('div');
        videoContainer.id = 'local-medical-container';
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
        console.log('📦 Контейнер для локальных видео создан');
    }

    // Создание видео элемента
    function createVideoElement(videoPath, videoInfo) {
        console.log(`🎬 Создаем видео: ${videoInfo.name}`);
        console.log(`📍 Путь: ${videoPath}`);

        const video = document.createElement('video');
        video.id = 'local-medical-video';
        video.src = videoPath;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        
        // Убираем crossOrigin для локальных файлов
        // video.crossOrigin = 'anonymous';
        
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
            transition: opacity 2s ease-in-out;
            filter: blur(0.5px) brightness(0.6) contrast(1.1) saturate(0.9);
        `;

        return video;
    }

    // Настройка обработчиков событий
    function setupVideoHandlers(video, videoInfo, videoPath) {
        const timeoutId = setTimeout(() => {
            console.warn(`⏰ Тайм-аут загрузки: ${videoInfo.name}`);
            handleVideoError(videoInfo, 'timeout');
        }, CONFIG.timeoutMs);

        video.addEventListener('loadeddata', function() {
            clearTimeout(timeoutId);
            console.log(`✅ Видео загружено: ${videoInfo.name}`);
            this.style.opacity = '0.8';
            retryCount = 0; // Сбрасываем счетчик при успехе
        });

        video.addEventListener('error', function(e) {
            clearTimeout(timeoutId);
            console.error(`❌ Ошибка загрузки ${videoInfo.name}:`, e);
            console.error(`❌ Проблемный путь: ${videoPath}`);
            console.error(`❌ Код ошибки:`, this.error ? this.error.code : 'неизвестен');
            handleVideoError(videoInfo, 'load_error');
        });

        video.addEventListener('canplaythrough', function() {
            console.log(`📺 Видео готово: ${videoInfo.name}`);
            this.play().then(() => {
                console.log(`▶️ Воспроизведение: ${videoInfo.name}`);
            }).catch(err => {
                console.error('❌ Ошибка воспроизведения:', err);
                handleVideoError(videoInfo, 'play_error');
            });
        });

        video.addEventListener('loadstart', function() {
            console.log(`🔄 Начата загрузка: ${videoInfo.name}`);
        });

        video.addEventListener('stalled', function() {
            console.warn(`⏸️ Загрузка застопорилась: ${videoInfo.name}`);
        });

        video.addEventListener('waiting', function() {
            console.warn(`⏳ Ожидание данных: ${videoInfo.name}`);
        });

        // Специальный обработчик для отслеживания прогресса загрузки
        video.addEventListener('progress', function() {
            if (this.buffered.length > 0) {
                const bufferedEnd = this.buffered.end(this.buffered.length - 1);
                const duration = this.duration;
                if (duration > 0) {
                    const percent = Math.round((bufferedEnd / duration) * 100);
                    console.log(`📊 Загружено ${videoInfo.name}: ${percent}%`);
                }
            }
        });
    }

    // Обработка ошибок загрузки
    function handleVideoError(videoInfo, errorType) {
        console.warn(`⚠️ Ошибка с видео: ${videoInfo.name} (${errorType})`);
        
        retryCount++;
        
        // Переходим к следующему видео
        if (currentVideoIndex < LOCAL_VIDEOS.length - 1) {
            currentVideoIndex++;
            retryCount = 0;
            
            console.log(`➡️ Переключаемся на следующее видео...`);
            setTimeout(() => {
                loadCurrentVideo();
            }, CONFIG.retryDelay);
            return;
        }
        
        // Все видео исчерпаны - пробуем снова с первого видео (если есть попытки)
        if (retryCount < CONFIG.maxRetries) {
            console.log(`🔄 Перезапуск с первого видео (попытка ${retryCount + 1})`);
            currentVideoIndex = 0;
            setTimeout(() => {
                loadCurrentVideo();
            }, CONFIG.retryDelay);
            return;
        }
        
        // Все попытки исчерпаны
        console.error('❌ Все локальные видео недоступны');
        showFallbackBackground();
    }

    // Загрузка текущего видео
    function loadCurrentVideo() {
        if (currentVideoIndex >= LOCAL_VIDEOS.length) {
            console.error('❌ Индекс видео выходит за границы');
            showFallbackBackground();
            return;
        }

        const videoInfo = LOCAL_VIDEOS[currentVideoIndex];
        const videoPath = videoInfo.path;
        
        console.log(`🎬 Загружаем видео ${currentVideoIndex + 1}/${LOCAL_VIDEOS.length}: ${videoInfo.name}`);
        console.log(`📍 Путь: ${videoPath}`);

        // Удаляем предыдущее видео
        if (currentVideo) {
            currentVideo.style.opacity = '0';
            setTimeout(() => {
                if (currentVideo && currentVideo.parentNode) {
                    currentVideo.remove();
                }
            }, 1000);
        }

        // Создаем новое видео
        currentVideo = createVideoElement(videoPath, videoInfo);
        setupVideoHandlers(currentVideo, videoInfo, videoPath);
        
        if (videoContainer) {
            videoContainer.appendChild(currentVideo);
        }
    }

    // Fallback фон при отсутствии видео
    function showFallbackBackground() {
        console.log('🎨 Показываем запасной градиентный фон');
        
        if (videoContainer) {
            videoContainer.style.background = `
                radial-gradient(circle at 25% 25%, rgba(79, 209, 197, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(118, 75, 162, 0.2) 0%, transparent 50%),
                linear-gradient(135deg, #1a202c 0%, #2d3748 100%)
            `;
            videoContainer.style.animation = 'backgroundPulse 8s ease-in-out infinite';
        }
        
        // Добавляем анимацию пульса
        if (!document.getElementById('fallback-pulse-styles')) {
            const style = document.createElement('style');
            style.id = 'fallback-pulse-styles';
            style.textContent = `
                @keyframes backgroundPulse {
                    0%, 100% { filter: brightness(0.8); }
                    50% { filter: brightness(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Подготовка видео массива
    function prepareVideoList() {
        if (CONFIG.randomSelection) {
            // Перемешиваем массив видео
            for (let i = LOCAL_VIDEOS.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [LOCAL_VIDEOS[i], LOCAL_VIDEOS[j]] = [LOCAL_VIDEOS[j], LOCAL_VIDEOS[i]];
            }
            console.log('🎲 Видео перемешаны случайным образом');
        }
        
        currentVideoIndex = 0;
    }

    // Главная функция инициализации
    function initLocalVideoBackground() {
        if (isInitialized) {
            console.log('⚠️ Локальная видео система уже инициализирована');
            return;
        }

        console.log('🚀 Инициализация локальной медицинской видео системы...');
        console.log(`📊 Доступно ${LOCAL_VIDEOS.length} локальных видео`);
        
        detectVKEnvironment();
        createVideoContainer();
        prepareVideoList();
        loadCurrentVideo();
        
        isInitialized = true;
        console.log('✅ Локальная видео система готова');
    }

    // Глобальные функции управления
    window.localMedicalVideo = {
        status: function() {
            const video = document.getElementById('local-medical-video');
            const container = document.getElementById('local-medical-container');
            
            const status = {
                initialized: isInitialized,
                isVKEnvironment: isVKEnvironment,
                container: !!container,
                video: !!video,
                playing: video && !video.paused,
                currentVideo: LOCAL_VIDEOS[currentVideoIndex]?.name || 'None',
                currentPath: LOCAL_VIDEOS[currentVideoIndex]?.path || 'None',
                retryCount: retryCount,
                readyState: video ? video.readyState : 0,
                totalVideos: LOCAL_VIDEOS.length,
                videoError: video && video.error ? video.error.code : null
            };
            
            console.table(status);
            return status;
        },
        
        nextVideo: function() {
            if (currentVideoIndex < LOCAL_VIDEOS.length - 1) {
                currentVideoIndex++;
                retryCount = 0;
                loadCurrentVideo();
                console.log(`➡️ Переключено на следующее видео: ${LOCAL_VIDEOS[currentVideoIndex].name}`);
            } else {
                console.warn('⚠️ Это последнее видео в списке');
            }
        },
        
        previousVideo: function() {
            if (currentVideoIndex > 0) {
                currentVideoIndex--;
                retryCount = 0;
                loadCurrentVideo();
                console.log(`⬅️ Переключено на предыдущее видео: ${LOCAL_VIDEOS[currentVideoIndex].name}`);
            } else {
                console.warn('⚠️ Это первое видео в списке');
            }
        },
        
        randomVideo: function() {
            const randomIndex = Math.floor(Math.random() * LOCAL_VIDEOS.length);
            currentVideoIndex = randomIndex;
            retryCount = 0;
            loadCurrentVideo();
            console.log(`🎲 Случайное видео: ${LOCAL_VIDEOS[currentVideoIndex].name}`);
        },
        
        restart: function() {
            console.log('🔄 Перезапуск локальной видео системы...');
            isInitialized = false;
            currentVideoIndex = 0;
            retryCount = 0;
            initLocalVideoBackground();
        },
        
        toggle: function() {
            const video = document.getElementById('local-medical-video');
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
        
        getVideoList: function() {
            return LOCAL_VIDEOS.map((video, index) => ({
                index: index,
                name: video.name,
                id: video.id,
                path: video.path
            }));
        },
        
        testVideo: function(index) {
            if (index >= 0 && index < LOCAL_VIDEOS.length) {
                currentVideoIndex = index;
                retryCount = 0;
                loadCurrentVideo();
                console.log(`🧪 Тестируем видео: ${LOCAL_VIDEOS[index].name}`);
            } else {
                console.error(`❌ Неверный индекс: ${index}. Доступно: 0-${LOCAL_VIDEOS.length - 1}`);
            }
        },
        
        checkVideoFiles: function() {
            console.log('🔍 Проверяем доступность видео файлов...');
            
            LOCAL_VIDEOS.forEach((video, index) => {
                const testVideo = document.createElement('video');
                testVideo.preload = 'metadata';
                
                testVideo.addEventListener('loadedmetadata', () => {
                    console.log(`✅ ${video.name} (${video.path}) - OK`);
                    testVideo.remove();
                });
                
                testVideo.addEventListener('error', (e) => {
                    console.error(`❌ ${video.name} (${video.path}) - ОШИБКА:`, e);
                    testVideo.remove();
                });
                
                testVideo.src = video.path;
            });
        }
    };

    // Совместимость со старыми именами
    window.medicalVideoBackground = window.localMedicalVideo;
    window.pexelsMedicalVideo = window.localMedicalVideo;

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLocalVideoBackground);
    } else {
        setTimeout(initLocalVideoBackground, 100);
    }

    console.log('✅ Система локальных медицинских видео загружена');
    console.log('🔧 Управление: window.localMedicalVideo');
    console.log('📋 Список видео: window.localMedicalVideo.getVideoList()');
    console.log('🧪 Проверка файлов: window.localMedicalVideo.checkVideoFiles()');

})();
