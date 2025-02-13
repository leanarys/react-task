import styles from "./Home.module.css";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import Button from "../../components/Button/Button";
import { useActivityContext } from "../../hooks/useActivityContext";
import reactLogo from "../../assets/react.svg";

const HomePage = () => {
  const { quizTemplate, loading } = useActivityContext();

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
      <DisplayCard
        smallHeader="CAE"
        mainHeader={quizTemplate?.name}
        footer="RESULTS"
        altText={quizTemplate?.heading}
      >
        <div className={styles.homeContainer}>
          <div className={styles.accordion}>
            {/* Dynamically generate buttons based on API data */}
            {quizTemplate?.activities.map((activity) => (
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
        </div>
      </DisplayCard>
    </div>
  );
};

export default HomePage;
