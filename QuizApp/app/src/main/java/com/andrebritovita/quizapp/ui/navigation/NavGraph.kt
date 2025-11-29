package com.andrebritovita.quizapp.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.andrebritovita.quizapp.ui.screens.HistoryScreen
import com.andrebritovita.quizapp.ui.screens.QuizScreen
import com.andrebritovita.quizapp.ui.screens.ResultScreen
import com.andrebritovita.quizapp.ui.screens.WelcomeScreen

@Composable
fun QuizNavGraph(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Welcome.route
    ) {
        composable(route = Screen.Welcome.route) {
            WelcomeScreen(
                { navController.navigate(Screen.Quiz.createRoute(it)) },
                { navController.navigate(Screen.History.route) }
            )
        }

        composable(
            route = Screen.Quiz.route,
            arguments = listOf(
                navArgument("playerName") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val playerName = backStackEntry.arguments?.getString("playerName") ?: ""
            QuizScreen(
                playerName = playerName,
                onQuizFinished = {
                    navController.navigate(Screen.Result.createRoute(it)) {
                        popUpTo(Screen.Welcome.route) {
                            inclusive = false
                        }
                    }
                }
            )
        }

        composable (
            route = Screen.Result.route,
            arguments = listOf(
                navArgument("score") { type = NavType.IntType }
            )
        ){ backStackEntry ->
            val result = backStackEntry.arguments?.getInt("score") ?: 0
            ResultScreen(
                score = result,
                onRestartClick = { navController.popBackStack(Screen.Welcome.route, inclusive = false) },
                onHistoryClick = { navController.navigate(Screen.History.route) }
            )
        }

        composable (
            route = Screen.History.route
        ){
            HistoryScreen (
                onBackClick = {navController.popBackStack()}
            )
        }
    }
}