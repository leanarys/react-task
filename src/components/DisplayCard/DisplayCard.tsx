import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DisplayCard.module.css";
import { DisplayCardProps } from "../../types/quiz.interface";
import { isMatched, mergeClassNames } from "../../helpers/helpers";

const DisplayCard: React.FC<DisplayCardProps> = ({
  smallHeader = "",
  mainHeader = "",
  footer = "",
  directory = "",
  altText = "",
  children,
}) => {
  const homeText = "HOME";
  const navigate = useNavigate(); // Hook for navigation

  /**
 * Navigates to a specified directory.
 * Ensures that the path starts with a `/` before navigating.
 * @param {string} dir - The directory to navigate to.
 */
  const navigateTo = (dir: string) => {
    if (dir.trim()) {
      navigate(dir.startsWith("/") ? dir : `/${dir}`);
    }
  };

  // Add pointer style if it's "HOME"
  const footerText =  footer === homeText ? styles.pointer : null;

  // Merged class style
  const mergeClass = mergeClassNames(styles.result, footerText)
 
  return (
    <main className={styles.main}>
      <div className={styles.cardContent}>
        {/* Header section with optional tooltip (altText) */}
        <div className={styles.header} title={altText}>
          <span>{smallHeader.toUpperCase()}</span>
          {mainHeader && <h1>{mainHeader}</h1>}
        </div>
        {/* Dynamic content container */}
        <div className={styles.dynamicContent}>
          {children}
          {/* Display footer button only if the footer prop exists */}
          {footer && (
            <div
              className={mergeClass}
              onClick={() => {
                if (isMatched(footer, homeText)) {
                  navigate("/"); // Navigate to home
                } else if (directory) {
                  navigateTo(directory); // Navigate to the specified directory
                }
              }}
            >
              {footer.toUpperCase()} {/* Convert footer text to uppercase */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DisplayCard;
