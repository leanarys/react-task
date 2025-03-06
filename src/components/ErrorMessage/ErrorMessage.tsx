import React from "react";
import styles from "./ErrorMessage.module.css";
import { ErrorMessageProps } from "../../types/quiz.interface";

/**
 * Displays an error or warning.
 * @param message - The message to display.
 * @param type - The type of message ("error", "warning"). Default is "error".
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = "error" }) => {
  return (
    <div className={`${styles.errorContainer} ${styles[type]}`}>
      <p className={styles.errorText}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
