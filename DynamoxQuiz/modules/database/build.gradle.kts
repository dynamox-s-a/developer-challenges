import org.gradle.kotlin.dsl.invoke
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.sqlDelight)
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_11)
        }
    }

    compilerOptions {
        optIn.addAll(
            "kotlin.time.ExperimentalTime",
            "kotlin.uuid.ExperimentalUuidApi",
        )
        freeCompilerArgs.addAll(
            "-Xexpect-actual-classes"
        )
    }

    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            implementation(projects.modules.shared)

            implementation(libs.kotlinx.datetime)
            implementation(libs.kotlinx.coroutines.core)

            implementation(libs.sqldelight.runtime)
            implementation(libs.sqldelight.coroutines)

            implementation(libs.koin.core)
        }
        androidMain.dependencies {
            implementation(libs.androidx.sqlite.bundled)
            implementation(libs.sqldelight.driver.android)
        }
        iosMain.dependencies {
            implementation(libs.sqldelight.driver.native)
        }
    }
}

android {
    namespace = "com.dynamox.quiz.database"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

sqldelight {
    databases {
        create("DatabaseDynamoxQuiz") {
            packageName.set("com.dynamox.quiz.database")
        }
    }
}