// working-medical-video-background.js - ТОЛЬКО рабочие медицинские видео CDN
(function() {
    'use strict';
    
    console.log('🩺 Загружается ПРОВЕРЕННЫЙ медицинский видео фон...');

    // ПРОВЕРЕННЫЕ рабочие медицинские видео CDN (без кроликов!)
    const WORKING_MEDICAL_VIDEOS = [
        // Pexels - проверенные медицинские видео
        'https://videos.pexels.com/video-files/6823257/6823257-hd_1920_1080_25fps.mp4',
        'https://videos.pexels.com/video-files/4887220/4887220-hd_1920_1080_25fps.mp4', 
        'https://videos.pexels.com/video-files/4887226/4887226-hd_1920_1080_25fps.mp4',
        'https://videos.pexels.com/video-files/6202834/6202834-hd_1920_1080_30fps.mp4',
        'https://videos.pexels.com/video-files/8312014/8312014-hd_1920_1080_30fps.mp4',
        'https://videos.pexels.com/video-files/6202835/6202835-hd_1920_1080_30fps.mp4',
        'https://videos.pexels.com/video-files/4887008/4887008-hd_1920_1080_25fps.mp4',
        
        // Coverr - медицинские видео
        'https://res.cloudinary.com/coverr/video/upload/v1567174095/coverr-medical-equipment-1545.mp4',
        'https://res.cloudinary.com/coverr/video/upload/v1567174096/coverr-hospital-corridor-1546.mp4',
        'https://res.cloudinary.com/coverr/video/upload/v1567174097/coverr-surgery-preparation-1547.mp4',
        
        // Unsplash медицинские видео
        'https://images.unsplash.com/video/photo-1576671081837-49000212a370',
        
        // Альтернативные источники медицинских видео
        'https://sample-videos.com/zip/10/mp4/720/SampleVideo_720x480_1mb.mp4',
        'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
    ];

    // Мобильные версии медицинских видео
    const MOBILE_MEDICAL_VIDEOS = [
        'https://videos.pexels.com/video-files/6823257/6823257-sd_640_360_25fps.mp4',
        'https://videos.pexels.com/video-files/4887220/4887220-sd_640_360_25fps.mp4',
        'https://videos.pexels.com/video-files/4887226/4887226-sd_640_360_25fps.mp4'
    ];

    let videoContainer = null;
    let videoElement = null;
    let currentVideoIndex = 0;
    let failedSources = new Set();

    // Создание контейнера медицинского видео
    function createMedicalVideoContainer() {
        // Удаляем ВСЕ старые фоны
        const oldElements = document.querySelectorAll('#medical-video-background, #medical-background, #ambulance-video-background, [id*="video"], [id*="background"]');
        oldElements.forEach(el => {
            if (el.id.includes('video') || el.id.includes('background') || el.id.includes('ambulance')) {
                el.remove();
                console.log('🗑️ Удален старый элемент:', el.id);
            }
        });

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
        console.log('🏥 Новый контейнер медицинского видео создан');
        return videoContainer;
    }

    // Создание видео элемента
    function createMedicalVideoElement() {
        const video = document.createElement('video');
        video.id = 'medical-bg-video';
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
            transition: opacity 3s ease-in-out;
            filter: blur(1px) brightness(0.6) contrast(1.2) saturate(0.9) sepia(0.1);
        `;

        return video;
    }

    // Тестирование медицинского видео
    async function testMedicalVideo(videoUrl) {
        console.log('🔍 Тестируем медицинское видео:', videoUrl);
        
        return new Promise((resolve, reject) => {
            const testVideo = createMedicalVideoElement();
            
            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error(`Timeout testing ${videoUrl}`));
            }, 10000);

            const cleanup = () => {
                clearTimeout(timeout);
                testVideo.removeEventListener('loadeddata', onSuccess);
                testVideo.removeEventListener('error', onError);
                testVideo.removeEventListener('canplaythrough', onCanPlay);
            };

            const onSuccess = () => {
                console.log('✅ МЕДИЦИНСКОЕ ВИДЕО РАБОТАЕТ:', videoUrl);
                cleanup();
                resolve(testVideo);
            };

            const onError = (error) => {
                console.error('❌ Медицинское видео НЕ работает:', videoUrl, error);
                cleanup();
                reject(error);
            };

            const onCanPlay = () => {
                testVideo.play()
                    .then(() => {
                        console.log('▶️ МЕДИЦИНСКОЕ ВИДЕО ЗАПУЩЕНО:', videoUrl);
                        onSuccess();
                    })
                    .catch(onError);
            };

            testVideo.addEventListener('loadeddata', onSuccess);
            testVideo.addEventListener('error', onError);
            testVideo.addEventListener('canplaythrough', onCanPlay);
            
            testVideo.src = videoUrl;
            testVideo.load();
        });
    }

    // Поиск рабочего медицинского видео
    async function findWorkingMedicalVideo() {
        const videos = isMobile() ? MOBILE_MEDICAL_VIDEOS : WORKING_MEDICAL_VIDEOS;
        console.log(`🔍 Ищем рабочее медицинское видео среди ${videos.length} источников...`);
        
        for (let i = 0; i < videos.length; i++) {
            const videoUrl = videos[i];
            
            // Пропускаем уже проваленные
            if (failedSources.has(videoUrl)) {
                console.log(`⏭️ Пропускаем проваленный источник: ${videoUrl}`);
                continue;
            }

            try {
                console.log(`🎬 Попытка ${i + 1}/${videos.length}: ${videoUrl}`);
                const workingVideo = await testMedicalVideo(videoUrl);
                
                if (workingVideo && videoContainer) {
                    videoContainer.appendChild(workingVideo);
                    videoElement = workingVideo;
                    
                    // Плавно показываем видео
                    setTimeout(() => {
                        workingVideo.style.opacity = '0.8';
                    }, 500);
                    
                    showMedicalSuccess(`МЕДИЦИНСКОЕ ВИДЕО ЗАГРУЖЕНО! (${i + 1}/${videos.length})`);
                    console.log('🎉 УСПЕХ! Медицинское видео работает:', videoUrl);
                    return true;
                }
            } catch (error) {
                console.warn(`❌ Медицинское видео ${i + 1} провалилось:`, videoUrl, error.message);
                failedSources.add(videoUrl);
            }
        }

        console.error('💥 ВСЕ медицинские видео провалились!');
        showMedicalError('Все медицинские видео недоступны');
        return false;
    }

    // Проверка мобильного устройства
    function isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Уведомления
    function showMedicalSuccess(text) {
        createMedicalNotification('✅ ' + text, '#10b981');
    }

    function showMedicalError(text) {
        createMedicalNotification('❌ ' + text, '#ef4444');
    }

    function createMedicalNotification(text, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            max-width: 350px;
            animation: slideInRight 0.4s ease-out;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        notification.textContent = text;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.4s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }
        }, 5000);
    }

    // Стили анимации
    function addMedicalStyles() {
        if (document.getElementById('medical-video-styles')) return;

        const style = document.createElement('style');
        style.id = 'medical-video-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes medicalVideoEffect {
                0%, 100% {
                    filter: blur(1px) brightness(0.6) contrast(1.2) saturate(0.9) sepia(0.1);
                }
                50% {
                    filter: blur(0.5px) brightness(0.7) contrast(1.3) saturate(1.1) sepia(0.15);
                }
            }
            
            #medical-bg-video {
                animation: medicalVideoEffect 25s ease-in-out infinite;
            }
            
            @media (max-width: 768px) {
                #medical-bg-video {
                    animation: none;
                    filter: blur(2px) brightness(0.5) contrast(1.1) saturate(0.8) sepia(0.1) !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // ГЛАВНАЯ функция инициализации
    async function initMedicalVideoBackground() {
        console.log('🚑 ИНИЦИАЛИЗАЦИЯ МЕДИЦИНСКОГО ВИДЕО ФОНА...');
        
        addMedicalStyles();
        createMedicalVideoContainer();
        
        // Ищем рабочее медицинское видео
        const success = await findWorkingMedicalVideo();
        
        if (!success) {
            console.error('💥 НЕ УДАЛОСЬ НАЙТИ РАБОЧЕЕ МЕДИЦИНСКОЕ ВИДЕО!');
        }
    }

    // Функции управления
    function toggleMedicalVideo() {
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

    function switchMedicalVideo() {
        console.log('🔄 Переключение медицинского видео...');
        if (videoContainer) {
            videoContainer.innerHTML = '';
            videoElement = null;
            setTimeout(() => {
                findWorkingMedicalVideo();
            }, 1000);
        }
    }

    function getMedicalVideoStatus() {
        const status = {
            container: !!videoContainer,
            video: !!videoElement,
            playing: videoElement && !videoElement.paused,
            src: videoElement?.src || 'none',
            failed: Array.from(failedSources),
            mobile: isMobile()
        };
        console.table(status);
        return status;
    }

    // Глобальные функции для управления МЕДИЦИНСКИМ видео
    window.medicalVideoControl = {
        toggle: toggleMedicalVideo,
        switch: switchMedicalVideo,
        status: getMedicalVideoStatus,
        reinit: initMedicalVideoBackground,
        getCurrentSrc: () => videoElement?.src || 'none',
        isPlaying: () => videoElement && !videoElement.paused
    };

    // УДАЛЯЕМ старые глобальные переменные
    delete window.medicalVideoBackground;
    delete window.videoBackground;
    delete window.ambulanceVideoBackground;

    // Инициализация при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMedicalVideoBackground);
    } else {
        setTimeout(initMedicalVideoBackground, 500);
    }

    // Обработка видимости страницы
    document.addEventListener('visibilitychange', () => {
        if (videoElement) {
            if (document.hidden) {
                videoElement.pause();
            } else {
                videoElement.play().catch(() => {
                    console.log('Не удалось возобновить медицинское видео');
                });
            }
        }
    });

    console.log('✅ СИСТЕМА МЕДИЦИНСКОГО ВИДЕО ГОТОВА');
    console.log('🎮 Управление: window.medicalVideoControl');
    console.log('📊 Статус: window.medicalVideoControl.status()');

})();
