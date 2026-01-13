import React from "react";
import styles from "../../assets/styles/raindropIcon.module.css";

const RaindropIcon: React.FC = () => {
    return (
        <div className={styles.container}>
            <img src="./src/assets/raindrop-mask.svg" alt="raindrop" />
        </div>
    );
};

export default RaindropIcon;
