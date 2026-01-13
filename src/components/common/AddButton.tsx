import React, { useState } from "react";
import { irrigationService } from "../../api/irrigation.service";
import type { ScheduledTask, ScheduleModalData } from "../../types/Irrigation";
import ScheduleModal from "./ScheduleModal";
import { useRefreshStore } from "./store/taskRefresh.store";

const AddButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notifyRefresh = useRefreshStore((state) => state.notifyRefresh);

    const handleSaveSchedule = async (data: ScheduleModalData) => {
        console.log("Guardando datos:", data);
        const [hh, mm] = data.time.split(":").map(Number);
        const dataDTO: ScheduledTask = {
            dayOfWeek: data.days,
            hour: hh,
            minute: mm,
            duration: data.duration,
            active: true,
        };
        await irrigationService.scheduleNewTask(dataDTO);
        notifyRefresh();
    };

    const handleAddButtonClick = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <>
            <div
                onClick={handleAddButtonClick}
                className="add-button-container"
                style={{
                    margin: 0,
                    padding: 0,
                    aspectRatio: 1,
                    width: "56px",
                    cursor: "pointer",
                }}
            >
                <img
                    src="/add-button.svg"
                    alt="add-button"
                    style={{
                        width: "100%",
                        aspectRatio: 1,
                    }}
                />
            </div>
            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSchedule}
            />
        </>
    );
};

export default AddButton;
