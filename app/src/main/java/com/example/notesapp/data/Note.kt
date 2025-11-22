package com.example.notesapp.data

/**
 * Simple model used by the rest of the app. The background color is stored as a
 * String key (e.g. "YELLOW") to keep persistence simple and avoid leaking UI
 * color classes into the data layer.
 */
data class Note(
    val id: Long = 0L,
    val title: String,
    val body: String,
    val backgroundColor: String,
)
