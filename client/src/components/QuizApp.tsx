import React, { useState, useEffect } from 'react';
import StartScreen from './StartScreen';
import QuizContainer from './QuizContainer';
import ResultsContainer from './ResultsContainer';
import { QuizMode, DifficultyLevel, UserData, QuizQuestion } from '@/types/quiz';
import { getQuestions } from '@/utils/quizHelpers';

const QuizApp: React.FC = () => {
  // State
  const [currentScreen, setCurrentScreen] = useState<'start' | 'quiz' | 'results'>('start');
  const [quizMode, setQuizMode] = useState<QuizMode>('anatomy');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [userData, setUserData] = useState<UserData>({
    id: 'guest',
    first_name: 'Гость',
    photo_100: 'https://vk.com/images/camera_100.png'
  });
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerId, setTimerId] = useState<number | null>(null);

  const TOTAL_QUESTIONS = 25;

  // Load user data if VK Bridge is available
  useEffect(() => {
    const loadUserData = async () => {
      if (typeof window.vkBridge !== 'undefined') {
        try {
          const userData = await window.vkBridge.send('VKWebAppGetUserInfo');
          setUserData({
            id: userData.id,
            first_name: userData.first_name,
            photo_100: userData.photo_100
          });
        } catch (error) {
          console.error('Error fetching VK user data:', error);
        }
      }
    };

    loadUserData();
  }, []);

  // Start quiz
  const handleStartQuiz = () => {
    // Get questions based on selected mode and difficulty
    const quizQuestions = getQuestions(quizMode, difficulty, TOTAL_QUESTIONS);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
    setCurrentScreen('quiz');
    startTimer();
  };

  // Handle quiz option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOptionIndex !== null) return; // Prevent changing answer after selection
    
    setSelectedOptionIndex(optionIndex);
    
    // Check if answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    if (optionIndex === currentQuestion.correctOptionIndex) {
      setScore(prevScore => prevScore + 1);
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOptionIndex(null);
      resetTimer();
    } else {
      // End quiz
      clearTimer();
      setCurrentScreen('results');
    }
  };

  // Timer functions
  const startTimer = () => {
    setTimeRemaining(30);
    const id = window.setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearTimer();
          // Move to next question if time runs out
          if (selectedOptionIndex === null) {
            handleNextQuestion();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const resetTimer = () => {
    clearTimer();
    startTimer();
  };

  const clearTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    setCurrentScreen('start');
  };

  // Handle sharing results
  const handleShareResults = async () => {
    const resultMessage = `Я прошел медицинский квиз и набрал ${score} из ${TOTAL_QUESTIONS} баллов в режиме "${quizMode === 'anatomy' ? 'Анатомия' : quizMode === 'clinical' ? 'Клиническое мышление' : 'Фармакология'}"!`;
    
    if (typeof window.vkBridge !== 'undefined') {
      try {
        await window.vkBridge.send('VKWebAppShare', {
          link: window.location.href
        });
      } catch (error) {
        console.error('Error sharing via VK Bridge:', error);
        alert(resultMessage);
      }
    } else {
      alert(resultMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      {currentScreen === 'start' && (
        <StartScreen 
          onStartQuiz={handleStartQuiz}
          userData={userData}
          selectedMode={quizMode}
          onModeChange={setQuizMode}
          selectedDifficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      )}
      
      {currentScreen === 'quiz' && questions.length > 0 && (
        <QuizContainer 
          question={questions[currentQuestionIndex]}
          totalQuestions={TOTAL_QUESTIONS}
          currentQuestionIndex={currentQuestionIndex}
          selectedOptionIndex={selectedOptionIndex}
          onOptionSelect={handleOptionSelect}
          onNextQuestion={handleNextQuestion}
          timeRemaining={timeRemaining}
          userData={userData}
        />
      )}
      
      {currentScreen === 'results' && (
        <ResultsContainer 
          score={score}
          totalQuestions={TOTAL_QUESTIONS}
          onRestartQuiz={handleRestartQuiz}
          onShareResults={handleShareResults}
          quizMode={quizMode}
        />
      )}
    </div>
  );
};

// Declare vkBridge for TypeScript
declare global {
  interface Window {
    vkBridge?: {
      send: (method: string, params?: any) => Promise<any>;
    }
  }
}

export default QuizApp;
