import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { irrigationService } from "../../api/irrigation.service";
import styles from "../../assets/styles/wateringButton.module.css";
import type { ManualTask } from "../../types/Irrigation";
import ManualWateringModal from "./ManualWateringModal";

interface IrrigationButtonProps {
    duration?: number;
}

const API_URL = import.meta.env.VITE_SERVER_URL;
const socket = io(API_URL);

const WateringButton: React.FC<IrrigationButtonProps> = () => {
    const [isWatering, setIsWatering] = useState<boolean>(false);
    const [minutesLeft, setMinutesLeft] = useState<string>("00");
    const [showModal, setShowModal] = useState(false);
    const endTimeRef = useRef<number | null>(null);

    // formatting miliseconds to seconds
    const calculateMinutesString = (endTime: number): string => {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) return "00";

        const minutes = Math.ceil(diff / 60000);

        if (minutes > 99) return "99";

        return String(minutes).padStart(2, "0");
    };

    const handleRealTimeUptade = (remainingTimeInMinutes: number) => {
        if (remainingTimeInMinutes > 0) {
            const now = Date.now();
            // remainingTime comes in minutes from RPI
            const msRemaining = remainingTimeInMinutes * 60 * 1000;
            const calculatedEnd = now + msRemaining;

            endTimeRef.current = calculatedEnd;
            setIsWatering(true);
            // Inmediate refresh
            setMinutesLeft(calculateMinutesString(calculatedEnd));
        } else {
            setIsWatering(false);
            endTimeRef.current = null;
            setMinutesLeft("00");
        }
    };

    // 1. Socket
    useEffect(() => {
        socket.on("status_update", (data: { remainingTime: number }) => {
            handleRealTimeUptade(data.remainingTime);
        });

        return () => {
            socket.off("status_update");
        };
    }, []);

    useEffect(() => {
        const fetchRemainingTime = async () => {
            const remainingTimeMinutes = await irrigationService.getStatus();
            handleRealTimeUptade(remainingTimeMinutes.remaining);
        };

        fetchRemainingTime();
    }, []);

    // 2. Timer
    useEffect(() => {
        if (!isWatering) return;

        const interval = setInterval(() => {
            if (endTimeRef.current) {
                const str = calculateMinutesString(endTimeRef.current);
                setMinutesLeft(str);

                if (str === "00") {
                    setIsWatering(false);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isWatering]);

    const startManualIrrigation = (body: ManualTask) => {
        irrigationService.manualIrrigation(body);
    };

    const handleButtonClick = () => {
        if (!isWatering) {
            setShowModal(true);
        } else {
            console.log("Ya se está regando...");
            irrigationService.stopIrrigation();
        }
    };

    const handleConfirmStart = (minutes: number) => {
        startManualIrrigation({
            duration: minutes,
        });

        setShowModal(false);
    };

    return (
        <>
            <div className={styles.buttonContainer} onClick={handleButtonClick}>
                <div
                    className={`${styles.raindrop} ${
                        !isWatering ? styles.inactive : ""
                    }`}
                >
                    <img src="./src/assets/raindrop.svg" alt="raindrops" />
                </div>
                <div
                    className={`${styles.startTextContainer} ${
                        isWatering ? styles.inactive : ""
                    }`}
                >
                    <p className={`${styles.active} ${styles.startText}`}>
                        Iniciar<br></br>Riego
                    </p>
                </div>
                <div className={styles.onGoingTextContainer}>
                    <p
                        className={`${!isWatering ? styles.inactive : ""} ${
                            styles.onGoingText
                        }`}
                    >
                        {/* Regando {String(duration).padStart(2, "0")} minutos */}
                        Regando: {minutesLeft} min.<br></br>Restantes
                    </p>
                </div>
            </div>
            <ManualWateringModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onStart={handleConfirmStart}
            />
        </>
    );
};

export default WateringButton;
