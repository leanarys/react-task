import { useContext } from "react";
import {
  ActivityContext,
  ActivityContextType,
} from "../../context/ActivityContext";

export const useActivityContext = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error(
      "useActivityContext must be used within an ActivityProvider"
    );
  }
  return context;
};
