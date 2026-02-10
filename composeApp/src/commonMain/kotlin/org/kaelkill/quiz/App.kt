package org.kaelkill.quiz

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import org.kaelkill.quiz.di.appModule
import org.kaelkill.quiz.ui.screens.HistoryScreen
import org.kaelkill.quiz.ui.screens.LoginScreen
import org.kaelkill.quiz.ui.screens.QuizScreen
import org.kaelkill.quiz.ui.screens.ResultScreen
import org.kaelkill.quiz.ui.viewmodel.QuizViewModel
import org.kaelkill.quiz.ui.viewmodel.Screen
import org.koin.compose.KoinApplication
import org.koin.compose.koinInject

@Composable
fun App() {
    KoinApplication(application = { modules(appModule) }) {
        MaterialTheme {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colorScheme.background
            ) {
                val viewModel: QuizViewModel = koinInject()
                val state by viewModel.state.collectAsState()

                when (state.screen) {
                    Screen.LOGIN -> LoginScreen(
                        playerName = state.playerName,
                        isLoading = state.isLoading,
                        error = state.error,
                        onNameChanged = viewModel::onPlayerNameChanged,
                        onStartQuiz = viewModel::onStartQuiz,
                        onShowHistory = viewModel::onShowHistory
                    )

                    Screen.QUIZ -> QuizScreen(
                        question = state.currentQuestion,
                        progress = state.progress,
                        questionIndex = state.currentQuestionIndex,
                        selectedOption = state.selectedOption,
                        answerResult = state.answerResult,
                        isLoading = state.isLoading,
                        isWaitingForQuestion = state.isWaitingForQuestion,
                        score = state.session?.score?.value ?: 0,
                        error = state.error,
                        canRetry = state.canRetry,
                        onSelectOption = viewModel::onSelectOption,
                        onSubmitAnswer = viewModel::onSubmitAnswer,
                        onNextQuestion = viewModel::onNextQuestion,
                        onRetry = viewModel::onRetry
                    )

                    Screen.RESULT -> ResultScreen(
                        playerName = state.player?.name?.value ?: "",
                        score = state.session?.score?.value ?: 0,
                        onRestartQuiz = viewModel::onRestartQuiz,
                        onShowHistory = viewModel::onShowHistory,
                        onBackToLogin = viewModel::onBackToLogin
                    )

                    Screen.HISTORY -> HistoryScreen(
                        players = state.allPlayers,
                        onBack = viewModel::onBackFromHistory
                    )
                }
            }
        }
    }
}