package com.example.notesapp.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.icons.Icons
import androidx.compose.material3.icons.filled.Add
import androidx.compose.material3.icons.filled.Delete
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.notesapp.data.Note
import com.example.notesapp.data.NoteColor

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteListScreen(
    viewModel: NoteViewModel,
    onAdd: () -> Unit,
    onOpen: (Long) -> Unit,
) {
    val notes by viewModel.notes.collectAsStateWithLifecycle()

    Scaffold(
        topBar = { TopAppBar(title = { Text("My Notes") }) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    viewModel.createNewNote()
                    onAdd()
                }
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add note")
            }
        }
    ) { padding ->
        if (notes.isEmpty()) {
            EmptyState(padding)
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(notes, key = { it.id }) { note ->
                    NoteItem(
                        note = note,
                        onOpen = {
                            viewModel.loadNote(note.id)
                            onOpen(note.id)
                        },
                        onDelete = { viewModel.deleteNote(note) }
                    )
                }
            }
        }
    }
}

@Composable
private fun EmptyState(padding: PaddingValues) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(padding),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Create your first note with the + button",
            style = MaterialTheme.typography.bodyLarge
        )
    }
}

@Composable
private fun NoteItem(note: Note, onOpen: () -> Unit, onDelete: () -> Unit) {
    val color = NoteColor.fromKey(note.backgroundColor).displayColor
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOpen() },
        colors = CardDefaults.cardColors(containerColor = color)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = note.title,
                style = MaterialTheme.typography.titleMedium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = note.body,
                style = MaterialTheme.typography.bodyMedium,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 8.dp)
            )
            IconButton(
                onClick = onDelete,
                modifier = Modifier
                    .align(Alignment.End)
                    .padding(top = 8.dp)
                    .clip(MaterialTheme.shapes.small)
            ) {
                Icon(Icons.Filled.Delete, contentDescription = "Delete note", tint = Color.DarkGray)
            }
        }
    }
}
