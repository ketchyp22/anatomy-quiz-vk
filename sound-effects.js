// sound-effects.js - исправленная версия
(function() {
    // Создаем звуковые эффекты с использованием Web Audio API
    class SoundEffects {
        constructor() {
            // Инициализируем аудио контекст
            this.initAudio();
            // Добавляем кнопку включения/выключения звука
            this.createMuteButton();
            // Добавляем обработчики событий
            this.setupEventListeners();
        }
        
        initAudio() {
            try {
                // Решение проблемы с требованием взаимодействия пользователя
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = null;
                this.isMuted = false;
                this.sounds = {};
                
                // Создаем базовые звуки после инициализации контекста
                this.createSoundDefinitions();
                
                // Инициализируем аудио контекст при первом клике
                const initOnInteraction = () => {
                    if (!this.audioContext) {
                        this.audioContext = new AudioContext();
                        this.playStartupSound(); // Подтверждаем, что звук работает
                    }
                    
                    // Удаляем обработчики событий после инициализации
                    document.removeEventListener('click', initOnInteraction);
                    document.removeEventListener('touchstart', initOnInteraction);
                };
                
                document.addEventListener('click', initOnInteraction);
                document.addEventListener('touchstart', initOnInteraction);
                
                console.log("🔊 Звуковая система инициализирована и готова");
            } catch (e) {
                console.error("⚠️ Ошибка инициализации звуковой системы:", e);
            }
        }
        
        createSoundDefinitions() {
            // Определения звуков (для последующего создания)
            this.sounds = {
                select: {
                    play: () => this.playTone(600, 0.1, 'sine')
                },
                correct: {
                    play: () => {
                        this.playTone(800, 0.1, 'sine');
                        setTimeout(() => this.playTone(1000, 0.15, 'sine'), 100);
                    }
                },
                wrong: {
                    play: () => {
                        this.playTone(300, 0.1, 'sine');
                        setTimeout(() => this.playTone(200, 0.15, 'sine'), 100);
                    }
                },
                start: {
                    play: () => {
                        this.playTone(500, 0.1, 'sine');
                        setTimeout(() => this.playTone(700, 0.1, 'sine'), 150);
                        setTimeout(() => this.playTone(900, 0.15, 'sine'), 300);
                    }
                },
                complete: {
                    play: () => {
                        this.playTone(700, 0.1, 'sine');
                        setTimeout(() => this.playTone(900, 0.1, 'sine'), 150);
                        setTimeout(() => this.playTone(1100, 0.1, 'sine'), 300);
                        setTimeout(() => this.playTone(1300, 0.2, 'sine'), 450);
                    }
                }
            };
        }
        
        playStartupSound() {
            // Проигрываем короткий звук для проверки
            this.playTone(440, 0.1, 'sine'); // нота "ля" 440 Гц
            console.log("🎵 Проигрывается стартовый звук");
        }
        
        playTone(frequency, duration, type = 'sine') {
            if (!this.audioContext || this.isMuted) {
                console.log("🔇 Звук отключен или контекст не инициализирован");
                return;
            }
            
            try {
                // Восстанавливаем контекст, если он был приостановлен
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = type;
                oscillator.frequency.value = frequency;
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // Устанавливаем громкость
                gainNode.gain.value = 0.2; // Повышаем громкость для лучшей слышимости
                
                // Плавный звук
                const now = this.audioContext.currentTime;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, now + duration);
                
                oscillator.start();
                oscillator.stop(now + duration);
                
                console.log(`🔊 Проигрывается тон ${frequency}Hz`);
            } catch (e) {
                console.error("⚠️ Ошибка воспроизведения звука:", e);
            }
        }
        
        toggleMute() {
            this.isMuted = !this.isMuted;
            
            const button = document.getElementById('mute-button');
            if (button) {
                // Обновляем состояние кнопки
                if (this.isMuted) {
                    button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>';
                    button.classList.add('muted');
                } else {
                    button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>';
                    button.classList.remove('muted');
                }
                
                console.log(`🔊 Звук ${this.isMuted ? 'выключен' : 'включен'}`);
                
                // Проигрываем звук при включении, если контекст инициализирован
                if (!this.isMuted && this.audioContext) {
                    this.playTone(700, 0.1, 'sine');
                }
            }
        }
        
        createMuteButton() {
            // Стили для кнопки
            const style = document.createElement('style');
            style.textContent = `
                #mute-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: var(--btn-primary-bg);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 1000;
                    opacity: 0.8;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                
                #mute-button:hover {
                    opacity: 1;
                    transform: scale(1.05);
                }
                
                #mute-button.muted {
                    background-color: #999;
                }
            `;
            document.head.appendChild(style);
            
            // Создаем кнопку
            const button = document.createElement('button');
            button.id = 'mute-button';
            button.title = 'Выключить/включить звук';
            button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>';
            button.addEventListener('click', () => this.toggleMute());
            
            document.body.appendChild(button);
        }
        
        setupEventListeners() {
            document.addEventListener('DOMContentLoaded', () => {
                // Звук при старте квиза
                const startButton = document.getElementById('start-quiz');
                if (startButton) {
                    startButton.addEventListener('click', () => {
                        if (!this.isMuted) {
                            this.sounds.start.play();
                            console.log("🎮 Старт квиза - проигрывается звук");
                        }
                    });
                }
                
                // Звук при выборе ответа
                const optionsContainer = document.getElementById('options');
                if (optionsContainer) {
                    optionsContainer.addEventListener('click', (e) => {
                        if (e.target.classList.contains('option') && !e.target.classList.contains('selected')) {
                            if (!this.isMuted) {
                                this.sounds.select.play();
                                console.log("🎮 Выбор ответа - проигрывается звук");
                            }
                        }
                    });
                }
                
                // Звук при проверке ответа - исправленная версия
                const nextButton = document.getElementById('next-question');
                if (nextButton) {
                    nextButton.addEventListener('click', () => {
                        // Проверяем, что все необходимые переменные существуют
                        if (typeof window.selectedOption !== 'undefined' && 
                            typeof window.currentQuestion !== 'undefined' && 
                            typeof window.questionsForQuiz !== 'undefined' && 
                            window.questionsForQuiz && 
                            window.currentQuestion < window.questionsForQuiz.length && 
                            window.selectedOption !== null) {
                            
                            const correctAnswer = window.questionsForQuiz[window.currentQuestion].correct;
                            
                            if (!this.isMuted) {
                                if (window.selectedOption === correctAnswer) {
                                    setTimeout(() => {
                                        this.sounds.correct.play();
                                        console.log("🎮 Правильный ответ - проигрывается звук");
                                    }, 300);
                                } else {
                                    setTimeout(() => {
                                        this.sounds.wrong.play();
                                        console.log("🎮 Неправильный ответ - проигрывается звук");
                                    }, 300);
                                }
                            }
                        } else {
                            console.log("⚠️ Недостаточно данных для воспроизведения звука ответа");
                        }
                    });
                }
                
                // Звук при завершении квиза
                const resultsContainer = document.getElementById('results-container');
                if (resultsContainer) {
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && 
                                mutation.attributeName === 'style' && 
                                resultsContainer.style.display === 'block') {
                                if (!this.isMuted) {
                                    this.sounds.complete.play();
                                    console.log("🎮 Завершение квиза - проигрывается звук");
                                }
                            }
                        });
                    });
                    
                    observer.observe(resultsContainer, { attributes: true });
                }
            });
        }
    }
    
    // Создаем экземпляр и делаем доступным глобально
    window.quizSoundEffects = new SoundEffects();
    console.log("🎵 Модуль звуковых эффектов загружен");
})();
