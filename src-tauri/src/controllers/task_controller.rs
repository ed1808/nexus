use crate::{models::task::{Task, TaskUpdate}, services::tasks_services};
use chrono::Utc;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct TaskRequest {
    title: Option<String>,
    description: Option<String>,
    priority: Option<String>,
    status: Option<String>,
    position: Option<i32>,
    list_id: Option<String>
}

#[tauri::command]
pub fn create_task(task_data: TaskRequest) -> Task {
    let task: Task = Task::new(
        task_data.title.unwrap(),
        task_data.description,
        task_data.priority,
        task_data.status,
        task_data.position,
        None,
        task_data.list_id.unwrap()
    );

    tasks_services::create_task(&task).unwrap()
}

#[tauri::command]
pub fn get_tasks() -> Vec<Task> {
    tasks_services::get_tasks()
}

#[tauri::command]
pub fn get_task(id: String) -> Task {
    tasks_services::get_task(id).unwrap()
}

#[tauri::command]
pub fn update_task(id: String, task: TaskRequest) -> usize {
    let update_data = TaskUpdate::new(
        task.title, 
        task.description, 
        task.priority, 
        task.status, 
        task.position, 
        Some(Utc::now().naive_utc()),
        task.list_id
    );

    tasks_services::update_task(id, &update_data).unwrap_or(0)
}

#[tauri::command]
pub fn delete_task(id: String) -> usize {
    tasks_services::delete_task(id).unwrap_or(0)
}
