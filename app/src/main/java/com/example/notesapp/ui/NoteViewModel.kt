package com.example.notesapp.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.notesapp.data.Note
import com.example.notesapp.data.NoteColor
import com.example.notesapp.data.NoteRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * Shared ViewModel for both list and editor screens.
 *
 * - `notes` is collected by the list composable to render the latest data.
 * - `editableNote` is collected by the editor composable to drive its text fields and color chips.
 * All CRUD calls run inside [viewModelScope] so Room work stays off the main thread.
 */
class NoteViewModel(private val repository: NoteRepository) : ViewModel() {

    /** Stream of all notes, exposed as StateFlow for Compose collection. */
    val notes: StateFlow<List<Note>> = repository.getAllNotes()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = emptyList()
        )

    private val _editableNote = MutableStateFlow(EditableNoteState())
    val editableNote: StateFlow<EditableNoteState> = _editableNote.asStateFlow()

    /** Load an existing row into the editor state. */
    fun loadNote(id: Long) {
        viewModelScope.launch {
            val note = repository.getNote(id).firstOrNull()
            _editableNote.value = if (note != null) {
                EditableNoteState(
                    id = note.id,
                    title = note.title,
                    body = note.body,
                    backgroundColor = NoteColor.fromKey(note.backgroundColor)
                )
            } else {
                EditableNoteState()
            }
        }
    }

    /** Seed the editor with an empty note. */
    fun createNewNote() {
        _editableNote.value = EditableNoteState()
    }

    fun updateTitle(title: String) {
        _editableNote.value = _editableNote.value.copy(title = title)
    }

    fun updateBody(body: String) {
        _editableNote.value = _editableNote.value.copy(body = body)
    }

    fun updateBackgroundColor(color: NoteColor) {
        _editableNote.value = _editableNote.value.copy(backgroundColor = color)
    }

    /** Convenience helper for the bullet toolbar action. */
    fun addBulletPoint() {
        // Simple append-only behavior: bullets are added at the end or after a newline.
        _editableNote.value = _editableNote.value.copy(
            body = addBulletToBody(_editableNote.value.body)
        )
    }

    /** Insert or update the current note, then inform the UI. */
    fun saveNote(onSaved: () -> Unit = {}) {
        viewModelScope.launch {
            val state = _editableNote.value
            val note = Note(
                id = state.id ?: 0L,
                title = state.title.ifBlank { "Untitled" },
                body = state.body,
                backgroundColor = state.backgroundColor.key // Persist the stable key; UI converts it back to Color.
            )
            repository.upsertNote(note)
            onSaved()
        }
    }

    /** Delete a note directly from the list screen. */
    fun deleteNote(note: Note) {
        viewModelScope.launch { repository.deleteNote(note) }
    }

    /** Delete the note currently loaded in the editor. */
    fun deleteCurrentNote(onDeleted: () -> Unit = {}) {
        val id = _editableNote.value.id ?: return
        viewModelScope.launch {
            repository.deleteNote(
                Note(
                    id = id,
                    title = _editableNote.value.title,
                    body = _editableNote.value.body,
                    backgroundColor = _editableNote.value.backgroundColor.key,
                )
            )
            onDeleted()
        }
    }
}

/** Simple factory for wiring the repository into the shared ViewModel. */
class NoteViewModelFactory(private val repository: NoteRepository) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return NoteViewModel(repository) as T
    }
}

/** Immutable snapshot of the editor screen state. */
data class EditableNoteState(
    val id: Long? = null,
    val title: String = "",
    val body: String = "",
    val backgroundColor: NoteColor = NoteColor.Yellow,
)
