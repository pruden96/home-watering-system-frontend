import React from "react";

interface MenuIconProps {
    onClick?: () => void;
}

const MenuIcon: React.FC<MenuIconProps> = ({ onClick }) => {
    return (
        <div
            className="menu-icon-container"
            onClick={onClick}
            style={{
                margin: 0,
                padding: 0,
                width: "32px",
                height: "21px",
                cursor: "pointer",
            }}
        >
            <img
                src="/icons/menu-icon-2.svg"
                alt="menu-icon"
                style={{
                    width: "100%",
                }}
            />
        </div>
    );
};

export default MenuIcon;
