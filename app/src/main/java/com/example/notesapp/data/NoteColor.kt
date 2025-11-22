package com.example.notesapp.data

import androidx.compose.ui.graphics.Color

/**
 * Fixed palette used by the app. We store only a simple key (e.g. "YELLOW") in
 * the database and map it to a real Compose [Color] inside the UI layer.
 */
enum class NoteColor(val key: String, val displayColor: Color) {
    Yellow("YELLOW", Color(0xFFFFF59D)),
    Green("GREEN", Color(0xFFC8E6C9)),
    White("WHITE", Color(0xFFFFFFFF)),
    LightBlue("LIGHT_BLUE", Color(0xFFB3E5FC)),
    Pink("PINK", Color(0xFFF8BBD0));

    companion object {
        fun fromKey(key: String): NoteColor = entries.find { it.key == key } ?: White
    }
}
