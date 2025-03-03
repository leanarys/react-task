import styles from "./Home.module.css";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import Button from "../../components/Button/Button";
import { useActivityContext } from "../../hooks/useActivityContext";
import reactLogo from "../../assets/react.svg";
// import Loader from "../../components/Loader/Loader";

const HomePage = () => {
  // Extract quiz data, loading state, and error status from context
  const { quizTemplate, loading, error } = useActivityContext();

  // Default header text
  const header = "CAE";

  // Show a loading indicator while fetching data
  if (loading) {
    return (
      // <Loader></Loader>
      <div>
        {/* React logo used as a loading animation */}
        <img src={reactLogo} className={styles.logoReact} alt="React logo loader" />
        <p className={styles.loadingTxt}>Loading...</p>
      </div>
    );
  }

  // Render the main content once data is loaded
  return (
    <div>
      {/* Reusable Display Card component */}
      <DisplayCard
        smallHeader={header}
        mainHeader={!error && quizTemplate?.name ? quizTemplate.name : ""} // Show quiz name if no error
        footer={error ? "" : "RESULTS"} // Show "RESULTS" unless there's an error
        altText={quizTemplate?.heading || ""} // Alternative text from API data
      >
        {/* Show error message if the API request fails */}
        {error ? (
          <div className={styles.errorMessage}>
            An error occurred while loading the quiz. Please try again.
          </div>
        ) : (
          <div className={styles.homeContainer}>
            <div className={styles.accordion}>
              {/* Generate activity buttons dynamically from API data */}
              {quizTemplate?.activities.map((activity) => (
                <div className={styles.activity} key={activity.activity_name}>
                  <Button
                    label={activity.activity_name} // Button text: activity name
                    to={`/activity/${activity.activity_name}`} // Navigate to the activity page
                    disabled={!activity.questions} // Disable if there are no questions
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
