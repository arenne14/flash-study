export type CardStatus = 'unanswered' | 'correct' | 'wrong';

export type Card = {
  id: string;
  question: string;
  answer: string;
  wrong: string[];
  status: CardStatus;
};

export type Course = {
  id: string;
  name: string;
  color: string;
  cards: Card[];
};

export type AppData = {
  name: string;
  courses: Course[];
  recentStack: string[];
};
