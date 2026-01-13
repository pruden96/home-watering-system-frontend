import React from "react";

interface TextProps {
    text: string;
}

const TextComponent: React.FC<TextProps> = ({ text }) => {
    return (
        <div
            className="text-container"
            style={{
                textAlign: "start",
                boxSizing: "border-box",
                padding: "16px 0 16px 0",
            }}
        >
            <span
                style={{
                    fontSize: "30px",
                    color: "white",
                }}
            >
                {text}
            </span>
        </div>
    );
};

export default TextComponent;
