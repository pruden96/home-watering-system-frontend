import React from "react";

import TextComponent from "../components/common/TextComponent";
import WateringButton from "../components/common/WateringButton";
import WeatherCard from "../components/common/WeatherCard";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
    return (
        <>
            <main className="main-container">
                <WeatherCard />
                <TextComponent text="Riego Manual" />
                <div className="main-button-container">
                    <WateringButton />
                </div>
            </main>
        </>
    );
};

export default HomePage;
