import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DisplayCard.module.css";

type DisplayCardProps = {
  smallHeader?: string;
  mainHeader?: string;
  footer?: string;
  directory?: string;
  children?: React.ReactNode;
};

const DisplayCard: React.FC<DisplayCardProps> = ({
  smallHeader = "",
  mainHeader = "",
  footer = "",
  directory = "",
  children,
}) => {
  const navigate = useNavigate();

  const navigateTo = (dir: string) => {
    if (dir.trim()) {
      navigate(dir.startsWith("/") ? dir : `/${dir}`);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.cardContent}>
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
                footer === "HOME" ? styles.pointer : null,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (footer === "HOME") {
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
