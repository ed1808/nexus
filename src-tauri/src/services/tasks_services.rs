use crate::{
    database::establish_db_connection,
    models::task::{Task, TaskUpdate},
    schema::tasks,
};
use diesel::prelude::*;

pub fn create_task(task: &Task) -> Result<Task, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::insert_into(tasks::table)
        .values(task)
        .get_result(connection)
}

pub fn get_tasks() -> Vec<Task> {
    let connection = &mut establish_db_connection();

    tasks::table
        .order_by(tasks::created_at.desc())
        .load(connection)
        .expect("Error loading tasks")
}

pub fn get_task(task_id: String) -> Option<Task> {
    let connection = &mut establish_db_connection();

    tasks::table
        .filter(tasks::id.eq(task_id))
        .first::<Task>(connection)
        .ok()
}

pub fn update_task(task_id: String, task: &TaskUpdate) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::update(tasks::table)
        .filter(tasks::id.eq(task_id))
        .set(task)
        .execute(connection)
}

pub fn delete_task(task_id: String) -> Result<usize, diesel::result::Error> {
    let connection = &mut establish_db_connection();

    diesel::delete(tasks::table)
        .filter(tasks::id.eq(task_id))
        .execute(connection)
}
