import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Cell,
  Div,
  Avatar,
  Spinner,
  Placeholder,
  Banner,
  Button
} from '@vkontakte/vkui';
import { Icon56GhostOutline } from '@vkontakte/icons';

const Categories = ({ id, go, startGame, showError }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для загрузки категорий
  const loadCategories = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Предполагаем, что у вас есть фиксированный список категорий
      const availableCategories = [
        { id: 'bones', title: 'Кости', icon: '💀' },
        { id: 'muscles', title: 'Мышцы', icon: '💪' },
        { id: 'organs', title: 'Органы', icon: '❤️' },
        { id: 'systems', title: 'Системы организма', icon: '🧠' },
        { id: 'diseases', title: 'Заболевания', icon: '🩺' }
      ];
      
      // Сохраняем категории в localStorage для кэширования
      localStorage.setItem('gameCategories', JSON.stringify(availableCategories));
      
      setCategories(availableCategories);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
      
      // В случае ошибки пытаемся загрузить из localStorage
      const cachedCategories = localStorage.getItem('gameCategories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        setLoading(false);
      } else {
        setError('Не удалось загрузить категории игр');
        setLoading(false);
      }
    }
  };

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go('home')} />}>
        Выберите категорию
      </PanelHeader>
      
      {loading && <Spinner size="large" style={{ margin: '20px auto' }} />}
      
      {error && !loading && (
        <Div>
          <Banner 
            mode="error"
            header="Ошибка загрузки"
            subheader={error}
            actions={<Button onClick={loadCategories}>Повторить</Button>}
          />
        </Div>
      )}
      
      {!loading && !error && categories.length === 0 && (
        <Placeholder
          icon={<Icon56GhostOutline />}
          header="Категории не найдены"
        >
          Попробуйте обновить страницу или вернуться позже.
        </Placeholder>
      )}
      
      {!loading && !error && categories.length > 0 && (
        <Group>
          {categories.map(category => (
            <Cell
              key={category.id}
              before={<Avatar size={40}>{category.icon}</Avatar>}
              onClick={() => startGame(category.id)}
              expandable
            >
              {category.title}
            </Cell>
          ))}
        </Group>
      )}
    </Panel>
  );
};

export default Categories;
