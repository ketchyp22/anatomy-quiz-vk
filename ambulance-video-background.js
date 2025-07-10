// КОНКРЕТНОЕ МЕДИЦИНСКОЕ ВИДЕО С PEXELS
(function() {
    'use strict';
    
    console.log('🩺 Загружаем конкретное медицинское видео с Pexels...');

    // ПРЯМАЯ ССЫЛКА НА МЕДИЦИНСКОЕ ВИДЕО 5453774
    const MEDICAL_VIDEO_URL = 'https://videos.pexels.com/video-files/5453774/5453774-hd_1920_1080_25fps.mp4';

    let videoContainer = null;

    // Полная очистка всех фонов
    function clearAllBackgrounds() {
        // Удаляем все элементы с video, background, medical, ambulance в ID
        const selectors = [
            '[id*="video"]', '[id*="background"]', '[id*="medical"]', '[id*="ambulance"]',
            'video', 'div[style*="position: fixed"][style*="z-index"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.tagName === 'VIDEO' || 
                    el.id.includes('video') || 
                    el.id.includes('background') || 
                    el.id.includes('medical') ||
                    el.id.includes('ambulance')) {
                    console.log('🗑️ УДАЛЯЕМ:', el.tagName, el.id);
                    el.remove();
                }
            });
        });
    }

    // Создание контейнера для медицинского видео
    function createVideoContainer() {
        clearAllBackgrounds();

        videoContainer = document.createElement('div');
        videoContainer.id = 'pexels-medical-bg';
        videoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -100;
            overflow: hidden;
            background: #1a202c;
        `;

        document.body.insertBefore(videoContainer, document.body.firstChild);
        console.log('📦 Контейнер для медицинского видео создан');
        return videoContainer;
    }

    // Создание медицинского видео элемента
    function createMedicalVideoElement() {
        const video = document.createElement('video');
        video.id = 'pexels-medical-video';
        video.src = MEDICAL_VIDEO_URL;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        
        // Стили для медицинского видео
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
            filter: blur(1px) brightness(0.6) contrast(1.1) saturate(0.9);
        `;

        // Обработчики событий
        video.addEventListener('loadeddata', function() {
            console.log('✅ МЕДИЦИНСКОЕ ВИДЕО ЗАГРУЖЕНО УСПЕШНО!');
            this.style.opacity = '0.8';
            showSuccessMessage('Медицинское видео с Pexels загружено!');
        });

        video.addEventListener('error', function(e) {
            console.error('❌ ОШИБКА загрузки медицинского видео:', e);
            showErrorMessage('Ошибка загрузки медицинского видео');
        });

        video.addEventListener('canplaythrough', function() {
            console.log('📺 Медицинское видео готово к воспроизведению');
            this.play().then(() => {
                console.log('▶️ МЕДИЦИНСКОЕ ВИДЕО ЗАПУЩЕНО!');
            }).catch(err => {
                console.error('❌ Ошибка воспроизведения:', err);
            });
        });

        video.addEventListener('loadstart', function() {
            console.log('🔄 Начата загрузка медицинского видео...');
        });

        return video;
    }

    // Уведомления
    function showSuccessMessage(text) {
        createNotification(text, '#10b981');
    }

    function showErrorMessage(text) {
        createNotification(text, '#ef4444');
    }

    function createNotification(text, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            max-width: 350px;
            animation: slideInRight 0.4s ease-out;
        `;
        
        notification.textContent = text;
        document.body.appendChild(notification);
        
        // Автоудаление через 5 секунд
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

    // Добавление стилей анимации
    function addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ГЛАВНАЯ функция инициализации
    function initPexelsMedicalVideo() {
        console.log('🚑 ИНИЦИАЛИЗАЦИЯ МЕДИЦИНСКОГО ВИДЕО С PEXELS...');
        console.log('🎬 Загружаем:', MEDICAL_VIDEO_URL);
        
        addNotificationStyles();
        
        const container = createVideoContainer();
        const video = createMedicalVideoElement();
        
        container.appendChild(video);
        
        console.log('🩺 Медицинское видео инициализировано');
    }

    // Глобальные функции для управления
    window.pexelsMedicalVideo = {
        status: function() {
            const video = document.getElementById('pexels-medical-video');
            const container = document.getElementById('pexels-medical-bg');
            
            const status = {
                container: !!container,
                video: !!video,
                playing: video && !video.paused,
                currentTime: video ? video.currentTime : 0,
                duration: video ? video.duration : 0,
                src: MEDICAL_VIDEO_URL,
                readyState: video ? video.readyState : 0
            };
            
            console.table(status);
            return status;
        },
        
        restart: function() {
            console.log('🔄 Перезапуск медицинского видео...');
            initPexelsMedicalVideo();
        },
        
        toggle: function() {
            const video = document.getElementById('pexels-medical-video');
            if (video) {
                if (video.paused) {
                    video.play().then(() => {
                        console.log('▶️ Медицинское видео возобновлено');
                    });
                } else {
                    video.pause();
                    console.log('⏸️ Медицинское видео приостановлено');
                }
            }
        }
    };

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPexelsMedicalVideo);
    } else {
        // Небольшая задержка для очистки старых элементов
        setTimeout(initPexelsMedicalVideo, 1000);
    }

    console.log('✅ СИСТЕМА МЕДИЦИНСКОГО ВИДЕО С PEXELS ГОТОВА');
    console.log('🔧 Управление: window.pexelsMedicalVideo');

})();
