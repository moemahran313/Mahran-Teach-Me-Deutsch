
export enum AppView {
  CHAT = 'chat',
  VOCABULARY = 'vocabulary',
  PRONUNCIATION = 'pronunciation',
  GRAMMAR = 'grammar'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface FlashcardData {
  id: string;
  german: string;
  english: string;
  example: string;
  category: 'Food' | 'Travel' | 'Daily Life';
  gender?: 'der' | 'die' | 'das' | 'none';
}

export interface PronunciationResult {
  score: number;
  transcription: string;
  feedback: string;
  phonemeAnalysis: string;
  isPerfect: boolean;
}

export interface GrammarExercise {
  id: string;
  sentence: string; // e.g., "Ich ____ nach Hause."
  answer: string;
  options: string[];
  explanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  content: string;
  exercises: GrammarExercise[];
}
