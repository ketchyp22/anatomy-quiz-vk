import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App';

// Init VK Mini App
bridge.send('VKWebAppInit');

ReactDOM.render(<App />, document.getElementById('root'));

// Если вы хотите, чтобы ваше веб-приложение работало в автономном режиме
// и загружалось быстрее, вы можете изменить unregister() на register() ниже.
// Обратите внимание, что это имеет некоторые подводные камни.
// Узнайте больше о service workers: https://bit.ly/CRA-PWA
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.error('Error registering service worker:', error);
      });
  }
}
