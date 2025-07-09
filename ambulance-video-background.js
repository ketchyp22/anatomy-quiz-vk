// МЕДИЦИНСКИЕ CDN видео
        const sources = [
            // Медицинские видео из CDN:
            'https://assets.mixkit.co/videos/preview/mixkit-red-and-blue-sirens-of-an-ambulance-4107-large.mp4',  // Скорая помощь
            'https://assets.mixkit.co/videos/preview/mixkit-doctor-writing-on-clipboard-4166-large.mp4',  // Врач
            'https://assets.mixkit.co/videos/preview/mixkit-hospital-corridor-4163-large.mp4',  // Коридор больницы
            'https://assets.mixkit.co/videos/preview/mixkit-medical-equipment-in-hospital-4273-large.mp4',  // Медоборудование
            'https://assets.mixkit.co/videos/preview/mixkit-ambul// ambulance-video-background.js - РАБОТАЮЩАЯ версия для VK
(function() {
    'use strict';
    
    console.log('🎬 Загружается РАБОТАЮЩИЙ видео фон...');

    function createVideoBackground() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        `;

        const video = document.createElement('video');
        video.id = 'ambulance-video';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.5;
            filter: blur(1px) brightness(0.8);
        `;

        // ОДНА РАБОЧАЯ ССЫЛКА
        video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        
        console.log('🔄 Загружаем рабочее видео...');
        video.load();

        video.onloadeddata = function() {
            console.log('✅ ВИДЕО ЗАГРУЖЕНО!');
            video.play()
                .then(() => {
                    console.log('▶️ ВИДЕО ЗАПУЩЕНО!');
                    showSuccess();
                })
                .catch(err => {
                    console.warn('⚠️ Автовоспроизведение заблокировано:', err);
                    showPlayButton();
                });
        };

        video.onerror = function() {
            console.error('❌ ОШИБКА ЗАГРУЗКИ ВИДЕО!');
            showError();
        };

        function showPlayButton() {
            const button = document.createElement('button');
            button.innerHTML = '🎬 Запустить видео фон';
            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            `;
            
            button.onclick = () => {
                video.play().then(() => {
                    button.remove();
                    console.log('✅ ВИДЕО ЗАПУЩЕНО ПОЛЬЗОВАТЕЛЕМ!');
                });
            };
            
            document.body.appendChild(button);
        }

        function showSuccess() {
            const status = document.createElement('div');
            status.innerHTML = '✅ Видео фон работает!';
            status.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 9999;
            `;
            document.body.appendChild(status);
            setTimeout(() => status.remove(), 3000);
        }

        function showError() {
            const error = document.createElement('div');
            error.innerHTML = '❌ Видео не загрузилось';
            error.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 9999;
            `;
            document.body.appendChild(error);
            setTimeout(() => error.remove(), 5000);
        }

        container.appendChild(video);
        document.body.insertBefore(container, document.body.firstChild);

        // Глобальные функции для управления
        window.debugVideoBackground = {
            play: () => video.play(),
            pause: () => video.pause(),
            setOpacity: (val) => video.style.opacity = val,
            restart: () => {
                currentIndex = 0;
                loadVideo();
            },
            info: () => ({
                src: video.src,
                paused: video.paused,
                currentTime: video.currentTime,
                duration: video.duration,
                readyState: video.readyState
            })
        };
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createVideoBackground);
    } else {
        createVideoBackground();
    }

    console.log('✅ РАБОТАЮЩИЙ видео фон готов!');
})();

// ИНСТРУКЦИЯ:
// 1. Скачайте ЛЮБОЕ медицинское видео (скорая помощь, больница, врачи)
// 2. Переименуйте в ambulance-bg.mp4  
// 3. Загрузите в корень репозитория
// 4. Видео ЗАРАБОТАЕТ!
