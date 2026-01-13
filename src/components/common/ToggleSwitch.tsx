import React from "react";
import styles from "../../assets/styles/ToggleSwitch.module.css";

interface ToggleSwitchProps {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
    return (
        <label className={styles.switch}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className={styles.slider}></span>
        </label>
    );
};

export default ToggleSwitch;
