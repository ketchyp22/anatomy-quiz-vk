// sound-effects.js - Система звуковых эффектов для анатомического квиза
(function() {
    // Объект для хранения звуковых эффектов
    const sounds = {};
    
    // Флаг, указывающий, включены ли звуки
    let soundEnabled = true;
    
    // Функция для создания аудио элемента
    function createAudio(name, src) {
        const audio = new Audio();
        audio.src = src;
        audio.preload = 'auto';
        
        // Добавляем аудио в наш объект звуков
        sounds[name] = audio;
        
        return audio;
    }
    
    // Функция для воспроизведения звука
    function playSound(name) {
        if (!soundEnabled) return;
        
        const sound = sounds[name];
        if (sound) {
            // Перезапускаем звук, если он уже играет
            sound.currentTime = 0;
            
            // Воспроизводим звук
            sound.play().catch(error => {
                console.warn(`Ошибка воспроизведения звука ${name}:`, error);
            });
        } else {
            console.warn(`Звук ${name} не найден`);
        }
    }
    
    // Функция для включения/выключения звука
    function toggleSound() {
        soundEnabled = !soundEnabled;
        return soundEnabled;
    }
    
    // Функция для создания кнопки включения/выключения звука
    function createMuteButton() {
        const container = document.getElementById('sound-container');
        if (!container) return;
        
        const button = document.createElement('button');
        button.id = 'mute-button';
        button.className = 'mute-button';
        button.title = 'Выключить звук';
        
        // Иконки для состояний звука (вкл/выкл)
        const soundOnIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        
        const soundOffIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        `;
        
        // Устанавливаем начальное состояние
        button.innerHTML = soundEnabled ? soundOnIcon : soundOffIcon;
        
        // Добавляем обработчик события клика
        button.addEventListener('click', () => {
            const isSoundOn = toggleSound();
            button.innerHTML = isSoundOn ? soundOnIcon : soundOffIcon;
            button.title = isSoundOn ? 'Выключить звук' : 'Включить звук';
            
            // Воспроизводим звук нажатия кнопки, если звук включен
            if (isSoundOn) {
                playSound('click');
            }
        });
        
        // Добавляем стили для кнопки
        const style = document.createElement('style');
        style.textContent = `
            .mute-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(74, 118, 168, 0.8);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            .mute-button:hover {
                background-color: rgba(74, 118, 168, 1);
                transform: scale(1.1);
            }
            
            .mute-button svg {
                width: 20px;
                height: 20px;
            }
            
            @media (max-width: 768px) {
                .mute-button {
                    bottom: 10px;
                    right: 10px;
                    width: 36px;
                    height: 36px;
                }
            }
        `;
        
        document.head.appendChild(style);
        container.appendChild(button);
    }
    
    // Инициализация звуковой системы
    function init() {
        console.log('🔊 Звуковая система инициализирована и готова');
        
        // Создаем звуковые эффекты
        // Примечание: пути к звуковым файлам могут отличаться
        createAudio('click', 'sounds/click.mp3');
        createAudio('correct', 'sounds/correct.mp3');
        createAudio('wrong', 'sounds/wrong.mp3');
        createAudio('complete', 'sounds/complete.mp3');
        
        // Создаем кнопку управления звуком
        try {
            createMuteButton();
        } catch (error) {
            console.error('Ошибка при создании кнопки управления звуком:', error);
        }
        
        // Пробуем предварительно загрузить все звуки
        Object.values(sounds).forEach(sound => {
            sound.load();
        });
    }
    
    // Экспортируем API для использования в других скриптах
    window.SoundEffects = {
        init: init,
        playSound: playSound,
        toggleSound: toggleSound
    };
})();
