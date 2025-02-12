// import { fetchActivityTemplate } from "../../services/api";
import styles from "./Home.module.css";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import Button from "../../components/Button/Button";
import { useActivityContext } from "../../context/hooks/useActivityContext";
import reactLogo from "../../assets/react.svg";

interface Question {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: boolean[];
  feedback: string;
}

interface Round {
  round_title: string;
  order: number;
  questions: Question[];
}

interface Activity {
  activity_name: string;
  order: number;
  questions: (Question | Round)[];
}

export type ActivityData = Activity[];

const HomePage = () => {
  const { activities, loading } = useActivityContext();

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={reactLogo} className="logo react" alt="React logo" />
        <div className="spinner">🔄</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <DisplayCard smallHeader="CAE" mainHeader="Error Find" footer="RESULTS">
        <div className={styles.accordion}>
          {/* Dynamically generate buttons based on API data */}
          {activities.map((activity) => (
            <div className={styles.activity} key={activity.activity_name}>
              <Button
                label={activity.activity_name} // Use API data for button label
                to={`/activity/${activity.activity_name}`} // Navigate to dynamic route
                variant="primary"
                disabled={!activity.questions}
              />
            </div>
          ))}
        </div>
      </DisplayCard>
    </div>
  );
};

export default HomePage;
