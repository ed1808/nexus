use tauri::{SystemTray, CustomMenuItem, SystemTrayMenu};

pub fn system_tray() -> SystemTray {
    let quit = CustomMenuItem::new(String::from("quit"), "Quit");
    let restore = CustomMenuItem::new(String::from("restore"), "Restore");

    let tray_menu = SystemTrayMenu::new().add_item(quit).add_item(restore);

    SystemTray::new().with_menu(tray_menu)
}