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
  
  /* Анимация исчезновения */
  .fade-out {
    animation: fadeOut 0.5s ease forwards;
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  /* Стили для достижений */
  .achievements-section {
    margin-top: 16px;
  }
  
  .achievements-section h4 {
    margin-bottom: 10px;
    color: #2a5885;
  }
  
  .achievements-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .achievement-item {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #f5f6f8;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
  }
  
  .achievement-icon {
    font-size: 16px;
  }
  
  /* Стили для уведомления о достижении */
  .achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    display: flex;
    padding: 16px;
    z-index: 1000;
    max-width: 320px;
    animation: slideIn 0.5s ease forwards;
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .achievement-notification-icon {
    font-size: 36px;
    margin-right: 16px;
  }
  
  .achievement-notification-content {
    flex: 1;
  }
  
  .achievement-notification-title {
    font-size: 12px;
    color: #656565;
    margin-bottom: 4px;
  }
  
  .achievement-notification-name {
    font-size: 16px;
    font-weight: bold;
    color: #2a5885;
    margin-bottom: 4px;
  }
  
  .achievement-notification-desc {
    font-size: 14px;
    color: #333;
  }
  
  /* Стили для панели действий */
  .actions-panel {
    background-color: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-top: 16px;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .actions-panel h3 {
    color: #2a5885;
    margin-bottom: 12px;
    font-size: 18px;
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f6f8;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  
  .action-button:hover {
    background-color: #e5e7ea;
    transform: translateY(-2px);
  }
  
  .action-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .action-text {
    font-size: 14px;
    color: #2a5885;
  }
  
  /* Стили для полоски индикатора ежедневного посещения */
  .streak-info {
    margin-top: 12px;
    padding: 10px;
    background-color: #FFF8E1;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Улучшенный дизайн заголовка приложения */
  .app-logo {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .app-logo img {
    width: 120px;
    height: 120px;
    border-radius: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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
    <div class="actions-panel fade-in delay-4">
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
        <div class="action-button" onclick="VKIntegration.joinCommunity()">
          <div class="action-icon">👪</div>
          <div class="action-text">Вступить в сообщество</div>
        </div>
        <div class="action-button" onclick="VKIntegration.requestNotificationsPermission()">
          <div class="action-icon">🔔</div>
          <div class="action-text">Включить уведомления</div>
        </div>
      </div>
    </div>
  `;
};

// Обновляем метод renderMainMenu, чтобы добавить панель действий
const originalRenderMainMenu = UI.renderMainMenu;
UI.renderMainMenu = function() {
  originalRenderMainMenu.call(this);
  
  // Добавляем панель действий после кнопки "Поделиться результатами"
  const shareButton = document.querySelector('.button');
  if (shareButton) {
    const actionsPanel = document.createElement('div');
    actionsPanel.innerHTML = this.renderActionsPanel();
    shareButton.parentNode.insertBefore(actionsPanel, shareButton.nextSibling);
  }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
  // Добавляем дополнительные стили
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles; // Только дополнительные стили
  document.head.appendChild(styleElement);
  
  // Загружаем статистику пользователя
  UI.loadUserStats();
  
  // Инициализируем интеграцию с ВКонтакте
  VKIntegration.init();
  
  // Отображаем главное меню
  UI.renderMainMenu();
});
