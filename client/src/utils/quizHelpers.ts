import { QuizMode, DifficultyLevel, QuizQuestion } from '@/types/quiz';
import { questions as allQuestions } from '@/data/questions';

/**
 * Get questions for a quiz based on mode and difficulty
 * @param mode Quiz mode (anatomy, clinical, pharmacology)
 * @param difficulty Difficulty level (easy, hard)
 * @param count Number of questions to return
 * @returns Array of quiz questions
 */
export const getQuestions = (
  mode: QuizMode, 
  difficulty: DifficultyLevel, 
  count: number
): QuizQuestion[] => {
  // Filter questions by mode and difficulty
  const filteredQuestions = allQuestions.filter(
    q => q.mode === mode && q.difficulty === difficulty
  );
  
  // If not enough questions, supplement with questions from other difficulty
  if (filteredQuestions.length < count) {
    const otherDifficulty: DifficultyLevel = difficulty === 'easy' ? 'hard' : 'easy';
    const additionalQuestions = allQuestions.filter(
      q => q.mode === mode && q.difficulty === otherDifficulty
    );
    
    // Combine and shuffle
    const combinedQuestions = [...filteredQuestions, ...additionalQuestions];
    return shuffleArray(combinedQuestions).slice(0, count);
  }
  
  // If enough questions, shuffle and return requested count
  return shuffleArray(filteredQuestions).slice(0, count);
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculate percentage score
 * @param score Number of correct answers
 * @param total Total number of questions
 * @returns Percentage as a number
 */
export const calculatePercentage = (score: number, total: number): number => {
  return Math.round((score / total) * 100);
};
