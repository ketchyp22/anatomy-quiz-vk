// sound-effects.js
(function() {
    // Создаем звуковые эффекты с использованием Web Audio API
    class SoundEffects {
        constructor() {
            // Создаем аудио контекст
            this.audioContext = null;
            this.isMuted = false;
            this.sounds = {};
            
            // Инициализация аудио контекста при первом взаимодействии
            document.addEventListener('click', () => {
                if (!this.audioContext) {
                    this.initAudio();
                }
            }, { once: true });
            
            // Добавляем кнопку включения/выключения звука
            this.createMuteButton();
        }
        
        initAudio() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.createSounds();
            } catch (e) {
                console.error('Web Audio API не поддерживается в этом браузере.', e);
            }
        }
        
        createSounds() {
            // Звук при выборе ответа
            this.sounds.select = {
                play: () => this.playTone(600, 0.1, 'sine')
            };
            
            // Звук при правильном ответе
            this.sounds.correct = {
                play: () => {
                    this.playTone(800, 0.1, 'sine');
                    setTimeout(() => this.playTone(1000, 0.15, 'sine'), 100);
                }
            };
            
            // Звук при неправильном ответе
            this.sounds.wrong = {
                play: () => {
                    this.playTone(300, 0.1, 'sine');
                    setTimeout(() => this.playTone(200, 0.15, 'sine'), 100);
                }
            };
            
            // Звук при старте квиза
            this.sounds.start = {
                play: () => {
                    this.playTone(500, 0.1, 'sine');
                    setTimeout(() => this.playTone(700, 0.1, 'sine'), 150);
                    setTimeout(() => this.playTone(900, 0.15, 'sine'), 300);
                }
            };
            
            // Звук при завершении квиза
            this.sounds.complete = {
                play: () => {
                    this.playTone(700, 0.1, 'sine');
                    setTimeout(() => this.playTone(900, 0.1, 'sine'), 150);
                    setTimeout(() => this.playTone(1100, 0.1, 'sine'), 300);
                    setTimeout(() => this.playTone(1300, 0.2, 'sine'), 450);
                }
            };
        }
        
        playTone(frequency, duration, type = 'sine') {
            if (!this.audioContext || this.isMuted) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Устанавливаем громкость (меньше значение - тише звук)
            gainNode.gain.value = 0.1;
            
            // Плавный звук (fade in/out)
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, now + duration);
            
            oscillator.start();
            oscillator.stop(now + duration);
        }
        
        toggleMute() {
            this.isMuted = !this.isMuted;
            const button = document.getElementById('mute-button');
            if (button) {
                button.innerHTML = this.isMuted 
                    ? '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 4L9 8H5v8h4l3 4V4zm3 2v2a4 4 0 0 1 0 8v2a6 6 0 0 0 0-12z" fill="currentColor"/><path d="M3 3L21 21" stroke="currentColor" stroke-width="2"/></svg>'
                    : '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 4L9 8H5v8h4l3 4V4zm3 2v2a4 4 0 0 1 0 8v2a6 6 0 0 0 0-12z" fill="currentColor"/></svg>';
            }
        }
        
        createMuteButton() {
            const button = document.createElement('button');
            button.id = 'mute-button';
            button.className = 'mute-button';
            button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 4L9 8H5v8h4l3 4V4zm3 2v2a4 4 0 0 1 0 8v2a6 6 0 0 0 0-12z" fill="currentColor"/></svg>';
            button.addEventListener('click', () => this.toggleMute());
            
            // Стили для кнопки
            const style = document.createElement('style');
            style.textContent = `
                .mute-button {
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
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }
                
                .mute-button:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
            
            // Добавляем кнопку на страницу
            document.body.appendChild(button);
        }
    }
    
    // Интеграция со страницей
    document.addEventListener('DOMContentLoaded', () => {
        const soundEffects = new SoundEffects();
        
        // Глобальный доступ к звуковым эффектам
        window.QuizSounds = soundEffects.sounds;
        
        // Добавляем обработчики событий для звуковых эффектов
        
        // Звук при старте квиза
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (window.QuizSounds && window.QuizSounds.start) {
                    window.QuizSounds.start.play();
                }
            });
        }
        
        // Звук при выборе ответа
        const optionsContainer = document.getElementById('options');
        if (optionsContainer) {
            optionsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('option') && !e.target.classList.contains('selected')) {
                    if (window.QuizSounds && window.QuizSounds.select) {
                        window.QuizSounds.select.play();
                    }
                }
            });
        }
        
        // Звук при проверке ответа
        const nextButton = document.getElementById('next-question');
        if (nextButton) {
            const originalClickHandler = nextButton.onclick;
            
            nextButton.onclick = function(event) {
                // Сохраняем текущий выбранный и правильный ответы
                const selected = document.querySelector('.option.selected');
                const correct = document.querySelector('.option[data-index="' + window.questionsForQuiz[window.currentQuestion].correct + '"]');
                
                // Вызываем оригинальный обработчик
                if (originalClickHandler) {
                    originalClickHandler.call(this, event);
                }
                
                // Воспроизводим соответствующий звук
                if (selected && correct) {
                    if (selected.dataset.index === correct.dataset.index) {
                        if (window.QuizSounds && window.QuizSounds.correct) {
                            window.QuizSounds.correct.play();
                        }
                    } else {
                        if (window.QuizSounds && window.QuizSounds.wrong) {
                            window.QuizSounds.wrong.play();
                        }
                    }
                }
            };
        }
        
        // Звук при завершении квиза
        // Мы не можем напрямую перехватить момент показа результатов
        // Поэтому используем MutationObserver для отслеживания появления экрана результатов
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style' && 
                        resultsContainer.style.display === 'block') {
                        if (window.QuizSounds && window.QuizSounds.complete) {
                            window.QuizSounds.complete.play();
                        }
                    }
                });
            });
            
            observer.observe(resultsContainer, { attributes: true });
        }
    });
})();
