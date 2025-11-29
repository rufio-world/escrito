package com.example.notesapp.data

import androidx.compose.ui.graphics.Color

/**
 * Fixed palette used by the app.
 *
 * Only the [key] is persisted in Room (see [Note.backgroundColor] /
 * [NoteEntity.backgroundColor]); Compose-specific [Color] values stay in the UI
 * layer. When rendering notes we translate the stored key back into a Compose
 * [Color] via [colorForKey].
 */
enum class NoteColor(val key: String, val displayColor: Color) {
    Yellow("YELLOW", Color(0xFFFFF59D)),
    Green("GREEN", Color(0xFFC8E6C9)),
    White("WHITE", Color(0xFFFFFFFF)),
    LightBlue("LIGHT_BLUE", Color(0xFFB3E5FC)),
    Pink("PINK", Color(0xFFF8BBD0));

    companion object {
        /** Palette for UI pickers (stable order for chips/rows). */
        val allColors: List<NoteColor> = entries

        /** Convert a stored database key into the palette entry (defaults to white). */
        fun fromKey(key: String): NoteColor = entries.find { it.key == key } ?: White

        /** Shortcut to get the actual Compose [Color] from a persisted key. */
        fun colorForKey(key: String): Color = fromKey(key).displayColor
    }
}
