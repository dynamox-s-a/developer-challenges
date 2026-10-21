package com.romulofer.kotlinMultiplatform.presentation.registration

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isFalse
import assertk.assertions.isNull
import assertk.assertions.isTrue
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.Blank
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.TooLong
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase.Companion.MAX_NAME_LENGTH
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Quiz
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Scoreboard
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Settings
import com.romulofer.kotlinMultiplatform.testutil.resetMainDispatcher
import com.romulofer.kotlinMultiplatform.testutil.useTestMainDispatcher
import dev.mokkery.answering.calls
import dev.mokkery.answering.returns
import dev.mokkery.answering.throws
import dev.mokkery.everySuspend
import dev.mokkery.matcher.any
import dev.mokkery.mock
import dev.mokkery.verify.VerifyMode.Companion.exactly
import dev.mokkery.verifySuspend
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.test.runTest
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

class RegistrationViewModelTest {

    private val players = mock<PlayerRepository>()
    private val navigator = Navigator()
    private val ana = Player(id = 1, name = "Ana")

    private lateinit var viewModel: RegistrationViewModel

    @BeforeTest
    fun setUp() {
        useTestMainDispatcher()
        viewModel = RegistrationViewModel(RegisterPlayerUseCase(players), navigator)
    }

    @AfterTest
    fun tearDown() = resetMainDispatcher()

    @Test
    fun `starts with an empty form`() {
        assertThat(viewModel.state.value).isEqualTo(RegistrationUiState())
    }

    @Test
    fun `keeps what the user types`() {
        viewModel.onNameChange("Ana")

        assertThat(viewModel.state.value.name).isEqualTo("Ana")
    }

    @Test
    fun `shows an error for a blank name and stays on the screen`() = runTest {
        viewModel.onNameChange("  ")

        viewModel.onStart()

        assertThat(viewModel.state.value.nameError).isEqualTo(Blank)
        assertThat(viewModel.state.value.isLoading).isFalse()
        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `shows an error for a name that is too long`() = runTest {
        viewModel.onNameChange("a".repeat(MAX_NAME_LENGTH + 1))

        viewModel.onStart()

        assertThat(viewModel.state.value.nameError).isEqualTo(TooLong)
    }

    @Test
    fun `clears the error when the user edits the name`() = runTest {
        viewModel.onStart()

        viewModel.onNameChange("A")

        assertThat(viewModel.state.value.nameError).isNull()
    }

    @Test
    fun `starts the quiz for a valid name`() = runTest {
        everySuspend { players.getOrCreate("Ana") } returns ana
        viewModel.onNameChange(" Ana ")

        viewModel.onStart()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration, Quiz(ana, runId = 1)))
        assertThat(viewModel.state.value.isLoading).isFalse()
    }

    @Test
    fun `reports a storage failure and stays on the screen`() = runTest {
        everySuspend { players.getOrCreate(any()) } throws IllegalStateException("disk full")
        viewModel.onNameChange("Ana")

        viewModel.onStart()

        assertThat(viewModel.state.value.storageFailed).isTrue()
        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `opens the scoreboard and the settings`() {
        viewModel.onScoreboardClick()
        viewModel.onSettingsClick()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration, Scoreboard, Settings))
    }

    @Test
    fun `ignores a second tap while the name is being saved`() = runTest {
        val saving = CompletableDeferred<Player>()
        everySuspend { players.getOrCreate("Ana") } calls { saving.await() }
        viewModel.onNameChange("Ana")

        viewModel.onStart()
        assertThat(viewModel.state.value.isLoading).isTrue()
        viewModel.onStart()
        saving.complete(ana)

        verifySuspend(exactly(1)) { players.getOrCreate("Ana") }
        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration, Quiz(ana, runId = 1)))
    }
}
