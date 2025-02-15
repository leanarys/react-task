import React, { useState, useEffect } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { fetchQuizTemplate } from "../services/api";
import { QuizTemplate } from "../types/quiz-interface";

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quizTemplate, setQuizTemplate] = useState<QuizTemplate>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setErrorFlag] = useState<boolean>(false);

  useEffect(() => {
    const getActivities = async () => {
      try {
        const data = await fetchQuizTemplate();
        setQuizTemplate(data);
      } catch (error) {
        console.error("Failed to fetch quiz template", error);
        setErrorFlag(true);
      } finally {
        setLoading(false);
      }
    };

    getActivities();
  }, []);
  return (
    <ActivityContext.Provider value={{ quizTemplate, loading, error }}>
      {children}
    </ActivityContext.Provider>
  );
};
