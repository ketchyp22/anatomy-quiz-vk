// UI-компоненты для приложения Анатомического Квиза
const UIComponents = {
  // Создание карточки с анимацией
  createCard: function(content, className = '', style = {}) {
    const card = document.createElement('div');
    card.className = `card animated ${className}`;
    
    // Применяем дополнительные стили
    Object.keys(style).forEach(key => {
      card.style[key] = style[key];
    });
    
    // Устанавливаем содержимое
    if (typeof content === 'string') {
      card.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      card.appendChild(content);
    }
    
    return card;
  },
  
  // Создание кнопки с возможностью настройки
  createButton: function(text, onClick, options = {}) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = options.className || 'btn';
    
    if (options.icon) {
      const icon = document.createElement('span');
      icon.className = 'button-icon';
      icon.textContent = options.icon;
      button.prepend(icon);
    }
    
    if (onClick) {
      button.addEventListener('click', onClick);
    }
    
    if (options.disabled) {
      button.disabled = true;
    }
    
    return button;
  },
  
  // Создание модального окна
  createModal: function(title, content, actions = []) {
    const modal = document.createElement('div');
    modal.className = 'ui-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'ui-modal-content';
    
    // Добавляем заголовок
    const modalTitle = document.createElement('div');
    modalTitle.className = 'ui-modal-title';
    modalTitle.textContent = title;
    modalContent.appendChild(modalTitle);
    
    // Добавляем крестик для закрытия
    const closeButton = document.createElement('button');
    closeButton.className = 'ui-modal-close';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    modalTitle.appendChild(closeButton);
    
    // Добавляем содержимое
    const modalBody = document.createElement('div');
    modalBody.className = 'ui-modal-body';
    if (typeof content === 'string') {
      modalBody.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      modalBody.appendChild(content);
    }
    modalContent.appendChild(modalBody);
    
    // Добавляем кнопки действий
    if (actions.length > 0) {
      const modalFooter = document.createElement('div');
      modalFooter.className = 'ui-modal-footer';
      
      actions.forEach(action => {
        const button = this.createButton(action.text, () => {
          if (action.callback) {
            action.callback();
          }
          document.body.removeChild(modal);
        }, {
          className: `btn ${action.primary ? 'btn-primary' : ''}`
        });
        modalFooter.appendChild(button);
      });
      
      modalContent.appendChild(modalFooter);
    }
    
    modal.appendChild(modalContent);
    
    // Добавляем на страницу
    document.body.appendChild(modal);
    
    return modal;
  },
  
  // Создание уведомления
  createNotification: function(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `ui-notification ui-notification-${type}`;
    notification.textContent = message;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Удаляем через указанное время
    setTimeout(() => {
      notification.classList.add('ui-notification-hide');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, duration);
    
    return notification;
  },
  
  // Создание рейтинга пользователя (звездочки)
  createRating: function(value, max = 5, readonly = true, onChange = null) {
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'ui-rating';
    ratingContainer.dataset.value = value;
    
    for (let i = 1; i <= max; i++) {
      const star = document.createElement('span');
      star.className = 'ui-rating-star';
      star.textContent = i <= value ? '★' : '☆';
      star.dataset.value = i;
      
      if (!readonly) {
        star.addEventListener('click', () => {
          ratingContainer.querySelectorAll('.ui-rating-star').forEach((s, index) => {
            s.textContent = index + 1 <= i ? '★' : '☆';
          });
          
          ratingContainer.dataset.value = i;
          
          if (onChange) {
            onChange(i);
          }
        });
      }
      
      ratingContainer.appendChild(star);
    }
    
    return ratingContainer;
  },
  
  // Создание переключателя
  createToggle: function(checked = false, onChange = null, label = '') {
    const container = document.createElement('div');
    container.className = 'ui-toggle-container';
    
    const toggle = document.createElement('label');
    toggle.className = 'ui-toggle';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    
    const slider = document.createElement('span');
    slider.className = 'ui-toggle-slider';
    
    toggle.appendChild(input);
    toggle.appendChild(slider);
    container.appendChild(toggle);
    
    if (label) {
      const labelElement = document.createElement('span');
      labelElement.className = 'ui-toggle-label';
      labelElement.textContent = label;
      container.appendChild(labelElement);
    }
    
    if (onChange) {
      input.addEventListener('change', () => {
        onChange(input.checked);
      });
    }
    
    return container;
  },
  
  // Создание прогресс-бара
  createProgressBar: function(value, max = 100, showPercentage = true) {
    const container = document.createElement('div');
    container.className = 'ui-progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'ui-progress-bar';
    
    const progress = document.createElement('div');
    progress.className = 'ui-progress';
    progress.style.width = `${(value / max) * 100}%`;
    
    progressBar.appendChild(progress);
    container.appendChild(progressBar);
    
    if (showPercentage) {
      const percentage = document.createElement('div');
      percentage.className = 'ui-progress-percentage';
      percentage.textContent = `${Math.round((value / max) * 100)}%`;
      container.appendChild(percentage);
    }
    
    return container;
  },
  
  // Создание селектора опций
  createSelect: function(options = [], selectedIndex = 0, onChange = null) {
    const select = document.createElement('select');
    select.className = 'ui-select';
    
    options.forEach((option, index) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value || option;
      optionElement.textContent = option.text || option;
      optionElement.selected = index === selectedIndex;
      select.appendChild(optionElement);
    });
    
    if (onChange) {
      select.addEventListener('change', (event) => {
        onChange(event.target.value, select.selectedIndex);
      });
    }
    
    return select;
  },
  
  // Создание горизонтальных вкладок
  createTabs: function(tabs = [], activeIndex = 0, onTabChange = null) {
    const container = document.createElement('div');
    container.className = 'ui-tabs-container';
    
    const tabsList = document.createElement('div');
    tabsList.className = 'ui-tabs-list';
    
    const tabContent = document.createElement('div');
    tabContent.className = 'ui-tabs-content';
    
    tabs.forEach((tab, index) => {
      // Создаем вкладку
      const tabElement = document.createElement('div');
      tabElement.className = `ui-tab ${index === activeIndex ? 'ui-tab-active' : ''}`;
      tabElement.textContent = tab.title;
      tabElement.dataset.index = index;
      
      // Добавляем обработчик клика
      tabElement.addEventListener('click', () => {
        // Обновляем активную вкладку
        container.querySelectorAll('.ui-tab').forEach(t => t.classList.remove('ui-tab-active'));
        tabElement.classList.add('ui-tab-active');
        
        // Обновляем содержимое
        tabContent.innerHTML = '';
        if (typeof tab.content === 'string') {
          tabContent.innerHTML = tab.content;
        } else if (tab.content instanceof HTMLElement) {
          tabContent.appendChild(tab.content);
        }
        
        // Вызываем обработчик
        if (onTabChange) {
          onTabChange(index, tab);
        }
      });
      
      tabsList.appendChild(tabElement);
      
      // Устанавливаем начальное содержимое
      if (index === activeIndex) {
        if (typeof tab.content === 'string') {
          tabContent.innerHTML = tab.content;
        } else if (tab.content instanceof HTMLElement) {
          tabContent.appendChild(tab.content);
        }
      }
    });
    
    container.appendChild(tabsList);
    container.appendChild(tabContent);
    
    return container;
  }
};
