import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Div,
  Cell,
  Avatar,
  Text,
  Button,
  Placeholder
} from '@vkontakte/vkui';
import { Icon56GhostOutline } from '@vkontakte/icons';

// Компонент для отображения пустого состояния достижений
const EmptyAchievements = ({ onPlayGame }) => {
  return (
    <Placeholder
      icon={<Icon56GhostOutline />}
      header="Достижения пока недоступны"
    >
      <Div>
        <Text weight="regular" style={{ margin: '8px 0 16px' }}>
          Чтобы разблокировать достижения, необходимо пройти хотя бы одну викторину с результатом выше 70%.
        </Text>
        <Button size="m" onClick={onPlayGame}>
          Играть сейчас
        </Button>
      </Div>
    </Placeholder>
  );
};

const Achievements = ({ id, go, gameStats, showError }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Список всех возможных достижений
  const allAchievements = [
    { id: 'first_completion_bones', title: 'Первое прохождение: Кости', description: 'Завершите викторину по категории "Кости"', icon: '💀' },
    { id: 'first_completion_muscles', title: 'Первое прохождение: Мышцы', description: 'Завершите викторину по категории "Мышцы"', icon: '💪' },
    { id: 'first_completion_organs', title: 'Первое прохождение: Органы', description: 'Завершите викторину по категории "Органы"', icon: '❤️' },
    { id: 'first_completion_systems', title: 'Первое прохождение: Системы', description: 'Завершите викторину по категории "Системы организма"', icon: '🧠' },
    { id: 'first_completion_diseases', title: 'Первое прохождение: Заболевания', description: 'Завершите викторину по категории "Заболевания"', icon: '🩺' },
    { id: 'high_score_bones', title: 'Знаток костей', description: 'Получите более 80% в викторине по категории "Кости"', icon: '🏆' },
    { id: 'high_score_muscles', title: 'Мастер мышц', description: 'Получите более 80% в викторине по категории "Мышцы"', icon: '🏆' },
    { id: 'high_score_organs', title: 'Эксперт по органам', description: 'Получите более 80% в викторине по категории "Органы"', icon: '🏆' },
    { id: 'high_score_systems', title: 'Физиолог', description: 'Получите более 80% в викторине по категории "Системы организма"', icon: '🏆' },
    { id: 'high_score_diseases', title: 'Диагност', description: 'Получите более 80% в викторине по категории "Заболевания"', icon: '🏆' },
    { id: 'all_categories', title: 'Анатом', description: 'Пройдите все категории викторины', icon: '👨‍⚕️' },
    { id: 'perfect_score', title: 'Идеальный результат', description: 'Ответьте правильно на все вопросы в любой категории', icon: '🎯' }
  ];

  // Загрузка достижений пользователя
  useEffect(() => {
    const loadAchievements = () => {
      try {
        // Получаем сохраненные достижения из localStorage
        const savedAchievementsString = localStorage.getItem('achievements') || '[]';
        const savedAchievementIds = JSON.parse(savedAchievementsString);
       
        // Фильтруем только разблокированные достижения
        const unlockedAchievements = allAchievements.filter(achievement => 
          savedAchievementIds.includes(achievement.id)
        );
       
        setAchievements(unlockedAchievements);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке достижений:', error);
        showError('Не удалось загрузить достижения');
        setLoading(false);
      }
    };

    loadAchievements();
  }, [showError]);

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go('home')} />}>
        Достижения
      </PanelHeader>
     
      {loading ? (
        <Div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh'}}>
          <Text>Загрузка достижений...</Text>
        </Div>
      ) : achievements.length > 0 ? (
        <Group>
          {achievements.map(achievement => (
            <Cell
              key={achievement.id}
              before={<Avatar size={40}>{achievement.icon}</Avatar>}
              description={achievement.description}
            >
              {achievement.title}
            </Cell>
          ))}
        </Group>
      ) : (
        <EmptyAchievements onPlayGame={() => go('categories')} />
      )}
    </Panel>
  );
 };

 export default Achievements;