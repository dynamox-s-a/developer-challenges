buildscript {
    dependencies {
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.54")
    }
}

plugins {
    id("com.android.application") version "8.6.0" apply false
    id("org.jetbrains.kotlin.android") version "2.0.20" apply false
    id("org.jetbrains.kotlin.kapt") version "2.0.20" apply false
}
