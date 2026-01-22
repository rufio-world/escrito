plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.kapt")
}

android {
    namespace = "com.example.notesapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.notesapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.15"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.09.02")
    add("implementation", composeBom)
    add("androidTestImplementation", composeBom)

    add("implementation", "androidx.core:core-ktx:1.13.1")
    add("implementation", "androidx.lifecycle:lifecycle-runtime-ktx:2.8.6")
    add("implementation", "androidx.activity:activity-compose:1.9.2")
    add("implementation", "androidx.compose.ui:ui")
    add("implementation", "androidx.compose.ui:ui-tooling-preview")
    add("debugImplementation", "androidx.compose.ui:ui-tooling")
    add("implementation", "androidx.compose.material3:material3")
    add("implementation", "androidx.navigation:navigation-compose:2.8.3")
    add("implementation", "androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")

    add("implementation", "androidx.room:room-runtime:2.6.1")
    add("implementation", "androidx.room:room-ktx:2.6.1")
    add("kapt", "androidx.room:room-compiler:2.6.1")

    add("testImplementation", "junit:junit:4.13.2")
    add("androidTestImplementation", "androidx.test.ext:junit:1.2.1")
    add("androidTestImplementation", "androidx.test.espresso:espresso-core:3.6.1")
    add("androidTestImplementation", "androidx.compose.ui:ui-test-junit4")
    add("debugImplementation", "androidx.compose.ui:ui-test-manifest")
}
