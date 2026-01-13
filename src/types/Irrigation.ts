export interface ManualTask {
    type?: string;
    duration: number;
}

export interface ScheduledTask {
    id?: string;
    dayOfWeek: number[];
    hour: number;
    minute: number;
    duration: number;
    active: boolean;
}

export interface ScheduleModalData {
    time: string;
    duration: number;
    days: number[];
}
