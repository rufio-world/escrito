package com.example.notesapp.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.icons.Icons
import androidx.compose.material3.icons.filled.ArrowBack
import androidx.compose.material3.icons.filled.Check
import androidx.compose.material3.icons.filled.Delete
import androidx.compose.material3.icons.filled.FormatListBulleted
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.notesapp.data.NoteColor

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteEditorScreen(
    viewModel: NoteEditorViewModel,
    onBack: () -> Unit,
) {
    val title by viewModel.title.collectAsStateWithLifecycle()
    val body by viewModel.body.collectAsStateWithLifecycle()
    val color by viewModel.color.collectAsStateWithLifecycle()
    val isExisting = viewModel.isExistingNote

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit note") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (isExisting) {
                        IconButton(onClick = {
                            viewModel.delete { onBack() }
                        }) {
                            Icon(Icons.Filled.Delete, contentDescription = "Delete note")
                        }
                    }
                    IconButton(onClick = {
                        viewModel.save { onBack() }
                    }) {
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
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            TextField(
                value = title,
                onValueChange = viewModel::updateTitle,
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Title") }
            )
            TextField(
                value = body,
                onValueChange = viewModel::updateBody,
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                label = { Text("Body (supports bullets)") },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = color.displayColor,
                    unfocusedContainerColor = color.displayColor,
                    disabledContainerColor = color.displayColor,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                )
            )
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                IconButton(onClick = viewModel::addBulletPoint) {
                    Icon(Icons.Filled.FormatListBulleted, contentDescription = "Insert bullet")
                }
                Text(
                    text = "Color",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                    modifier = Modifier.padding(top = 12.dp)
                )
                ColorSwatches(selected = color, onSelect = viewModel::updateColor)
            }
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}

@Composable
private fun ColorSwatches(selected: NoteColor, onSelect: (NoteColor) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        NoteColor.entries.forEach { color ->
            ColorDot(
                color = color.displayColor,
                selected = color == selected,
                onClick = { onSelect(color) }
            )
        }
    }
}
