// medical-video-background.js - CDN видео фон для медицинского приложения
(function() {
    'use strict';
    
    console.log('🎬 Загружается медицинский видео фон с CDN...');

    // CDN источники медицинских видео
    const MEDICAL_VIDEO_SOURCES = [
        // Mixkit - бесплатные медицинские видео
        'https://assets.mixkit.co/videos/preview/mixkit-doctor-writing-on-clipboard-4166-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-medical-equipment-in-hospital-4273-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-hospital-corridor-4163-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-stethoscope-on-a-table-4169-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-medical-pills-4170-large.mp4',
        
        // Pixabay CDN
        'https://cdn.pixabay.com/vimeo/451878859/medical-40692.mp4?width=1280&hash=4b2b1b2b1b2b1b2b1b2b1b2b1b2b1b2b1b2b1b2b',
        'https://cdn.pixabay.com/vimeo/412456789/hospital-39856.mp4?width=1280&hash=5c3c2c3c2c3c2c3c2c3c2c3c2c3c2c3c2c3c2c3c',
        
        // Videvo CDN
        'https://cdn.videvo.net/videvo_files/video/premium/video0032/large_watermarked/medical_170928_006_preview.mp4',
        'https://cdn.videvo.net/videvo_files/video/premium/video0033/large_watermarked/hospital_170928_007_preview.mp4',
        
        // Google Storage (тестовые медицинские видео)
        'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ];

    // Альтернативные источники для мобильных устройств
    const MOBILE_VIDEO_SOURCES = [
        'https://assets.mixkit.co/videos/preview/mixkit-doctor-writing-on-clipboard-4166-small.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-medical-equipment-in-hospital-4273-small.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-hospital-corridor-4163-small.mp4'
    ];

    // Медицинские изображения как fallback
    const MEDICAL_IMAGES = [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2129&q=80',
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    ];

    let currentVideoIndex = 0;
    let videoContainer = null;
    let videoElement = null;
    let isVideoEnabled = true;
    let failedSources = new Set();

    // Создание видео контейнера
    function createVideoContainer() {
        // Удаляем существующий контейнер
        const existing = document.getElementById('medical-video-background');
        if (existing) {
            existing.remove();
        }

        videoContainer = document.createElement('div');
        videoContainer.id = 'medical-video-background';
        videoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -10;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        `;

        document.body.insertBefore(videoContainer, document.body.firstChild);
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
            transition: opacity 1s ease-in-out;
            filter: blur(1px) brightness(0.7) contrast(1.1);
        `;

        return videoElement;
    }

    // Загрузка видео
    async function loadVideo(sourceUrl) {
        return new Promise((resolve, reject) => {
            const video = createVideoElement();
            
            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error('Timeout loading video'));
            }, 10000);

            const cleanup = () => {
                clearTimeout(timeout);
                video.removeEventListener('loadeddata', onLoaded);
                video.removeEventListener('error', onError);
                video.removeEventListener('canplaythrough', onCanPlay);
            };

            const onLoaded = () => {
                console.log('✅ Видео загружено:', sourceUrl);
                video.style.opacity = '0.6';
                cleanup();
                resolve(video);
            };

            const onError = (error) => {
                console.warn('❌ Ошибка загрузки видео:', sourceUrl, error);
                cleanup();
                reject(error);
            };

            const onCanPlay = () => {
                video.play()
                    .then(() => {
                        console.log('▶️ Видео начато:', sourceUrl);
                        onLoaded();
                    })
                    .catch(onError);
            };

            video.addEventListener('loadeddata', onLoaded);
            video.addEventListener('error', onError);
            video.addEventListener('canplaythrough', onCanPlay);
            
            video.src = sourceUrl;
            video.load();
        });
    }

    // Попытка загрузки видео из источников
    async function tryLoadVideo() {
        const sources = isMobile() ? MOBILE_VIDEO_SOURCES : MEDICAL_VIDEO_SOURCES;
        
        for (let i = 0; i < sources.length; i++) {
            const sourceUrl = sources[i];
            
            if (failedSources.has(sourceUrl)) {
                continue;
            }

            try {
                console.log(`🔄 Попытка загрузки видео ${i + 1}/${sources.length}: ${sourceUrl}`);
                const video = await loadVideo(sourceUrl);
                
                if (videoContainer) {
                    videoContainer.appendChild(video);
                    videoElement = video;
                    showSuccessNotification();
                    return true;
                }
            } catch (error) {
                console.warn(`❌ Не удалось загрузить видео ${i + 1}: ${sourceUrl}`);
                failedSources.add(sourceUrl);
            }
        }

        return false;
    }

    // Fallback на изображения
    function setupImageFallback() {
        if (!videoContainer) return;

        const imageUrl = MEDICAL_IMAGES[Math.floor(Math.random() * MEDICAL_IMAGES.length)];
        
        videoContainer.style.cssText += `
            background-image: url('${imageUrl}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        `;

        console.log('🖼️ Используется изображение как fallback:', imageUrl);
        showImageFallbackNotification();
    }

    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Уведомления
    function showSuccessNotification() {
        if (!window.location.href.includes('localhost') && !window.location.href.includes('github.io')) {
            return; // Показываем только в dev режиме
        }

        const notification = createNotification('✅ Медицинский видео фон активирован', '#10b981');
        setTimeout(() => notification.remove(), 3000);
    }

    function showImageFallbackNotification() {
        const notification = createNotification('🖼️ Используется медицинское изображение', '#f59e0b');
        setTimeout(() => notification.remove(), 4000);
    }

    function showErrorNotification() {
        const notification = createNotification('⚠️ Видео фон недоступен', '#ef4444');
        setTimeout(() => notification.remove(), 5000);
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
            
            @keyframes medicalPulse {
                0%, 100% {
                    filter: blur(1px) brightness(0.7) contrast(1.1);
                }
                50% {
                    filter: blur(0.5px) brightness(0.8) contrast(1.2);
                }
            }
            
            #medical-bg-video {
                animation: medicalPulse 10s ease-in-out infinite;
            }
            
            @media (max-width: 768px) {
                #medical-bg-video {
                    animation: none;
                    filter: blur(2px) brightness(0.6) contrast(1.1) !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Основная функция инициализации
    async function initMedicalVideoBackground() {
        console.log('🎬 Инициализация медицинского видео фона...');
        
        addAnimationStyles();
        createVideoContainer();
        
        // Пытаемся загрузить видео
        const videoLoaded = await tryLoadVideo();
        
        if (!videoLoaded) {
            console.warn('❌ Не удалось загрузить ни одно видео, используем изображение');
            setupImageFallback();
        }
    }

    // Функции управления
    function toggleVideo() {
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
                console.log('▶️ Видео возобновлено');
            } else {
                videoElement.pause();
                console.log('⏸️ Видео приостановлено');
            }
        }
    }

    function changeVideoOpacity(opacity) {
        if (videoElement) {
            videoElement.style.opacity = Math.max(0, Math.min(1, opacity));
            console.log(`🎨 Прозрачность изменена на ${opacity}`);
        }
    }

    function switchToNextVideo() {
        if (failedSources.size < MEDICAL_VIDEO_SOURCES.length) {
            console.log('🔄 Переключение на следующее видео...');
            tryLoadVideo();
        }
    }

    // Глобальные функции управления
    window.medicalVideoBackground = {
        toggle: toggleVideo,
        setOpacity: changeVideoOpacity,
        switchVideo: switchToNextVideo,
        reinit: initMedicalVideoBackground,
        isEnabled: () => isVideoEnabled,
        getCurrentVideo: () => videoElement?.src || 'none',
        getStatus: () => ({
            enabled: isVideoEnabled,
            loaded: !!videoElement,
            playing: videoElement && !videoElement.paused,
            currentSrc: videoElement?.src,
            failedSources: Array.from(failedSources)
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
        if (videoElement) {
            // Перезапуск видео при изменении ориентации на мобильных
            if (isMobile()) {
                videoElement.style.filter = 'blur(2px) brightness(0.6) contrast(1.1)';
            }
        }
    });

    // Обработка видимости страницы
    document.addEventListener('visibilitychange', () => {
        if (videoElement) {
            if (document.hidden) {
                videoElement.pause();
            } else {
                videoElement.play().catch(console.warn);
            }
        }
    });

    console.log('✅ Медицинский видео фон готов к работе');
    console.log('🎮 Управление: window.medicalVideoBackground');

})();
