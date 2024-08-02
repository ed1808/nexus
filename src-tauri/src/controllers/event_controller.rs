use crate::{
    models::event::{Event, EventUpdate},
    services::events_services,
};
use chrono:: DateTime;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct EventRequest {
    title: Option<String>,
    description: Option<String>,
    start_datetime: Option<String>,
    end_datetime: Option<String>,
    finished: Option<bool>,
}

#[tauri::command]
pub fn create_event(event_data: EventRequest) -> Event {
    let start_datetime = event_data.start_datetime.unwrap().parse().unwrap();
    let end_datetime = event_data.end_datetime.unwrap().parse().unwrap();

    let event_start_datetime = DateTime::from_timestamp_millis(start_datetime).unwrap();
    let event_end_datetime = DateTime::from_timestamp_millis(end_datetime).unwrap();

    let event: Event = Event::new(
        event_data.title.unwrap(),
        event_data.description,
        event_start_datetime.naive_local(),
        event_end_datetime.naive_local(),
        event_data.finished,
    );

    events_services::create_event(&event).unwrap()
}

#[tauri::command]
pub fn get_events() -> Vec<Event> {
    events_services::get_events()
}

#[tauri::command]
pub fn get_event(id: String) -> Event {
    events_services::get_event(id).unwrap()
}

#[tauri::command]
pub fn get_last_event() -> Vec<Event> {
    events_services::get_last_event()
}

#[tauri::command]
pub fn update_event(id: String, event: EventRequest) -> usize {
    let start_datetime = event.start_datetime.unwrap().parse().unwrap();
    let end_datetime = event.end_datetime.unwrap().parse().unwrap();

    let event_start_datetime = DateTime::from_timestamp_millis(start_datetime).unwrap();
    let event_end_datetime = DateTime::from_timestamp_millis(end_datetime).unwrap();

    let updated_event: EventUpdate = EventUpdate::new(
        event.title,
        event.description,
        Some(event_start_datetime.naive_local()),
        Some(event_end_datetime.naive_local()),
        event.finished,
    );

    events_services::update_event(id, &updated_event).unwrap_or(0)
}

#[tauri::command]
pub fn delete_event(id: String) -> usize {
    events_services::delete_event(id).unwrap_or(0)
}
