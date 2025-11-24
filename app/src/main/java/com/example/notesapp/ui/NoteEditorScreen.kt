package com.example.notesapp.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.icons.Icons
import androidx.compose.material3.icons.filled.ArrowBack
import androidx.compose.material3.icons.filled.Check
import androidx.compose.material3.icons.filled.Delete
import androidx.compose.material3.icons.filled.FormatListBulleted
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.notesapp.data.NoteColor

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteEditorScreen(
    viewModel: NoteViewModel,
    noteId: Long?,
    onBack: () -> Unit,
    onSaved: () -> Unit,
) {
    val editableNote by viewModel.editableNote.collectAsStateWithLifecycle()
    val title = editableNote.title
    val body = editableNote.body
    val color = editableNote.backgroundColor
    val isExisting = editableNote.id != null

    // Load or seed the editor state when the navigation argument changes.
    LaunchedEffect(noteId) {
        if (noteId != null) {
            viewModel.loadNote(noteId)
        } else {
            viewModel.createNewNote()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (title.isEmpty()) "New Note" else "Edit Note") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (isExisting) {
                        IconButton(onClick = { viewModel.deleteCurrentNote(onBack) }) {
                            Icon(Icons.Filled.Delete, contentDescription = "Delete note")
                        }
                    }
                    IconButton(onClick = { viewModel.saveNote(onSaved) }) {
                        Icon(Icons.Filled.Check, contentDescription = "Save")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            OutlinedTextField(
                value = title,
                onValueChange = viewModel::updateTitle,
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Title") }
            )
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedTextField(
                value = body,
                onValueChange = viewModel::updateBody,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp),
                label = { Text("Body") },
                supportingText = { Text("Use the bullet button to quickly add bullet points.") },
                trailingIcon = {
                    IconButton(onClick = viewModel::addBulletPoint) {
                        Icon(Icons.Filled.FormatListBulleted, contentDescription = "Insert bullet")
                    }
                }
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text("Background color", style = MaterialTheme.typography.titleSmall)
            ColorPickerRow(selected = color, onSelected = viewModel::updateBackgroundColor)
            Spacer(modifier = Modifier.height(24.dp))
            Button(onClick = { viewModel.saveNote(onSaved) }, modifier = Modifier.fillMaxWidth()) {
                Text("Save note")
            }
        }
    }
}

@Composable
private fun ColorPickerRow(selected: NoteColor, onSelected: (NoteColor) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        NoteColor.values().forEach { noteColor ->
            ColorChip(color = noteColor, isSelected = noteColor == selected) {
                onSelected(noteColor)
            }
        }
    }
}

@Composable
private fun ColorChip(color: NoteColor, isSelected: Boolean, onClick: () -> Unit) {
    TextButton(
        onClick = onClick,
        modifier = Modifier.weight(1f),
        colors = androidx.compose.material3.ButtonDefaults.textButtonColors(
            containerColor = color.displayColor,
            contentColor = MaterialTheme.colorScheme.onSurface
        )
    ) {
        Text(text = color.name)
        if (isSelected) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = "Selected", style = MaterialTheme.typography.bodySmall)
        }
    }
}
