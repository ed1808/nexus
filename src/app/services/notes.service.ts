import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor() { }

  async getNotes(): Promise<Note[]> {
    return await invoke<Note[]>('list_notes');
  }

  async getNote(id: string): Promise<Note> {
    return await invoke<Note>('get_note', { id });
  }

  async getLastNote(): Promise<Note> {
    const result = await invoke<Note[]>('get_last_note');
    
    return result[0];
  }

  createNote(content: string): void {
    const newNoteData: Note = { content };
    invoke('create_note', { noteData: newNoteData });
  }

  async updateNote(id: string, newContent: string): Promise<number> {
    const updatedContent = { content: newContent };
    return await invoke<number>('update_note', { id, note: updatedContent });
  }

  async deleteNote(id: string): Promise<number> {
    return await invoke<number>('delete_note', { id });
  }
}
