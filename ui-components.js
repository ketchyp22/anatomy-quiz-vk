/* Стили UI-компонентов для Анатомического Квиза */

/* Карточка */
.card {
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px var(--shadow-color);
  margin-bottom: 15px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

/* Кнопка */
.btn {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 500;
  transition: all 0.3s;
  background-color: var(--card-color);
  color: var(--text-color);
  box-shadow: 0 2px 5px var(--shadow-color);
  margin: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.button-icon {
  margin-right: 8px;
  font-size: 1.2em;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Модальное окно */
.ui-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s forwards;
}

.ui-modal-content {
  background-color: var(--card-color);
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s forwards;
}

.ui-modal-title {
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.ui-modal-close {
  position: absolute;
  right: 15px;
  top: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  padding: 0;
  margin: 0;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.ui-modal-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.ui-modal-body {
  padding: 15px;
  max-height: 60vh;
  overflow-y: auto;
}

.ui-modal-footer {
  padding: 15px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Уведомления */
.ui-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: var(--card-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideInRight 0.3s forwards;
  max-width: 300px;
}

.ui-notification-info {
  border-left: 4px solid var(--primary-color);
}

.ui-notification-success {
  border-left: 4px solid var(--secondary-color);
}

.ui-notification-warning {
  border-left: 4px solid #f5b942;
}

.ui-notification-error {
  border-left: 4px solid var(--accent-color);
}

.ui-notification-hide {
  animation: slideOutRight 0.3s forwards;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

/* Рейтинг (звездочки) */
.ui-rating {
  display: inline-flex;
  align-items: center;
}

.ui-rating-star {
  font-size: 24px;
  color: #f5b942;
  cursor: default;
  transition: transform 0.2s;
}

.ui-rating:not([readonly]) .ui-rating-star:hover {
  transform: scale(1.2);
  cursor: pointer;
}

/* Переключатель */
.ui-toggle-container {
  display: flex;
  align-items: center;
}

.ui-toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin-right: 10px;
}

.ui-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.ui-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: .4s;
  border-radius: 34px;
}

.ui-toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.ui-toggle input:checked + .ui-toggle-slider {
  background-color: var(--primary-color);
}

.ui-toggle input:checked + .ui-toggle-slider:before {
  transform: translateX(26px);
}

.ui-toggle-label {
  font-size: 16px;
}

/* Прогресс-бар */
.ui-progress-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.ui-progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.ui-progress {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.5s;
}

.ui-progress-percentage {
  margin-left: 10px;
  font-size: 14px;
  width: 45px;
  text-align: right;
}

/* Селектор */
.ui-select {
  display: block;
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
  color: var(--text-color);
  font-size: 16px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
}

.ui-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Вкладки */
.ui-tabs-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--card-color);
  box-shadow: 0 2px 5px var(--shadow-color);
}

.ui-tabs-list {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.ui-tab {
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  text-align: center;
  border-bottom: 3px solid transparent;
}

.ui-tab:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.ui-tab-active {
  border-bottom-color: var(--primary-color);
  font-weight: bold;
}

.ui-tabs-content {
  padding: 15px;
  min-height: 100px;
}

/* Анимации для компонентов */
.ui-fade-in {
  animation: uiFadeIn 0.3s forwards;
}

.ui-slide-in {
  animation: uiSlideIn 0.3s forwards;
}

.ui-scale-in {
  animation: uiScaleIn 0.3s forwards;
}

@keyframes uiFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes uiSlideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes uiScaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Адаптивные стили для компонентов */
@media (max-width: 768px) {
  .ui-modal-content {
    width: 95%;
  }
  
  .ui-tabs-list {
    flex-wrap: wrap;
  }
  
  .ui-tab {
    flex-basis: 50%;
    padding: 10px;
  }
}
