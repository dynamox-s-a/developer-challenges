package com.abel.dynamoxquiz.presentation.quiz

import com.abel.dynamoxquiz.data.remote.QuestionDto

data class QuizUiState(
    val isLoading: Boolean = false,
    val question: QuestionDto? = null,
    val selectedAnswer: String? = null,
    val answerResult: Boolean? = null,
    val error: String? = null
)

// vai representar o estado da tela - aqui a Ui vai reagir ao estado observando e redesenhando