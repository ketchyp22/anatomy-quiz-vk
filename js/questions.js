import useUserStatistics from '../hooks/useUserStatistics';

const QuizQuestion = ({ question, topic, onAnswer }) => {
  // Добавляем доступ к методам статистики
  const { recordAnswer } = useUserStatistics();
  
  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === question.correctAnswer;
    
    // Записываем ответ в статистику
    recordAnswer(isCorrect, topic);
    
    // Ваш существующий код обработки ответа
    onAnswer(isCorrect);
  };
  
  // Остальной код компонента...
};

// Массив с вопросами для квиза
const questions = [
    // РАЗДЕЛ: КОСТНАЯ СИСТЕМА
    {
        question: "Какая кость является самой длинной в человеческом теле?",
        options: [
            "Плечевая кость",
            "Бедренная кость",
            "Большеберцовая кость",
            "Малоберцовая кость"
        ],
        correct: 1
    },
    {
        question: "Сколько костей в человеческом теле у взрослого человека?",
        options: [
            "106",
            "206",
            "306",
            "406"
        ],
        correct: 1
    },
    {
        question: "Какая кость является самой маленькой в человеческом теле?",
        options: [
            "Стремечко",
            "Наковальня",
            "Молоточек",
            "Фаланга мизинца"
        ],
        correct: 0
    },
    {
        question: "Какие кости образуют свод черепа?",
        options: [
            "Височная, теменная, лобная, затылочная",
            "Лобная, решетчатая, затылочная, скуловая",
            "Теменная, клиновидная, височная, скуловая",
            "Затылочная, клиновидная, решетчатая, сошник"
        ],
        correct: 0
    }
];

// Определяем темы для статистики
const quizTopics = {
    "КОСТНАЯ СИСТЕМА": questions
};

export { questions, quizTopics, QuizQuestion };
