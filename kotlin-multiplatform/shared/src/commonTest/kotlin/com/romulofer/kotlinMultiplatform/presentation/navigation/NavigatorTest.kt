package com.romulofer.kotlinMultiplatform.presentation.navigation

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Quiz
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Scoreboard
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Settings
import kotlin.test.Test

class NavigatorTest {

    private val navigator = Navigator()
    private val ana = Player(id = 1, name = "Ana")

    @Test
    fun `starts on the registration screen`() {
        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `starts a quiz for the player`() {
        navigator.startQuiz(ana)

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration, Quiz(ana, runId = 1)))
    }

    @Test
    fun `gives every quiz run a new id`() {
        navigator.startQuiz(ana)
        navigator.backToRegistration()
        navigator.startQuiz(ana)

        assertThat(navigator.backStack.value.last()).isEqualTo(Quiz(ana, runId = 2))
    }

    @Test
    fun `opens the scoreboard and the settings`() {
        navigator.showScoreboard()
        navigator.showSettings()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration, Scoreboard, Settings))
    }

    @Test
    fun `goes back one screen`() {
        navigator.showScoreboard()

        navigator.back()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `stays on the first screen when there is nowhere to go back`() {
        navigator.back()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `returns to the registration screen from anywhere`() {
        navigator.startQuiz(ana)
        navigator.showScoreboard()

        navigator.backToRegistration()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }
}
