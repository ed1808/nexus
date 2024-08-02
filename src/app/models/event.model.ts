export interface CalendarEvent {
    id?: string;
    title?: string;
    description?: string;
    start_datetime?: string;
    end_datetime?: string;
    finished?: boolean;
    created_at?: string;
}

export interface CalendarEventModalConfig {
    entityType: string;
    mode: string;
    title: string;
    entity: { [key: string]: string; };
}

export interface ListEvent {
    id: string;
    title: string;
    description?: string;
    start_datetime: string;
    end_datetime: string;
    created_at: string;
    time: string;
}
