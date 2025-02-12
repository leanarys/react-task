import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import styles from "./Score.module.css";
// import DisplayCard from "../../components/DisplayCard/DisplayCard";
// import Button from "../../components/Button/Button";

interface Question {
  order: number;
  stimulus: string;
  feedback: string;
  is_correct: boolean;
  user_answer: boolean;
  round_title?: string;
}

interface ActivityResults {
  activity_name: string;
  is_multi_round: boolean;
  questions: Question[];
  rounds?: Round[];
  prevRoute?: string;
}

interface Round {
  round_title: string;
  order: number;
  questions: Question[];
}

const ScorePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activityResults, setActivityResults] =
    useState<ActivityResults | null>(null);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null
  );
  const [openRoundIndex, setOpenRoundIndex] = useState<number | null>(null);

  console.log(location);

  useEffect(() => {
    const results = location.state as ActivityResults;

    console.log("results", results);
    if (!results) {
      navigate("/"); // If no results navigate to home
    } else {
      setActivityResults(results);
      if (results.is_multi_round) {
        setActivityResults({
          ...results,
          rounds: groupQuestionsByRound(results.questions),
        });
      }
    }

    return () => {
      if (location.state.prevRoute == "/activity") {
        navigate("/"); // If no results navigate to home
      }
    };
  }, [location, navigate]);

  // Function to group questions into rounds
  const groupQuestionsByRound = (questions: Question[]): Round[] => {
    const groupedRounds = Object.values(
      questions.reduce((acc, question) => {
        const roundKey = question.round_title;
        if (roundKey) {
          if (!acc[roundKey]) {
            acc[roundKey] = {
              round_title: roundKey,
              order: question.order,
              questions: [],
            };
          }
          acc[roundKey].questions.push(question);
        }
        return acc;
      }, {} as Record<string, Round>)
    ).sort((a, b) => a.order - b.order);
    return groupedRounds;
  };

  // Toggle feedback for a question (Single Round)
  const toggleFeedback = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  // Toggle feedback for a question inside a round (Multi Round)
  const toggleFeedbackByRound = (roundIndex: number, questionIndex: number) => {
    const isSameSelection =
      openRoundIndex === roundIndex && openQuestionIndex === questionIndex;

    setOpenRoundIndex(isSameSelection ? null : roundIndex);
    setOpenQuestionIndex(isSameSelection ? null : questionIndex);
  };

  if (!activityResults) return <p>Loading...</p>;

  return (
    <DisplayCard
      smallHeader={activityResults.activity_name}
      mainHeader="RESULTS"
      footer="HOME"
      // directory="/about"
    >
      <div className={styles.scoreContainer}>
        {/* Single Round Results */}
        {!activityResults.is_multi_round ? (
          <div className={styles.singeRoundResults}>
            {activityResults.questions.map((item, index) => (
              <div
                key={index}
                className={styles.resultItem}
                onClick={() => toggleFeedback(index)}
              >
                <span className={styles.question}>Q{item.order}</span>
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
                    <div
                      className={[styles.feedbackItem, styles.fbCorrect].join(
                        " "
                      )}
                    >
                      <div className={styles.feedbackIcon}>
                        {item.is_correct === item.user_answer ? (
                          <span className={styles.icon}>🟢</span>
                        ) : (
                          <span className={styles.icon}>🟡</span>
                        )}

                        <strong>
                          {item.is_correct === item.user_answer
                            ? " You are correct!"
                            : " Correct answer is:"}
                        </strong>
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: item.feedback }} />
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
              <div className={styles.roundHeader}>
                {/* Round {roundIndex + 1 || "N/A"} */}
                {round.round_title.toUpperCase()}
              </div>
              <div className={styles.roundContainer}>
                {round.questions.map((item, questionIndex) => (
                  <div
                    key={questionIndex}
                    className={styles.resultItem}
                    onClick={() =>
                      toggleFeedbackByRound(roundIndex, questionIndex)
                    }
                  >
                    <span className={styles.question}>Q{item.order}</span>
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
                      {item.is_correct === item.user_answer
                        ? "CORRECT"
                        : "FALSE"}
                    </span>

                    {openRoundIndex === roundIndex &&
                      openQuestionIndex === questionIndex && (
                        <div className={styles.feedbackDetails}>
                          <div
                            className={[
                              styles.feedbackItem,
                              styles.fbCorrect,
                            ].join(" ")}
                          >
                            <div className={styles.feedbackIcon}>
                              {item.is_correct === item.user_answer ? (
                                <span className={styles.icon}>🟢</span>
                              ) : (
                                <span className={styles.icon}>🟡</span>
                              )}

                              <strong>
                                {item.is_correct === item.user_answer
                                  ? " You are correct!"
                                  : " Correct answer is:"}
                              </strong>
                            </div>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: item.feedback,
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
