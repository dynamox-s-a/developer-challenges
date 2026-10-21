package com.romulofer.kotlinMultiplatform

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.romulofer.kotlinMultiplatform.presentation.app.AppViewModel
import com.romulofer.kotlinMultiplatform.presentation.navigation.PlatformBackHandler
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Quiz
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Scoreboard
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Settings
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizScreen
import com.romulofer.kotlinMultiplatform.presentation.registration.RegistrationScreen
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardScreen
import com.romulofer.kotlinMultiplatform.presentation.settings.SettingsScreen
import com.romulofer.kotlinMultiplatform.presentation.strings.LocalStrings
import com.romulofer.kotlinMultiplatform.presentation.strings.strings
import com.romulofer.kotlinMultiplatform.presentation.theme.QuizTheme
import org.koin.compose.viewmodel.koinViewModel
import org.koin.core.parameter.parametersOf

private const val SCREEN_ENTER_MILLIS = 250
private const val SCREEN_EXIT_MILLIS = 150

@Composable
fun App(appViewModel: AppViewModel = koinViewModel()) {
    val language by appViewModel.language.collectAsStateWithLifecycle()
    val backStack by appViewModel.backStack.collectAsStateWithLifecycle()

    QuizTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            language?.let { loaded ->
                CompositionLocalProvider(LocalStrings provides loaded.strings()) {
                    PlatformBackHandler(enabled = backStack.size > 1, onBack = appViewModel::onBack)
                    AnimatedContent(
                        targetState = backStack.last(),
                        transitionSpec = {
                            fadeIn(tween(SCREEN_ENTER_MILLIS)) togetherWith fadeOut(tween(SCREEN_EXIT_MILLIS))
                        }
                    ) { screen ->
                        ScreenHost(screen)
                    }
                }
            }
        }
    }
}

@Composable
private fun ScreenHost(screen: Screen) {
    when (screen) {
        Registration -> RegistrationScreen()
        is Quiz -> QuizScreen(
            viewModel = koinViewModel(key = "quiz-${screen.runId}") { parametersOf(screen.player) }
        )
        Scoreboard -> ScoreboardScreen()
        Settings -> SettingsScreen()
    }
}
