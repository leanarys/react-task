import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
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

  useEffect(() => {
    const results = location.state as ActivityResults;
    if (!results) {
      navigate("/");
    } else {
      setActivityResults(results);
      if (results.is_multi_round) {
        setActivityResults({
          ...results,
          rounds: groupQuestionsByRound(results.questions),
        });
      }
    }
  }, [location, navigate]);

  // Function to group questions into rounds
  const groupQuestionsByRound = (questions: Question[]): Round[] => {
    const groupedRounds = Object.values(
      questions.reduce((acc, question) => {
        const roundKey = question.round_title;
        if (!acc[roundKey]) {
          acc[roundKey] = {
            round_title: roundKey,
            order: question.order,
            questions: [],
          };
        }

        acc[roundKey].questions.push(question);
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
      <div className="score-container">
        {/* Single Round Results */}
        {!activityResults.is_multi_round ? (
          <div className="single-round-results">
            {activityResults.questions.map((item, index) => (
              <div
                key={index}
                className="result-item"
                onClick={() => toggleFeedback(index)}
              >
                <span className="question">Q{item.order}</span>
                <span
                  className={`answer ${
                    item.is_correct === item.user_answer
                      ? "correct"
                      : "incorrect"
                  }`}
                >
                  {item.is_correct === item.user_answer ? "CORRECT" : "FALSE"}
                </span>

                {openQuestionIndex === index && (
                  <div className="feedback-details">
                    <div className="feedback-item">
                      <span className="icon">❌</span>
                      <strong>Wrong:</strong>
                      <p dangerouslySetInnerHTML={{ __html: item.stimulus }} />
                    </div>
                    <div className="feedback-item fb-correct">
                      <span className="icon">✅</span>
                      <strong>Correct:</strong>
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
            <div key={roundIndex} className="multi-round-results">
              <h3>Round {roundIndex + 1 || "N/A"}</h3>
              <div className="round-container">
                {round.questions.map((item, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="result-item"
                    onClick={() =>
                      toggleFeedbackByRound(roundIndex, questionIndex)
                    }
                  >
                    <span className="question">Q{item.order}</span>
                    <span
                      className={`answer ${
                        item.is_correct === item.user_answer
                          ? "correct"
                          : "incorrect"
                      }`}
                    >
                      {item.is_correct === item.user_answer
                        ? "CORRECT"
                        : "FALSE"}
                    </span>

                    {openRoundIndex === roundIndex &&
                      openQuestionIndex === questionIndex && (
                        <div className="feedback-details">
                          <div className="feedback-item">
                            <span className="icon">❌</span>
                            <strong>Wrong:</strong>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: item.stimulus,
                              }}
                            />
                          </div>
                          <div className="feedback-item fb-correct">
                            <span className="icon">✅</span>
                            <strong>Correct:</strong>
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
