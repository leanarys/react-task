import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Button.module.css";
import { ButtonProps } from "../../types/quiz.interface";

const Button: React.FC<ButtonProps> = ({ label, onClick, to, disabled = false }) => {
  const navigate = useNavigate(); // Hook for navigation

  /** Handles button click: navigates or triggers `onClick` */
  const handleClick = () => {
    if (to) navigate(to);
    else if (onClick) onClick();
  };

  return (
    <button className={styles.accordionItem} onClick={handleClick} disabled={disabled}>
      {label.toUpperCase()} {/* Ensure uppercase label */}
    </button>
  );
};

export default Button;
