import React from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Div,
  Button,
  Card,
  Text,
  Title,
  SimpleCell,
  Progress
} from '@vkontakte/vkui';

const Results = ({ id, go, gameResults }) => {
  if (!gameResults) {
    return (
      <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={() => go('home')} />}>
          Результаты
        </PanelHeader>
        <Div>
          <Text>Нет доступных результатов. Сначала пройдите игру.</Text>
        </Div>
        <Div>
          <Button stretched size="l" onClick={() => go('categories')}>
            Начать игру
          </Button>
        </Div>
      </Panel>
    );
  }

  const { correctAnswers, totalQuestions, percentage, category, newAchievements } = gameResults;

  // Определяем оценку в зависимости от процента правильных ответов
  let rating;
  if (percentage >= 90) {
    rating = 'Отлично!';
  } else if (percentage >= 70) {
    rating = 'Хорошо!';
  } else if (percentage >= 50) {
    rating = 'Неплохо!';
  } else {
    rating = 'Попробуйте еще раз!';
  }

  // Функция для получения понятного названия категории
  const getCategoryName = (categoryId) => {
    const categories = {
      'bones': 'Кости',
      'muscles': 'Мышцы',
      'organs': 'Органы',
      'systems': 'Системы организма',
      'diseases': 'Заболевания'
    };
    return categories[categoryId] || categoryId;
  };

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go('home')} />}>
        Результаты
      </PanelHeader>
      
      <Group>
        <Div>
          <Title level="1" weight="bold" style={{marginBottom: 16, textAlign: 'center'}}>
            {rating}
          </Title>
          
          <Card mode="shadow" style={{marginBottom: 16}}>
            <Div>
              <Text weight="semibold" style={{marginBottom: 8}}>
                Категория: {getCategoryName(category)}
              </Text>
              <Text weight="regular" style={{marginBottom: 8}}>
                Правильных ответов: {correctAnswers} из {totalQuestions}
              </Text>
              <Text weight="regular" style={{marginBottom: 16}}>
                Процент: {percentage}%
              </Text>
              <Progress value={percentage} style={{marginBottom: 8}} />
            </Div>
          </Card>
          
          {newAchievements && newAchievements.length > 0 && (
            <Card mode="shadow" style={{marginBottom: 16}}>
              <Div>
                <Text weight="semibold" style={{marginBottom: 8}}>
                  Новые достижения:
                </Text>
                {newAchievements.map((achievement, index) => (
                  <SimpleCell key={index}>
                    {achievement.replace(/_/g, ' ')}
                  </SimpleCell>
                ))}
              </Div>
            </Card>
          )}
        </Div>
      </Group>
      
      <Group>
        <Div>
          <Button stretched size="l" mode="primary" onClick={() => go('categories')}>
            Играть еще
          </Button>
        </Div>
        <Div>
          <Button stretched size="l" onClick={() => go('achievements')}>
            Достижения
          </Button>
        </Div>
        <Div>
          <Button stretched size="l" onClick={() => go('home')}>
            На главную
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

export default Results;
