import { useState } from "react";
import "./App.css";
import AddButton from "./components/common/AddButton";
import MenuIcon from "./components/common/MenuIcon";
import Sidebar from "./components/common/Sidebar";
import TextComponent from "./components/common/TextComponent";

import HomePage from "./pages/HomePage";
import ScheduledPage from "./pages/ScheduledPage";

type PageType = "home" | "scheduled";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState<PageType>("home");

    const getHeaderTitle = () => {
        if (currentPage === "home") return "Panel de Control";
        if (currentPage === "scheduled") return "Programación";
        return "";
    };

    return (
        <div className="app-container">
            {/* HEADER */}
            <header
                className="header-container"
                style={{ position: "relative", zIndex: 60 }}
            >
                {/* sidebar */}
                <MenuIcon
                    onClick={() => setIsSidebarOpen((prevState) => !prevState)}
                />
                <TextComponent text={getHeaderTitle()} />
            </header>

            {/* SIDEBAR*/}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activePage={currentPage}
                onNavigate={setCurrentPage}
            />

            {currentPage === "home" && <HomePage />}
            {currentPage === "scheduled" && <ScheduledPage />}
            <footer className="footer-container">
                <AddButton />
            </footer>
        </div>
    );
}

export default App;
