import React from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Cell,
  Div,
  Avatar,
  Button,
  Text
} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';

const Home = ({ id, go, fetchedUser, showError, showMessage }) => {
  const inviteFriends = async () => {
    try {
      const { result } = await bridge.send("VKWebAppShowInviteBox", {});
      
      if (result) {
        showMessage('Приглашения отправлены!');
      }
    } catch (error) {
      console.error('Ошибка при отправке приглашений:', error);
      showError('Не удалось отправить приглашения. Попробуйте позже.');
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Анатомическая викторина</PanelHeader>
      
      {fetchedUser && (
        <Group>
          <Cell
            before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
            subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
          >
            {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
          </Cell>
        </Group>
      )}

      <Group>
        <Div>
          <Button stretched size="l" mode="primary" onClick={() => go('categories')}>
            Начать игру
          </Button>
        </Div>
        <Div>
          <Button stretched size="l" onClick={() => go('achievements')}>
            Достижения
          </Button>
        </Div>
        <Div>
          <Button stretched size="l" onClick={inviteFriends}>
            Пригласить друзей
          </Button>
        </Div>
      </Group>
      
      <Group>
        <Div>
          <Text weight="regular">
            Проверьте свои знания в области анатомии человека! Выберите категорию и ответьте на вопросы правильно, чтобы получить достижения.
          </Text>
        </Div>
      </Group>
    </Panel>
  );
};

export default Home;
