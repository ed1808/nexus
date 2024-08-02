use crate::schema::events;
use chrono::{naive::NaiveDateTime, Local};
use diesel::{AsChangeset, Insertable, Queryable};
use serde::Serialize;
use uuid::Uuid;

#[derive(Queryable, Serialize, Insertable, Clone)]
#[diesel(table_name = events)]
pub struct Event {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub start_datetime: NaiveDateTime,
    pub end_datetime: NaiveDateTime,
    pub finished: Option<bool>,
    pub created_at: NaiveDateTime,
}

impl Event {
    pub fn new(
        title: String,
        description: Option<String>,
        start_datetime: NaiveDateTime,
        end_datetime: NaiveDateTime,
        finished: Option<bool>,
    ) -> Self {
        Self {
            id: String::from(Uuid::new_v4()),
            title,
            description,
            start_datetime,
            end_datetime,
            finished,
            created_at: Local::now().naive_local(),
        }
    }
}

#[derive(AsChangeset, Debug)]
#[diesel(table_name = events)]
pub struct EventUpdate {
    title: Option<String>,
    description: Option<String>,
    start_datetime: Option<NaiveDateTime>,
    end_datetime: Option<NaiveDateTime>,
    finished: Option<bool>,
}

impl EventUpdate {
    pub fn new(
        title: Option<String>,
        description: Option<String>,
        start_datetime: Option<NaiveDateTime>,
        end_datetime: Option<NaiveDateTime>,
        finished: Option<bool>,
    ) -> Self {
        Self {
            title,
            description,
            start_datetime,
            end_datetime,
            finished,
        }
    }
}
