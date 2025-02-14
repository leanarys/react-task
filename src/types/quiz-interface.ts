export interface ActivityContextType {
  quizTemplate?: QuizTemplate;
  error: boolean
  loading: boolean;
}

export interface QuizTemplate {
  name: string;
  heading: string;
  activities: Activity[];
}

export interface Activity {
  activity_name: string;
  order: number;
  prev_route?: string;
  is_multi_round?: boolean;
  questions: Question[] | any;
  rounds?: Round[];
}

export interface Question {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answer?: boolean;
  user_answers: boolean[];
  feedback: string;
  round_title?: string;
  questions?: Question[];
}

export interface DisplayCardProps {
  smallHeader?: string;
  mainHeader?: string;
  footer?: string;
  directory?: string;
  children?: React.ReactNode;
  altText?: string;
}

export interface Round {
  round_title: string;
  order: number;
  questions: Question[];
}