import React, { useState, useEffect } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { fetchQuizTemplate } from "../services/api";
import { QuizTemplate } from "../types/quiz.interface";

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the quiz template data
  const [quizTemplate, setQuizTemplate] = useState<QuizTemplate>();
  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to track if an error occurred
  const [error, setErrorFlag] = useState<boolean>(false);

  /**
   * Fetches the quiz template data from the API.
   * Updates state with the retrieved data or sets an error flag if the request fails.
   * Ensures the loading state is updated once the request completes.
   */
  const fetchActivities = async () => {
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

  useEffect(() => {
    // Fetch activities on component mount
    fetchActivities();
  }, []); // Runs once


  return (
    // Provides quiz template data, loading state, and error flag to consumers
    <ActivityContext.Provider value={{ quizTemplate, loading, error }}>
      {children}
    </ActivityContext.Provider>
  );
};
