// ambulance-video-background.js - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ версия
(function() {
    'use strict';
    
    console.log('🎬 Загружается видео фон скорой помощи...');

    class VideoBackground {
        constructor() {
            this.videoElement = null;
            this.container = null;
            this.isInitialized = false;
            this.videoLoaded = false;
            this.currentSourceIndex = 0;
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
            // Создаем контейнер
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
            this.videoElement.id = 'ambulance-background-video';
            this.videoElement.muted = true;
            this.videoElement.loop = true;
            this.videoElement.autoplay = true;
            this.videoElement.playsInline = true;
            this.videoElement.preload = 'auto';
            
            this.videoElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.5;
                filter: blur(1px) brightness(0.8);
                transition: opacity 0.3s ease;
            `;

            // Множественные источники видео
            const videoSources = [
                './ambulance-bg.mp4',
                'https://ketchyp22.github.io/ambulance-bg.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'https://sample-videos.com/zip/10/mp4/720/mp4-sample.mp4',
                'https://assets.mixkit.co/videos/preview/mixkit-red-and-blue-sirens-of-an-ambulance-4107-large.mp4'
            ];

            this.loadVideoWithFallback(videoSources);
            this.container.appendChild(this.videoElement);

            // Overlay для контраста
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    rgba(102, 126, 234, 0.2) 0%, 
                    transparent 40%, 
                    rgba(118, 75, 162, 0.2) 100%);
                pointer-events: none;
                animation: overlayPulse 6s ease-in-out infinite;
            `;
            
            this.container.appendChild(overlay);
            document.body.insertBefore(this.container, document.body.firstChild);

            console.log('✅ Видео фон скорой помощи создан');
        }

        loadVideoWithFallback(sources) {
            if (this.currentSourceIndex >= sources.length) {
                console.warn('❌ Все источники видео не удалось загрузить');
                this.showFallback();
                return;
            }

            const currentSource = sources[this.currentSourceIndex];
            console.log(`🔄 Попытка загрузки: ${currentSource}`);

            // Очищаем предыдущие источники
            this.videoElement.innerHTML = '';
            
            const source = document.createElement('source');
            source.src = currentSource;
            source.type = 'video/mp4';
            this.videoElement.appendChild(source);

            // Обработчики событий
            this.videoElement.onloadeddata = () => {
                console.log(`✅ Видео загружено: ${currentSource}`);
                this.videoLoaded = true;
                this.playVideo();
            };

            this.videoElement.onerror = () => {
                console.warn(`❌ Ошибка загрузки: ${currentSource}`);
                this.currentSourceIndex++;
                setTimeout(() => this.loadVideoWithFallback(sources), 500);
            };

            this.videoElement.onloadstart = () => {
                console.log(`📹 Начинается загрузка: ${currentSource}`);
            };

            // Таймаут для медленной загрузки
            setTimeout(() => {
                if (!this.videoLoaded && this.currentSourceIndex < sources.length - 1) {
                    console.warn(`⏰ Таймаут загрузки: ${currentSource}`);
                    this.currentSourceIndex++;
                    this.loadVideoWithFallback(sources);
                }
            }, 8000);

            // Принудительно загружаем
            this.videoElement.load();
        }

        playVideo() {
            if (!this.videoElement) return;

            this.videoElement.play()
                .then(() => {
                    console.log('✅ Видео запущено успешно');
                })
                .catch(error => {
                    console.warn('⚠️ Автовоспроизведение заблокировано:', error);
                    this.handleAutoplayBlock();
                });
        }

        handleAutoplayBlock() {
            const playButton = document.createElement('div');
            playButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                cursor: pointer;
                z-index: 1000;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                border: 2px solid rgba(255, 255, 255, 0.2);
            `;
            playButton.innerHTML = '🎬 Включить видео фон';
            
            playButton.addEventListener('click', () => {
                this.videoElement.play()
                    .then(() => {
                        playButton.remove();
                        console.log('✅ Видео запущено пользователем');
                    })
                    .catch(e => console.warn('Не удалось запустить видео:', e));
            });

            playButton.addEventListener('mouseenter', () => {
                playButton.style.background = 'rgba(0, 0, 0, 1)';
                playButton.style.transform = 'translateY(-2px)';
            });

            playButton.addEventListener('mouseleave', () => {
                playButton.style.background = 'rgba(0, 0, 0, 0.9)';
                playButton.style.transform = 'translateY(0)';
            });

            document.body.appendChild(playButton);
            
            // Автоматически убираем через 15 секунд
            setTimeout(() => {
                if (playButton.parentNode) {
                    playButton.remove();
                }
            }, 15000);

            // Пробуем запустить при первом клике на странице
            document.addEventListener('click', () => {
                if (this.videoElement && this.videoElement.paused) {
                    this.videoElement.play().catch(() => {});
                }
            }, { once: true });
        }

        showFallback() {
            console.log('🔄 Переключение на CSS анимацию...');
            
            // Скрываем видео
            if (this.videoElement) {
                this.videoElement.style.display = 'none';
            }
            
            // Активируем CSS анимацию
            this.container.style.background = `
                linear-gradient(45deg, #667eea 0%, #764ba2 100%),
                radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(79, 209, 197, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 30%)
            `;
            
            this.container.style.backgroundSize = '400% 400%, 200% 200%, 300% 300%, 150% 150%';
            this.container.style.animation = 'fallbackAnimation 8s ease-in-out infinite';
            
            console.log('✅ CSS анимация активирована');
        }

        addStyles() {
            if (document.getElementById('video-bg-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'video-bg-styles';
            styles.textContent = `
                @keyframes overlayPulse {
                    0%, 100% { 
                        opacity: 0.2; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.4; 
                        transform: scale(1.01); 
                    }
                }

                @keyframes fallbackAnimation {
                    0%, 100% { 
                        background-position: 0% 50%, 25% 25%, 75% 75%, 50% 50%; 
                        filter: hue-rotate(0deg);
                    }
                    25% { 
                        background-position: 100% 50%, 75% 25%, 25% 75%, 25% 75%; 
                        filter: hue-rotate(15deg);
                    }
                    50% { 
                        background-position: 50% 100%, 50% 50%, 50% 50%, 75% 25%; 
                        filter: hue-rotate(30deg);
                    }
                    75% { 
                        background-position: 0% 0%, 25% 75%, 75% 25%, 50% 50%; 
                        filter: hue-rotate(15deg);
                    }
                }

                /* Мобильная оптимизация */
                @media (max-width: 768px) {
                    #ambulance-background-video {
                        filter: blur(0.5px) brightness(0.6) !important;
                        opacity: 0.3 !important;
                    }
                }

                /* Производительность */
                #video-background-container {
                    will-change: transform;
                    backface-visibility: hidden;
                    perspective: 1000px;
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
                if (this.videoElement && this.videoElement.videoWidth > 0) {
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
            if (this.videoElement && this.videoElement.paused) {
                this.videoElement.play()
                    .then(() => console.log('▶️ Видео запущено'))
                    .catch(e => console.warn('Не удалось запустить:', e));
            }
        }

        pause() {
            if (this.videoElement && !this.videoElement.paused) {
                this.videoElement.pause();
                console.log('⏸️ Видео поставлено на паузу');
            }
        }

        setOpacity(opacity) {
            if (this.videoElement) {
                this.videoElement.style.opacity = Math.max(0, Math.min(1, opacity));
                console.log('🎭 Прозрачность изменена на:', opacity);
            }
        }

        setBlur(blur) {
            if (this.videoElement) {
                const brightness = this.videoElement.style.filter.match(/brightness\(([^)]+)\)/);
                const brightnessValue = brightness ? brightness[1] : '0.8';
                this.videoElement.style.filter = `blur(${blur}px) brightness(${brightnessValue})`;
                console.log('🌫️ Размытие изменено на:', blur);
            }
        }

        setBrightness(brightness) {
            if (this.videoElement) {
                const blur = this.videoElement.style.filter.match(/blur\(([^)]+)\)/);
                const blurValue = blur ? blur[1] : '1px';
                this.videoElement.style.filter = `blur(${blurValue}) brightness(${brightness})`;
                console.log('💡 Яркость изменена на:', brightness);
            }
        }

        getStatus() {
            if (!this.videoElement) return { error: 'Видео не создано' };
            
            return {
                файл: this.videoElement.querySelector('source')?.src || 'не указан',
                пауза: this.videoElement.paused,
                время: this.videoElement.currentTime,
                длительность: this.videoElement.duration,
                готовность: this.videoElement.readyState,
                загружен: this.videoLoaded,
                прозрачность: this.videoElement.style.opacity,
                фильтр: this.videoElement.style.filter
            };
        }
    }

    // Автозапуск
    window.addEventListener('load', () => {
        console.log('🎬 Запуск видео фона скорой помощи...');
        window.ambulanceBackground = new VideoBackground();
    });

    // Отладочные функции
    window.debugVideoBackground = {
        play: () => window.ambulanceBackground?.play(),
        pause: () => window.ambulanceBackground?.pause(),
        setOpacity: (val) => window.ambulanceBackground?.setOpacity(val),
        setBlur: (val) => window.ambulanceBackground?.setBlur(val),
        setBrightness: (val) => window.ambulanceBackground?.setBrightness(val),
        info: () => {
            const status = window.ambulanceBackground?.getStatus();
            console.log('🚑 Статус видео фона:', status);
            return status;
        },
        presets: {
            normal: () => {
                window.ambulanceBackground?.setOpacity(0.5);
                window.ambulanceBackground?.setBlur(1);
                window.ambulanceBackground?.setBrightness(0.8);
                console.log('✅ Обычные настройки применены');
            },
            bright: () => {
                window.ambulanceBackground?.setOpacity(0.7);
                window.ambulanceBackground?.setBlur(0.5);
                window.ambulanceBackground?.setBrightness(1);
                console.log('✅ Яркие настройки применены');
            },
            dim: () => {
                window.ambulanceBackground?.setOpacity(0.3);
                window.ambulanceBackground?.setBlur(2);
                window.ambulanceBackground?.setBrightness(0.6);
                console.log('✅ Тусклые настройки применены');
            },
            hidden: () => {
                window.ambulanceBackground?.setOpacity(0);
                console.log('✅ Видео скрыто');
            }
        }
    };

    console.log('✅ Модуль видео фона скорой помощи загружен');
    console.log('🛠️ Отладка: window.debugVideoBackground.info()');
    console.log('🎛️ Настройки: window.debugVideoBackground.presets.normal()');

})();
