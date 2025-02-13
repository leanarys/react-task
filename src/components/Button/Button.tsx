import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  to?: string; // Route path for navigation
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  to,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); // Navigate when `to` is provided
    } else if (onClick) {
      onClick(); // Execute custom function
    }
  };

  return (
    <button
      className={styles.accordionItem}
      onClick={handleClick}
      disabled={disabled}
    >
      {label.toUpperCase()}
    </button>
  );
};

export default Button;
