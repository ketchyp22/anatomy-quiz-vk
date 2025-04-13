export type QuizMode = 'anatomy' | 'clinical' | 'pharmacology';
export type DifficultyLevel = 'easy' | 'hard';

export interface UserData {
  id: string | number;
  first_name: string;
  photo_100: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  mode: QuizMode;
  difficulty: DifficultyLevel;
}
