import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      {/* Display a 404 error header */}
      <p className={styles.header}>404</p>
      {/* Brief message indicating the page was not found */}
      <p className={styles.subHeader}>Page Not Found</p>
      <p className={styles.description}>Sorry we couldn't find that page</p>
      {/* Link to navigate back to the home page */}
      <Link to="/" className={styles.goHome}>
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
