use crate::{
    database::establish_db_connection,
    models::{task::Task, task_list::List},
    schema::{lists, tasks},
};
use diesel::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
pub struct ListWithTasks {
    #[serde(flatten)]
    list: List,
    tasks: Vec<Task>,
}

pub fn create_list(list: &List) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::insert_into(lists::table)
        .values(list)
        .execute(connection)
}

pub fn get_lists() -> Vec<ListWithTasks> {
    let connection = &mut establish_db_connection();

    let all_lists: Vec<List> = lists::table
        .select(List::as_select())
        .load(connection)
        .expect("Error loading lists");

    let all_tasks: Vec<Task> = Task::belonging_to(&all_lists)
        .select(Task::as_select())
        .order_by(tasks::position.asc())
        .load(connection)
        .expect("Error loading tasks");

    let list_with_tasks = all_tasks
        .grouped_by(&all_lists)
        .into_iter()
        .zip(all_lists)
        .map(|(tasks, list)| ListWithTasks { list, tasks })
        .collect::<Vec<ListWithTasks>>();

    return list_with_tasks;
}

pub fn update_list(list_id: String, list_title: String) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::update(lists::table)
        .filter(lists::id.eq(list_id))
        .set(lists::title.eq(list_title))
        .execute(connection)
}

pub fn delete_list(list_id: String) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::delete(lists::table)
        .filter(lists::id.eq(list_id))
        .execute(connection)
}
