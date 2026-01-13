import { Droplets, Timer, X } from "lucide-react";
import React, { useState } from "react";
import styles from "../../assets/styles/ManualWateringModal.module.css";

interface ManualWateringModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (minutes: number) => void;
}

const ManualWateringModal: React.FC<ManualWateringModalProps> = ({
    isOpen,
    onClose,
    onStart,
}) => {
    const [duration, setDuration] = useState<number | string>(15);

    if (!isOpen) return null;

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (val === "") {
            setDuration("");
            return;
        }

        const num = parseInt(val, 10);
        if (!isNaN(num) && num <= 99) {
            setDuration(num);
        }
    };

    const handleStart = () => {
        const finalDuration = Number(duration);

        if (finalDuration < 5) {
            alert("El tiempo mínimo de riego es de 5 minutos.");
            return;
        }

        onStart(finalDuration);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Riego Manual</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <Timer size={18} />
                            Minutos
                        </label>
                        <input
                            type="number"
                            min="5"
                            max="99"
                            value={duration}
                            onChange={handleDurationChange}
                            className={styles.bigInput}
                            placeholder="00"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button
                        onClick={onClose}
                        className={`${styles.buttonBase} ${styles.cancelBtn}`}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleStart}
                        className={`${styles.buttonBase} ${styles.confirmBtn}`}
                    >
                        <Droplets size={20} />
                        Regar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualWateringModal;
