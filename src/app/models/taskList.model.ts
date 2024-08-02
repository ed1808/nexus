import { Task } from "./task.model";

export interface TaskList {
    id?: string;
    title: string;
    tasks?: Task[];
}

export interface TaskListModalConfig {
    entityType: string;
    mode: string;
    title: string;
    entity: { [key: string]: string; };
}
