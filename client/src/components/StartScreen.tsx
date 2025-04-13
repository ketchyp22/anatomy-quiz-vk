import React from 'react';
import { UserData, QuizMode, DifficultyLevel } from '@/types/quiz';
import PulseLine from './PulseLine';
import UserInfo from './UserInfo';

interface StartScreenProps {
  userData: UserData;
  selectedMode: QuizMode;
  selectedDifficulty: DifficultyLevel;
  onModeChange: (mode: QuizMode) => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStartQuiz: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  userData,
  selectedMode,
  selectedDifficulty,
  onModeChange,
  onDifficultyChange,
  onStartQuiz
}) => {
  return (
    <div id="start-screen" className="bg-dark-surface rounded-xl overflow-hidden shadow-dark-card relative medical-pattern">
      {/* Top border gradient */}
      <div className="h-1.5 bg-gradient-to-r from-vk-blue via-blue-400 to-vk-blue"></div>
      
      {/* User info */}
      <UserInfo userData={userData} />

      {/* Quiz header with pulse line */}
      <div className="text-center py-6 relative">
        <h1 className="text-2xl font-bold text-center mb-1">Медицинский квиз</h1>
        <PulseLine />
        <p className="text-dark-text-secondary mb-6">
          Проверьте свои знания анатомии человека!
        </p>
      </div>

      {/* Difficulty selection */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Выберите уровень сложности:</h2>
        <div className="flex justify-center gap-4">
          <div className="bg-dark-border rounded-full p-1 inline-flex">
            <button 
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedDifficulty === 'easy' 
                  ? 'bg-vk-blue text-white' 
                  : 'text-dark-text-secondary hover:bg-opacity-20 hover:bg-white'
              }`}
              onClick={() => onDifficultyChange('easy')}
            >
              Обычный
            </button>
            <button 
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedDifficulty === 'hard' 
                  ? 'bg-vk-blue text-white' 
                  : 'text-dark-text-secondary hover:bg-opacity-20 hover:bg-white'
              }`}
              onClick={() => onDifficultyChange('hard')}
            >
              Сложный
            </button>
          </div>
        </div>
      </div>

      {/* Quiz mode selection */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Выберите режим:</h2>
        <div className="grid gap-4">
          <div 
            className={`quiz-mode-btn bg-dark-surface border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMode === 'anatomy' ? 'border-vk-blue' : 'border-dark-border hover:border-vk-blue'
            }`}
            onClick={() => onModeChange('anatomy')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 ${selectedMode === 'anatomy' ? 'text-vk-blue' : 'text-dark-text-secondary'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Анатомия</h3>
                <p className="text-sm text-dark-text-secondary">
                  Проверьте свои знания анатомии человека с вопросами разной сложности.
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`quiz-mode-btn bg-dark-surface border rounded-lg p-4 cursor-pointer transition-all relative ${
              selectedMode === 'clinical' ? 'border-vk-blue' : 'border-dark-border hover:border-vk-blue'
            }`}
            onClick={() => onModeChange('clinical')}
          >
            <div className="absolute -top-1 -right-1">
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 ${selectedMode === 'clinical' ? 'text-vk-blue' : 'text-dark-text-secondary'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Клиническое мышление</h3>
                <p className="text-sm text-dark-text-secondary">
                  Развивайте клиническое мышление, анализируя сложные случаи из практики!
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`quiz-mode-btn bg-dark-surface border rounded-lg p-4 cursor-pointer transition-all relative ${
              selectedMode === 'pharmacology' ? 'border-vk-blue' : 'border-dark-border hover:border-vk-blue'
            }`}
            onClick={() => onModeChange('pharmacology')}
          >
            <div className="absolute -top-1 -right-1">
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 ${selectedMode === 'pharmacology' ? 'text-vk-blue' : 'text-dark-text-secondary'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Фармакология</h3>
                <p className="text-sm text-dark-text-secondary">
                  Проверьте знания лекарственных препаратов, дозировок и лекарственных взаимодействий.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="px-6 pb-8 text-center">
        <button 
          id="start-quiz" 
          className="bg-gradient-to-r from-vk-blue to-vk-blue-hover text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          onClick={onStartQuiz}
        >
          Начать квиз
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
