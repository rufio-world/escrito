package com.example.notesapp.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.notesapp.data.NoteEntity
import com.example.notesapp.data.NoteRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * ViewModel backing the note list screen. It exposes the list of notes as a
 * [StateFlow] so Compose can easily collect it. This class only knows about the
 * repository and never about UI classes.
 */
class NotesViewModel(private val repository: NoteRepository) : ViewModel() {

    val notes: StateFlow<List<NoteEntity>> = repository.notes
        .map { items -> items.sortedByDescending { it.id } }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = emptyList()
        )

    fun deleteNote(note: NoteEntity) {
        viewModelScope.launch { repository.delete(note) }
    }
}
