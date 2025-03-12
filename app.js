import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
  View,
  Snackbar,
  Avatar
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

// Импорт компонентов
import Home from './panels/Home';
import Game from './panels/Game';
import Categories from './panels/Categories';
import Achievements from './panels/Achievements';
import Results from './panels/Results';
import { Icon16ErrorCircleFill } from '@vkontakte/icons';

const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [popout, setPopout] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [gameStats, setGameStats] = useState({});
  const [gameResults, setGameResults] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);

        // Загружаем сохраненную статистику из localStorage
        const savedStatsString = localStorage.getItem('gameStats') || '{}';
        setGameStats(JSON.parse(savedStatsString));

        // Инициализируем приложение ВК
        bridge.send('VKWebAppInit');
      } catch (error) {
        console.error('Ошибка при инициализации:', error);
        showError('Не удалось загрузить данные пользователя');
      }
    }
    fetchData();
  }, []);

  const go = panel => {
    setActivePanel(panel);
  };

  const startGame = (categoryId) => {
    setCurrentCategory(categoryId);
    go('game');
  };

  const showError = (errorText) => {
    setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => setSnackbar(null)}
        before={
          <Avatar size={24} style={{ background: 'var(--dynamic_red)' }}>
            <Icon16ErrorCircleFill fill="#fff" width={14} height={14} />
          </Avatar>
        }
        duration={3000}
      >
        {errorText}
      </Snackbar>
    );
  };

  const showMessage = (messageText) => {
    setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => setSnackbar(null)}
        duration={2000}
      >
        {messageText}
      </Snackbar>
    );
  };

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout popout={popout}>
            <SplitCol>
              <View activePanel={activePanel}>
                <Home 
                  id='home' 
                  go={go} 
                  fetchedUser={fetchedUser} 
                  showError={showError}
                  showMessage={showMessage}
                />
                <Categories 
                  id='categories' 
                  go={go} 
                  startGame={startGame}
                  showError={showError}
                />
                <Game 
                  id='game' 
                  go={go} 
                  categoryId={currentCategory}
                  setGameResults={setGameResults}
                  setGameStats={setGameStats}
                  showError={showError}
                  showMessage={showMessage}
                />
                <Results 
                  id='results' 
                  go={go} 
                  gameResults={gameResults}
                />
                <Achievements 
                  id='achievements' 
                  go={go} 
                  gameStats={gameStats}
                  showError={showError}
                />
              </View>
            </SplitCol>
          </SplitLayout>
          {snackbar}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
