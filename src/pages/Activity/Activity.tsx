import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityContext } from "../../hooks/useActivityContext";
import styles from "./Activity.module.css";
import { Activity, Question, Round } from "../../types/quiz.interface";
import { parseBoldText } from "../../helpers/helpers";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const ActivityPage: React.FC = () => {
  // Get quiz data and loading state from context
  const { quizTemplate } = useActivityContext();

  // Get activity name from the URL params
  const { name } = useParams();

  // Navigation function
  const navigate = useNavigate();

  // Tracks whether the activity has multiple rounds
  const hasMultipleRounds = useRef<boolean>(false);

  // Activity data (null until loaded)
  const [activity, setActivity] = useState<Activity | null>(null);

  // Current question and round indices
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  // Sets the user responses
  const [userResponses, setUserResponses] = useState<Question[]>([]);

  // Controls the visibility of the round transition card
  const [showRoundCard, setShowRoundCard] = useState(false);

  // Find the activity by name when the component mounts
  useEffect(() => {
    // Reset `hasMultipleRounds` before processing
    hasMultipleRounds.current = false;

    // Wait until loading is complete
    if (quizTemplate) {
      // Look for the activity that matches the given name
      const selectedActivity = quizTemplate?.activities?.find(
        (act) => act.activity_name === name
      );
      
      if (!selectedActivity) {
        // Redirect if no matching activity is found
        navigate("/not-found");
      } else {
        // Resets User Answers
        const updatedActivity = resetUserAnswers(selectedActivity);

        // Store the selected activity
        setActivity({ ...updatedActivity });

        // Check if the activity has multiple rounds
        hasMultipleRounds.current = !!selectedActivity.questions?.[0]?.round_title;

        // Show round transition indicator if multiple rounds exist
        if (hasMultipleRounds.current) showRoundIndicator();
      }
    }

    return () => {
      // Reset when the component unmounts
      hasMultipleRounds.current = false;
    };
  }, [quizTemplate?.activities, name, navigate]);


  /**
 * Resets user answers if they contain data.
 * 
 * @param {Activity} selectedActivity - The activity to update.
 * @returns {Activity} - A new activity object with reset user answers.
 */
  const resetUserAnswers = (selectedActivity: Activity): Activity => {
    if (!selectedActivity?.questions) return selectedActivity; // Early return if no questions
  
    // Reset user_answers for all levels 
    const resetQuestions = (questions: Question[]): Question[] =>
      questions.map((question) => {
        // Start with spreading the question properties
        const resetQuestion: Question = { ...question };
  
        // Reset user_answers only if it exists
        if (question.user_answers) {
          resetQuestion.user_answers = [];
        }
  
        // If the question has nested questions, recursively reset their user_answers
        if (question.questions) {
          resetQuestion.questions = resetQuestions(question.questions);
        }
  
        return resetQuestion;
      });
  
    return { ...selectedActivity, questions: resetQuestions(selectedActivity.questions) };
  };
  
  /**
   * Temporarily shows the round indicator card for 1.9 seconds.
   * Sets `showRoundCard` to `true` and hides it after a timeout.
   */
  const showRoundIndicator = () => {
    setShowRoundCard(true);
    setTimeout(() => setShowRoundCard(false), 1900);
  };


  /**
   * Handles user answers for both single-round and multi-round quizzes.
   * Updates the user's responses and progresses through questions or rounds accordingly.
   * 
   * @param {boolean} isCorrect - Indicates whether the user's answer is correct.
   * @param {Question} question - The question being answered.
   */
  const handleAnswer = (isCorrect: boolean, question: Question) => {
    const updatedResponses = updateUserResponses(isCorrect, question);
    setUserResponses(updatedResponses);

    if (!activity) return;

    hasMultipleRounds.current
      ? handleMultiRoundProgress()
      : handleSingleRoundProgress();
  };

  /**
   * Updates the user responses state with the latest answer.
   * 
   * @param {boolean} userAnswer - User's response
   * @param {Question} question - The question being answered.
   * @returns {Question[]} - Updated user responses.
   */
  const updateUserResponses = (userAnswer: boolean, question: Question): Question[] => {
    question.user_answers.push(userAnswer);

    if (hasMultipleRounds.current) {
      question.round_title = `Round ${currentRoundIndex + 1}`;
    }

    return [...userResponses, { ...question, user_answers: [userAnswer] }];
  };

  /**
   * Advances to the next question or round in a multi-round quiz.
   */
  const handleMultiRoundProgress = () => {
    const currentRound = activity?.questions[currentRoundIndex];
    if (!currentRound || !currentRound.questions) return;

    const hasNextQuestion = currentQuestionIndex < currentRound.questions.length - 1;

    if (hasNextQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentRoundIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      showRoundIndicator();
    }
  };

  /**
   * Advances to the next question in a single-round quiz.
   */
  const handleSingleRoundProgress = () => {
    const hasNextQuestion = currentQuestionIndex < activity!.questions.length - 1;
    if (hasNextQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (userResponses.length > 0) {
      const totalQuestions = calculateTotalQuestions();
      if (userResponses.length === totalQuestions) {
        navigateToScore();
      }
    }
  }, [userResponses]);

  /**
   * Calculates the total number of questions in the activity.
   * Handles both single-round and multi-round activities.
   * 
   * @returns {number} - The total number of questions.
   */
  const calculateTotalQuestions = (): number => {
    if (hasMultipleRounds.current) {
      return (activity?.questions as Round[])?.reduce(
        (acc: number, round: Round) => acc + (round.questions ? round.questions.length : 0),
        0
      ) || 0;
    }
    return activity?.questions?.length || 0;
  };

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

  // Show a loading message while waiting for data
  if (!quizTemplate || !activity) return <Loader></Loader>;

  // Show error message if found
  if (!activity?.questions) {
    return <ErrorMessage message="Something went wrong while fetching activity. Please try again." type="warning" />;
  }
  // Get the activity name, defaulting to "Unknown Activity" if missing
  const activityName = activity?.activity_name?.toUpperCase() || "Unknown Activity";

  // Track the current question and round numbers (1-based for better readability)
  const currentQuestionNum = currentQuestionIndex + 1;
  const roundNum = currentRoundIndex + 1;

  // Get the current round title, or use a default if it's not available
  const roundTitle =
    activity?.questions?.[currentRoundIndex]?.round_title?.toUpperCase() || "Default Title";

  // Find the current question, adjusting for multi-round vs. single-round quizzes
  const currentQuestion = hasMultipleRounds.current
    ? activity?.questions?.[currentRoundIndex]?.questions?.[currentQuestionIndex] // Multi-round structure
    : activity?.questions?.[currentQuestionIndex]; // Single-round structure

  /**
   * Handles answer selection.
   * If there's no valid question, logs an error instead of crashing.
   */
  const handleAnswerClick = (userAnswer: boolean) => {
    if (!currentQuestion) {
      console.error("No question found", { currentRoundIndex, currentQuestionIndex });
      return;
    }
    handleAnswer(userAnswer, currentQuestion);
  };

  // Get the question prompt, with a fallback if it's missing
  const stimulus = currentQuestion?.stimulus ?? "Default Stimulus";

  // Loading completed, activity is available
  return (
    <div>
      {/* Single-round mode: Display the question interface if there are no multiple rounds */}
      {!hasMultipleRounds.current && (
        <div className={styles.activityContainer}>
          <div className={styles.activityHeaders}>
            {/* Display the activity name in uppercase */}
            <h1 className={styles.activityName}>
              {activityName}
            </h1>
            {/* Show the current question number */}
            <h1 className={styles.activityQuestionNo}>
              Q{currentQuestionNum}.
            </h1>
          </div>
          {/* Show the question text, allowing bold formatting */}
          <p
            className={styles.activityQuestionTxt}
            dangerouslySetInnerHTML={{ __html: parseBoldText(stimulus) }}
          />
          {/* Answer buttons */}
          <div className={styles.activityBtns}>
            <button onClick={() => handleAnswerClick(true)}>CORRECT</button>
            <button onClick={() => handleAnswerClick(false)}>INCORRECT</button>
          </div>
        </div>
      )}

      {/* Round transition indicator: Only shown for multi-round activities */}
      {showRoundCard && hasMultipleRounds.current && (
        <div className={styles.activityRoundCard}>
          <div className={styles.activityHeaders}>
            {/* Display activity name and round number */}
            <h1 className={styles.activityName}>
              {activityName}
            </h1>
            <h1 className={styles.activityQuestionNo}>
              ROUND {roundNum}
            </h1>
          </div>
        </div>
      )}

      {/* Multi-round mode: Display the question interface if not in transition */}
      {hasMultipleRounds.current && !showRoundCard && (
        <div className={styles.activityContainer}>
          <div className={styles.activityHeaders}>
            {/* Show activity name and round title (fallback if missing) */}
            <h1 className={styles.activityName}>
              {activityName} /{" "} {roundTitle}
            </h1>
            {/* Show the current question number */}
            <h1 className={styles.activityQuestioNo}>
              Q{currentQuestionNum}.
            </h1>
          </div>

          {/* Show the question text, allowing bold formatting */}
          <p
            className={styles.activityQuestionTxt}
            dangerouslySetInnerHTML={{ __html: parseBoldText(stimulus) }}
          />

          {/* Answer buttons */}
          <div className={styles.activityBtns}>
            <button onClick={() => handleAnswerClick(true)}>CORRECT</button>
            <button onClick={() => handleAnswerClick(false)}>INCORRECT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
