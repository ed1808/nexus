use crate::schema::notes;
use chrono::{naive::NaiveDateTime, Local};
use diesel::{Insertable, Queryable};
use serde::Serialize;
use uuid::Uuid;

#[derive(Queryable, Serialize, Insertable)]
#[diesel(table_name = notes)]
pub struct Note {
    pub id: String,
    pub content: String,
    pub created_at: NaiveDateTime,
}

impl Note {
    pub fn new(content: String) -> Self {
        Self {
            id: String::from(Uuid::new_v4()),
            content,
            created_at: Local::now().naive_local(),
        }
    }
}
