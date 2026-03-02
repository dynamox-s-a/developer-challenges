package com.dynamox.quiz.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.dynamox.quiz.presentation.screens.leaderboard.LeaderboardScreen
import com.dynamox.quiz.presentation.screens.login.LoginScreen
import com.dynamox.quiz.presentation.screens.quiz.QuizScreen
import com.dynamox.quiz.presentation.screens.result.ResultScreen
import com.dynamox.quiz.presentation.screens.splash.SplashScreen

/**
 *
 * Função Composable que configura o NavHost, o "gerenciador de telas"
 * do Compose Navigation. Define todas as rotas e as transições entre elas.
 *
 * Importantes:
 * - NavController: objeto que controla a navegação (push/pop da back stack)
 * - NavHost: container que renderiza a tela atual com base na back stack
 * - composable<T>: registra um destino tipado para a classe T
 * - popUpTo: ao navegar, remove telas da back stack para economizar memória
 */
@Composable
fun NavGraph() {
    // rememberNavController cria e lembra o controlador de navegação entre recomposições (sobrevive a mudanças de estado da UI)
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = SplashScreen
    ) {
        composable<SplashScreen> {
            SplashScreen(
                onSplashFinished = {
                    // Após a animação, navega para Login e REMOVE o Splash da back stack
                    // (inclusive = true), para que o botão "voltar" não retorne ao Splash
                    navController.navigate(LoginScreen) {
                        popUpTo(SplashScreen) { inclusive = true }
                    }
                }
            )
        }

        composable<LoginScreen> {
            LoginScreen(
                onStartQuiz = { player ->
                    // Navega para o Quiz passando nome e ID do jogador como parâmetros
                    navController.navigate(QuizScreen(playerName = player.name, playerId = player.id))
                },
                onViewLeaderboard = {
                    navController.navigate(LeaderboardScreen)
                }
            )
        }

        composable<QuizScreen> { backStackEntry ->
            // toRoute<QuizScreen>() desserializa os parâmetros da rota atual
            val route = backStackEntry.toRoute<QuizScreen>()
            QuizScreen(
                playerId = route.playerId,
                playerName = route.playerName,
                onQuizFinished = { score, total ->
                    navController.navigate(
                        ResultScreen(
                            playerName = route.playerName,
                            playerId = route.playerId,
                            score = score,
                            total = total
                        )
                    ) {
                        // Remove a tela de Quiz da back stack ao ir para Resultado
                        // (para não voltar ao quiz no meio com o botão Back)
                        popUpTo(QuizScreen(route.playerName, route.playerId)) { inclusive = true }
                    }
                }
            )
        }

        composable<ResultScreen> { backStackEntry ->
            val route = backStackEntry.toRoute<ResultScreen>()
            ResultScreen(
                playerName = route.playerName,
                playerId = route.playerId,
                score = route.score,
                total = route.total,
                onRestartQuiz = {
                    // Reinicia o quiz para o mesmo jogador, removendo o Resultado da back stack
                    navController.navigate(
                        QuizScreen(playerName = route.playerName, playerId = route.playerId)
                    ) {
                        popUpTo(ResultScreen(route.playerName, route.playerId, route.score, route.total)) {
                            inclusive = true
                        }
                    }
                },
                onViewLeaderboard = {
                    navController.navigate(LeaderboardScreen)
                },
                onHome = {
                    navController.navigate(LoginScreen) {
                        popUpTo(LoginScreen) { inclusive = false }
                        launchSingleTop = true  // evita abrir Login se já está no topo
                    }
                }
            )
        }

        composable<LeaderboardScreen> {
            LeaderboardScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
