package com.dynamox.quizchallenge.ui.navigation

import kotlinx.serialization.Serializable

/** Type-safe navigation destinations for the quiz flow. */
sealed interface QuizDestination {

    @Serializable
    data object NameEntry : QuizDestination

    @Serializable
    data class Quiz(val playerName: String) : QuizDestination

    @Serializable
    data class Result(val playerName: String, val correctCount: Int, val totalQuestions: Int) : QuizDestination

    @Serializable
    data object History : QuizDestination
}
