// enhanced-results.js

// Функция для улучшения экрана результатов
const ResultsEnhancer = {
    // Улучшение отображения результатов
    enhanceResults: function(score, totalQuestions) {
        const scoreElement = document.getElementById('score');
        if (!scoreElement) return;
        
        const percentage = Math.round((score / totalQuestions) * 100);
        
        let resultText;
        let resultClass;
        
        if (percentage >= 90) {
            resultText = 'Отлично! Вы эксперт в анатомии!';
            resultClass = 'result-excellent';
        } else if (percentage >= 70) {
            resultText = 'Хороший результат! Вы хорошо знаете анатомию!';
            resultClass = 'result-good';
        } else if (percentage >= 50) {
            resultText = 'Неплохо! Но есть над чем поработать.';
            resultClass = 'result-average';
        } else {
            resultText = 'Стоит подучить анатомию, но вы уже на пути к знаниям!';
            resultClass = 'result-needs-work';
        }
        
        // Заменяем стандартное отображение результатов на улучшенное
        scoreElement.innerHTML = `
            <p>Вы ответили правильно на ${score} из ${totalQuestions} вопросов</p>
            <p class="${resultClass}">${percentage}%</p>
            <p>${resultText}</p>
        `;
        
        // Добавляем эффект появления результатов
        scoreElement.style.animation = 'fadeIn 0.8s ease-out';
        
        // Улучшаем кнопки
        const shareButton = document.getElementById('share-results');
        const restartButton = document.getElementById('restart-quiz');
        
        if (shareButton) {
            shareButton.classList.add('enhanced-button');
        }
        
        if (restartButton) {
            restartButton.classList.add('enhanced-button');
        }
    }
};

// Экспортируем для использования в основном приложении
window.ResultsEnhancer = ResultsEnhancer;
