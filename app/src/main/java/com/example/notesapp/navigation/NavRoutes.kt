package com.example.notesapp.navigation

sealed class NavRoutes(val route: String) {
    data object Notes : NavRoutes("notes")
    data object Edit : NavRoutes("edit?noteId={noteId}") {
        const val NOTE_ID = "noteId"
        fun createRoute(id: Long?) = if (id != null) "edit?noteId=$id" else "edit"
    }
}
