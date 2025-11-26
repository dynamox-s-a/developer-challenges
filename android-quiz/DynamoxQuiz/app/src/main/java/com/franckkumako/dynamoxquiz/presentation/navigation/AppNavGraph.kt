package com.franckkumako.dynamoxquiz.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.franckkumako.dynamoxquiz.presentation.quiz.QuizScreen
import com.franckkumako.dynamoxquiz.presentation.quiz.QuizViewModel
import com.franckkumako.dynamoxquiz.presentation.result.ResultScreen
import com.franckkumako.dynamoxquiz.presentation.result.ResultViewModel
import com.franckkumako.dynamoxquiz.presentation.welcome.WelcomeScreen

object Routes {
    const val WELCOME = "welcome"
    const val QUIZ = "quiz"
    const val RESULT = "result"
}

@Composable
fun AppNavGraph() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.WELCOME
    ) {
        composable(Routes.WELCOME) {
            WelcomeScreen(
                onStartQuiz = { playerName ->
                    navController.navigate("${Routes.QUIZ}/$playerName")
                }
            )
        }

        composable(
            route = "${Routes.QUIZ}/{playerName}",
            arguments = listOf(
                navArgument("playerName") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val playerName = backStackEntry.arguments?.getString("playerName") ?: ""
            val viewModel: QuizViewModel = hiltViewModel()

            QuizScreen(
                viewModel = viewModel,
                playerName = playerName,
                onQuizFinished = { score ->
                    navController.navigate("${Routes.RESULT}/$playerName/$score") {
                        popUpTo(Routes.WELCOME) { inclusive = false }
                    }
                }
            )
        }

        composable(
            route = "${Routes.RESULT}/{playerName}/{score}",
            arguments = listOf(
                navArgument("playerName") { type = NavType.StringType },
                navArgument("score") { type = NavType.IntType }
            )
        ) { backStackEntry ->
            val playerName = backStackEntry.arguments?.getString("playerName") ?: ""
            val score = backStackEntry.arguments?.getInt("score") ?: 0
            val viewModel: ResultViewModel = hiltViewModel()

            ResultScreen(
                playerName = playerName,
                score = score,
                onRestart = {
                    navController.navigate(Routes.WELCOME) {
                        popUpTo(Routes.WELCOME) { inclusive = true }
                    }
                },
                viewModel = viewModel
            )
        }
    }
}
