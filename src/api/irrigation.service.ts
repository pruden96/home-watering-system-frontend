import type { ManualTask, ScheduledTask } from "../types/Irrigation";
import { apiRequest } from "./RPIclient";

const IRRIGATE_ENDPOINT = import.meta.env.VITE_IRRIGATE_ENDPOINT;
const SCHEDULE_ENDPOINT = import.meta.env.VITE_SCHEDULE_ENDPOINT;
const STATUS_ENDPOINT = import.meta.env.VITE_STATUS_ENDPOINT;
const STOP_ENDPOINT = import.meta.env.VITE_STOP_ENDPOINT;

export const irrigationService = {
    getTasks() {
        return apiRequest<null, ScheduledTask[]>({
            method: "GET",
            endpoint: SCHEDULE_ENDPOINT,
        });
    },

    manualIrrigation(task: ManualTask) {
        return apiRequest<ManualTask, { message: string }>({
            method: "POST",
            endpoint: IRRIGATE_ENDPOINT,
            body: task,
        });
    },

    scheduleNewTask(task: ScheduledTask) {
        return apiRequest<
            ScheduledTask,
            { message: string; content: ScheduledTask }
        >({
            method: "POST",
            endpoint: SCHEDULE_ENDPOINT,
            body: task,
        });
    },

    updateScheduledTask(task: ScheduledTask) {
        return apiRequest<
            ScheduledTask,
            { message: string; content: ScheduledTask }
        >({
            method: "PUT",
            endpoint: SCHEDULE_ENDPOINT,
            body: task,
        });
    },

    deleteScheduledTask(task: ScheduledTask) {
        return apiRequest<ScheduledTask>({
            method: "DELETE",
            endpoint: SCHEDULE_ENDPOINT,
            body: task,
        });
    },

    getStatus() {
        return apiRequest<null, { remaining: number }>({
            method: "GET",
            endpoint: STATUS_ENDPOINT,
        });
    },

    stopIrrigation() {
        return apiRequest({
            method: "POST",
            endpoint: STOP_ENDPOINT,
        });
    },
};
