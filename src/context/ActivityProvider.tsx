import React, { useState, useEffect } from "react";
import { ActivityContext } from "../context/ActivityContext";
import { fetchQuizTemplate } from "../services/api";
import { QuizTemplate } from "../types/quiz.interface";

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Store the quiz template data
  const [quizTemplate, setQuizTemplate] = useState<QuizTemplate>();
  // Track loading status
  const [loading, setLoading] = useState<boolean>(true);
  // Track if an error occurred
  const [error, setErrorFlag] = useState<boolean>(false);

  /** 
   * Fetches quiz data from the API.  
   * Updates state with the data or sets an error if the request fails.  
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
