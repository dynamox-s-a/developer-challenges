package com.dynamox.quizchallenge.ui.navigation

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.dynamox.quizchallenge.ui.history.HistoryScreen
import com.dynamox.quizchallenge.ui.nameentry.NameEntryScreen
import com.dynamox.quizchallenge.ui.quiz.QuizScreen
import com.dynamox.quizchallenge.ui.result.ResultScreen

// Shared slide+fade transitions for every destination, so moving forward in the quiz flow
// (name -> quiz -> result) and back always feels directional and consistent, instead of the
// default abrupt cut.
private const val TRANSITION_DURATION_MILLIS = 300

private val enterTransition = slideInHorizontally(
    initialOffsetX = { fullWidth -> fullWidth / 4 },
) + fadeIn(animationSpec = tween(TRANSITION_DURATION_MILLIS))

private val exitTransition = slideOutHorizontally(
    targetOffsetX = { fullWidth -> -fullWidth / 4 },
) + fadeOut(animationSpec = tween(TRANSITION_DURATION_MILLIS))

private val popEnterTransition = slideInHorizontally(
    initialOffsetX = { fullWidth -> -fullWidth / 4 },
) + fadeIn(animationSpec = tween(TRANSITION_DURATION_MILLIS))

private val popExitTransition = slideOutHorizontally(
    targetOffsetX = { fullWidth -> fullWidth / 4 },
) + fadeOut(animationSpec = tween(TRANSITION_DURATION_MILLIS))

@Composable
fun QuizNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(
        navController = navController,
        startDestination = QuizDestination.NameEntry,
        enterTransition = { enterTransition },
        exitTransition = { exitTransition },
        popEnterTransition = { popEnterTransition },
        popExitTransition = { popExitTransition },
    ) {
        composable<QuizDestination.NameEntry> {
            NameEntryScreen(
                onStartQuiz = { name -> navController.navigate(QuizDestination.Quiz(name)) },
                onViewHistory = { navController.navigate(QuizDestination.History) },
            )
        }

        composable<QuizDestination.Quiz> { backStackEntry ->
            val args = backStackEntry.toRoute<QuizDestination.Quiz>()
            QuizScreen(
                onFinished = { correctCount, totalQuestions ->
                    navController.navigate(
                        QuizDestination.Result(args.playerName, correctCount, totalQuestions),
                    ) {
                        popUpTo<QuizDestination.NameEntry>()
                    }
                },
            )
        }

        composable<QuizDestination.Result> { backStackEntry ->
            val args = backStackEntry.toRoute<QuizDestination.Result>()
            ResultScreen(
                playerName = args.playerName,
                correctCount = args.correctCount,
                totalQuestions = args.totalQuestions,
                onRestart = {
                    navController.navigate(QuizDestination.Quiz(args.playerName)) {
                        popUpTo<QuizDestination.NameEntry>()
                    }
                },
                onChangePlayer = {
                    navController.navigate(QuizDestination.NameEntry) {
                        popUpTo<QuizDestination.NameEntry> { inclusive = true }
                    }
                },
                onViewHistory = { navController.navigate(QuizDestination.History) },
            )
        }

        composable<QuizDestination.History> {
            HistoryScreen(onBack = { navController.popBackStack() })
        }
    }
}
