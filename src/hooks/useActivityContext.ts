import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { ActivityContextType } from "../types/quiz.interface";

/**
 * Hook to access the activity context.
 */
export const useActivityContext = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivityContext must be inside ActivityProvider");
  }
  return context;
};
