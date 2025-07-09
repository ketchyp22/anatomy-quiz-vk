// Замените ambulance-video-background.js на этот простой код:

(function() {
    'use strict';
    
    console.log('🎬 Простой видео фон с CDN...');

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
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.4;
            filter: blur(1px) brightness(0.8);
        `;

        // Медицинские видео из CDN
        const sources = [
            './ambulance-bg.mp4',                    // ← ВАШЕ видео
            'https://ketchyp22.github.io/ambulance-bg.mp4',  // ← Через GitHub Pages
            
            // Медицинские CDN видео:
            'https://assets.mixkit.co/videos/preview/mixkit-red-and-blue-sirens-of-an-ambulance-4107-large.mp4',  // Скорая помощь
            'https://assets.mixkit.co/videos/preview/mixkit-doctor-writing-on-clipboard-4166-large.mp4',  // Врач с документами
            'https://assets.mixkit.co/videos/preview/mixkit-medical-equipment-in-hospital-4273-large.mp4',  // Медоборудование
            'https://assets.mixkit.co/videos/preview/mixkit-hospital-corridor-4163-large.mp4',  // Коридор больницы
            
            // Альтернативные медицинские:
            'https://cdn.pixabay.com/vimeo/462298126/ambulance-80413.mp4',  // Скорая помощь
            'https://cdn.pixabay.com/vimeo/475928377/hospital-88234.mp4',   // Больница
            'https://sample-videos.com/zip/10/mp4/720/mp4-sample-hospital.mp4',  // Больничное видео
            
            // Запасное (если медицинские не загрузятся):
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        ];

        let currentIndex = 0;
        
        function tryLoad() {
            if (currentIndex >= sources.length) {
                console.log('Все источники не удалось загрузить');
                return;
            }
            
            video.src = sources[currentIndex];
            console.log(`🔄 Пробуем: ${sources[currentIndex]}`);
            
            video.onloadeddata = () => {
                console.log(`✅ Видео загружено: ${sources[currentIndex]}`);
                video.play().catch(() => console.log('Кликните для запуска'));
            };
            
            video.onerror = () => {
                console.log(`❌ Не удалось: ${sources[currentIndex]}`);
                currentIndex++;
                tryLoad();
            };
        }
        
        tryLoad();

        video.onloadeddata = () => {
            console.log('✅ CDN видео загружено');
            video.play().catch(() => console.log('Кликните для запуска'));
        };

        video.onerror = () => {
            console.log('Используем CSS анимацию');
            container.style.background = `
                linear-gradient(45deg, #667eea, #764ba2),
                radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(79, 209, 197, 0.3) 0%, transparent 50%)
            `;
            container.style.animation = 'bgAnimation 8s ease-in-out infinite';
        };

        container.appendChild(video);
        document.body.insertBefore(container, document.body.firstChild);

        // Стили анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bgAnimation {
                0%, 100% { background-position: 0% 50%, 20% 50%, 80% 20%; }
                50% { background-position: 100% 50%, 80% 20%, 20% 80%; }
            }
        `;
        document.head.appendChild(style);

        // Функции управления
        window.debugVideoBackground = {
            play: () => video.play(),
            pause: () => video.pause(),
            setOpacity: (val) => video.style.opacity = val,
            info: () => ({ 
                src: video.src, 
                paused: video.paused, 
                duration: video.duration 
            })
        };
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createVideoBackground);
    } else {
        createVideoBackground();
    }

    console.log('✅ Простой видео фон готов');
})();
