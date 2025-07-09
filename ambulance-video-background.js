// ambulance-video-background.js - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ
(function() {
    'use strict';
    
    console.log('🎬 Загружается видео фон скорой помощи...');

    class VideoBackground {
        constructor() {
            this.videoElement = null;
            this.container = null;
            this.isInitialized = false;
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            console.log('🚀 Настройка видео фона скорой помощи...');
            this.createVideoBackground();
            this.addStyles();
            this.handleResize();
            this.isInitialized = true;
        }

        createVideoBackground() {
            // Создаем контейнер для видео
            this.container = document.createElement('div');
            this.container.id = 'ambulance-video-container';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -2;
                overflow: hidden;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            `;

            // Создаем видео элемент
            this.videoElement = document.createElement('video');
            this.videoElement.id = 'ambulance-background-video';
            this.videoElement.muted = true;
            this.videoElement.loop = true;
            this.videoElement.autoplay = true;
            this.videoElement.playsInline = true;
            
            this.videoElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.5;
                filter: blur(2px) brightness(0.8);
                transition: opacity 0.3s ease;
            `;

            // ПРАВИЛЬНОЕ ИМЯ ФАЙЛА
            const source = document.createElement('source');
            source.src = './ambulance-bg.mp4';
            source.type = 'video/mp4';
            
            this.videoElement.appendChild(source);
            this.container.appendChild(this.videoElement);

            // Добавляем overlay для контраста
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    rgba(102, 126, 234, 0.2) 0%, 
                    transparent 50%, 
                    rgba(118, 75, 162, 0.2) 100%);
                pointer-events: none;
                animation: overlayPulse 8s ease-in-out infinite;
            `;
            
            this.container.appendChild(overlay);

            // Вставляем в начало body
            document.body.insertBefore(this.container, document.body.firstChild);

            // Обработка событий видео
            this.setupVideoEvents();

            console.log('✅ Видео фон скорой помощи создан');
        }

        setupVideoEvents() {
            this.videoElement.addEventListener('loadstart', () => {
                console.log('📹 Начинается загрузка ambulance-bg.mp4...');
            });

            this.videoElement.addEventListener('canplay', () => {
                console.log('✅ Видео ambulance-bg.mp4 готово к воспроизведению');
                this.videoElement.play().catch(error => {
                    console.warn('⚠️ Автовоспроизведение заблокировано:', error);
                    this.handleAutoplayBlock();
                });
            });

            this.videoElement.addEventListener('error', (e) => {
                console.error('❌ Ошибка загрузки видео ambulance-bg.mp4:', e);
                console.error('🔍 Проверьте что файл ambulance-bg.mp4 находится в корневой папке');
                this.showFallback();
            });

            // Обработка клика для запуска видео
            document.addEventListener('click', () => {
                if (this.videoElement.paused) {
                    this.videoElement.play().catch(() => {});
                }
            }, { once: true });
        }

        handleAutoplayBlock() {
            const playButton = document.createElement('div');
            playButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                cursor: pointer;
                z-index: 1000;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
            `;
            playButton.textContent = '🎬 Включить видео фон';
            
            playButton.addEventListener('click', () => {
                this.videoElement.play();
                playButton.remove();
            });

            document.body.appendChild(playButton);
            
            setTimeout(() => {
                if (playButton.parentNode) {
                    playButton.remove();
                }
            }, 10000);
        }

        showFallback() {
            console.log('🔄 Переключение на CSS fallback...');
            
            this.container.style.background = `
                linear-gradient(45deg, #667eea, #764ba2),
                radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(79, 209, 197, 0.3) 0%, transparent 50%)
            `;
            
            this.container.style.animation = 'fallbackAnimation 8s ease-in-out infinite';
        }

        addStyles() {
            if (document.getElementById('ambulance-video-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'ambulance-video-styles';
            styles.textContent = `
                @keyframes overlayPulse {
                    0%, 100% { 
                        opacity: 0.2; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.4; 
                        transform: scale(1.02); 
                    }
                }

                @keyframes fallbackAnimation {
                    0%, 100% { 
                        background-position: 0% 50%, 20% 50%, 80% 20%; 
                    }
                    50% { 
                        background-position: 100% 50%, 80% 20%, 20% 80%; 
                    }
                }

                @media (max-width: 768px) {
                    #ambulance-background-video {
                        filter: blur(1px) brightness(0.7) !important;
                        opacity: 0.3 !important;
                    }
                }

                #ambulance-video-container {
                    will-change: transform;
                    backface-visibility: hidden;
                }

                #ambulance-background-video {
                    will-change: opacity, filter;
                    transform: translate3d(-50%, -50%, 0);
                }
            `;
            
            document.head.appendChild(styles);
        }

        handleResize() {
            window.addEventListener('resize', () => {
                if (this.videoElement) {
                    const windowRatio = window.innerWidth / window.innerHeight;
                    const videoRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
                    
                    if (windowRatio > videoRatio) {
                        this.videoElement.style.width = '100%';
                        this.videoElement.style.height = 'auto';
                    } else {
                        this.videoElement.style.width = 'auto';
                        this.videoElement.style.height = '100%';
                    }
                }
            });
        }

        // Публичные методы
        play() {
            if (this.videoElement) {
                this.videoElement.play();
            }
        }

        pause() {
            if (this.videoElement) {
                this.videoElement.pause();
            }
        }

        setOpacity(opacity) {
            if (this.videoElement) {
                this.videoElement.style.opacity = opacity;
            }
        }

        setBlur(blur) {
            if (this.videoElement) {
                const currentFilter = this.videoElement.style.filter;
                this.videoElement.style.filter = currentFilter.replace(/blur\([^)]*\)/, `blur(${blur}px)`);
            }
        }
    }

    // Автоматический запуск
    window.addEventListener('load', () => {
        console.log('🎬 Запуск видео фона скорой помощи...');
        window.videoBackground = new VideoBackground();
    });

    // Функции для отладки
    window.debugVideoBackground = {
        play: () => window.videoBackground?.play(),
        pause: () => window.videoBackground?.pause(),
        setOpacity: (val) => window.videoBackground?.setOpacity(val),
        setBlur: (val) => window.videoBackground?.setBlur(val),
        info: () => {
            const video = document.getElementById('ambulance-background-video');
            if (video) {
                console.log('🚑 Статус видео фона:', {
                    файл: 'ambulance-bg.mp4',
                    пауза: video.paused,
                    время: video.currentTime,
                    длительность: video.duration,
                    готовность: video.readyState,
                    источник: video.querySelector('source')?.src
                });
            } else {
                console.log('❌ Видео элемент не найден');
            }
        },
        presets: {
            normal: () => window.videoBackground?.setOpacity(0.5),
            bright: () => window.videoBackground?.setOpacity(0.7),
            dim: () => window.videoBackground?.setOpacity(0.3),
            hidden: () => window.videoBackground?.setOpacity(0)
        }
    };

    console.log('✅ Модуль видео фона скорой помощи загружен');
    console.log('🛠️ Отладка: window.debugVideoBackground');

})();
