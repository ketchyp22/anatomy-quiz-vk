import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

// Функция для сохранения статистики в localStorage
const saveUserStats = (userId, stats) => {
  try {
    localStorage.setItem(`user_stats_${userId}`, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error saving stats:', error);
    return false;
  }
};

// Функция для загрузки статистики из localStorage
const loadUserStats = (userId) => {
  try {
    const stats = localStorage.getItem(`user_stats_${userId}`);
    return stats ? JSON.parse(stats) : null;
  } catch (error) {
    console.error('Error loading stats:', error);
    return null;
  }
};

// Хук для работы со статистикой
const useUserStatistics = () => {
  const [userId, setUserId] = useState(null);
  const [userStats, setUserStats] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuizzes: 0,
    topicsProgress: {},
    lastActivity: null
  });

  // Инициализация — получаем ID пользователя безопасным способом
  useEffect(() => {
    const initUserData = async () => {
      try {
        const userData = await bridge.send('VKWebAppGetUserInfo');
        setUserId(userData.id);
        
        // Загружаем сохраненную статистику
        const savedStats = loadUserStats(userData.id);
        if (savedStats) {
          setUserStats(savedStats);
        }
      } catch (error) {
        console.error('Failed to get user data:', error);
      }
    };
    
    initUserData();
  }, []);

  // Функция для обновления статистики
  const updateStatistics = (data) => {
    if (!userId) return false;
    
    const newStats = {
      ...userStats,
      ...data,
      lastActivity: new Date().toISOString()
    };
    
    setUserStats(newStats);
    saveUserStats(userId, newStats);
    return true;
  };

  return {
    userStats,
    updateStatistics,
    // Вспомогательные методы для конкретных обновлений
    recordAnswer: (isCorrect, topic) => {
      const topicsProgress = {...userStats.topicsProgress};
      
      if (!topicsProgress[topic]) {
        topicsProgress[topic] = { total: 0, correct: 0 };
      }
      
      topicsProgress[topic].total += 1;
      if (isCorrect) {
        topicsProgress[topic].correct += 1;
      }
      
      return updateStatistics({
        correctAnswers: isCorrect ? userStats.correctAnswers + 1 : userStats.correctAnswers,
        wrongAnswers: !isCorrect ? userStats.wrongAnswers + 1 : userStats.wrongAnswers,
        topicsProgress
      });
    },
    finishQuiz: (topic, score, totalQuestions) => {
      return updateStatistics({
        totalQuizzes: userStats.totalQuizzes + 1,
        lastQuizTopic: topic,
        lastQuizScore: score,
        lastQuizTotal: totalQuestions
      });
    }
  };
};

export default useUserStatistics;
