package com.andrebritovita.quizapp.ui.quiz

import androidx.lifecycle.SavedStateHandle
import com.andrebritovita.quizapp.domain.model.Question
import com.andrebritovita.quizapp.domain.usecase.GetNewQuestionUseCase
import com.andrebritovita.quizapp.domain.usecase.SaveScoreUseCase
import com.andrebritovita.quizapp.domain.usecase.SubmitAnswerUseCase
import com.andrebritovita.quizapp.ui.screens.quiz.QuizViewModel
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runCurrent
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class QuizViewModelTest {

    private val getNewQuestionUseCase = mockk<GetNewQuestionUseCase>()
    private val submitAnswerUseCase = mockk<SubmitAnswerUseCase>()
    private val saveScoreUseCase = mockk<SaveScoreUseCase>(relaxed = true)
    private val savedStateHandle = SavedStateHandle(mapOf("playerName" to "TesteUser"))
    private val testDispatcher = StandardTestDispatcher()
    private lateinit var viewModel: QuizViewModel

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `inicializacao deve carregar pergunta e atualizar estado`() = runTest {

        val question = Question(id = "1", statement = "Pergunta?", options = listOf("A", "B"))
        coEvery { getNewQuestionUseCase() } returns Result.success(question)

        viewModel = QuizViewModel(savedStateHandle, getNewQuestionUseCase, submitAnswerUseCase, saveScoreUseCase)

        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertEquals(question, state.question)
        assertEquals(null, state.errorResId)
    }

    @Test
    fun `submitAnswer deve incrementar score quando resposta for correta`() = runTest {
        val question = Question(id = "1", statement = "P?", options = listOf("A", "B"))
        coEvery { getNewQuestionUseCase() } returns Result.success(question)
        coEvery { submitAnswerUseCase("1", "A") } returns Result.success(true)

        viewModel = QuizViewModel(savedStateHandle, getNewQuestionUseCase, submitAnswerUseCase, saveScoreUseCase)
        advanceUntilIdle()

        viewModel.selectOption("A")
        viewModel.submitAnswer()

        testScheduler.advanceTimeBy(100)
        runCurrent()

        val stateDuringDelay = viewModel.uiState.value
        assertEquals(true, stateDuringDelay.isAnswerCorrect)
        assertEquals(1, stateDuringDelay.score)

        testScheduler.advanceTimeBy(2000)
        runCurrent()
    }
}