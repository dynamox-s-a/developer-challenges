package br.com.govanidebastiani.dynamoxquiz.app

import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import androidx.navigation.compose.rememberNavController
import br.com.govanidebastiani.dynamoxquiz.player.presentation.PlayerScreenRoot
import br.com.govanidebastiani.dynamoxquiz.player.presentation.PlayerViewModel
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.QuizScreenRoute
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.QuizViewModel
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.finalscore.FinalScoreScreenRoot
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.finalscore.FinalScoreViewModel
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.history.HistoryScreenRoot
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.history.HistoryScreenViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
@Preview
fun App() {
    MaterialTheme {
        val navController = rememberNavController()

        NavHost(
            navController = navController,
            startDestination = Route.AppGraph
        ) {
            navigation<Route.AppGraph>(
                startDestination = Route.PlayerScreen
            ) {
                composable<Route.PlayerScreen>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    val viewModel = koinViewModel<PlayerViewModel>()
                    PlayerScreenRoot(
                        viewModel = viewModel,
                        onNavigateToQuiz = { playerNickname ->
                            navController.navigate(Route.QuizScreen(playerNickname))
                        },
                        onSeeHistory = {
                            navController.navigate(Route.HistoryScreen)
                        }
                    )
                }

                composable<Route.QuizScreen>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    val viewModel = koinViewModel<QuizViewModel>()
                    QuizScreenRoute(
                        viewModel = viewModel,
                        onNavigateToFinalScore = { quizId, ignoreIds ->
                            navController.navigate(Route.FinalScore(quizId, ignoreIds))
                        }
                    )
                }

                composable<Route.FinalScore>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    val viewModel = koinViewModel<FinalScoreViewModel>()
                    FinalScoreScreenRoot(
                        viewModel = viewModel,
                        onRestartQuiz = { playerNickname, ignoreIds ->
                            navController.navigate(Route.QuizScreen(playerNickname, ignoreIds))
                        },
                        onSeeHistory = {
                            navController.navigate(Route.HistoryScreen)
                        }
                    )
                }

                composable<Route.HistoryScreen> {
                    val viewModel = koinViewModel<HistoryScreenViewModel>()
                    HistoryScreenRoot(
                        viewModel = viewModel
                    )
                }
            }
        }
    }
}