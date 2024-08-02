export interface Task {
    id?: string;
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    position?: number;
    createdAt?: string;
    updatedAt?: string;
    list_id?: string;
}

export interface TaskModalConfig {
    entityType: string;
    mode: string;
    title: string;
    entity: { [key: string]: string; };
}
