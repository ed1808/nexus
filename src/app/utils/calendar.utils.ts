import { CalendarEvent } from "../models/event.model";

export interface CalendarDay {
    date: Date;
    today: boolean;
    currentMonth: boolean;
    events: CalendarEvent[];
}

export const daysInitials: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
