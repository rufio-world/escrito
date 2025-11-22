package com.example.notesapp.data

import kotlinx.coroutines.flow.Flow

class NoteRepository(private val dao: NoteDao) {
    val notes: Flow<List<NoteEntity>> = dao.getNotes()

    fun getNote(id: Long): Flow<NoteEntity?> = dao.getNote(id)

    suspend fun upsert(note: NoteEntity): Long {
        return if (note.id == 0L) {
            dao.insert(note)
        } else {
            dao.update(note)
            note.id
        }
    }

    suspend fun delete(note: NoteEntity) = dao.delete(note)
}
