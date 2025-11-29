package com.andrebritovita.quizapp.ui.navigation

/**
 * Define as rotas de navegação do aplicativo.
 */
sealed class Screen(val route: String) {

    data object Welcome : Screen("welcome_screen")
    data object History : Screen("history_screen")
    data object Quiz : Screen("quiz_screen/{playerName}") {
        fun createRoute(playerName: String) = "quiz_screen/$playerName"
    }
    data object Result : Screen("result_screen/{score}") {
        fun createRoute(score: Int) = "result_screen/$score"
    }
}