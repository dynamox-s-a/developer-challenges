package br.com.govanidebastiani.dynamoxquiz.app

import kotlinx.serialization.Serializable

sealed interface Route {
    @Serializable
    data object AppGraph: Route

    @Serializable
    data object PlayerScreen: Route

    @Serializable
    data class QuizScreen(val playerNickname: String, val ignoreIds: List<String> = emptyList()): Route

    @Serializable
    data class FinalScore(val quizId: Long, val ignoreIds: List<String>): Route

    @Serializable
    data object HistoryScreen: Route
}