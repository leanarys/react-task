import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityContext } from "../../hooks/useActivityContext"; // Context for shared data
import styles from "./Activity.module.css";
import { Activity, Question, Round } from "../../types/quiz.interface";
import { parseBoldText } from "../../helpers/parseBoldText";

const ActivityPage: React.FC = () => {
  const { quizTemplate, loading } = useActivityContext(); // Get activities from context
  const { name } = useParams(); // Get activity name from route
  const navigate = useNavigate(); // Router navigation
  const [activity, setActivity] = useState<Activity | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Question[]>([]);
  // Controls the visibility of the round transition card
  const [showRoundCard, setShowRoundCard] = useState(false);
  // Flag for activity with multiple rounds
  const hasMultipleRounds = useRef<boolean>(false);

  // Find activity by name when component mounts
  useEffect(() => {
    // Ensure `hasMultipleRounds` starts as `false`
    hasMultipleRounds.current = false;

    // Proceed only when loading is complete
    if (!loading) {
      // Find the activity that matches the given name
      const selectedActivity = quizTemplate?.activities?.find(
        (act) => act.activity_name === name
      );

      // If no matching activity is found, navigate to the "Not Found" page
      if (!selectedActivity) {
        navigate("/not-found");
      } else {
        // Set the found activity as the current activity
        setActivity(selectedActivity);
        // Determine if the activity has multiple rounds by checking for `round_title`
        hasMultipleRounds.current = selectedActivity?.questions?.[0]
          ?.round_title
          ? true
          : false;
        // If the activity has multiple rounds, show the round transition indicator
        if (hasMultipleRounds.current) {
          showRoundIndicator();
        }
      }
    }

    return () => {
      // Reset `hasMultipleRounds` when the component unmounts.
      hasMultipleRounds.current = false;
    };
  }, [loading, quizTemplate?.activities, name, navigate]);


  /**
   * Displays the round indicator card for 1.9 seconds.
   * This function sets `setShowRoundCard` to `true` and then hides it after a timeout.
   */
  const showRoundIndicator = () => {
    setShowRoundCard(true);
    setTimeout(() => setShowRoundCard(false), 1900);
  };

  /**
   * Handles user answers for both normal and round-based questions
   * @param isCorrect 
   * @param question 
   * @returns 
   */
  const handleAnswer = (isCorrect: boolean, question: Question) => {
    question.user_answer = isCorrect;

    // Sets the round title
    if (hasMultipleRounds.current) {
      question.round_title = `Round ${currentRoundIndex + 1}`;
    }

    // Create a new array with the existing user responses and 
    // add the current question along with the user's answer (correct or not).
    const updatedResponses = [
      ...userResponses,
      { ...question, user_answer: isCorrect },
    ];

    setUserResponses(updatedResponses);

    // Exit early if `activity` is not available to prevent errors.
    if (!activity) return;

    // Activity has multple rounds
    if (hasMultipleRounds.current) {

      const currentRound = activity.questions[currentRoundIndex];
      // Exit if no Round or questions
      if (!currentRound || !currentRound.questions) return;

      // Checks for next question/s
      const hasNextQuestion =
        currentQuestionIndex < currentRound.questions.length - 1;
      // Checks for the next round
      const hasNextRound = currentRoundIndex < activity.questions.length - 1;
      // If there are multiple rounds

      if (hasNextQuestion) {
        // Move to the next question within the current round
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (hasNextRound) {
        // Move to the next round and reset the question index
        setCurrentRoundIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        // Show round transition indicator
        showRoundIndicator();
      }
      // If there is only a single round
    } else {
      const hasNextQuestion = currentQuestionIndex < activity.questions.length - 1;
      if (hasNextQuestion) {
        // Move to the next question
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    // Ensures there are user responses
    if (userResponses.length > 0) {
      // Counts the number of questions
      const totalQuestions = hasMultipleRounds.current
        ? activity?.questions?.reduce(
          (acc: number, round: Round) => acc + (round.questions ? round.questions.length : 0),
          0
        ) || 0
        : activity?.questions?.length || 0;

      // Navigates to Score page if responses count matches the number of questions
      if (userResponses.length === totalQuestions) {
        navigateToScore();
      }
    }
  }, [userResponses]);

  /**
   * Navigates to the Score page and passes relevant state.
   * 
   * State includes:
   * - `activity_name`: The name of the activity.
   * - `is_multi_round`: Whether the activity has multiple rounds.
   * - `questions`: The user's responses.
   * - `prev_route`: The previous route for potential navigation handling.
   */
  const navigateToScore = () => {
    navigate("/score", {
      state: {
        activity_name: activity?.activity_name,
        is_multi_round: hasMultipleRounds.current,
        questions: userResponses,
        prev_route: "/activity",
      },
    });
  };

  // Loader
  if (loading || !activity) return <p>Loading...</p>;

  // Loading completed or activity available
  return (
    <div>
      {/* Displays the round indicator card if `showRoundCard` is true and multiple rounds exist */}
      {showRoundCard && hasMultipleRounds.current && (
        <div className={styles.activityRoundCard}>
          <div className={styles.activityHeaders}>
            {/* Display the activity name in uppercase */}
            <h1 className={styles.activityName}>
              {activity.activity_name.toUpperCase()}
            </h1>
            {/* Show the current round number */}
            <h1 className={styles.activityQuestionNo}>
              ROUND {currentRoundIndex + 1}
            </h1>
          </div>
        </div>
      )}

      {/* Single round mode: Displays question interface when there's no multiple rounds */}
      {!hasMultipleRounds.current && (
        <div className={styles.activityContainer}>
          <div className={styles.activityHeaders}>
            {/* Display the activity name in uppercase */}
            <h1 className={styles.activityName}>
              {activity.activity_name.toUpperCase()}
            </h1>
            {/* Show the current question number */}
            <h1 className={styles.activityQuestionNo}>
              Q{currentQuestionIndex + 1}.
            </h1>
          </div>
          {/* Display the question text, allowing bold formatting via `parseBoldText` */}
          <p
            className={styles.activityQuestionTxt}
            dangerouslySetInnerHTML={{
              __html: parseBoldText(
                activity.questions[currentQuestionIndex].stimulus
              ),
            }}
          />
          {/* Answer buttons: User selects 'CORRECT' or 'INCORRECT' */}
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

      {/* Multiple rounds mode: Displays the question interface when there are multiple rounds */}
      {hasMultipleRounds.current && !showRoundCard && (
        <div className={styles.activityContainer}>
          <div className={styles.activityHeaders}>
            {/* Display the activity name and round title (fallback to "Default Title" if missing) */}
            <h1 className={styles.activityName}>
              {activity.activity_name.toUpperCase()} /{" "}
              {activity?.questions?.[
                currentRoundIndex
              ]?.round_title?.toUpperCase() ?? "Default Title"}
            </h1>
            {/* Show the current question number */}
            <h1 className={styles.activityQuestioNo}>
              Q{currentQuestionIndex + 1}.
            </h1>
          </div>
          {/* Display the question text, allowing bold formatting via `parseBoldText`. 
          Fallbacks to "Default Stimulus" if no question stimulus is available. */}
          <p
            className={styles.activityQuestionTxt}
            dangerouslySetInnerHTML={{
              __html: parseBoldText(
                activity.questions?.[currentRoundIndex]?.questions?.[
                  currentQuestionIndex
                ]?.stimulus ?? "Default Stimulus"
              ),
            }}
          />
          {/* Answer buttons: User selects 'CORRECT' or 'INCORRECT' */}
          <div className={styles.activityBtns}>
            <button
              onClick={() => {
                handleAnswer(
                  true,
                  activity.questions[currentRoundIndex].questions[
                  currentQuestionIndex
                  ]
                );
              }}
            >
              CORRECT
            </button>
            <button
              onClick={() => {
                handleAnswer(
                  false,
                  activity.questions[currentRoundIndex].questions[
                  currentQuestionIndex
                  ]
                );
              }}
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
