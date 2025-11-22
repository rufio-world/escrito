package com.example.notesapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.notesapp.data.NoteRepository
import com.example.notesapp.navigation.NavRoutes
import com.example.notesapp.ui.NoteEditorScreen
import com.example.notesapp.ui.NoteEditorViewModel
import com.example.notesapp.ui.NoteListScreen
import com.example.notesapp.ui.NotesViewModel
import com.example.notesapp.ui.theme.NotesTheme

class MainActivity : ComponentActivity() {

    private val notesViewModel: NotesViewModel by viewModels {
        val repository = (application as NotesApplication).repository
        object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return NotesViewModel(repository) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { NotesApp(notesViewModel) }
    }
}

@Composable
private fun NotesApp(notesViewModel: NotesViewModel) {
    val navController = rememberNavController()
    val application = LocalContext.current.applicationContext as NotesApplication
    val repository = application.repository

    NotesTheme {
        Surface(color = MaterialTheme.colorScheme.background) {
            NavHost(
                navController = navController,
                startDestination = NavRoutes.Notes.route
            ) {
                composable(NavRoutes.Notes.route) {
                    NoteListScreen(
                        viewModel = notesViewModel,
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
                    val editorViewModel: NoteEditorViewModel = viewModel(
                        factory = NoteEditorViewModelFactory(repository, noteIdArg),
                        viewModelStoreOwner = backStackEntry
                    )
                    NoteEditorScreen(
                        viewModel = editorViewModel,
                        onBack = { navController.popBackStack() },
                    )
                }
            }
        }
    }
}

private class NoteEditorViewModelFactory(
    private val repository: NoteRepository,
    private val noteId: Long?,
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return NoteEditorViewModel(
            repository = repository,
            savedStateHandle = SavedStateHandle(mapOf("noteId" to noteId))
        ) as T
    }
}
