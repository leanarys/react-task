import { createContext } from "react";
import { ActivityContextType } from "../types/quiz.interface";

// Context for managing quiz activity state.
export const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);
