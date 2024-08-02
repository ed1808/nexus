use crate::{models::note::Note, services::notes_services};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct NoteRequest {
    content: String,
}

#[tauri::command]
pub fn create_note(note_data: NoteRequest) -> usize {
    let note = Note::new(note_data.content);

    notes_services::create_note(&note).unwrap_or(0)
}

#[tauri::command]
pub fn list_notes() -> Vec<Note> {
    notes_services::list_notes()
}

#[tauri::command]
pub fn get_note(id: String) -> Note {
    notes_services::get_note(id).unwrap()
}

#[tauri::command]
pub fn get_last_note() -> Vec<Note> {
    notes_services::get_last_note()
}

#[tauri::command]
pub fn update_note(id: String, note: NoteRequest) -> usize {
    notes_services::update_note(id, note.content).unwrap_or(0)
}

#[tauri::command]
pub fn delete_note(id: String) -> usize {
    notes_services::delete_note(id).unwrap_or(0)
}
