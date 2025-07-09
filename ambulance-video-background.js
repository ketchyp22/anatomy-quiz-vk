// Замените файл ambulance-video-background.js на этот простой код:

(function() {
    'use strict';
    
    console.log('🎬 Простой видео фон загружается...');

    function createVideoBackground() {
        // Создаем контейнер
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

        // Создаем видео
        const video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
            filter: blur(1px) brightness(0.7);
        `;

        // Пробуем загрузить видео из CDN
        const sources = [
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://sample-videos.com/zip/10/mp4/720/mp4-sample.mp4'
        ];

        let currentIndex = 0;
        
        function tryLoad() {
            if (currentIndex >= sources.length) {
                console.log('Видео не загрузилось, остается CSS фон');
                return;
            }
            
            video.src = sources[currentIndex];
            video.onloadeddata = () => {
                console.log('✅ Видео загружено');
                video.play().catch(() => console.log('Автовоспроизведение заблокировано'));
            };
            video.onerror = () => {
                currentIndex++;
                tryLoad();
            };
        }

        tryLoad();
        container.appendChild(video);
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createVideoBackground);
    } else {
        createVideoBackground();
    }

    console.log('✅ Простой видео фон готов');
})();
