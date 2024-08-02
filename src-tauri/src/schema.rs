// @generated automatically by Diesel CLI.

diesel::table! {
    events (id) {
        id -> Text,
        title -> Text,
        description -> Nullable<Text>,
        start_datetime -> Timestamp,
        end_datetime -> Timestamp,
        finished -> Nullable<Bool>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    lists (id) {
        id -> Text,
        title -> Text,
    }
}

diesel::table! {
    notes (id) {
        id -> Text,
        content -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    tasks (id) {
        id -> Text,
        title -> Text,
        description -> Nullable<Text>,
        priority -> Nullable<Text>,
        status -> Nullable<Text>,
        position -> Nullable<Integer>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        list_id -> Text,
    }
}

diesel::joinable!(tasks -> lists (list_id));

diesel::allow_tables_to_appear_in_same_query!(
    events,
    lists,
    notes,
    tasks,
);
