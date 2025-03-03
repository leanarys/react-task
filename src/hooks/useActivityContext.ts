import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { ActivityContextType } from "../types/quiz.interface";

/**
 * Hook to access the activity context.
 * Must be used inside an ActivityProvider.
 */
export const useActivityContext = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivityContext must be used within an ActivityProvider");
  }
  return context;
};
