import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styles from "../../assets/styles/irrigationButton.module.css";

interface IrrigationButtonProps {
    duration?: number;
}

interface Task {
    type: string;
    duration: number;
}

const API_URL = import.meta.env.VITE_SERVER_URL;
const IRRIGATE_ENDPOINT = import.meta.env.VITE_IRRIGATE_ENDPOINT;
const socket = io(API_URL);

const IrrigationButton: React.FC<IrrigationButtonProps> = ({
    duration = 1,
}) => {
    const [isWatering, setIsWatering] = useState<boolean>(false);
    const [minutesLeft, setMinutesLeft] = useState<string>("00");
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

    // 1. Socket
    useEffect(() => {
        socket.on("status_update", (data: { remainingTime: number }) => {
            if (data.remainingTime > 0) {
                const now = Date.now();
                // remainingTime comes in minutes from RPI
                const msRemaining = data.remainingTime * 60 * 1000;
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
        });

        return () => {
            socket.off("status_update");
        };
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

    const startManualIrrigation = async (body: Task) => {
        const controller = new AbortController();
        const timeoutDuration = 3000; // 3 seconds
        const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
        try {
            // Send watering order to RPI
            await fetch(IRRIGATE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
        } catch (error: any) {
            if (error.name === "AbortError") {
                alert("Fetch request timed out.");
            } else {
                alert(error.message);
            }
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const startWatering = async () => {
        if (!isWatering) {
            await startManualIrrigation({
                type: "Manual",
                duration: duration,
            });
        }
    };

    return (
        <div className={styles.buttonContainer} onClick={startWatering}>
            <div
                className={`${isWatering ? styles.waveRigth : ""} ${
                    styles.wave
                } ${!isWatering ? styles.inactive : ""}`}
            >
                <img src="./src/assets/wave_back.svg" alt="wave rigth" />
            </div>
            <div
                className={`${isWatering ? styles.waveLeft : ""} ${
                    styles.wave
                } ${!isWatering ? styles.inactive : ""}`}
            >
                <img src="./src/assets/wave_front.svg" alt="wave left" />
            </div>
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
                <p className={`${styles.active}`}>Iniciar Riego</p>
            </div>
            <div className={styles.onGoingTextContainer}>
                <p className={`${!isWatering ? styles.inactive : ""}`}>
                    {/* Regando {String(duration).padStart(2, "0")} minutos */}
                    Regando {minutesLeft} minutos
                </p>
            </div>
        </div>
    );
};

export default IrrigationButton;
