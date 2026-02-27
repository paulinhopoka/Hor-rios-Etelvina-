export interface Lesson {
    s: string; // Subject
    t: string; // Teacher
    state: 'normal' | 'interval' | 'moved';
    hidden: boolean;
    tempS: string | null;
    tempT: string | null;
    origIdx: number;
}

export interface DaySchedule extends Array<Lesson> {}

export interface ShiftData {
    times: string[];
    classesList: string[];
    schedules: Record<string, Record<string, DaySchedule>>;
}

export interface ScheduleData {
    config: {
        schoolName: string;
        theme: 'dark' | 'light';
    };
    shifts: {
        manha: ShiftData;
        tarde: ShiftData;
        [key: string]: ShiftData;
    };
}
