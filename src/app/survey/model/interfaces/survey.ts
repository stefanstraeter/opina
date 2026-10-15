import { Question } from './question';

export interface Survey {
  id: number;
  title: string;
  category: string;
  deadline: string;
  description: string;
  questions: Question[];
}
