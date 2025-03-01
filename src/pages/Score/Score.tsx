import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import styles from "./Score.module.css";
import { Activity, Question, Round } from "../../types/quiz.interface";
import { parseBoldText } from "../../helpers/parseBoldText";
const ScorePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activityResults, setActivityResults] = useState<Activity | null>(null);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);
  const [openRoundIndex, setOpenRoundIndex] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve activity results from the navigation state
    const results = location.state as Activity;
    // If no results are available, redirect the user to the home page
    if (!results) {
      navigate("/");
    } else {
      // Store activity results in state
      setActivityResults(results);
      // If the activity has multiple rounds, group questions by round
      if (results?.is_multi_round && results?.questions) {
        setActivityResults({
          ...results,
          rounds: groupQuestionsByRound(results.questions),
        });
      }
    }
    // Redirect to home if the user came from the activity page
    // This ensures that the user cannot retake the quiz starting from the last question
    return () => {
      if (location?.state?.prev_route == "/activity") {
        navigate("/");
      }
    };
  }, [location, navigate]);


  /**
   * Groups an array of questions into rounds based on their `round_title`.
   * Ensures that questions are correctly categorized into their respective rounds.
   * 
   * @param {Question[]} questions - The list of questions to group by rounds.
   * @returns {Round[]} - An array of grouped rounds with associated questions.
   */
  const groupQuestionsByRound = (questions: Question[]): Round[] => {
    const groupedRounds = Object.values(
      questions.reduce((acc, question) => {
        const roundKey = question.round_title; // Extract round title

        if (roundKey) {
          // If the round doesn't exist in accumulator, initialize it
          if (!acc[roundKey]) {
            acc[roundKey] = {
              round_title: roundKey,
              order: question.order, // Order helps in sorting
              questions: [],
            };
          }
          // Add question to the appropriate round
          acc[roundKey].questions.push(question);
        }
        return acc;
      }, {} as Record<string, Round>)
    ).sort((a, b) => a.order - b.order);  // Sort rounds by order
    return groupedRounds;
  };

  /**
 * Toggles feedback visibility for a question in a **single round** quiz.
 * If the same question is clicked again, it hides the feedback.
 * 
 * @param {number} index - The index of the question to toggle feedback for.
 */
  const toggleFeedback = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  /**
 * Toggles feedback visibility for a question in a **multi-round** quiz.
 * If the same question in the same round is clicked again, it hides the feedback.
 * 
 * @param {number} roundIndex - The index of the round in which the question exists.
 * @param {number} questionIndex - The index of the question within the round.
 */
  const toggleFeedbackByRound = (roundIndex: number, questionIndex: number) => {
    const isSameSelection =
      openRoundIndex === roundIndex && openQuestionIndex === questionIndex;

    // Toggle feedback visibility based on current selection
    setOpenRoundIndex(isSameSelection ? null : roundIndex);
    setOpenQuestionIndex(isSameSelection ? null : questionIndex);
  };

  // Display a loading message if activityResults are not available
  if (!activityResults) return <p>Loading...</p>;

  // Proceed only when loading is complete
  return (
    <DisplayCard
      smallHeader={activityResults.activity_name} // Display the activity name
      mainHeader="RESULTS" // Main header for the results page
      footer="HOME" // Footer text
      altText="Displays answer scores"  // Alternative text describing the purpose
    // directory="/about"
    >
      <div className={styles.scoreContainer}>
        {/* Single Round Results */}
        {!activityResults.is_multi_round ? (
          <div className={styles.singeRoundResults}>
            {/* Iterate over each question and display results */}
            {activityResults?.questions?.map((item: Question, index: number) => (
              <div
                key={index}
                className={styles.resultItem}
                onClick={() => toggleFeedback(index)} // Toggle feedback when clicked
              >
                {/* Display the question order */}
                <span className={styles.question}>Q{item.order}</span>

                {/* Display answer correctness with appropriate styling */}
                <span
                  className={[
                    styles.answer,
                    item.is_correct === item.user_answer
                      ? styles.correct
                      : styles.incorrect,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.is_correct === item.user_answer ? "CORRECT" : "FALSE"}
                </span>

                {openQuestionIndex === index && (
                  <div className={styles.feedbackDetails}>
                    {/* Feedback item container with correct/incorrect styling */}
                    <div className={[styles.feedbackItem, styles.fbCorrect].join(" ")}>
                      <div className={styles.feedbackIcon}>
                        {/* Show a green icon for correct answers and yellow for incorrect */}
                        {item.is_correct === item.user_answer ? (
                          <span className={styles.icon}>🟢</span>
                        ) : (
                          <span className={styles.icon}>🟡</span>
                        )}
                        {/* Display feedback message based on correctness */}
                        <strong>
                          {item.is_correct === item.user_answer
                            ? " You are correct!"
                            : " Correct answer is:"}
                        </strong>
                      </div>
                      {/* Display feedback text with formatted bold text */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: parseBoldText(item.feedback),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Multi Round Results
          activityResults.rounds?.map((round, roundIndex) => (
            <div key={roundIndex} className={styles.multiRoundResults}>
              {/* Display round title */}
              <div className={styles.roundHeader}>
                {round.round_title.toUpperCase()}
              </div>
              <div className={styles.roundContainer}>
                {/* Iterate through questions in the current round */}
                {round.questions.map((item, questionIndex) => (
                  <div
                    key={questionIndex}
                    className={styles.resultItem}
                    onClick={() => toggleFeedbackByRound(roundIndex, questionIndex)}
                  >
                    {/* Display question number */}
                    <span className={styles.question}>Q{item.order}</span>
                    {/* Display correctness with dynamic styling */}
                    <span
                      className={[
                        styles.answer,
                        item.is_correct === item.user_answer
                          ? styles.correct
                          : styles.incorrect,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {item.is_correct === item.user_answer ? "CORRECT" : "FALSE"}
                    </span>

                    {/* Display feedback details if the question is selected */}
                    {openRoundIndex === roundIndex &&
                      openQuestionIndex === questionIndex && (
                        <div className={styles.feedbackDetails}>
                          {/* Feedback container with correct/incorrect styling */}
                          <div className={[styles.feedbackItem, styles.fbCorrect].join(" ")}>
                            <div className={styles.feedbackIcon}>
                              {/* Show appropriate feedback icon based on correctness */}
                              {item.is_correct === item.user_answer ? (
                                <span className={styles.icon}>🟢</span>
                              ) : (
                                <span className={styles.icon}>🟡</span>
                              )}

                              {/* Display feedback message */}
                              <strong>
                                {item.is_correct === item.user_answer
                                  ? " You are correct!"
                                  : " Correct answer is:"}
                              </strong>
                            </div>

                            {/* Display feedback message */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: parseBoldText(item.feedback),
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </DisplayCard>
  );
};

export default ScorePage;
