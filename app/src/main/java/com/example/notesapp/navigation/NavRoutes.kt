package com.example.notesapp.navigation

sealed class NavRoutes(val route: String) {
    data object Notes : NavRoutes("notes_list")
    data object Edit : NavRoutes("note_editor/{noteId}") {
        const val NOTE_ID = "noteId"
        fun createRoute(id: Long?): String = if (id != null) {
            "note_editor/$id"
        } else {
            // Use -1 to represent "new note" (matches default argument).
            "note_editor/-1"
        }
    }
}
