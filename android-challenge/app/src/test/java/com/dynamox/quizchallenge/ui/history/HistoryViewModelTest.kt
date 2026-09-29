package com.dynamox.quizchallenge.ui.history

import app.cash.turbine.test
import com.dynamox.quizchallenge.domain.model.PlayerScore
import com.dynamox.quizchallenge.domain.usecase.ObserveScoreHistoryUseCase
import com.dynamox.quizchallenge.fakes.FakeScoreRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import java.time.Instant

@OptIn(ExperimentalCoroutinesApi::class)
class HistoryViewModelTest {

    private val dispatcher = StandardTestDispatcher()
    private lateinit var repository: FakeScoreRepository

    @Before
    fun setUp() {
        Dispatchers.setMain(dispatcher)
        repository = FakeScoreRepository()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    private fun createViewModel() = HistoryViewModel(ObserveScoreHistoryUseCase(repository))

    @Test
    fun `starts empty when there is no saved score`() = runTest {
        val viewModel = createViewModel()

        viewModel.uiState.test {
            assertEquals(HistoryUiState.Loading, awaitItem())
            assertEquals(HistoryUiState.Empty, awaitItem())
        }
    }

    @Test
    fun `reflects every saved score`() = runTest {
        val viewModel = createViewModel()

        viewModel.uiState.test {
            assertEquals(HistoryUiState.Loading, awaitItem())
            assertEquals(HistoryUiState.Empty, awaitItem())

            repository.saveScore(
                PlayerScore(playerName = "Ada", correctCount = 8, totalQuestions = 10, playedAt = Instant.now()),
            )

            val content = awaitItem() as HistoryUiState.Content
            assertEquals(1, content.scores.size)
            assertEquals("Ada", content.scores.first().playerName)
        }
    }
}
