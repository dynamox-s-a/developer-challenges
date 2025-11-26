package com.franckkumako.dynamoxquiz.presentation.quiz

import com.franckkumako.dynamoxquiz.domain.model.AnswerResult
import com.franckkumako.dynamoxquiz.domain.model.Question
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository
import com.franckkumako.dynamoxquiz.domain.usecase.GetQuestionUseCase
import com.franckkumako.dynamoxquiz.domain.usecase.SaveScoreUseCase
import com.franckkumako.dynamoxquiz.domain.usecase.SubmitAnswerUseCase
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

private class QuizRepositoryFake : QuizRepository {
    override suspend fun getQuestion(): Question {
        return Question(
            id = "1",
            statement = "2 + 2 = ?",
            options = listOf("3", "4")
        )
    }

    override suspend fun submitAnswer(questionId: String, answer: String): AnswerResult {
        return AnswerResult(isCorrect = answer == "4")
    }

    override suspend fun saveScore(playerName: String, score: Int) { }

    override fun observeScores() = error("Not needed")
}

@OptIn(ExperimentalCoroutinesApi::class)
class QuizViewModelTest {

    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(dispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `when correct answer submitted then score increases`() = runTest {
        val repository = QuizRepositoryFake()
        val vm = QuizViewModel(
            getQuestionUseCase = GetQuestionUseCase(repository),
            submitAnswerUseCase = SubmitAnswerUseCase(repository),
            saveScoreUseCase = SaveScoreUseCase(repository)
        )

        vm.startQuiz("Tester")
        dispatcher.scheduler.advanceUntilIdle()

        // select correct option
        vm.selectOption("4")
        vm.submitAnswer("Tester") { }

        dispatcher.scheduler.advanceUntilIdle()

        val state = vm.uiState.value
        assertEquals(1, state.score)
    }
}
