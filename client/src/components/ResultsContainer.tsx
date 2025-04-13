import React from 'react';
import { QuizMode } from '@/types/quiz';
import PulseLine from './PulseLine';

interface ResultsContainerProps {
  score: number;
  totalQuestions: number;
  quizMode: QuizMode;
  onRestartQuiz: () => void;
  onShareResults: () => void;
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({
  score,
  totalQuestions,
  quizMode,
  onRestartQuiz,
  onShareResults
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Get result message based on score percentage
  const getResultMessage = () => {
    if (percentage >= 90) {
      return 'Отличный результат! Вы показали исключительные знания!';
    } else if (percentage >= 70) {
      return 'Вы показали хороший результат!';
    } else if (percentage >= 50) {
      return 'Неплохой результат, но есть куда расти.';
    } else {
      return 'Рекомендуем повторить материал и попробовать снова.';
    }
  };

  // Get mode name
  const getModeName = () => {
    switch (quizMode) {
      case 'anatomy': return 'анатомии';
      case 'clinical': return 'клинического мышления';
      case 'pharmacology': return 'фармакологии';
      default: return 'медицинских знаний';
    }
  };

  return (
    <div id="results-container" className="bg-dark-surface rounded-xl overflow-hidden shadow-dark-card p-6 text-center">
      <PulseLine />
      
      <h2 className="text-xl font-bold mb-2">Результаты теста</h2>
      
      <div id="score" className="text-2xl font-bold my-6">
        Ваш результат: <span className="text-vk-blue">{score}</span> из <span>{totalQuestions}</span> ({percentage}%)
      </div>
      
      <div className="text-dark-text-secondary mb-6">
        {getResultMessage()} Вы показали хороший результат в области {getModeName()}!
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          id="share-results" 
          className="bg-vk-blue text-white font-medium py-2 px-6 rounded-lg transition-all hover:bg-vk-blue-hover flex items-center justify-center"
          onClick={onShareResults}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Поделиться
        </button>
        <button 
          id="restart-quiz" 
          className="bg-dark-border text-dark-text font-medium py-2 px-6 rounded-lg transition-all hover:bg-opacity-80 flex items-center justify-center"
          onClick={onRestartQuiz}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Начать заново
        </button>
      </div>
    </div>
  );
};

export default ResultsContainer;
