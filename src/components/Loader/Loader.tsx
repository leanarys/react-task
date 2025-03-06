import styles from "./Loader.module.css";
import reactLogo from "../../assets/react.svg";

const Loader = () => {
  return (
    <div>
      {/* React logo as a visual loader */}
      <img src={reactLogo} className={styles.logoReact} alt="React logo loader" />
      <p className={styles.loadingTxt}>Loading...</p>
    </div>
  );
};

export default Loader;
