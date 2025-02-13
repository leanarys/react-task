import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <p className={styles.header}>404</p>
      <p className={styles.subHeader}>Page Not Found</p>
      <p className={styles.description}>Sorry we couldn't find that page</p>
      <Link to="/" className={styles.goHome}>
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
