import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import styles from "./Score.module.css";
import { Activity, Question, Round } from "../../types/quiz.interface";
import { classNames, isMatched, parseBoldText } from "../../helpers/parseBoldText";

const ScorePage: React.FC = () => {
  // React Router hooks for navigation  
  const location = useLocation();
  const navigate = useNavigate();

  // Stores activity results (null by default)  
  const [activityResults, setActivityResults] = useState<Activity | null>(null);

  // Tracks the currently open question (null if none)  
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

  // Tracks the currently open round (null if none)  
  const [openRoundIndex, setOpenRoundIndex] = useState<number | null>(null);

  /**
   * Processes activity results and updates the state.  
   * Redirects the user if no results are available.  
   * Groups questions when multi-round mode is enabled.  
   * 
   * @param {Activity} results - The activity data from the location state.  
   */

  const processActivityResults = (results: Activity) => {
    // If no results or questions exist, alert the user and redirect  
    if (!results || !results.questions) {
      window.alert("No activity results found. Redirecting to home...");
      return navigate("/");
    }

    // Group questions if the activity has multiple rounds  
    if (results.is_multi_round) {
      const groupedRounds = groupQuestionsByRound(results.questions);

      setActivityResults({
        ...results, // Keep existing data  
        rounds: groupedRounds, // Store grouped rounds  
      });
    } else {
      // Store results as-is for single-round activities  
      setActivityResults(results);
    }
  };


  // Handle location state and redirect if needed  
  useEffect(() => {
    const results = location.state as Activity;

    console.log("results", results);
    processActivityResults(results);

    // Redirect to home if the user came from the activity page  
    return () => {
      if (location?.state?.prev_route === "/activity") {
        navigate("/");
      }
    };
  }, [location, navigate]);


  /**
  * Groups an array of questions into rounds based on their `round_title`.
  *
  * @param {Question[]} questions - List of questions to organize into rounds.
  * @returns {Round[]} - Array of rounds, each containing its respective questions.
  */
  const groupQuestionsByRound = (questions: Question[]): Round[] => {
    const groupedRounds = Object.values(
      questions.reduce((acc, question) => {
        console.log("acc", acc);
        console.log("question", question);

        const roundKey = question.round_title;
        if (!roundKey) return acc; // Skip if no round title

        // Initialize round if it doesn't exist
        acc[roundKey] ??= { round_title: roundKey, order: question.order, questions: [] };

        // Add question to the correct round
        acc[roundKey].questions.push(question);

        return acc;
      }, {} as Record<string, Round>)
    ).sort((a, b) => a.order - b.order); // Sort rounds by order

    return groupedRounds;
  };

  /**
 * Toggles feedback visibility for a question in a single-round quiz.  
 * Clicking the same question again hides the feedback.  
 * 
 * @param {number} index - The index of the question to toggle.  
 */
  const toggleFeedback = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  /**
   * Toggles feedback visibility for a question in a multi-round quiz.  
   * Clicking the same question again hides the feedback.  
   * 
   * @param {number} roundIndex - The index of the round containing the question.  
   * @param {number} questionIndex - The index of the question within the round.  
   */
  const toggleFeedbackByRound = (roundIndex: number, questionIndex: number) => {
    const isSameSelection = openRoundIndex === roundIndex && openQuestionIndex === questionIndex;

    // Toggle feedback visibility
    setOpenRoundIndex(isSameSelection ? null : roundIndex);
    setOpenQuestionIndex(isSameSelection ? null : questionIndex);
  };

  // Show a loading message until activity results are available
  if (!activityResults) return <p>Loading...</p>;

  // Render the results page inside a DisplayCard
  return (
    <DisplayCard
      smallHeader={activityResults.activity_name} // Activity name
      mainHeader="RESULTS" // Page title
      footer="HOME" // Footer text
      altText="Displays answer scores" // Accessibility text
    >
      <div className={styles.scoreContainer}>
        {/* Single Round Results */}
        {!activityResults.is_multi_round ? (
          <div className={styles.singeRoundResults}>
            {/* Iterate over each question and display results */}
            {activityResults?.questions?.map((item: Question, index: number) => {
              const firstUserAnswer = item?.user_answers?.[0] ?? null;
              const isCorrect = isMatched(item.is_correct, firstUserAnswer);

              return (
                <div
                  key={index}
                  className={styles.resultItem}
                  onClick={() => toggleFeedback(index)}
                >
                  <span className={styles.question}> Q{item.order} </span>
                  <span className={styles.answer}>
                    {isCorrect ? "CORRECT" : "FALSE"}
                  </span>

                  {/* Show feedback details if this question is selected */}
                  {openQuestionIndex === index && (
                    <div className={styles.feedbackDetails}>
                      <div className={classNames(styles.feedbackItem, styles.fbCorrect)}>
                        <div className={styles.feedbackIcon}>
                          <span className={styles.icon}>
                            {isCorrect ? '🟢' : '🟡'}
                          </span>
                          <strong>
                            {isCorrect ? " You are correct!" : " Correct answer is:"}
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
              );
            })}
          </div>

        ) : (
          <>
            {/* Multi Round Results */}
              {activityResults.rounds?.map((round, roundIndex) => {
                const roundTitle = round.round_title.toUpperCase();
              return (
                <div key={roundIndex} className={styles.multiRoundResults}>
                  {/* Display round title */}
                  <div className={styles.roundHeader}>
                    {roundTitle}
                  </div>
                  <div className={styles.roundContainer}>
                    {/* Iterate through questions in the current round */}
                    {round.questions.map((item, questionIndex) => {
                      const firstUserAnswer = item?.user_answers?.[0] ?? null;
                      const isCorrect = isMatched(item.is_correct, firstUserAnswer);
                      const isOpen = openRoundIndex === roundIndex && openQuestionIndex === questionIndex;
                      return (
                        <div
                          key={questionIndex}
                          className={styles.resultItem}
                          onClick={() => toggleFeedbackByRound(roundIndex, questionIndex)}
                        >
                          <span className={styles.question}>Q{item.order}</span>
                          <span className={styles.answer}>
                            {isCorrect ? "CORRECT" : "FALSE"}
                          </span>

                           {/* Show feedback details if this question is selected */}
                          {isOpen && (
                            <div className={styles.feedbackDetails}>
                              <div className={classNames(styles.feedbackItem, styles.fbCorrect)}>
                                <div className={styles.feedbackIcon}>
                                  <span className={styles.icon}>
                                    {isCorrect ? '🟢' : '🟡'}
                                  </span>
                                  <strong>
                                    {isCorrect ? " You are correct!" : " Correct answer is:"}
                                  </strong>
                                </div>

                                {/* Display feedback text with formatted bold text */}
                                <p
                                  dangerouslySetInnerHTML={{ __html: parseBoldText(item.feedback) }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </DisplayCard >
  );
};

export default ScorePage;
