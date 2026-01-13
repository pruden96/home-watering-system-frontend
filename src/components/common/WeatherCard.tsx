import { useEffect, useState } from "react";
import styles from "../../assets/styles/WeatherCard.module.css";

type HourForecast = {
    time: string;
    temp: number;
    icon: string;
    code: number;
};

export default function WeatherCard() {
    const [forecast, setForecast] = useState<HourForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDay, setIsDay] = useState(true);

    useEffect(() => {
        const lat = -17.39;
        const lon = -66.15;

        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=auto`
                );
                const data = await res.json();

                const currentDate = new Date();
                const start = currentDate.getHours();
                setIsDay(start >= 6 && start <= 18);
                const end = start + 4 > 23 ? 24 : start + 4;

                const parsed = data.hourly.time
                    .slice(start, end)
                    .map((t: string, i: number) => ({
                        time: new Date(t).toLocaleTimeString([], {
                            hour: "numeric",
                            hour12: false,
                        }),
                        temp: Math.round(data.hourly.temperature_2m[start + i]),
                        icon: mapWeatherCodeToIcon(
                            data.hourly.weathercode[start + i]
                        ),
                        code: data.hourly.weathercode[start + i],
                    }));
                console.log(parsed);
                setForecast(parsed);
            } catch (err) {
                console.error("Weather fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return <div className={styles.card}>Cargando...</div>;
    }

    return (
        <div className={`${styles.card} ${isDay ? styles.day : styles.night}`}>
            {forecast.map((hour, i) => (
                <div key={i} className={styles.column}>
                    <div className={styles.temp}>{hour.temp}°C</div>
                    <img
                        src={hour.icon}
                        alt="weather"
                        className={styles.icon}
                    />
                    <div className={styles.time}>{`${hour.time}:00`}</div>
                    {/* <div className={styles.period}>{hour.icon}</div> */}
                </div>
            ))}
        </div>
    );
}

function mapWeatherCodeToIcon(code: number) {
    if (code === 0) return "/icons/sun.svg";
    if (code <= 5) return "/icons/partly-cloudy.svg";
    if (code <= 48) return "/icons/cloud.svg";
    if (code <= 67) return "/icons/rain.svg";
    return "/icons/storm.svg";
}
