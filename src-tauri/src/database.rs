use std::fs;
use std::path::{Path, MAIN_SEPARATOR_STR};

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn init() {
    if !db_exists() {
        create_db();
    }

    run_migrations();
}

pub fn establish_db_connection() -> SqliteConnection {
    let db_path = get_db_path();

    SqliteConnection::establish(&db_path)
        .unwrap_or_else(|_| panic!("Error connecting to {db_path}"))
}

fn run_migrations() {
    let mut connection = establish_connection();
    connection.run_pending_migrations(MIGRATIONS).unwrap();
}

fn establish_connection() -> SqliteConnection {
    let db_path = String::from("sqlite:///") + get_db_path().as_str();

    SqliteConnection::establish(&db_path)
        .unwrap_or_else(|_| panic!("Error connecting to {db_path}"))
}

fn create_db() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    fs::File::create(db_path).unwrap();
}

fn db_exists() -> bool {
    let db_path = get_db_path();
    Path::new(&db_path).exists()
}

fn get_db_path() -> String {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.to_str().unwrap().to_string()
        + MAIN_SEPARATOR_STR
        + "AppData"
        + MAIN_SEPARATOR_STR
        + "Roaming"
        + MAIN_SEPARATOR_STR
        + "app.nexus.desktop"
        + MAIN_SEPARATOR_STR
        + "nexus.sqlite"
}
