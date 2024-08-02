// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controllers;
mod database;
mod models;
mod schema;
mod services;
mod system_tray;

use controllers::{
    event_controller::*, note_controller::*, task_controller::*, task_list_controller::*,
};

use database::establish_db_connection;
use diesel::prelude::*;
use models::event::Event;
use schema::events;
use system_tray::system_tray::system_tray;

use tauri::{Manager, SystemTrayEvent};
use tokio::sync::mpsc;
use cron::Schedule;
use chrono::Local;
use std::{str::FromStr, time::Duration};

#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let (sender, mut receiver) = mpsc::channel(100);

            tokio::spawn(async move {
                database::init();
            });

            tokio::spawn(async move {
                let expression = "0 */30 * * * * *";
                let schedule = Schedule::from_str(expression).unwrap();

                for datetime in schedule.upcoming(Local) {
                    let now = Local::now();
                    let duration_to_wait = datetime.signed_duration_since(now).to_std().unwrap();

                    tokio::time::sleep(duration_to_wait).await;

                    if let Some(event) = check_upcoming_event().await {
                        let _ = sender.send(event).await;
                    }
                }
            });

            tokio::spawn(async move {
                while let Some(event) = receiver.recv().await {
                    handle.emit_all("notification", event).unwrap();
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_note,
            list_notes,
            get_note,
            get_last_note,
            update_note,
            delete_note,
            create_list,
            get_lists,
            update_list,
            delete_list,
            create_task,
            get_task,
            get_tasks,
            update_task,
            delete_task,
            create_event,
            get_events,
            get_event,
            get_last_event,
            update_event,
            delete_event
        ])
        .system_tray(system_tray())
        .on_system_tray_event(|app, event| {
            match event {
                SystemTrayEvent::MenuItemClick { id, .. } => {
                    match id.as_str() {
                        "quit" => {
                            std::process::exit(0);
                        }
                        "restore" => {
                            let window = app.get_window("main").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn check_upcoming_event() -> Option<Event> {
    let connection = &mut establish_db_connection();

    events::table
        .filter(events::start_datetime.ge(Local::now().naive_local().to_string()))
        .filter(events::start_datetime.le((Local::now() + Duration::from_secs(1800)).naive_local().to_string()))
        .first::<Event>(connection)
        .ok()
} 
