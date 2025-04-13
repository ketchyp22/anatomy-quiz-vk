import React from 'react';
import { QuizQuestion, UserData } from '@/types/quiz';
import UserInfo from './UserInfo';

interface QuizContainerProps {
  question: QuizQuestion;
  totalQuestions: number;
  currentQuestionIndex: number;
  selectedOptionIndex: number | null;
  timeRemaining: number;
  userData: UserData;
  onOptionSelect: (index: number) => void;
  onNextQuestion: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  question,
  totalQuestions,
  currentQuestionIndex,
  selectedOptionIndex,
  timeRemaining,
  userData,
  onOptionSelect,
  onNextQuestion
}) => {
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div id="quiz-container" className="bg-dark-surface rounded-xl overflow-hidden shadow-dark-card">
      {/* Quiz header with user info */}
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <UserInfo userData={userData} compact={true} />
        <div id="question-counter" className="text-dark-text-secondary text-sm">
          Вопрос <span>{currentQuestionIndex + 1}</span> из <span>{totalQuestions}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div id="progress-bar-container" className="h-1 bg-dark-border">
        <div 
          id="progress-bar" 
          className="h-full bg-vk-blue transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Timer */}
      <div id="timer" className="text-center text-sm py-2 text-dark-text-secondary">
        Оставшееся время: <span>{timeRemaining}</span> сек
      </div>

      {/* Question and options */}
      <div className="p-6">
        <div id="question" className="text-lg font-medium mb-6">
          {question.text}
        </div>

        <div id="options" className="grid gap-3 mb-6">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`option 
                ${selectedOptionIndex === null 
                  ? 'bg-dark-surface hover:bg-opacity-80 border border-dark-border' 
                  : selectedOptionIndex === index 
                    ? 'bg-option-selected border border-vk-blue' 
                    : 'bg-dark-surface border border-dark-border'
                } 
                rounded-lg p-4 cursor-pointer transition-all`}
              onClick={() => onOptionSelect(index)}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Next button */}
        <div className="text-center">
          <button 
            id="next-question" 
            className="bg-vk-blue text-white font-medium py-2 px-6 rounded-lg transition-all hover:bg-vk-blue-hover disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={selectedOptionIndex === null}
            onClick={onNextQuestion}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;
