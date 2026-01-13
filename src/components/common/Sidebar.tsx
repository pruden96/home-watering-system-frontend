import { Calendar, Home } from "lucide-react"; // Instala lucide-react o usa tus svgs
import React from "react";
import styles from "../../assets/styles/Sidebar.module.css";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activePage: "home" | "scheduled";
    onNavigate: (page: "home" | "scheduled") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    activePage,
    onNavigate,
}) => {
    const handleNav = (page: "home" | "scheduled") => {
        onNavigate(page);
        onClose();
    };

    return (
        <>
            {/* Closes if we click outside the modal*/}
            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
                onClick={onClose}
            />

            {/* Sliding menu */}
            <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <div
                    className={`${styles.menuItem} ${
                        activePage === "home" ? styles.active : ""
                    }`}
                    onClick={() => handleNav("home")}
                >
                    <Home size={20} />
                    <span>Panel de Control</span>
                </div>

                <div
                    className={`${styles.menuItem} ${
                        activePage === "scheduled" ? styles.active : ""
                    }`}
                    onClick={() => handleNav("scheduled")}
                >
                    <Calendar size={20} />
                    <span>Programado</span>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
