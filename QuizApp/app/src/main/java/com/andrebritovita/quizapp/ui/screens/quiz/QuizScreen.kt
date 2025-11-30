package com.andrebritovita.quizapp.ui.screens.quiz


import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.andrebritovita.quizapp.ui.components.ErrorView
import com.andrebritovita.quizapp.ui.components.LoadingView


@Composable
fun QuizScreen(
    viewModel: QuizViewModel = hiltViewModel(),
    onQuizFinished: (Int) -> Unit
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(state.isQuizFinished) {
        if (state.isQuizFinished) {
            onQuizFinished(state.score)
        }
    }

    if (state.isLoading) {
        LoadingView()
    } else if (state.errorResId != null) {
        ErrorView(
            messageId = state.errorResId!!,
            onRetry = {
                viewModel.loadNextQuestion()
            })
    } else if (state.question != null) {
        QuizContent(
            state = state,
            onOptionSelected = viewModel::selectOption,
            onSubmit = viewModel::submitAnswer
        )
    }
}