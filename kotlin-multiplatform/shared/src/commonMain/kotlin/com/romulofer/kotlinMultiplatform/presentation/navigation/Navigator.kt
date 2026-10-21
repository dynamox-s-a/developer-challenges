package com.romulofer.kotlinMultiplatform.presentation.navigation

import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Quiz
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Scoreboard
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Settings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class Navigator {

    private val _backStack = MutableStateFlow<List<Screen>>(listOf(Registration))
    val backStack: StateFlow<List<Screen>> = _backStack.asStateFlow()

    private var quizRuns = 0

    fun startQuiz(player: Player) {
        quizRuns++
        push(Quiz(player, quizRuns))
    }

    fun showScoreboard() = push(Scoreboard)

    fun showSettings() = push(Settings)

    fun back() {
        _backStack.update { stack -> if (stack.size > 1) stack.dropLast(1) else stack }
    }

    fun backToRegistration() {
        _backStack.value = listOf(Registration)
    }

    private fun push(screen: Screen) {
        _backStack.update { it + screen }
    }
}
