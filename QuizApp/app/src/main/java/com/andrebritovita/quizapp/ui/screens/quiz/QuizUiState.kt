package com.andrebritovita.quizapp.ui.screens.quiz

import com.andrebritovita.quizapp.domain.model.Question

/**
 * Representa o estado visual da tela de Quiz.
 * A UI deve apenas reagir a este estado (Unidirectional Data Flow).
 */
data class QuizUiState(
    val isLoading: Boolean = true,
    val question: Question? = null,
    val questionIndex: Int = 1,
    val totalQuestions: Int = 10,
    val score: Int = 0,
    val selectedOption: String? = null,
    val isCheckingAnswer: Boolean = false, // bloqueia cliques enquanto valida na API
    val isAnswerCorrect: Boolean? = null,
    val errorResId: Int? = null,
    val isQuizFinished: Boolean = false
) {
    val isButtonEnabled: Boolean
        get() = selectedOption != null && !isCheckingAnswer && isAnswerCorrect == null
}