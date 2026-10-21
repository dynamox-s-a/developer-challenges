package com.romulofer.kotlinMultiplatform.presentation.quiz

import com.romulofer.kotlinMultiplatform.domain.model.AppError
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession.Companion.TOTAL_QUESTIONS
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Answered
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Finished

data class QuizUiState(
    val session: QuizSession,
    val step: QuizStep
) {
    val totalQuestions: Int get() = TOTAL_QUESTIONS

    val questionNumber: Int
        get() = when (step) {
            is Answered, is Finished -> session.answered
            else -> session.answered + 1
        }

    val progress: Float get() = session.answered.toFloat() / TOTAL_QUESTIONS
}

sealed interface QuizStep {
    data object Loading : QuizStep
    data class LoadFailed(val error: AppError) : QuizStep
    data class Asking(
        val question: Question,
        val selected: String? = null,
        val isSubmitting: Boolean = false,
        val submitError: AppError? = null
    ) : QuizStep
    data class Answered(
        val question: Question,
        val selected: String,
        val isCorrect: Boolean,
        val isLastQuestion: Boolean
    ) : QuizStep
    data class Finished(val scoreSaved: Boolean) : QuizStep
}
