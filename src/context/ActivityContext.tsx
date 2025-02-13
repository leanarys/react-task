import { createContext } from "react";
import { ActivityContextType } from "../types/quiz-interface";

export const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);
