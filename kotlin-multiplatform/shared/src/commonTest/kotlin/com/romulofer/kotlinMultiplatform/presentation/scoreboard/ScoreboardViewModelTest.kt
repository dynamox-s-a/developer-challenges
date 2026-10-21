package com.romulofer.kotlinMultiplatform.presentation.scoreboard

import app.cash.turbine.test
import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Content
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Empty
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Failed
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Loading
import com.romulofer.kotlinMultiplatform.testutil.resetMainDispatcher
import com.romulofer.kotlinMultiplatform.testutil.useTestMainDispatcher
import dev.mokkery.every
import dev.mokkery.answering.returns
import dev.mokkery.mock
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.test.runTest
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

class ScoreboardViewModelTest {

    private val scores = mock<ScoreRepository>()
    private val navigator = Navigator()
    private val entry = ScoreboardEntry("Ana", 8, 10, 1_000L)

    @BeforeTest
    fun setUp() = useTestMainDispatcher()

    @AfterTest
    fun tearDown() = resetMainDispatcher()

    private fun viewModelWith(entries: Flow<List<ScoreboardEntry>>): ScoreboardViewModel {
        every { scores.observeScoreboard() } returns entries
        return ScoreboardViewModel(scores, navigator)
    }

    @Test
    fun `shows the scores when there are some`() = runTest {
        val viewModel = viewModelWith(MutableStateFlow(listOf(entry)))

        viewModel.state.test {
            assertThat(expectMostRecentItem()).isEqualTo(Content(listOf(entry)))
        }
    }

    @Test
    fun `shows the empty state when there are no scores`() = runTest {
        val viewModel = viewModelWith(MutableStateFlow(emptyList()))

        viewModel.state.test {
            assertThat(expectMostRecentItem()).isEqualTo(Empty)
        }
    }

    @Test
    fun `starts in the loading state`() = runTest {
        val viewModel = viewModelWith(MutableStateFlow(emptyList()))

        assertThat(viewModel.state.value).isEqualTo(Loading)
    }

    @Test
    fun `updates when a new score arrives`() = runTest {
        val source = MutableStateFlow(emptyList<ScoreboardEntry>())
        val viewModel = viewModelWith(source)

        viewModel.state.test {
            assertThat(expectMostRecentItem()).isEqualTo(Empty)

            source.value = listOf(entry)

            assertThat(awaitItem()).isEqualTo(Content(listOf(entry)))
        }
    }

    @Test
    fun `shows a failure when the scores cannot be read`() = runTest {
        val viewModel = viewModelWith(flow { throw IllegalStateException("disk error") })

        viewModel.state.test {
            assertThat(expectMostRecentItem()).isEqualTo(Failed)
        }
    }

    @Test
    fun `goes back`() = runTest {
        navigator.showScoreboard()
        val viewModel = viewModelWith(MutableStateFlow(emptyList()))

        viewModel.onBack()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }
}
