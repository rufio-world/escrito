package com.example.notesapp.ui

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.notesapp.data.NoteColor
import com.example.notesapp.data.NoteEntity
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

    private val _content = MutableStateFlow("")
    val content: StateFlow<String> = _content

    private val _color = MutableStateFlow(NoteColor.Yellow)
    val color: StateFlow<NoteColor> = _color

    init {
        // If a note id is present we load the note once and seed the UI state.
        if (noteId != null) {
            viewModelScope.launch {
                repository.getNote(noteId).first()?.let { note ->
                    _title.value = note.title
                    _content.value = note.content
                    _color.value = NoteColor.fromHex(note.colorHex)
                }
            }
        }
    }

    fun updateTitle(value: String) {
        _title.value = value
    }

    fun updateContent(value: String) {
        _content.value = value
    }

    fun updateColor(color: NoteColor) {
        _color.value = color
    }

    fun addBulletPoint() {
        _content.value = if (_content.value.isEmpty()) "• " else _content.value + "\n• "
    }

    fun save(onSaved: (Long) -> Unit) {
        viewModelScope.launch {
            val id = noteId ?: 0L
            val entity = NoteEntity(
                id = id,
                title = _title.value.ifBlank { "Untitled" },
                content = _content.value,
                colorHex = _color.value.hex,
            )
            val savedId = repository.upsert(entity)
            onSaved(savedId)
        }
    }
}
