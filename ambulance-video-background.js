// vk-safe-video-background.js - Безопасная система для ВКонтакте
(function() {
    'use strict';
    
    console.log('🔒 Загружается VK-совместимая система видео фона...');

    // БЕЗОПАСНАЯ КОНФИГУРАЦИЯ ДЛЯ VK
    const VK_SAFE_CONFIG = {
        // Приоритет источников для VK
        sources: [
            // 1. Локальные файлы (самый безопасный вариант)
            {
                type: 'local',
                urls: ['./ambulance-bg.mp4', './medical-bg.mp4', './hospital-bg.mp4'],
                name: 'Локальные медицинские видео'
            },
            
            // 2. Анимированные CSS фоны (fallback)
            {
                type: 'css_animation',
                name: 'CSS анимация пульса',
                generator: 'pulse'
            },
            
            // 3. Статические градиенты с анимацией
            {
                type: 'gradient',
                name: 'Медицинский градиент',
                generator: 'medical'
            },
            
            // 4. Canvas анимация (если видео недоступно)
            {
                type: 'canvas',
                name: 'Canvas анимация',
                generator: 'heartbeat'
            }
        ],
        
        // Настройки для VK
        vkSettings: {
            respectCSP: true,           // Соблюдать CSP политику
            fallbackFirst: true,       // Сначала пробовать безопасные варианты
            detectVKEnvironment: true, // Определять VK окружение
            maxVideoSize: 5 * 1024 * 1024, // Максимум 5MB
            timeoutMs: 8000,          // Тайм-аут загрузки
            respectAutoplayPolicy: true // Соблюдать политику автовоспроизведения
        },
        
        // Внешние видео (только если разрешено)
        externalVideos: [
            {
                url: 'https://videos.pexels.com/video-files/6687824/6687824-hd_1280_720_25fps.mp4',
                name: 'Pexels Video 1 (720p)',
                size: 'small'
            },
            {
                url: 'https://videos.pexels.com/video-files/6688264/6688264-hd_1280_720_25fps.mp4',
                name: 'Pexels Video 2 (720p)',
                size: 'small'
            }
        ]
    };

    let videoContainer = null;
    let currentBackground = null;
    let isVKEnvironment = false;
    let isInitialized = false;

    // Определение VK окружения
    function detectVKEnvironment() {
        const indicators = [
            // VK Bridge
            typeof window.vkBridge !== 'undefined',
            typeof window.VKWebAppInit !== 'undefined',
            
            // VK домены
            window.location.hostname.includes('vk.com'),
            window.location.hostname.includes('vk.me'),
            
            // User Agent
            navigator.userAgent.includes('vk.com'),
            navigator.userAgent.includes('VKApp'),
            
            // Referrer
            document.referrer.includes('vk.com'),
            
            // Parent frame
            window.parent !== window && window.parent.location.hostname.includes('vk.com')
        ];
        
        isVKEnvironment = indicators.some(Boolean);
        
        console.log('🔍 VK окружение:', isVKEnvironment ? 'Обнаружено' : 'Не обнаружено');
        console.log('📊 Индикаторы VK:', indicators);
        
        return isVKEnvironment;
    }

    // Проверка CSP политики
    function checkCSPPolicy() {
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (metaCSP) {
            const cspContent = metaCSP.getAttribute('content');
            console.log('🔒 Обнаружена CSP политика:', cspContent);
            
            // Проверяем разрешены ли внешние медиа
            const allowsExternalMedia = cspContent.includes('media-src') && 
                                      (cspContent.includes('*') || cspContent.includes('pexels.com'));
            
            return allowsExternalMedia;
        }
        
        return true; // Если CSP не найдена, разрешаем
    }

    // Создание безопасного контейнера
    function createSafeContainer() {
        const existingContainers = document.querySelectorAll('[id*="video"], [id*="background"]');
        existingContainers.forEach(el => el.remove());

        videoContainer = document.createElement('div');
        videoContainer.id = 'vk-safe-background';
        videoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -100;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        `;

        document.body.insertBefore(videoContainer, document.body.firstChild);
        console.log('📦 Безопасный контейнер создан');
        return videoContainer;
    }

    // Попытка загрузки локального видео
    async function tryLocalVideo() {
        console.log('📁 Пробуем локальные видео файлы...');
        
        for (const videoUrl of VK_SAFE_CONFIG.sources[0].urls) {
            try {
                const video = await createSafeVideo(videoUrl);
                if (video) {
                    console.log(`✅ Локальное видео загружено: ${videoUrl}`);
                    return video;
                }
            } catch (error) {
                console.warn(`⚠️ Локальное видео недоступно: ${videoUrl}`, error);
            }
        }
        
        return null;
    }

    // Создание безопасного видео элемента
    function createSafeVideo(url) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
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
                transition: opacity 2s ease-in-out;
                filter: blur(1px) brightness(0.4) contrast(1.1) saturate(0.8);
            `;
            
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'metadata'; // Загружаем только метаданные сначала
            
            // Обработчики событий
            const timeoutId = setTimeout(() => {
                reject(new Error('Тайм-аут загрузки видео'));
            }, VK_SAFE_CONFIG.vkSettings.timeoutMs);
            
            video.addEventListener('loadeddata', () => {
                clearTimeout(timeoutId);
                video.style.opacity = '0.6';
                
                // Пробуем автовоспроизведение
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('▶️ Видео воспроизводится');
                            resolve(video);
                        })
                        .catch(error => {
                            console.warn('⚠️ Автовоспроизведение заблокировано:', error);
                            // Видео загружено, но не воспроизводится - это тоже успех
                            resolve(video);
                        });
                } else {
                    resolve(video);
                }
            });
            
            video.addEventListener('error', (e) => {
                clearTimeout(timeoutId);
                reject(new Error(`Ошибка загрузки видео: ${e.message}`));
            });
            
            // Устанавливаем источник
            video.src = url;
        });
    }

    // CSS анимация пульса (медицинская тема)
    function createPulseAnimation() {
        console.log('💓 Создаем CSS анимацию пульса...');
        
        const pulseContainer = document.createElement('div');
        pulseContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(118, 75, 162, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(79, 209, 197, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            animation: medicalPulse 4s ease-in-out infinite;
        `;
        
        // Добавляем стили анимации
        if (!document.getElementById('medical-pulse-styles')) {
            const style = document.createElement('style');
            style.id = 'medical-pulse-styles';
            style.textContent = `
                @keyframes medicalPulse {
                    0%, 100% {
                        filter: brightness(0.8) saturate(0.9);
                        transform: scale(1);
                    }
                    25% {
                        filter: brightness(1.1) saturate(1.1);
                        transform: scale(1.02);
                    }
                    50% {
                        filter: brightness(0.9) saturate(1.0);
                        transform: scale(1.01);
                    }
                    75% {
                        filter: brightness(1.0) saturate(1.05);
                        transform: scale(1.015);
                    }
                }
                
                @keyframes heartbeat {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    15% { opacity: 0.9; transform: scale(1.1); }
                    30% { opacity: 0.7; transform: scale(1.05); }
                    45% { opacity: 0.8; transform: scale(1.08); }
                    60% { opacity: 0.6; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        return pulseContainer;
    }

    // Медицинский градиент с анимацией
    function createMedicalGradient() {
        console.log('🏥 Создаем медицинский градиент...');
        
        const gradientContainer = document.createElement('div');
        gradientContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(45deg, 
                    rgba(79, 209, 197, 0.1) 0%, 
                    rgba(102, 126, 234, 0.15) 25%, 
                    rgba(118, 75, 162, 0.1) 50%, 
                    rgba(79, 209, 197, 0.15) 75%, 
                    rgba(102, 126, 234, 0.1) 100%
                ),
                linear-gradient(135deg, #1e293b 0%, #334155 100%);
            animation: medicalFlow 15s ease-in-out infinite;
        `;
        
        // Добавляем медицинские элементы
        for (let i = 0; i < 6; i++) {
            const medElement = document.createElement('div');
            medElement.style.cssText = `
                position: absolute;
                width: 60px;
                height: 60px;
                background: rgba(79, 209, 197, 0.2);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: heartbeat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            gradientContainer.appendChild(medElement);
        }
        
        return gradientContainer;
    }

    // Canvas анимация (если все остальное не работает)
    function createCanvasAnimation() {
        console.log('🎨 Создаем Canvas анимацию...');
        
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.7;
        `;
        
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function drawHeartbeat() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Градиентный фон
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.1)');
            gradient.addColorStop(0.5, 'rgba(79, 209, 197, 0.1)');
            gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Анимированные круги
            const time = Date.now() * 0.002;
            for (let i = 0; i < 5; i++) {
                const x = (Math.sin(time + i) * 0.3 + 0.5) * canvas.width;
                const y = (Math.cos(time + i * 0.7) * 0.3 + 0.5) * canvas.height;
                const radius = (Math.sin(time * 2 + i) * 0.5 + 0.5) * 30 + 20;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(79, 209, 197, ${0.1 + Math.sin(time + i) * 0.1})`;
                ctx.fill();
            }
            
            requestAnimationFrame(drawHeartbeat);
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        drawHeartbeat();
        
        return canvas;
    }

    // Основная функция инициализации
    async function initVKSafeBackground() {
        if (isInitialized) {
            console.log('⚠️ Фон уже инициализирован');
            return;
        }

        console.log('🔒 Инициализация VK-безопасного фона...');
        
        detectVKEnvironment();
        createSafeContainer();
        
        let backgroundCreated = false;
        
        // 1. Пробуем локальные видео (самый безопасный вариант)
        try {
            const localVideo = await tryLocalVideo();
            if (localVideo) {
                videoContainer.appendChild(localVideo);
                currentBackground = localVideo;
                backgroundCreated = true;
                console.log('✅ Локальное видео успешно загружено');
            }
        } catch (error) {
            console.warn('⚠️ Локальные видео недоступны:', error);
        }
        
        // 2. Если видео не загрузилось - используем CSS анимацию
        if (!backgroundCreated) {
            const pulseAnimation = createPulseAnimation();
            videoContainer.appendChild(pulseAnimation);
            currentBackground = pulseAnimation;
            backgroundCreated = true;
            console.log('✅ CSS анимация пульса активирована');
        }
        
        isInitialized = true;
        console.log('✅ VK-безопасный фон инициализирован');
    }

    // Глобальные функции управления
    window.vkSafeBackground = {
        status: function() {
            return {
                initialized: isInitialized,
                isVKEnvironment: isVKEnvironment,
                currentBackground: currentBackground?.tagName || 'None',
                containerExists: !!videoContainer
            };
        },
        
        switchToPulse: function() {
            if (videoContainer) {
                videoContainer.innerHTML = '';
                const pulse = createPulseAnimation();
                videoContainer.appendChild(pulse);
                currentBackground = pulse;
                console.log('🔄 Переключено на CSS анимацию пульса');
            }
        },
        
        switchToGradient: function() {
            if (videoContainer) {
                videoContainer.innerHTML = '';
                const gradient = createMedicalGradient();
                videoContainer.appendChild(gradient);
                currentBackground = gradient;
                console.log('🔄 Переключено на медицинский градиент');
            }
        },
        
        switchToCanvas: function() {
            if (videoContainer) {
                videoContainer.innerHTML = '';
                const canvas = createCanvasAnimation();
                videoContainer.appendChild(canvas);
                currentBackground = canvas;
                console.log('🔄 Переключено на Canvas анимацию');
            }
        },
        
        restart: function() {
            isInitialized = false;
            initVKSafeBackground();
        }
    };

    // Совместимость со старым API
    window.medicalVideoBackground = window.vkSafeBackground;
    window.pexelsMedicalVideo = window.vkSafeBackground;

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVKSafeBackground);
    } else {
        setTimeout(initVKSafeBackground, 100);
    }

    console.log('✅ VK-совместимая система фона готова');
    console.log('🔧 Управление: window.vkSafeBackground');

})();
