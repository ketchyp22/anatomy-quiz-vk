// Глобальные переменные для отслеживания текущего состояния
let currentCategory;
let currentQuestionIndex;
let score;

// Дополнительные стили для уведомлений и новых элементов
const additionalStyles = `
  /* Стили для уведомлений */
  .notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(73, 134, 204, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    font-size: 16px;
    max-width: 90%;
    animation: slideUp 0.3s ease forwards;
  }
  
  .notification.error {
    background-color: rgba(244, 67, 54, 0.9);
  }
  
  .notification.success {
    background-color: rgba(76, 175, 80, 0.9);
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;

// Добавляем дополнительные методы в объект UI

// Метод для показа уведомлений
UI.showNotification = function(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
};

// Добавляем метод для отображения панели действий
UI.renderActionsPanel = function() {
  return `
    <div class="actions-panel">
      <h3>Дополнительные действия</h3>
      <div class="actions-grid">
        <div class="action-button" onclick="VKIntegration.addToFavorites()">
          <div class="action-icon">⭐</div>
          <div class="action-text">Добавить в избранное</div>
        </div>
        <div class="action-button" onclick="VKIntegration.inviteFriends()">
          <div class="action-icon">👥</div>
          <div class="action-text">Пригласить друзей</div>
        </div>
      </div>
    </div>
  `;
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
  // Добавляем дополнительные стили
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
  
  // Загружаем статистику пользователя
  if (UI && UI.loadUserStats) {
    UI.loadUserStats();
  }
  
  // Инициализируем интеграцию с ВКонтакте
  if (VKIntegration && VKIntegration.init) {
    VKIntegration.init();
  }
  
  // Отображаем главное меню
  if (UI && UI.renderMainMenu) {
    UI.renderMainMenu();
  }
});