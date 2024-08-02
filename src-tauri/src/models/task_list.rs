use crate::schema::lists;
use diesel::{Identifiable, Insertable, Queryable, Selectable};
use serde::Serialize;
use uuid::Uuid;

#[derive(Queryable, Selectable, Identifiable, Serialize, Insertable, Debug, PartialEq)]
#[diesel(table_name = lists)]
pub struct List {
    pub id: String,
    pub title: String,
}

impl List {
    pub fn new(title: String) -> Self {
        Self {
            id: String::from(Uuid::new_v4()),
            title,
        }
    }
}
