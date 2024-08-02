use crate::models::task_list::List;
use crate::schema::tasks;
use chrono::{naive::NaiveDateTime, Utc};
use diesel::{AsChangeset, Associations, Identifiable, Insertable, Queryable, Selectable};
use serde::Serialize;
use uuid::Uuid;

#[derive(
    Identifiable, Associations, Debug, PartialEq, Serialize, Insertable, Queryable, Selectable,
)]
#[diesel(belongs_to(List, foreign_key=list_id))]
#[diesel(table_name = tasks)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: Option<String>,
    pub status: Option<String>,
    pub position: Option<i32>,
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub list_id: String,
}

impl Task {
    pub fn new(
        title: String,
        description: Option<String>,
        priority: Option<String>,
        status: Option<String>,
        position: Option<i32>,
        updated_at: Option<NaiveDateTime>,
        list_id: String,
    ) -> Self {
        Self {
            id: String::from(Uuid::new_v4()),
            title,
            description,
            priority,
            status,
            position,
            created_at: Utc::now().naive_utc(),
            updated_at,
            list_id,
        }
    }
}

#[derive(AsChangeset, Debug)]
#[diesel(table_name = tasks)]
pub struct TaskUpdate {
    title: Option<String>,
    description: Option<String>,
    priority: Option<String>,
    status: Option<String>,
    position: Option<i32>,
    updated_at: Option<NaiveDateTime>,
    list_id: Option<String>,
}

impl TaskUpdate {
    pub fn new(
        title: Option<String>,
        description: Option<String>,
        priority: Option<String>,
        status: Option<String>,
        position: Option<i32>,
        updated_at: Option<NaiveDateTime>,
        list_id: Option<String>,
    ) -> Self {
        Self {
            title,
            description,
            priority,
            status,
            position,
            updated_at,
            list_id,
        }
    }
}
