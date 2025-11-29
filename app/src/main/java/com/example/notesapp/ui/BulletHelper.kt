package com.example.notesapp.ui

/**
 * Append a simple bullet to the end of the text.
 *
 * We do not track cursor position; the bullet is always appended at the end of
 * the current body (or after a newline). This is intentionally minimal and
 * avoids a rich-text dependency for the first version.
 */
fun addBulletToBody(current: String): String {
    val bullet = "\u2022 "
    if (current.isBlank()) return bullet
    return if (current.endsWith("\n")) {
        current + bullet
    } else {
        "$current\n$bullet"
    }
}
