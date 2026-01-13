import { Clock, MoreVertical, Trash2 } from "lucide-react";
import React from "react";
import styles from "../../assets/styles/TaskCard.module.css";
import ToggleSwitch from "./ToggleSwitch";

export interface Task {
    id?: string;
    dayOfWeek: number[]; // [0, 1, 2...]
    hour: number;
    minute: number;
    duration: number;
    active: boolean;
}

interface TaskCardProps {
    task: Task;
    onToggle: (newState: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
}

const DAYS_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onToggle,
    onEdit,
    onDelete,
}) => {
    // Formatting: 7:5 -> "07:05"
    const formattedTime = `${String(task.hour).padStart(2, "0")}:${String(
        task.minute
    ).padStart(2, "0")}`;

    return (
        <div className={styles.card}>
            {/* Hour & Switch */}
            <div className={styles.header}>
                <div className={styles.timeInfo}>
                    <span className={styles.time}>{formattedTime}</span>
                    <span className={styles.duration}>
                        <Clock size={14} /> {task.duration} min
                    </span>
                </div>
                <ToggleSwitch isChecked={task.active} onChange={onToggle} />
            </div>

            {/* Days & Menu */}
            <div className={styles.footer}>
                <div className={styles.daysRow}>
                    {DAYS_LABELS.map((label, index) => {
                        const isActive = task.dayOfWeek.includes(index);
                        return (
                            <div
                                key={index}
                                className={`${styles.dayDot} ${
                                    isActive ? styles.active : ""
                                }`}
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>
                <button className={styles.trashBtn} onClick={onDelete}>
                    <Trash2 size={20} />
                </button>
                <button className={styles.moreBtn} onClick={onEdit}>
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
