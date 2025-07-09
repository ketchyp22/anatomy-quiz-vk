// video-background.js - добавляет видео фон ЗА 3D машинку
(function() {
    'use strict';
    
    console.log('🎬 Загружается видео фон за 3D машинку...');

    class VideoBackground {
        constructor() {
            this.videoElement = null;
            this.container = null;
            this.isInitialized = false;
            this.init();
        }

        init() {
            // Ждем пока DOM загрузится
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            console.log('🚀 Настройка видео фона...');
            this.createVideoBackground();
            this.addStyles();
            this.handleResize();
            this.isInitialized = true;
        }

        createVideoBackground() {
            // Создаем контейнер для видео
            this.container = document.createElement('div');
            this.container.id = 'video-background-container';
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
            this.videoElement.id = 'medical-background-video';
            this.videoElement.muted = true;
            this.videoElement.loop = true;
            this.videoElement.autoplay = true;
            this.videoElement.playsInline = true; // Для мобильных
            
            this.videoElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.6;
                filter: blur(2px) brightness(0.8);
                transition: opacity 0.3s ease;
            `;

            // Добавляем источник видео
            const source = document.createElement('source');
            source.src = './medical-bg.mp4'; // Ваш скачанный файл
            source.type = 'video/mp4';
            
            this.videoElement.appendChild(source);
            this.container.appendChild(this.videoElement);

            // Добавляем overlay для лучшего контраста
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    rgba(102, 126, 234, 0.3) 0%, 
                    transparent 50%, 
                    rgba(118, 75, 162, 0.3) 100%);
                pointer-events: none;
                animation: overlayPulse 8s ease-in-out infinite;
            `;
            
            this.container.appendChild(overlay);

            // Вставляем контейнер в начало body (за всем остальным)
            document.body.insertBefore(this.container, document.body.firstChild);

            // Обработка событий видео
            this.setupVideoEvents();

            console.log('✅ Видео фон создан за 3D машинкой');
        }

        setupVideoEvents() {
            this.videoElement.addEventListener('loadstart', () => {
                console.log('📹 Начинается загрузка видео...');
            });

            this.videoElement.addEventListener('canplay', () => {
                console.log('✅ Видео готово к воспроизведению');
                this.videoElement.play().catch(error => {
                    console.warn('⚠️ Автовоспроизведение заблокировано:', error);
                    this.handleAutoplayBlock();
                });
            });

            this.videoElement.addEventListener('error', (e) => {
                console.error('❌ Ошибка загрузки видео:', e);
                this.showFallback();
            });

            // Обработка клика для запуска видео (если автовоспроизведение заблокировано)
            document.addEventListener('click', () => {
                if (this.videoElement.paused) {
                    this.videoElement.play().catch(() => {});
                }
            }, { once: true });
        }

        handleAutoplayBlock() {
            // Если автовоспроизведение заблокировано, показываем уведомление
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
            
            // Автоматически убираем через 10 секунд
            setTimeout(() => {
                if (playButton.parentNode) {
                    playButton.remove();
                }
            }, 10000);
        }

        showFallback() {
            // Если видео не загрузилось, показываем CSS анимацию
            console.log('🔄 Переключение на CSS fallback...');
            
            this.container.style.background = `
                linear-gradient(45deg, #667eea, #764ba2),
                radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(79, 209, 197, 0.3) 0%, transparent 50%)
            `;
            
            this.container.style.animation = 'fallbackAnimation 8s ease-in-out infinite';
        }

        addStyles() {
            // Добавляем CSS стили если их еще нет
            if (document.getElementById('video-bg-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'video-bg-styles';
            styles.textContent = `
                @keyframes overlayPulse {
                    0%, 100% { 
                        opacity: 0.3; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.5; 
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

                /* Адаптивность для мобильных */
                @media (max-width: 768px) {
                    #medical-background-video {
                        filter: blur(1px) brightness(0.7) !important;
                        opacity: 0.4 !important;
                    }
                }

                /* Улучшение производительности */
                #video-background-container {
                    will-change: transform;
                    backface-visibility: hidden;
                    perspective: 1000px;
                }

                #medical-background-video {
                    will-change: opacity, filter;
                    transform: translate3d(-50%, -50%, 0);
                }
            `;
            
            document.head.appendChild(styles);
        }

        handleResize() {
            window.addEventListener('resize', () => {
                if (this.videoElement) {
                    // Пересчитываем размеры при изменении окна
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

        // Публичные методы для управления
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
        console.log('🎬 Запуск видео фона...');
        window.videoBackground = new VideoBackground();
    });

    // Функции для отладки
    window.debugVideoBackground = {
        play: () => window.videoBackground?.play(),
        pause: () => window.videoBackground?.pause(),
        setOpacity: (val) => window.videoBackground?.setOpacity(val),
        setBlur: (val) => window.videoBackground?.setBlur(val),
        info: () => {
            const video = document.getElementById('medical-background-video');
            if (video) {
                console.log('Видео статус:', {
                    paused: video.paused,
                    currentTime: video.currentTime,
                    duration: video.duration,
                    readyState: video.readyState
                });
            }
        }
    };

    console.log('✅ Модуль видео фона загружен');
    console.log('🛠️ Отладка: window.debugVideoBackground');

})();
