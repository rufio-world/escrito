package com.example.notesapp.data

import android.content.Context

/**
 * Simple helper that wires up the Room database with the repository without
 * pulling in a full dependency-injection framework.
 */
object NoteRepositoryProvider {
    fun get(context: Context): NoteRepository {
        val database = NoteDatabase.getInstance(context.applicationContext)
        return NoteRepository(database.noteDao())
    }
}
