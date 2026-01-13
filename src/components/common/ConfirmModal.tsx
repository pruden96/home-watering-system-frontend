import React from "react";
import styles from "../../assets/styles/ConfirmationModal.module.css";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    message = "Esta acción eliminará la programación de forma permanente.",
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button
                        onClick={onClose}
                        className={`${styles.buttonBase} ${styles.cancelBtn}`}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${styles.buttonBase} ${styles.deleteBtn}`}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
