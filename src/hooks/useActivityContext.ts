import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { ActivityContextType } from "../types/quiz-interface";

export const useActivityContext = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  console.log("context", context);
  if (!context) {
    throw new Error(
      "useActivityContext must be used within an ActivityProvider"
    );
  }
  return context;
};
