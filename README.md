# escrito

A simple Android notes app built with Kotlin, Jetpack Compose, Material 3, and Room. The app stores notes locally and demonstrates a minimal MVVM-style architecture with Compose Navigation.

## Features
- Create, edit, view, and delete notes with a title and body.
- Choose a background color (yellow, green, white, light blue, or pink) for each note.
- Bullet helper button inserts a "• " to keep lists tidy.
- Navigation Compose inside a single-activity setup.
- Room-backed persistence with flows observed by Compose.

## Running the app
1. Open the project in Android Studio (latest stable Android SDK installed).
2. Let Gradle sync finish (Android Studio will prompt if anything is missing).
3. Select an emulator or connected device and press Run to install the app module.

## Manual test checklist
- Create a new note and save it.
- Edit the title, body, and background color, then save again.
- Tap Add bullet and confirm a "• " is appended at the end or on a new line.
- Delete a note and confirm it disappears from the list.
- Close or kill the app, relaunch, and verify notes are still present (Room persistence).

## Future enhancements
- Search notes by title or body.
- Pin or favourite notes to keep them at the top.
- Sort notes by date or title.
- Export/import or back up notes.
- Share note content via a simple Android share intent.

## Project structure
- app/src/main/java/com/example/notesapp/data - Room entities, DAO, database, and repository.
- app/src/main/java/com/example/notesapp/ui - ViewModels and Compose screens.
- app/src/main/java/com/example/notesapp/navigation - Navigation routes used by the NavHost.
- app/src/main/java/com/example/notesapp/ui/theme - Compose theming helpers.
