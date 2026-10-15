export interface Answer {
  id: number;
  text: string;
  votes: number;
}

export interface Question {
  id: number;
  text: string;
  multiple: boolean;
  answers: Answer[];
}
