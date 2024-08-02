use crate::{database::establish_db_connection, models::note::Note, schema::notes};
use diesel::prelude::*;

pub fn create_note(note: &Note) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::insert_into(notes::table)
        .values(note)
        .execute(connection)
}

pub fn list_notes() -> Vec<Note> {
    let connection = &mut establish_db_connection();

    notes::table
        .order_by(notes::created_at.desc())
        .load(connection)
        .expect("Error loading notes")
}

pub fn get_note(note_id: String) -> Option<Note> {
    let connection = &mut establish_db_connection();

    notes::table
        .filter(notes::id.eq(note_id))
        .first::<Note>(connection)
        .ok()
}

pub fn get_last_note() -> Vec<Note> {
    let connection = &mut establish_db_connection();

    notes::table
        .order_by(notes::created_at.desc())
        .limit(1)
        .load(connection)
        .expect("Error loading last note")
}

pub fn update_note(note_id: String, note_content: String) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::update(notes::table)
        .filter(notes::id.eq(note_id))
        .set(notes::content.eq(note_content))
        .execute(connection)
}

pub fn delete_note(note_id: String) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::delete(notes::table)
        .filter(notes::id.eq(note_id))
        .execute(connection)
}
