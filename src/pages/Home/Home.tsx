import styles from "./Home.module.css";
import DisplayCard from "../../components/DisplayCard/DisplayCard";
import Button from "../../components/Button/Button";
import { useActivityContext } from "../../hooks/useActivityContext";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const HomePage = () => {
  // Extract quiz data, loading state, and error status from context
  const { quizTemplate, loading, error } = useActivityContext();

  // Show a loading while fetching data
  if (loading) {
    return (<Loader></Loader>);
  }

  // Show error message if found
  if (!loading && error) {
    return <ErrorMessage message="An error occurred while loading the quiz. Please try again." type="error" />;
  }

  // Default header text
  const smallHeader = "CAE";
  // Sets the quiz name 
  const mainHeader = quizTemplate?.name ? quizTemplate.name : "";
  const footerText = "RESULTS";
  const altText = quizTemplate?.heading || "";

  // Render the main content once data is loaded
  return (
    <div>
      {/* Reusable Display Card component */}
      <DisplayCard
        smallHeader={smallHeader}
        mainHeader={mainHeader}
        footer={footerText}
        altText={altText}
      >
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
      </DisplayCard>
    </div>
  );
};

export default HomePage;
