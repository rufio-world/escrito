package com.example.notesapp.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class NoteRepository(private val dao: NoteDao) {
    val notes: Flow<List<Note>> = dao.getAllNotes().map { items -> items.map { it.toNote() } }

    fun getNote(id: Long): Flow<Note?> = dao.getNoteById(id).map { entity -> entity?.toNote() }

    suspend fun save(note: Note): Long {
        val entity = note.toEntity()
        return if (note.id == 0L) {
            dao.insertNote(entity)
        } else {
            dao.updateNote(entity)
            note.id
        }
    }

    suspend fun delete(note: Note) = dao.deleteNote(note.toEntity())
}
