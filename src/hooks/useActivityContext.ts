import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { ActivityContextType } from "../types/quiz.interface";

/**
 * Custom hook to access the ActivityContext.
 * Ensures that the hook is used within an ActivityProvider.
 *
 * @throws {Error} If used outside of an ActivityProvider.
 * @returns {ActivityContextType} The current context value.
 */
export const useActivityContext = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error(
      "useActivityContext must be used within an ActivityProvider"
    );
  }
  return context;
};
