import styles from "./Home.module.css";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import Button from "../../components/Button/Button";
import { useActivityContext } from "../../hooks/useActivityContext";
import reactLogo from "../../assets/react.svg";

const HomePage = () => {
  // Extract quiz data, loading state, and error status from the activity context
  const { quizTemplate, loading, error } = useActivityContext();
  // Default header text
  const header = "CAE";
  // If loading display the loader
  if (loading) {
    return (
      <div>
        {/* React logo as a visual loader */}
        <img src={reactLogo} className={styles.logoReact} alt="React logo loader" />
        <p className={styles.loadingTxt}>Loading...</p>
      </div>
    );
  }

  // Render the main content once loading is complete
  return (
    <div>
      {/* Reusable Display Card component*/}
      <DisplayCard
        smallHeader={header}
        mainHeader={(!error && quizTemplate?.name) ? quizTemplate.name : ""} // Quiz name if no error
        footer={error ? "" : "RESULTS"} // Show "RESULTS" footer unless there's an error
        altText={quizTemplate?.heading || ""} // Alternative text from API data
      >
        {/* Display an error message if the API call fails */}
        {error ? (
          <div className={styles.errorMessage}>
            An error occurred while loading the quiz. Please try again.
          </div>
        ) : (
          <div className={styles.homeContainer}>
            <div className={styles.accordion}>
              {/* Dynamically generate buttons based fron API data */}
              {quizTemplate?.activities.map((activity) => (
                <div className={styles.activity} key={activity.activity_name}>
                  <Button
                    label={activity?.activity_name} // Set button text to the activity name
                    to={`/activity/${activity?.activity_name}`} // Navigate to the specific activity page
                    disabled={!activity?.questions} // Disable button if the activity has no questions
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
