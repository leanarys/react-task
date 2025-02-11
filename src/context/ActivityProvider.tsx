import React, { useState, useEffect } from "react";
import { ActivityContext, ActivityContextType } from "./ActivityContext"; // ✅ Ensure correct import
import { fetchActivityTemplate } from "../services/api";

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activities, setActivities] = useState<
    ActivityContextType["activities"]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getActivities = async () => {
      try {
        const data = await fetchActivityTemplate();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };

    getActivities();
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, loading }}>
      {children}
    </ActivityContext.Provider>
  );
};
