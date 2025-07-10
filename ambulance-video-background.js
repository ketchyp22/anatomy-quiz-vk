// ambulance-video-background-FIXED.js - Исправленная версия с реальными медицинскими видео
(function() {
    'use strict';
    
    console.log('🚑 Загружается ИСПРАВЛЕННЫЙ медицинский видео фон...');

    // ИСПРАВЛЕННЫЕ источники МЕДИЦИНСКИХ видео
    const MEDICAL_VIDEO_SOURCES = [
        // Реальные медицинские видео с надежных CDN
        'https://cdn.coverr.co/videos/coverr-medical-equipment-in-a-hospital-room-3838/1080p.mp4',
        'https://cdn.coverr.co/videos/coverr-hospital-corridor-with-medical-equipment-3839/1080p.mp4',
        'https://cdn.coverr.co/videos/coverr-doctor-examining-patient-with-stethoscope-4201/1080p.mp4',
        'https://cdn.coverr.co/videos/coverr-medical-consultation-room-4202/1080p.mp4',
        
        // Videvo медицинские видео
        'https://cdn.videvo.net/videvo_files/video/free/2019-11/large_watermarked/medical_190129_02_4k_uhd.mp4',
        'https://cdn.videvo.net/videvo_files/video/free/2019-11/large_watermarked/hospital_190129_01_4k_uhd.mp4',
        
        // Альтернативные медицинские источники
        'https://sample-videos.com/zip/10/mp4/720/BigBuckBunny_320x180_1mb.mp4', // Временный тест
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Тестовое видео
        
        // Медицинские видео с других источников
        'https://player.vimeo.com/external/194837908.sd.mp4?s=c350076905b78c67f74d7ee39fdb4fef01dd5676&profile_id=164',
        'https://assets.mixkit.co/videos/preview/mixkit-hospital-bed-in-intensive-care-4274-large.mp4'
    ];

    // Мобильные версии (более легкие)
    const MOBILE_VIDEO_SOURCES = [
        'https://cdn.coverr.co/videos/coverr-medical-equipment-in-a-hospital-room-3838/720p.mp4',
        'https://cdn.coverr.co/videos/coverr-hospital-corridor-with-medical-equipment-3839/720p.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-hospital-bed-in-intensive-care-4274-small.mp4'
    ];

    let currentVideoIndex = 0;
    let videoContainer = null;
    let videoElement = null;
    let isVideoEnabled = true;
    let failedSources = new Set();

    // Создание видео контейнера
    function createVideoContainer() {
        // Удаляем существующие контейнеры
        const existing = document.querySelectorAll('#medical-video-background, #ambulance-video-background, [id*="video-background"]');
        existing.forEach(el => el.remove());

        videoContainer = document.createElement('div');
        videoContainer.id = 'medical-video-background';
        videoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -100;
            overflow: hidden;
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #dc2626 100%);
        `;

        document.body.insertBefore(videoContainer, document.body.firstChild);
        console.log('🎬 Контейнер медицинского видео создан');
        return videoContainer;
    }

    // Создание видео элемента
    function createVideoElement() {
        videoElement = document.createElement('video');
        videoElement.id = 'medical-bg-video';
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.playsInline = true;
        videoElement.preload = 'metadata';
        videoElement.crossOrigin = 'anonymous';
        
        videoElement.style.cssText = `
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
            filter: blur(1px) brightness(0.6) contrast(1.2) saturate(0.9);
        `;

        return videoElement;
    }

    // Загрузка видео с улучшенной обработкой ошибок
    async function loadVideo(sourceUrl) {
        console.log('🔄 Загружаем медицинское видео:', sourceUrl);
        
        return new Promise((resolve, reject) => {
            const video = createVideoElement();
            
            const timeout = setTimeout(() => {
                cleanup();
                console.warn('⏰ Таймаут загрузки видео');
                reject(new Error('Video load timeout'));
            }, 15000); // Увеличиваем таймаут

            const cleanup = () => {
                clearTimeout(timeout);
                video.removeEventListener('loadeddata', onLoaded);
                video.removeEventListener('error', onError);
                video.removeEventListener('canplaythrough', onCanPlay);
                video.removeEventListener('loadstart', onLoadStart);
            };

            const onLoadStart = () => {
                console.log('📡 Начата загрузка видео:', sourceUrl);
            };

            const onLoaded = () => {
                console.log('✅ Медицинское видео загружено успешно:', sourceUrl);
                video.style.opacity = '0.8';
                cleanup();
                resolve(video);
            };

            const onError = (error) => {
                console.error('❌ Ошибка загрузки медицинского видео:', sourceUrl, error);
                cleanup();
                reject(error);
            };

            const onCanPlay = () => {
                console.log('▶️ Видео готово к воспроизведению');
                video.play()
                    .then(() => {
                        console.log('🎬 Медицинское видео запущено');
                        onLoaded();
                    })
                    .catch(error => {
                        console.error('❌ Ошибка воспроизведения:', error);
                        onError(error);
                    });
            };

            video.addEventListener('loadstart', onLoadStart);
            video.addEventListener('loadeddata', onLoaded);
            video.addEventListener('error', onError);
            video.addEventListener('canplaythrough', onCanPlay);
            
            // Добавляем дополнительные обработчики для диагностики
            video.addEventListener('progress', () => {
                if (video.buffered.length > 0) {
                    const percent = Math.round((video.buffered.end(0) / video.duration) * 100);
                    console.log(`📊 Загружено: ${percent}%`);
                }
            });
            
            video.src = sourceUrl;
            video.load();
        });
    }

    // Попытка загрузки медицинского видео
    async function tryLoadMedicalVideo() {
        const sources = isMobile() ? MOBILE_VIDEO_SOURCES : MEDICAL_VIDEO_SOURCES;
        console.log(`🎯 Попытка загрузки медицинского видео (${sources.length} источников)`);
        
        for (let i = 0; i < sources.length; i++) {
            const sourceUrl = sources[i];
            
            if (failedSources.has(sourceUrl)) {
                console.log(`⏭️ Пропускаем уже неудачный источник: ${sourceUrl}`);
                continue;
            }

            try {
                console.log(`🔄 Попытка ${i + 1}/${sources.length}: ${sourceUrl}`);
                const video = await loadVideo(sourceUrl);
                
                if (videoContainer && video) {
                    videoContainer.appendChild(video);
                    videoElement = video;
                    showSuccessNotification(`Медицинское видео загружено (${i + 1}/${sources.length})`);
                    return true;
                }
            } catch (error) {
                console.warn(`❌ Видео ${i + 1} не загрузилось:`, sourceUrl, error.message);
                failedSources.add(sourceUrl);
                
                // Показываем прогресс попыток
                if (i < sources.length - 1) {
                    console.log(`🔄 Переходим к следующему источнику...`);
                }
            }
        }

        console.error('❌ Все медицинские видео источники не удалось загрузить');
        return false;
    }

    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Уведомления
    function showSuccessNotification(text) {
        // Показываем только в dev режиме
        if (!window.location.href.includes('localhost') && !window.location.href.includes('github.io')) {
            return;
        }

        const notification = createNotification('✅ ' + text, '#10b981');
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    function showErrorNotification(text) {
        const notification = createNotification('❌ ' + text, '#ef4444');
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    function createNotification(text, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.textContent = text;
        document.body.appendChild(notification);
        
        return notification;
    }

    // Добавление стилей анимации
    function addAnimationStyles() {
        if (document.getElementById('medical-video-styles')) return;

        const style = document.createElement('style');
        style.id = 'medical-video-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes medicalVideoEffect {
                0%, 100% {
                    filter: blur(1px) brightness(0.6) contrast(1.2) saturate(0.9);
                }
                50% {
                    filter: blur(0.5px) brightness(0.7) contrast(1.3) saturate(1.1);
                }
            }
            
            #medical-bg-video {
                animation: medicalVideoEffect 20s ease-in-out infinite;
            }
            
            @media (max-width: 768px) {
                #medical-bg-video {
                    animation: none;
                    filter: blur(2px) brightness(0.5) contrast(1.1) saturate(0.8) !important;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                #medical-bg-video {
                    animation: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Основная функция инициализации
    async function initMedicalVideoBackground() {
        console.log('🚑 Инициализация медицинского видео фона...');
        
        addAnimationStyles();
        createVideoContainer();
        
        // Пытаемся загрузить медицинское видео
        const videoLoaded = await tryLoadMedicalVideo();
        
        if (!videoLoaded) {
            console.warn('⚠️ Не удалось загрузить медицинское видео, оставляем градиент');
            showErrorNotification('Медицинское видео недоступно');
        }
    }

    // Функции управления
    function toggleVideo() {
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play().then(() => {
                    console.log('▶️ Медицинское видео возобновлено');
                }).catch(console.warn);
            } else {
                videoElement.pause();
                console.log('⏸️ Медицинское видео приостановлено');
            }
        }
    }

    function changeVideoOpacity(opacity) {
        if (videoElement) {
            videoElement.style.opacity = Math.max(0, Math.min(1, opacity));
            console.log(`🎨 Прозрачность медицинского видео: ${opacity}`);
        }
    }

    function switchToNextVideo() {
        console.log('🔄 Переключение на следующее медицинское видео...');
        if (videoContainer) {
            videoContainer.innerHTML = '';
            videoElement = null;
            setTimeout(() => {
                tryLoadMedicalVideo();
            }, 500);
        }
    }

    function diagnosticInfo() {
        const info = {
            container: !!videoContainer,
            video: !!videoElement,
            playing: videoElement && !videoElement.paused,
            src: videoElement?.src || 'none',
            failed: Array.from(failedSources),
            mobile: isMobile()
        };
        console.table(info);
        return info;
    }

    // Глобальные функции управления
    window.medicalVideoBackground = {
        toggle: toggleVideo,
        setOpacity: changeVideoOpacity,
        switchVideo: switchToNextVideo,
        reinit: initMedicalVideoBackground,
        diagnostic: diagnosticInfo,
        isEnabled: () => isVideoEnabled,
        getCurrentVideo: () => videoElement?.src || 'none',
        getStatus: () => ({
            enabled: isVideoEnabled,
            loaded: !!videoElement,
            playing: videoElement && !videoElement.paused,
            currentSrc: videoElement?.src,
            failedSources: Array.from(failedSources),
            isMobile: isMobile()
        })
    };

    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMedicalVideoBackground);
    } else {
        initMedicalVideoBackground();
    }

    // Обработка изменения размеров окна
    window.addEventListener('resize', () => {
        if (videoElement && isMobile()) {
            videoElement.style.filter = 'blur(2px) brightness(0.5) contrast(1.1) saturate(0.8)';
        }
    });

    // Обработка видимости страницы для экономии ресурсов
    document.addEventListener('visibilitychange', () => {
        if (videoElement) {
            if (document.hidden) {
                videoElement.pause();
            } else {
                videoElement.play().catch(() => {
                    console.log('Не удалось возобновить видео после возврата на страницу');
                });
            }
        }
    });

    console.log('✅ ИСПРАВЛЕННЫЙ медицинский видео фон готов');
    console.log('🎮 Управление: window.medicalVideoBackground');
    console.log('🔧 Диагностика: window.medicalVideoBackground.diagnostic()');

})();
