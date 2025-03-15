// enhanced-sharing.js
(function() {
    // Улучшенное окно "Поделиться"
    function enhanceSharing() {
        // Создаем стили
        const style = document.createElement('style');
        style.textContent = `
            .quiz-share-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }
            
            .quiz-share-content {
                background-color: var(--main-bg);
                border-radius: 12px;
                padding: 20px;
                max-width: 90%;
                width: 350px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                position: relative;
            }
            
            .quiz-share-close {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 24px;
                height: 24px;
                background: none;
                border: none;
                color: var(--text-color);
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .quiz-share-title {
                margin: 0 0 20px 0;
                font-size: 18px;
                text-align: center;
                color: var(--text-color);
            }
            
            .quiz-share-preview {
                background: linear-gradient(135deg, #4a76a8, #6d9eeb);
                border-radius: 8px;
                padding: 15px;
                color: white;
                text-align: center;
                margin-bottom: 20px;
            }
            
            .quiz-share-score {
                font-size: 28px;
                font-weight: bold;
                margin: 10px 0;
            }
            
            .quiz-share-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            
            .quiz-share-button {
                padding: 12px;
                border-radius: 8px;
                border: none;
                background-color: var(--option-bg);
                color: var(--text-color);
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .quiz-share-button:hover {
                background-color: var(--option-bg-hover);
                transform: translateY(-2px);
            }
            
            .quiz-share-button svg {
                width: 24px;
                height: 24px;
                margin-bottom: 8px;
            }

            .quiz-share-message {
                margin-top: 15px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 10px;
                font-size: 14px;
                color: var(--text-color);
                background-color: var(--option-bg);
            }
            
            .quiz-share-copy {
                width: 100%;
                margin-top: 15px;
                padding: 10px;
                border-radius: 8px;
                background-color: var(--btn-primary-bg);
                color: white;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .quiz-share-copy:hover {
                background-color: var(--btn-primary-bg-hover);
            }
        `;
        document.head.appendChild(style);
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'quiz-share-modal';
        modal.id = 'share-modal';
        
        // Создаем содержимое модального окна
        modal.innerHTML = `
            <div class="quiz-share-content">
                <button class="quiz-share-close" id="share-close">×</button>
                <h3 class="quiz-share-title">Поделиться результатом</h3>
                <div class="quiz-share-preview">
                    <div>Анатомический квиз</div>
                    <div class="quiz-share-score" id="modal-score">0%</div>
                    <div id="modal-message">Мой результат!</div>
                </div>
                <div class="quiz-share-options">
                    <button class="quiz-share-button" id="share-vk">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.44 7.37c.14-.4 0-.68-.67-.68h-2.2c-.57 0-.83.3-.97.64 0 0-1.13 2.76-2.73 4.56-.52.52-.75.68-1.04.68-.14 0-.34-.16-.34-.57V7.37c0-.5-.14-.68-.57-.68H9.35c-.32 0-.51.23-.51.45 0 .47.7.58.77 1.91v2.89c0 .64-.11.75-.36.75-.75 0-2.56-2.73-3.63-5.87-.21-.6-.42-.84-1-.84H2.42c-.64 0-.77.3-.77.64 0 .52.75 3.1 3.48 6.54 1.82 2.34 4.38 3.61 6.72 3.61 1.4 0 1.57-.31 1.57-.85v-1.96c0-.63.13-.75.57-.75.32 0 .88.16 2.18 1.41 1.48 1.48 1.73 2.14 2.56 2.14h2.2c.63 0 .95-.31.77-.94-.2-.61-.92-1.5-1.87-2.56-.52-.61-1.29-1.27-1.53-1.6-.32-.41-.23-.6 0-.96 0 0 2.7-3.8 2.98-5.09z"></path></svg>
                        ВКонтакте
                    </button>
                    <button class="quiz-share-button" id="share-message">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>
                        Сообщение
                    </button>
                    <button class="quiz-share-button" id="share-story">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-8c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5zm2 0c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path></svg>
                        История
                    </button>
                    <button class="quiz-share-button" id="share-friend">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                        Другу
                    </button>
                </div>
                <div class="quiz-share-message">
                    <div id="share-text">Я прошел Анатомический квиз и набрал 0%! Попробуй и ты!</div>
                </div>
                <button class="quiz-share-copy" id="copy-button">Скопировать текст</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Добавляем обработчики событий
        const closeButton = document.getElementById('share-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Закрытие модального окна по клику вне содержимого
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Кнопка копирования текста
        const copyButton = document.getElementById('copy-button');
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                const shareText = document.getElementById('share-text');
                if (shareText) {
                    // Копирование текста в буфер обмена
                    navigator.clipboard.writeText(shareText.textContent)
                        .then(() => {
                            // Временно меняем текст кнопки
                            const originalText = copyButton.textContent;
                            copyButton.textContent = 'Скопировано!';
                            setTimeout(() => {
                                copyButton.textContent = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Не удалось скопировать текст: ', err);
                        });
                }
            });
        }
        
        // Кнопки поделиться
        const shareVK = document.getElementById('share-vk');
        if (shareVK) {
            shareVK.addEventListener('click', () => {
                const shareText = document.getElementById('share-text');
                if (shareText && window.vkBridgeInstance) {
                    window.vkBridgeInstance.send('VKWebAppShare', {
                        message: shareText.textContent
                    })
                    .then(data => {
                        console.log('Поделились через ВК:', data);
                        modal.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Ошибка при шеринге через ВК:', error);
                    });
                } else {
                    alert('ВКонтакте не доступен или отсутствует VK Bridge');
                }
            });
        }
        
        // Переопределяем стандартную кнопку "Поделиться"
        const shareButton = document.getElementById('share-results');
        if (shareButton) {
            const originalClickHandler = shareButton.onclick;
            
            shareButton.onclick = function(event) {
                // Предотвращаем стандартное поведение
                event.preventDefault();
                
                // Получаем результаты
                const score = window.score || 0;
                const totalQuestions = window.questionsForQuiz ? window.questionsForQuiz.length : 25;
                const percentage = Math.round((score / totalQuestions) * 100);
                
                // Обновляем данные в модальном окне
                const modalScore = document.getElementById('modal-score');
                const shareText = document.getElementById('share-text');
                if (modalScore) modalScore.textContent = percentage + '%';
                
                // Создаем сообщение для шеринга
                let shareMessage = '';
                if (percentage >= 90) {
                    shareMessage = `Я эксперт в анатомии! Набрал ${percentage}% в анатомическом квизе!`;
                } else if (percentage >= 70) {
                    shareMessage = `Хорошо знаю анатомию! Мой результат ${percentage}% в анатомическом квизе!`;
                } else if (percentage >= 50) {
                    shareMessage = `Неплохой результат в анатомическом квизе - ${percentage}%. Сможешь лучше?`;
                } else {
                    shareMessage = `Я прошел анатомический квиз и набрал ${percentage}%. Попробуй и ты!`;
                }
                
                if (shareText) shareText.textContent = shareMessage;
                
                // Показываем модальное окно
                modal.style.display = 'flex';
                
                // Вызываем оригинальный обработчик, если он был
                if (originalClickHandler) {
                    // Но не в этом случае, так как он сразу отправляет в ВК
                    // originalClickHandler.call(this, event);
                }
            };
        }
    }
    
    // Инициализация улучшенного шеринга
    document.addEventListener('DOMContentLoaded', enhanceSharing);
})();
