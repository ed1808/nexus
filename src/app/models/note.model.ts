export interface Note {
    id?: string;
    content: string;
}

export interface NoteModalConfig {
    entityType: string;
    mode: string;
    title: string;
    entity: { [key: string]: string; };
}
