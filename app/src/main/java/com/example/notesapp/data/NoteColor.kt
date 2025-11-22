package com.example.notesapp.data

import androidx.compose.ui.graphics.Color

/**
 * Fixed palette used by the app. Storing the hex string in the database keeps
 * the Room layer free from Compose primitives.
 */
enum class NoteColor(val hex: String, val displayColor: Color) {
    Yellow("#FFF59D", Color(0xFFFFF59D)),
    Green("#C8E6C9", Color(0xFFC8E6C9)),
    White("#FFFFFF", Color(0xFFFFFFFF)),
    LightBlue("#B3E5FC", Color(0xFFB3E5FC)),
    Pink("#F8BBD0", Color(0xFFF8BBD0));

    companion object {
        fun fromHex(hex: String): NoteColor = entries.find { it.hex == hex } ?: White
    }
}
