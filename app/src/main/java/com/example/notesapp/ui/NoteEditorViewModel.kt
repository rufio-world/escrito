package com.example.notesapp.ui

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.notesapp.data.Note
import com.example.notesapp.data.NoteColor
import com.example.notesapp.data.NoteRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * ViewModel backing the note editor screen. The screen can either create a new
 * note or edit an existing one depending on the navigation argument.
 */
class NoteEditorViewModel(
    private val repository: NoteRepository,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val noteId: Long? = savedStateHandle["noteId"]

    private val _title = MutableStateFlow("")
    val title: StateFlow<String> = _title

    private val _body = MutableStateFlow("")
    val body: StateFlow<String> = _body

    private val _color = MutableStateFlow(NoteColor.Yellow)
    val color: StateFlow<NoteColor> = _color

    init {
        // If a note id is present we load the note once and seed the UI state.
        if (noteId != null) {
            viewModelScope.launch {
                repository.getNote(noteId).first()?.let { note ->
                    _title.value = note.title
                    _body.value = note.body
                    _color.value = NoteColor.fromKey(note.backgroundColor)
                }
            }
        }
    }

    fun updateTitle(value: String) {
        _title.value = value
    }

    fun updateBody(value: String) {
        _body.value = value
    }

    fun updateColor(color: NoteColor) {
        _color.value = color
    }

    fun addBulletPoint() {
        _body.value = if (_body.value.isEmpty()) "• " else _body.value + "\n• "
    }

    fun save(onSaved: (Long) -> Unit) {
        viewModelScope.launch {
            val id = noteId ?: 0L
            val note = Note(
                id = id,
                title = _title.value.ifBlank { "Untitled" },
                body = _body.value,
                backgroundColor = _color.value.key,
            )
            val savedId = repository.save(note)
            onSaved(savedId)
        }
    }
}
