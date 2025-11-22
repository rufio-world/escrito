package com.example.notesapp

import android.app.Application
import com.example.notesapp.data.NoteDatabase
import com.example.notesapp.data.NoteRepository

class NotesApplication : Application() {
    // Lazily create the database and repository once for the whole app.
    val database by lazy { NoteDatabase.getInstance(this) }
    val repository by lazy { NoteRepository(database.noteDao()) }
}
