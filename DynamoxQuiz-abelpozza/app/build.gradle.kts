plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("kotlin-kapt")




}

android {

    namespace = "com.abel.dynamoxquiz"

    compileSdk = 36

    defaultConfig {

        applicationId = "com.abel.dynamoxquiz"

        minSdk = 24
        targetSdk = 36

        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner =
            "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {

        release {

            isMinifyEnabled = false

            proguardFiles(
                getDefaultProguardFile(
                    "proguard-android-optimize.txt"
                ),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {

        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {

        jvmTarget = "11"
    }

    buildFeatures {

        compose = true
    }
    composeOptions {

        kotlinCompilerExtensionVersion = "1.5.14"
    }

}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    implementation(platform(libs.androidx.compose.bom))

    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)

    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.navigation.compose)

    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)

    implementation(libs.okhttp.logging)

    implementation(libs.kotlinx.coroutines.android)

    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    testImplementation("junit:junit:4.13.2")

    testImplementation(
        "org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3"
    )

    testImplementation(
        "io.mockk:mockk:1.13.8"
    )

    testImplementation(libs.junit)
    testImplementation(libs.mockito.core)
    testImplementation(libs.turbine)

    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)

    androidTestImplementation(
        platform(libs.androidx.compose.bom)
    )

    androidTestImplementation(
        libs.androidx.compose.ui.test.junit4
    )

    debugImplementation(libs.androidx.compose.ui.tooling)

    debugImplementation(
        libs.androidx.compose.ui.test.manifest

    )
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.24")
        implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.24")
        implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.24")
    }
}
configurations.all {
    resolutionStrategy {
        force("org.jetbrains.kotlin:kotlin-stdlib:1.9.24")
        force("org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.24")
        force("org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.24")
    }
}
configurations.configureEach {
    resolutionStrategy.eachDependency {
        if (requested.group == "com.squareup" &&
            requested.name == "javapoet"
        ) {
            useVersion("1.13.0")
        }
    }
}

