import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityContext } from "../../context/hooks/useActivityContext"; // Context for shared data
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
        showRoundIndicator();
      }
    }
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
    question.round_title = `Round ${currentRoundIndex + 1}`;

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
      console.log("HAHAHAH");
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
      },
    });
  };

  if (loading || !activity) return <p>Loading...</p>;

  return (
    <div>
      {showRoundCard && hasMultipleRounds.current && (
        <div className="round-card">
          <h1>ROUND {currentRoundIndex + 1}</h1>
        </div>
      )}

      {!hasMultipleRounds.current && (
        <div className="activity-container">
          <h2>{activity.activity_name.toUpperCase()}</h2>
          <h1>Q{currentQuestionIndex + 1}.</h1>
          <p
            dangerouslySetInnerHTML={{
              __html: activity.questions[currentQuestionIndex].stimulus,
            }}
          />
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
      )}

      {hasMultipleRounds.current && !showRoundCard && (
        <div className="activity-container">
          <h1>
            {activity.activity_name.toUpperCase()} /{" "}
            {activity.questions[currentRoundIndex].round_title.toUpperCase()}
          </h1>
          <h1>Q{currentQuestionIndex + 1}.</h1>
          <p
            dangerouslySetInnerHTML={{
              __html:
                activity.questions[currentRoundIndex].questions[
                  currentQuestionIndex
                ].stimulus,
            }}
          />
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
      )}
    </div>
  );
};

export default ActivityPage;
