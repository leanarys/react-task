import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityContext } from "../../context/hooks/useActivityContext"; // Context for shared data
import styles from "./Activity.module.css";
// import { Question } from "../types/quizTypes"; // TypeScript interface

const ActivityPage: React.FC = () => {
  const { activities, loading } = useActivityContext(); // Get activities from context
  const { name } = useParams(); // Get activity name from route
  const navigate = useNavigate(); // Router navigation
  const [activity, setActivity] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Question[]>([]);
  const [showRoundCard, setShowRoundCard] = useState(false);
  const hasMultipleRounds = useRef<boolean>(false);

  // Find activity by name when component mounts
  useEffect(() => {
    hasMultipleRounds.current = false;
    if (!loading) {
      const selectedActivity = activities?.find(
        (act) => act.activity_name === name
      );

      if (!selectedActivity) {
        navigate("/not-found");
      } else {
        setActivity(selectedActivity);

        hasMultipleRounds.current = selectedActivity?.questions?.[0]
          ?.round_title
          ? true
          : false;
        console.log("Has multiple rounds:", hasMultipleRounds.current);
        if (hasMultipleRounds.current) {
          showRoundIndicator();
        }
      }
    }

    return () => {
      hasMultipleRounds.current = false;
    };
  }, [loading, activities, name, navigate]);

  // Show round card briefly
  const showRoundIndicator = () => {
    setShowRoundCard(true);
    setTimeout(() => setShowRoundCard(false), 1900);
  };

  // Function to handle user answers for both normal and round-based questions
  const handleAnswer = (isCorrect: boolean, question: any) => {
    console.log("handleAnswer");
    question.user_answer = isCorrect;

    if (hasMultipleRounds.current) {
      question.round_title = `Round ${currentRoundIndex + 1}`;
    }

    const updatedResponses = [
      ...userResponses,
      { ...question, user_answer: isCorrect },
    ];

    setUserResponses(updatedResponses);
    if (hasMultipleRounds.current) {
      console.log("======");
      const currentRound = activity.questions[currentRoundIndex];
      const hasNextQuestion =
        currentQuestionIndex < currentRound.questions.length - 1;
      const hasNextRound = currentRoundIndex < activity.questions.length - 1;

      if (hasNextQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (hasNextRound) {
        setCurrentRoundIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        showRoundIndicator();
      }
    } else {
      const hasNextQuestion =
        currentQuestionIndex < activity.questions.length - 1;
      console.log("hasNextQuestion", hasNextQuestion);
      if (hasNextQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  // Ensure navigation happens only after userResponses updates
  useEffect(() => {
    if (userResponses.length > 0) {
      const totalQuestions = hasMultipleRounds.current
        ? activity.questions.reduce(
            (acc, round) => acc + round.questions.length,
            0
          )
        : activity.questions.length;
      if (userResponses.length === totalQuestions) {
        console.log("All responses collected, navigating to score.");
        navigateToScore();
      }
    }
  }, [userResponses]);

  // Navigate to score page
  const navigateToScore = () => {
    navigate("/score", {
      state: {
        activity_name: activity.activity_name,
        is_multi_round: hasMultipleRounds.current,
        questions: userResponses,
        prevRoute: "/activity",
      },
    });
  };

  if (loading || !activity) return <p>Loading...</p>;

  return (
    <div>
      {showRoundCard && hasMultipleRounds.current && (
        <div className={styles.activityRoundCard}>
          <div className={styles.activityHeaders}>
            <h1 className={styles.activityName}>
              {activity.activity_name.toUpperCase()}
            </h1>
            <h1 className={styles.activityQuestionNo}>
              ROUND {currentRoundIndex + 1}
            </h1>
          </div>
        </div>
      )}

      {/* Single round */}
      {!hasMultipleRounds.current && (
        <div className={styles.activityContainer}>
          <div className={styles.activityHeaders}>
            <h1 className={styles.activityName}>
              {activity.activity_name.toUpperCase()}
            </h1>
            <h1 className={styles.activityQuestionNo}>
              Q{currentQuestionIndex + 1}.
            </h1>
          </div>

          <p
            className={styles.activityQuestionTxt}
            dangerouslySetInnerHTML={{
              __html: activity.questions[currentQuestionIndex].stimulus,
            }}
          />
          <div className={styles.activityBtns}>
            <button
              onClick={() =>
                handleAnswer(true, activity.questions[currentQuestionIndex])
              }
            >
              CORRECT
            </button>
            <button
              onClick={() =>
                handleAnswer(false, activity.questions[currentQuestionIndex])
              }
            >
              INCORRECT
            </button>
          </div>
        </div>
      )}

      {/* Multiple rounds */}
      {hasMultipleRounds.current && !showRoundCard && (
        <div className={styles.activityContainer}>
          <div className={styles.activityHeaders}>
            <h1 className={styles.activityName}>
              {activity.activity_name.toUpperCase()} /{" "}
              {activity.questions[currentRoundIndex].round_title.toUpperCase()}
            </h1>
            <h1 className={styles.activityQuestioNo}>
              Q{currentQuestionIndex + 1}.
            </h1>
          </div>

          <p
            className={styles.activityQuestionTxt}
            dangerouslySetInnerHTML={{
              __html:
                activity.questions[currentRoundIndex].questions[
                  currentQuestionIndex
                ].stimulus,
            }}
          />

          <div className={styles.activityBtns}>
            <button
              onClick={() =>
                handleAnswer(
                  true,
                  activity.questions[currentRoundIndex].questions[
                    currentQuestionIndex
                  ]
                )
              }
            >
              CORRECT
            </button>
            <button
              onClick={() =>
                handleAnswer(
                  false,
                  activity.questions[currentRoundIndex].questions[
                    currentQuestionIndex
                  ]
                )
              }
            >
              INCORRECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
