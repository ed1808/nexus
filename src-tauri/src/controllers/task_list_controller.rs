use crate::{models::task_list::List, services::tasks_lists_services::{self, ListWithTasks}};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct ListRequest {
    title: String,
}

#[tauri::command]
pub fn create_list(list_data: ListRequest) -> usize {
    let list = List::new(list_data.title);

    tasks_lists_services::create_list(&list).unwrap_or(0)
}

#[tauri::command]
pub fn get_lists() -> Vec<ListWithTasks> {
    tasks_lists_services::get_lists()
}

#[tauri::command]
pub fn update_list(id: String, list: ListRequest) -> usize {
    tasks_lists_services::update_list(id, list.title).unwrap_or(0)
}

#[tauri::command]
pub fn delete_list(id: String) -> usize {
    tasks_lists_services::delete_list(id).unwrap_or(0)
}