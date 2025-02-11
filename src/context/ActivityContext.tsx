import { createContext } from "react";

export type ActivityContextType = {
  activities: any[];
  loading: boolean;
};

export const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);
