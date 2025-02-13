import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DisplayCard.module.css";
import { DisplayCardProps } from "../../types/quiz-interface";

const DisplayCard: React.FC<DisplayCardProps> = ({
  smallHeader = "",
  mainHeader = "",
  footer = "",
  directory = "",
  altText = "",
  children,
}) => {
  const homeText = "HOME";
  const navigate = useNavigate();
  const navigateTo = (dir: string) => {
    if (dir.trim()) {
      navigate(dir.startsWith("/") ? dir : `/${dir}`);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.cardContent} title={altText}>
        <div className={styles.header}>
          <span>{smallHeader.toUpperCase()}</span>
          <h1>{mainHeader}</h1>
        </div>
        <div className={styles.dynamicContent}>
          {children}
          {footer && (
            <div
              className={[
                styles.result,
                footer === homeText ? styles.pointer : null,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (footer === homeText) {
                  navigate("/");
                } else if (directory) {
                  navigateTo(directory);
                }
              }}
            >
              {footer.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DisplayCard;
