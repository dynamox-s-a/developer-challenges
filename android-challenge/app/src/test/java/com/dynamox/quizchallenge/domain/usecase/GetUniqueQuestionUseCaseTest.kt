package com.dynamox.quizchallenge.domain.usecase

import com.dynamox.quizchallenge.domain.model.AppError
import com.dynamox.quizchallenge.domain.model.Question
import com.dynamox.quizchallenge.domain.repository.QuizRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class GetUniqueQuestionUseCaseTest {

    private fun question(id: String) = Question(id = id, statement = "Statement $id", options = listOf("A", "B"))

    @Test
    fun `returns the first question when it has not been seen before`() = runTest {
        val repository = mockk<QuizRepository>()
        coEvery { repository.fetchQuestion() } returns Result.success(question("1"))
        val useCase = GetUniqueQuestionUseCase(repository)

        val result = useCase(seenQuestionIds = emptySet())

        assertEquals("1", result.getOrThrow().id)
        coVerify(exactly = 1) { repository.fetchQuestion() }
    }

    @Test
    fun `retries when the server returns a question that was already seen`() = runTest {
        val repository = mockk<QuizRepository>()
        coEvery { repository.fetchQuestion() } returnsMany listOf(
            Result.success(question("1")),
            Result.success(question("2")),
        )
        val useCase = GetUniqueQuestionUseCase(repository)

        val result = useCase(seenQuestionIds = setOf("1"))

        assertEquals("2", result.getOrThrow().id)
    }

    @Test
    fun `falls back to a repeated question after exhausting all retry attempts`() = runTest {
        val repository = mockk<QuizRepository>()
        coEvery { repository.fetchQuestion() } returns Result.success(question("1"))
        val useCase = GetUniqueQuestionUseCase(repository)

        val result = useCase(seenQuestionIds = setOf("1"))

        // Every attempt returned the already-seen id "1": the use case gives up after 5 tries
        // instead of looping forever, and returns that last (repeated) result to the caller.
        assertEquals("1", result.getOrThrow().id)
        coVerify(exactly = 5) { repository.fetchQuestion() }
    }

    @Test
    fun `returns a failure immediately without retrying`() = runTest {
        val repository = mockk<QuizRepository>()
        coEvery { repository.fetchQuestion() } returns Result.failure(AppError.Network)
        val useCase = GetUniqueQuestionUseCase(repository)

        val result = useCase(seenQuestionIds = emptySet())

        assertTrue(result.isFailure)
        coVerify(exactly = 1) { repository.fetchQuestion() }
    }
}
