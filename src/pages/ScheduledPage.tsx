import React, { useEffect, useState } from "react";
import { irrigationService } from "../api/irrigation.service";
import ConfirmModal from "../components/common/ConfirmModal";
import ScheduleModal from "../components/common/ScheduleModal";
import { useRefreshStore } from "../components/common/store/taskRefresh.store";
import TaskCard from "../components/common/TaskCard";
import type { ScheduleModalData, ScheduledTask } from "../types/Irrigation";

const ScheduledPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<ScheduledTask | null>(
        null
    );

    const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);

    const [tasks, setTasks] = useState<ScheduledTask[]>([]);

    const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

    useEffect(() => {
        const getScheduledTasks = async () => {
            const data: ScheduledTask[] = await irrigationService.getTasks();
            setTasks(data);
        };

        getScheduledTasks();
    }, [refreshTrigger]);

    const handleDeleteClick = (task: ScheduledTask) => {
        if (!task) return;
        setTaskToDelete(task);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;

        try {
            console.log(`Eliminando tarea: ${taskToDelete}`);
            await irrigationService.deleteScheduledTask(taskToDelete);
            setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
        } catch (error) {
            console.error("Error eliminando", error);
        } finally {
            setIsConfirmOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleEdit = (task: ScheduledTask) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSave = async (data: ScheduleModalData) => {
        // Convert string "HH:MM" to numbers
        const [hh, mm] = data.time.split(":").map(Number);

        if (editingTask && editingTask.id) {
            // --- UPDATE (PUT) ---
            const dataDTO: ScheduledTask = {
                id: editingTask.id,
                dayOfWeek: data.days,
                hour: hh,
                minute: mm,
                duration: data.duration,
                active: editingTask.active,
            };
            console.log(`Enviando PUT a /tasks/${editingTask.id}`, dataDTO);

            const updatedTask = await irrigationService.updateScheduledTask(
                dataDTO
            );

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === editingTask.id ? updatedTask.content : task
                )
            );
        }

        setIsModalOpen(false);
    };

    const handleToggle = (task: ScheduledTask, newState: boolean) => {
        console.log(
            `Enviando PATCH a /tasks/${task.id} con active: ${newState}`
        );
        const taskDTO = task;
        taskDTO.active = newState;
        irrigationService.updateScheduledTask(taskDTO);

        const updatedTasks = tasks.map((t) =>
            t.id === task.id ? { ...t, active: newState } : t
        );
        setTasks(updatedTasks);
    };

    return (
        <div
            className="main-container"
            style={{
                overflowY: "auto",
            }}
        >
            {" "}
            {/* Floating button space */}
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={(val) => handleToggle(task, val)}
                    onEdit={() => handleEdit(task)}
                    onDelete={() => handleDeleteClick(task)}
                />
            ))}
            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingTask}
            />
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar Riego?"
                message="Esta programación se borrará permanentemente y no se activará el riego."
            />
        </div>
    );
};

export default ScheduledPage;
