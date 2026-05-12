package com.abel.dynamoxquiz.presentation.quiz


import com.abel.dynamoxquiz.data.local.ScoreDao
import com.abel.dynamoxquiz.data.remote.AnswerResponse
import com.abel.dynamoxquiz.data.remote.QuestionDto
import com.abel.dynamoxquiz.domain.repository.QuizRepository
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class QuizViewModelTest {

    private lateinit var viewModel:
            QuizViewModel
    private val repository:
            QuizRepository = mockk()
    private val scoreDao:
            ScoreDao = mockk(relaxed = true)
    private val dispatcher =
        StandardTestDispatcher()
    @Before
    fun setup() {
        Dispatchers.setMain(
            dispatcher
        )
        coEvery {
            repository.getQuestion()
        } returns QuestionDto(
            id = "1",
            statement = "Pergunta teste",
            options = listOf(
                "A",
                "B",
                "C"
            )
        )
        viewModel = QuizViewModel(
            repository,
            scoreDao
        )
    }
    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }
    @Test
    fun `when answer is correct score should increase`() =
        runTest {
            coEvery {
                repository.sendAnswer(
                    any(),
                    any()
                )
            } returns AnswerResponse(
                result = true
            )

            viewModel.loadQuestion()
            advanceUntilIdle()
            viewModel.sendAnswer("A")
            advanceUntilIdle()
            assertEquals(
                1,
                viewModel.score.value
            )
        }
    @Test
    fun `restart quiz should reset states`() =
        runTest {

            coEvery {

                repository.sendAnswer(
                    any(),
                    any()
                )

            } returns AnswerResponse(
                result = true
            )

            viewModel.loadQuestion()

            advanceUntilIdle()

            viewModel.sendAnswer("A")

            advanceUntilIdle()

            viewModel.restartQuiz()

            assertEquals(
                0,
                viewModel.score.value
            )

            assertEquals(
                1,
                viewModel.currentQuestion.value
            )

            assertEquals(
                false,
                viewModel.quizFinished.value
            )
        }
}