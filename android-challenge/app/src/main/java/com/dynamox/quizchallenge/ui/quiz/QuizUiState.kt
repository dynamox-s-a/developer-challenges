package com.dynamox.quizchallenge.ui.quiz

import com.dynamox.quizchallenge.domain.model.AppError
import com.dynamox.quizchallenge.domain.model.Question

sealed interface QuizUiState {

    data object Loading : QuizUiState

    data class InProgress(
        val questionNumber: Int,
        val totalQuestions: Int,
        val question: Question,
        val selectedOption: String? = null,
        val isSubmitting: Boolean = false,
        val revealedCorrect: Boolean? = null,
        val correctCountSoFar: Int = 0,
    ) : QuizUiState {
        val isLastQuestion: Boolean get() = questionNumber == totalQuestions
        val isAnswerRevealed: Boolean get() = revealedCorrect != null
    }

    data class Error(val error: AppError) : QuizUiState
}
