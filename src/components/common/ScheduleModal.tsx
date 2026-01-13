import { Clock, Hourglass, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../../assets/styles/ScheduleModal.module.css"; // Importación del módulo
import type { ScheduledTask, ScheduleModalData } from "../../types/Irrigation";

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ScheduleModalData) => void;
    initialData?: ScheduledTask | null;
}

const DAYS = [
    { label: "D", value: 0 },
    { label: "L", value: 1 },
    { label: "M", value: 2 },
    { label: "X", value: 3 },
    { label: "J", value: 4 },
    { label: "V", value: 5 },
    { label: "S", value: 6 },
];

const ScheduleModal: React.FC<ScheduleModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [time, setTime] = useState("07:00");
    const [duration, setDuration] = useState<number>(15);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    // Look for data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const hh = String(initialData.hour).padStart(2, "0");
                const mm = String(initialData.minute).padStart(2, "0");
                setTime(`${hh}:${mm}`);
                setDuration(initialData.duration);
                setSelectedDays(initialData.dayOfWeek);
            } else {
                setTime("07:00");
                setDuration(15);
                setSelectedDays([]);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const toggleDay = (dayValue: number) => {
        setSelectedDays((prev) =>
            prev.includes(dayValue)
                ? prev.filter((d) => d !== dayValue)
                : [...prev, dayValue]
        );
    };

    const handleSave = () => {
        if (selectedDays.length === 0)
            return alert("Selecciona al menos un día");
        onSave({ time, duration, days: selectedDays });
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Programar Riego</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    <div className={styles.row}>
                        {/* Input Hour */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Clock size={16} /> Hora Inicio
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Input Duration */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Hourglass size={16} /> min.
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="99"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(Number(e.target.value))
                                }
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Days */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Días de la semana
                        </label>
                        <div className={styles.daysContainer}>
                            {DAYS.map((day) => {
                                const isSelected = selectedDays.includes(
                                    day.value
                                );

                                const btnClass = isSelected
                                    ? `${styles.dayButton} ${styles.dayButtonSelected}`
                                    : styles.dayButton;

                                return (
                                    <button
                                        key={day.value}
                                        onClick={() => toggleDay(day.value)}
                                        className={btnClass}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button onClick={handleSave} className={styles.saveButton}>
                        Guardar Programación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
