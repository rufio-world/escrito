package com.example.notesapp.data

/**
 * Convert a database entity into the plain [Note] model used by the rest of the
 * app. Keeping this mapper here avoids leaking Room classes into other layers.
 */
fun NoteEntity.toNote(): Note = Note(
    id = id,
    title = title,
    body = body,
    backgroundColor = backgroundColor,
)

/**
 * Convert a plain [Note] into a [NoteEntity] for Room. This is used whenever we
 * want to persist user changes.
 */
fun Note.toEntity(): NoteEntity = NoteEntity(
    id = id,
    title = title,
    body = body,
    backgroundColor = backgroundColor,
)
