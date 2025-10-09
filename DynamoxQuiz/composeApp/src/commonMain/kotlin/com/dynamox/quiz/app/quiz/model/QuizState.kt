package com.dynamox.quiz.app.quiz.model

import kotlin.time.Duration

sealed interface QuizState {
    data object Answering : QuizState
    data class Completed(val score: Int, val totalDuration: Duration) : QuizState
    data class Error(val errorMessage: String, val state: QuizState) : QuizState
}