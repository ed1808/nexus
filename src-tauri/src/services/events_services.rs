use crate::{
    database::establish_db_connection,
    models::event::{Event, EventUpdate},
    schema::events,
};
use diesel::prelude::*;

pub fn create_event(event: &Event) -> Result<Event, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::insert_into(events::table)
        .values(event)
        .get_result(connection)
}

pub fn get_events() -> Vec<Event> {
    let connection = &mut establish_db_connection();

    events::table
        .load(connection)
        .expect("Error loading events")
}

pub fn get_event(event_id: String) -> Option<Event> {
    let connection = &mut establish_db_connection();

    events::table
        .filter(events::id.eq(event_id))
        .first::<Event>(connection)
        .ok()
}

pub fn get_last_event() -> Vec<Event> {
    let connection = &mut establish_db_connection();

    events::table
        .order_by(events::created_at.desc())
        .limit(1)
        .load(connection)
        .expect("Error loading last event")
}

pub fn update_event(event_id: String, event: &EventUpdate) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::update(events::table)
        .filter(events::id.eq(event_id))
        .set(event)
        .execute(connection)
}

pub fn delete_event(event_id: String) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::delete(events::table)
        .filter(events::id.eq(event_id))
        .execute(connection)
}
