import React, { useState, useEffect, useRef } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Div,
  Button,
  Progress,
  Card,
  Text,
  Header,
  SimpleCell,
  Snackbar
} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';

// Предположим, что есть модуль с вопросами
import { getQuestionsByCategory } from '../data/questions';

const Game = ({ id, go, categoryId, setGameResults, setGameStats, showError, showMessage }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 секунд на игру
  const [isLoading, setIsLoading] = useState(true);
  const [hintShown, setHintShown] = useState(false);
  const [correctAnswerHighlighted, setCorrectAnswerHighlighted] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  
  const timerRef = useRef(null);

  // Загрузка вопросов для выбранной категории
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await getQuestionsByCategory(categoryId);
        setQuestions(loadedQuestions);
        setUserAnswers(Array(loadedQuestions.length).fill(null));
        setIsLoading(false);
        setGameActive(true);
      } catch (error) {
        console.error('Ошибка при загрузке вопросов:', error);
        showError('Не удалось загрузить вопросы. Попробуйте позже.');
        go('categories');
      }
    };

    if (categoryId) {
      loadQuestions();
    }
  }, [categoryId, go, showError]);

  // Управление таймером
  useEffect(() => {
    if (gameActive && !isLoading && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameActive, isLoading]);

  // Функция для ответа на вопрос
  const answerQuestion = (answerIndex) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);

    // Если это последний вопрос, завершаем игру, иначе переходим к следующему
    if (currentQuestionIndex === questions.length - 1) {
      finishGame();
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  // Функция для показа рекламы и получения подсказки
  const showAdForHint = async () => {
    try {
      const adResult = await bridge.send('VKWebAppShowNativeAds', {
        ad_format: 'reward'
      });
      
      // Если реклама успешно показана и пользователь получил награду
      if (adResult.result) {
        // Логика для активации подсказки
        showHint();
        return true;
      }
    } catch (error) {
      console.error('Ошибка при показе рекламы:', error);
      showError('Не удалось загрузить рекламу. Попробуйте позже.');
    }
    return false;
  };

  // Функция для показа рекламы и получения дополнительного времени
  const showAdForExtraTime = async () => {
    try {
      const adResult = await bridge.send('VKWebAppShowNativeAds', {
        ad_format: 'reward'
      });
      
      // Если реклама успешно показана и пользователь получил награду
      if (adResult.result) {
        // Добавить 30 секунд к текущему времени
        addExtraTime(30);
        return true;
      }
    } catch (error) {
      console.error('Ошибка при показе рекламы:', error);
      showError('Не удалось загрузить рекламу. Попробуйте позже.');
    }
    return false;
  };

  // Функция для отображения подсказки
  const showHint = () => {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
      return;
    }
    
    // Получаем текущий вопрос и отображаем правильный ответ
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswerIndex;
    
    // Визуально выделяем правильный ответ в интерфейсе
    setHintShown(true);
    setCorrectAnswerHighlighted(correctAnswer);
    
    // Скрыть подсказку через 3 секунды
    setTimeout(() => {
      setHintShown(false);
      setCorrectAnswerHighlighted(null);
    }, 3000);
    
    showMessage('Показан правильный ответ!');
  };

  // Функция для добавления дополнительного времени
  const addExtraTime = (seconds) => {
    setTimeLeft(prevTime => prevTime + seconds);
    showMessage(`Добавлено ${seconds} секунд!`);
  };

  // Функция для сохранения результатов игры
  const saveGameResults = (category, correctAnswers, totalQuestions) => {
    // Получаем текущую статистику из localStorage
    const savedStatsString = localStorage.getItem('gameStats') || '{}';
    const savedStats = JSON.parse(savedStatsString);
    
    // Обновляем статистику для данной категории
    savedStats[category] = {
      played: (savedStats[category]?.played || 0) + 1,
      correct: (savedStats[category]?.correct || 0) + correctAnswers,
      total: (savedStats[category]?.total || 0) + totalQuestions,
      lastPlayed: new Date().toISOString(),
    };
    
    // Сохраняем обновленную статистику
    localStorage.setItem('gameStats', JSON.stringify(savedStats));
    
    // Обновляем состояние в родительском компоненте
    setGameStats(savedStats);
    
    return savedStats;
  };

  // Функция для проверки достижений
  const checkAchievements = (correctAnswers, totalQuestions, category) => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Получаем текущие достижения
    const savedAchievementsString = localStorage.getItem('achievements') || '[]';
    const savedAchievements = JSON.parse(savedAchievementsString);
    
    // Определяем новые достижения
    const newAchievements = [];
    
    // Пример: первое прохождение категории
    const firstCompletionId = `first_completion_${category}`;
    if (!savedAchievements.includes(firstCompletionId)) {
      newAchievements.push(firstCompletionId);
    }
    
    // Пример: высокий результат (более 80%)
    if (percentage >= 80) {
      const highScoreId = `high_score_${category}`;
      if (!savedAchievements.includes(highScoreId)) {
        newAchievements.push(highScoreId);
      }
    }
    
    // Сохраняем новые достижения
    if (newAchievements.length > 0) {
      const updatedAchievements = [...savedAchievements, ...newAchievements];
      localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    }
    
    return newAchievements;
  };

  // Функция для завершения игры
  const finishGame = () => {
    // Остановка таймера
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setGameActive(false);
    
    // Подсчитываем результаты
    const totalQuestions = questions.length;
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswerIndex
    ).length;
    
    // Сохраняем результаты
    const updatedStats = saveGameResults(categoryId, correctAnswers, totalQuestions);
    
    // Проверяем достижения
    const newAchievements = checkAchievements(correctAnswers, totalQuestions, categoryId);
    
    // Устанавливаем результаты для экрана результатов
    setGameResults({
      correctAnswers,
      totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
      category: categoryId,
      stats: updatedStats[categoryId],
      newAchievements
    });
    
    // Переходим на экран с результатами
    go('results');
  };

  // Если данные загружаются
  if (isLoading) {
    return (
      <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={() => go('categories')} />}>
          Загрузка игры
        </PanelHeader>
        <Div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh'}}>
          <Text>Загрузка вопросов...</Text>
        </Div>
      </Panel>
    );
  }

  // Текущий вопрос
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go('categories')} />}>
        Вопрос {currentQuestionIndex + 1} из {questions.length}
      </PanelHeader>
      
      <Group>
        <Div>
          <Text weight="semibold" style={{marginBottom: 10}}>
            Осталось времени: {timeLeft} сек.
          </Text>
          <Progress value={(timeLeft / 60) * 100} />
        </Div>
      </Group>
      
      <Group header={<Header mode="secondary">Вопрос:</Header>}>
        <Div>
          <Card mode="shadow">
            <Div>
              <Text weight="regular">{currentQuestion.text}</Text>
            </Div>
          </Card>
        </Div>
      </Group>
      
      <Group header={<Header mode="secondary">Варианты ответов:</Header>}>
        {currentQuestion.options.map((option, index) => (
          <SimpleCell
            key={index}
            onClick={() => answerQuestion(index)}
            style={{
              backgroundColor: correctAnswerHighlighted === index ? 'rgba(46, 204, 113, 0.3)' : undefined,
              margin: '8px 0',
              borderRadius: '8px'
            }}
          >
            {option}
          </SimpleCell>
        ))}
      </Group>
      
      <Group>
        <Div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={showAdForHint} disabled={hintShown} size="m">
            Подсказка
          </Button>
          <Button onClick={showAdForExtraTime} size="m">
            +30 секунд
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

export default Game;
