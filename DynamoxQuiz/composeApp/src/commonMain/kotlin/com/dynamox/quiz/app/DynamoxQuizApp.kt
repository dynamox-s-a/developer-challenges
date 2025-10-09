package com.dynamox.quiz.app

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.dynamox.quiz.app.auth.view.AuthScreen
import com.dynamox.quiz.app.home.view.HomeScreen
import com.dynamox.quiz.app.navigation.Routes
import com.dynamox.quiz.app.quiz.view.QuizScreen
import com.dynamox.quiz.app.signup.view.SignUpScreen
import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.app.session.model.SessionState
import org.jetbrains.compose.ui.tooling.preview.Preview
import org.koin.compose.koinInject

@Composable
@Preview
fun DynamoxQuizApp() {
    val navController = rememberNavController()

    val sessionManager = koinInject<SessionManager>()
    val state by sessionManager.state.collectAsState()

    LaunchedEffect(state) {
        val destination = when (state) {
            SessionState.Unauthenticated -> Routes.AUTH
            SessionState.Registering -> Routes.REGISTER
            is SessionState.Authenticated -> Routes.HOME
        }
        if (navController.currentDestination?.route != destination) {
            navController.navigate(destination) {
                popUpTo(0)
            }
        }
    }

    MaterialTheme {
        Surface {
            NavHost(
                navController = navController,
                startDestination = Routes.AUTH,
            ) {
                composable(Routes.AUTH) {
                    AuthScreen(onSignUpRequest = sessionManager::setRegistering)
                }
                composable(Routes.REGISTER) {
                    SignUpScreen(onBackRequest = sessionManager::setAuthenticating)
                }
                composable(Routes.HOME) {
                    HomeScreen(onStartQuizRequest = { navController.navigate(Routes.QUIZ) })
                }
                composable(Routes.QUIZ) {
                    QuizScreen(onCloseRequest = navController::popBackStack)
                }
            }
        }
    }
}