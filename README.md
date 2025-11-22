# escrito

A simple Android notes app built with Kotlin, Jetpack Compose, Material 3, and Room. The app stores notes locally and demonstrates a minimal MVVM-style architecture with Compose Navigation.

## Features
- Create, edit, view, and delete notes with a title and body.
- Choose a background color (yellow, green, white, light blue, or pink) for each note.
- Bullet helper button inserts "•" to keep lists tidy.
- Navigation Compose inside a single-activity setup.
- Room-backed persistence with flows observed by Compose.

## Running the app
1. Open the project in Android Studio (Koala or newer recommended).
2. If the Gradle wrapper is missing, run `gradle wrapper --gradle-version 8.7` to generate it (Android Studio will also offer to create one).
3. Use the included `app` run configuration or click **Run** to install on an emulator/device (API 24+).

## Project structure
- `app/src/main/java/com/example/notesapp/data` – Room entities, DAO, database, and repository.
- `app/src/main/java/com/example/notesapp/ui` – ViewModels and Compose screens.
- `app/src/main/java/com/example/notesapp/navigation` – Navigation routes used by the NavHost.
- `app/src/main/java/com/example/notesapp/ui/theme` – Compose theming helpers.
