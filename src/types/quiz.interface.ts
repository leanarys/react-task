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
  questions: Question[];
  rounds?: Round[];
}

export interface Question {
  is_correct: boolean;
  stimulus: string;
  order: number;
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

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  to?: string; // Route path for navigation
  disabled?: boolean;
};

export interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning";
}
