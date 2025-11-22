package com.example.notesapp.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Room representation of a note. This mirrors the columns we store on disk.
 */
@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val body: String,
    val backgroundColor: String,
)
