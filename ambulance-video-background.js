// ambulance-video-background.js - С ПРАВИЛЬНЫМИ ссылками Pexels
(function() {
    'use strict';
    
    console.log('🎬 Загружается система с правильными Pexels видео...');

    // ПРАВИЛЬНЫЕ ПРЯМЫЕ ССЫЛКИ НА PEXELS ВИДЕО
    const PEXELS_VIDEOS = [
        {
            id: 'medical_lab_6687824',
            name: 'Медицинская лаборатория',
            // Видео ID: 6687824 - https://www.pexels.com/ru-ru/video/6687824/
            urls: [
                'https://videos.pexels.com/video-files/6687824/6687824-hd_1920_1080_25fps.mp4',
                'https://videos.pexels.com/video-files/6687824/6687824-hd_1280_720_25fps.mp4',
                'https://videos.pexels.com/video-files/6687824/6687824-sd_960_540_25fps.mp4'
            ]
        },
        {
            id: 'surgery_6688264',
            name: 'Хирургическая операция',
            // Видео ID: 6688264 - https://www.pexels.com/ru-ru/video/6688264/
            urls: [
                'https://videos.pexels.com/video-files/6688264/6688264-hd_1920_1080_25fps.mp4',
                'https://videos.pexels.com/video-files/6688264/6688264-hd_1280_720_25fps.mp4',
                'https://videos.pexels.com/video-files/6688264/6688264-sd_960_540_25fps.mp4'
            ]
        },
        {
            id: 'medical_equipment_6687713',
            name: 'Медицинское оборудование',
            // Видео ID: 6687713 - https://www.pexels.com/ru-ru/video/6687713/
            urls: [
                'https://videos.pexels.com/video-files/6687713/6687713-hd_1920_1080_25fps.mp4',
                'https://videos.pexels.com/video-files/6687713/6687713-hd_1280_720_25fps.mp4',
                'https://videos.pexels.com/video-files/6687713/6687713-sd_960_540_25fps.mp4'
            ]
        },
        {
            id: 'hospital_procedure_8944419',
            name: 'Больничная процедура',
            // Видео ID: 8944419 - https://www.pexels.com/ru-ru/video/8944419/
            urls: [
                'https://videos.pexels.com/video-files/8944419/8944419-hd_1920_1080_25fps.mp4',
                'https://videos.pexels.com/video-files/8944419/8944419-hd_1280_720_25fps.mp4',
                'https://videos.pexels.com/video-files/8944419/8944419-sd_960_540_25fps.mp4'
            ]
        },
        {
            id: 'medical_treatment_8944400',
            name: 'Медицинское лечение',
            // Видео ID: 8944400 - https://www.pexels.com/ru-ru/video/8944400/
            urls: [
                'https://videos.pexels.com/video-files/8944400/8944400-hd_1920_1080_25fps.mp4',
                'https://videos.pexels.com/video-files/8944400/8944400-hd_1280_720_25fps.mp4',
                'https://videos.pexels.com/video-files/8944400/8944400-sd_960_540_25fps.mp4'
            ]
        }
    ];

    // Настройки системы
    const CONFIG = {
        randomSelection: true,      // Случайный выбор видео
        fallbackChain: true,       // Цепочка fallback при ошибках
        vkCompatibility: true,     // Совместимость с VK
        maxRetries: 2,             // Максимум попыток на видео
        retryDelay: 3000,          // Задержка между попытками
        showNotifications: false,   // БЕЗ уведомлений
        preferLowerQuality: false,  // Предпочитать низкое качество для VK
        timeoutMs: 10000           // Тайм-аут загрузки
    };

    let videoContainer = null;
    let currentVideo = null;
    let currentVideoIndex = 0;
    let currentQualityIndex = 0;
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
        
        // В VK предпочитаем более низкое качество
        if (isVKEnvironment) {
            CONFIG.preferLowerQuality = true;
            CONFIG.timeoutMs = 8000; // Сокращаем тайм-аут для VK
        }
        
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
            '[id*="pexels"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.tagName === 'VIDEO' || 
                    el.id.match(/(video|background|medical|ambulance|pexels)/i)) {
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
        videoContainer.id = 'pexels-medical-container';
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
        console.log('📦 Контейнер для Pexels видео создан');
    }

    // Получение оптимального качества для окружения
    function getOptimalQualityIndex(video) {
        if (CONFIG.preferLowerQuality || isVKEnvironment) {
            // Для VK начинаем с самого низкого качества
            return video.urls.length - 1;
        } else {
            // Для обычного браузера начинаем с HD
            return 0;
        }
    }

    // Создание видео элемента
    function createVideoElement(videoUrl, videoInfo) {
        console.log(`🎬 Создаем видео: ${videoInfo.name}`);
        console.log(`📍 URL: ${videoUrl}`);

        const video = document.createElement('video');
        video.id = 'pexels-medical-video';
        video.src = videoUrl;
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
            transition: opacity 2s ease-in-out;
            filter: blur(0.5px) brightness(0.6) contrast(1.1) saturate(0.9);
        `;

        return video;
    }

    // Настройка обработчиков событий
    function setupVideoHandlers(video, videoInfo, videoUrl) {
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
            console.error(`❌ Проблемный URL: ${videoUrl}`);
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
    }

    // Обработка ошибок загрузки
    function handleVideoError(videoInfo, errorType) {
        console.warn(`⚠️ Ошибка с видео: ${videoInfo.name} (${errorType})`);
        
        retryCount++;
        
        // Пробуем следующее качество того же видео
        if (currentQualityIndex < videoInfo.urls.length - 1) {
            currentQualityIndex++;
            console.log(`🔄 Пробуем более низкое качество: ${videoInfo.name}`);
            setTimeout(() => {
                loadCurrentVideo();
            }, CONFIG.retryDelay);
            return;
        }
        
        // Переходим к следующему видео
        if (currentVideoIndex < PEXELS_VIDEOS.length - 1) {
            currentVideoIndex++;
            currentQualityIndex = getOptimalQualityIndex(PEXELS_VIDEOS[currentVideoIndex]);
            retryCount = 0;
            
            console.log(`➡️ Переключаемся на следующее видео...`);
            setTimeout(() => {
                loadCurrentVideo();
            }, CONFIG.retryDelay);
            return;
        }
        
        // Все видео исчерпаны
        console.error('❌ Все Pexels видео недоступны');
        showFallbackBackground();
    }

    // Загрузка текущего видео
    function loadCurrentVideo() {
        if (currentVideoIndex >= PEXELS_VIDEOS.length) {
            console.error('❌ Индекс видео выходит за границы');
            showFallbackBackground();
            return;
        }

        const videoInfo = PEXELS_VIDEOS[currentVideoIndex];
        const videoUrl = videoInfo.urls[currentQualityIndex];
        
        if (!videoUrl) {
            console.error('❌ URL видео не найден');
            handleVideoError(videoInfo, 'no_url');
            return;
        }

        console.log(`🎬 Загружаем видео ${currentVideoIndex + 1}/${PEXELS_VIDEOS.length}: ${videoInfo.name}`);
        console.log(`🎯 Качество ${currentQualityIndex + 1}/${videoInfo.urls.length}: ${videoUrl}`);

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
        currentVideo = createVideoElement(videoUrl, videoInfo);
        setupVideoHandlers(currentVideo, videoInfo, videoUrl);
        
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
            for (let i = PEXELS_VIDEOS.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [PEXELS_VIDEOS[i], PEXELS_VIDEOS[j]] = [PEXELS_VIDEOS[j], PEXELS_VIDEOS[i]];
            }
            console.log('🎲 Видео перемешаны случайным образом');
        }
        
        currentVideoIndex = 0;
        currentQualityIndex = getOptimalQualityIndex(PEXELS_VIDEOS[0]);
    }

    // Главная функция инициализации
    function initPexelsVideoBackground() {
        if (isInitialized) {
            console.log('⚠️ Pexels видео фон уже инициализирован');
            return;
        }

        console.log('🚀 Инициализация Pexels медицинского видео фона...');
        console.log(`📊 Доступно ${PEXELS_VIDEOS.length} видео с Pexels`);
        
        detectVKEnvironment();
        createVideoContainer();
        prepareVideoList();
        loadCurrentVideo();
        
        isInitialized = true;
        console.log('✅ Pexels видео система готова');
    }

    // Глобальные функции управления
    window.pexelsMedicalVideo = {
        status: function() {
            const video = document.getElementById('pexels-medical-video');
            const container = document.getElementById('pexels-medical-container');
            
            const status = {
                initialized: isInitialized,
                isVKEnvironment: isVKEnvironment,
                container: !!container,
                video: !!video,
                playing: video && !video.paused,
                currentVideo: PEXELS_VIDEOS[currentVideoIndex]?.name || 'None',
                currentQuality: currentQualityIndex,
                currentURL: PEXELS_VIDEOS[currentVideoIndex]?.urls[currentQualityIndex] || 'None',
                retryCount: retryCount,
                readyState: video ? video.readyState : 0,
                totalVideos: PEXELS_VIDEOS.length
            };
            
            console.table(status);
            return status;
        },
        
        nextVideo: function() {
            if (currentVideoIndex < PEXELS_VIDEOS.length - 1) {
                currentVideoIndex++;
                currentQualityIndex = getOptimalQualityIndex(PEXELS_VIDEOS[currentVideoIndex]);
                retryCount = 0;
                loadCurrentVideo();
                console.log(`➡️ Переключено на следующее видео: ${PEXELS_VIDEOS[currentVideoIndex].name}`);
            } else {
                console.warn('⚠️ Это последнее видео в списке');
            }
        },
        
        randomVideo: function() {
            const randomIndex = Math.floor(Math.random() * PEXELS_VIDEOS.length);
            currentVideoIndex = randomIndex;
            currentQualityIndex = getOptimalQualityIndex(PEXELS_VIDEOS[currentVideoIndex]);
            retryCount = 0;
            loadCurrentVideo();
            console.log(`🎲 Случайное видео: ${PEXELS_VIDEOS[currentVideoIndex].name}`);
        },
        
        restart: function() {
            console.log('🔄 Перезапуск Pexels видео системы...');
            isInitialized = false;
            currentVideoIndex = 0;
            retryCount = 0;
            initPexelsVideoBackground();
        },
        
        toggle: function() {
            const video = document.getElementById('pexels-medical-video');
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
            return PEXELS_VIDEOS.map((video, index) => ({
                index: index,
                name: video.name,
                id: video.id,
                qualities: video.urls.length
            }));
        },
        
        testVideo: function(index) {
            if (index >= 0 && index < PEXELS_VIDEOS.length) {
                currentVideoIndex = index;
                currentQualityIndex = getOptimalQualityIndex(PEXELS_VIDEOS[index]);
                retryCount = 0;
                loadCurrentVideo();
                console.log(`🧪 Тестируем видео: ${PEXELS_VIDEOS[index].name}`);
            }
        }
    };

    // Совместимость со старыми именами
    window.medicalVideoBackground = window.pexelsMedicalVideo;

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPexelsVideoBackground);
    } else {
        setTimeout(initPexelsVideoBackground, 100);
    }

    console.log('✅ Система Pexels медицинских видео загружена');
    console.log('🔧 Управление: window.pexelsMedicalVideo');
    console.log('📋 Список видео: window.pexelsMedicalVideo.getVideoList()');

})();
