import styles from "./Home.module.css";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import Button from "../../components/Button/Button";
import { useActivityContext } from "../../hooks/useActivityContext";
import reactLogo from "../../assets/react.svg";

const HomePage = () => {
  const { quizTemplate, loading, error } = useActivityContext();
  const header = "CAE";
  if (loading) {
    return (
      <div>
        <img src={reactLogo} className={styles.logoReact} alt="React logo loader" />
        <p className={styles.loadingTxt}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <DisplayCard
        smallHeader={header}
        mainHeader={(!error && quizTemplate?.name) ? quizTemplate.name : ""}
        footer={error ? "" : "RESULTS"}
        altText={quizTemplate?.heading || ""}
      >
        {error ? (
          <div className={styles.errorMessage}>
            An error occurred while loading the quiz. Please try again.
          </div>
        ) : (
          <div className={styles.homeContainer}>
            <div className={styles.accordion}>
              {/* Dynamically generate buttons based on API data */}
              {quizTemplate?.activities.map((activity) => (
                <div className={styles.activity} key={activity.activity_name}>
                  <Button
                    label={activity.activity_name} // Use API data for button label
                    to={`/activity/${activity.activity_name}`} // Navigate to dynamic route
                    disabled={!activity.questions}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </DisplayCard>
    </div>
  );
  
};

export default HomePage;
