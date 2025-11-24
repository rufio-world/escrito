package com.example.notesapp.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/**
 * Repository that hides the Room layer and exposes suspend/Flow based APIs for
 * the rest of the app. ViewModels only work with [Note] objects and never with
 * Room classes directly.
 */
class NoteRepository(private val dao: NoteDao) {

    /** Stream all notes ordered by id (newest first). */
    fun getAllNotes(): Flow<List<Note>> =
        dao.getAllNotes().map { items -> items.map { it.toNote() } }

    /** Observe a single note. Emits null when the row no longer exists. */
    fun getNote(id: Long): Flow<Note?> =
        dao.getNoteById(id).map { entity -> entity?.toNote() }

    /**
     * Insert or update a note. New notes (id == 0) get inserted and adopt the
     * generated primary key; existing ids trigger an update.
     */
    suspend fun upsertNote(note: Note) {
        val entity = note.toEntity()
        if (note.id == 0L) {
            dao.insertNote(entity)
        } else {
            dao.updateNote(entity)
        }
    }

    /** Permanently remove the provided note. */
    suspend fun deleteNote(note: Note) {
        dao.deleteNote(note.toEntity())
    }
}
