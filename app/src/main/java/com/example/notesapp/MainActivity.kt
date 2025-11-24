package com.example.notesapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.notesapp.navigation.NavRoutes
import com.example.notesapp.ui.NoteEditorScreen
import com.example.notesapp.ui.NoteListScreen
import com.example.notesapp.ui.NoteViewModel
import com.example.notesapp.ui.NoteViewModelFactory
import com.example.notesapp.ui.theme.NotesTheme

class MainActivity : ComponentActivity() {

    private val noteViewModel: NoteViewModel by viewModels {
        val repository = (application as NotesApplication).repository
        NoteViewModelFactory(repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { NotesApp(noteViewModel) }
    }
}

@Composable
private fun NotesApp(noteViewModel: NoteViewModel) {
    val navController = rememberNavController()

    NotesTheme {
        Surface(color = MaterialTheme.colorScheme.background) {
            NavHost(
                navController = navController,
                startDestination = NavRoutes.Notes.route
            ) {
                composable(NavRoutes.Notes.route) {
                    NoteListScreen(
                        viewModel = noteViewModel,
                        onAdd = { navController.navigate(NavRoutes.Edit.createRoute(null)) },
                        onOpen = { id -> navController.navigate(NavRoutes.Edit.createRoute(id)) }
                    )
                }

                composable(
                    route = NavRoutes.Edit.route,
                    arguments = listOf(
                        navArgument(NavRoutes.Edit.NOTE_ID) {
                            type = NavType.LongType
                            defaultValue = -1L
                            nullable = true
                        }
                    )
                ) { backStackEntry ->
                    val noteIdArg: Long? = backStackEntry.arguments
                        ?.getLong(NavRoutes.Edit.NOTE_ID)
                        ?.takeIf { it != -1L }
                    NoteEditorScreen(
                        viewModel = noteViewModel,
                        noteId = noteIdArg,
                        onBack = { navController.popBackStack() },
                        onSaved = { navController.popBackStack() }
                    )
                }
            }
        }
    }
}
