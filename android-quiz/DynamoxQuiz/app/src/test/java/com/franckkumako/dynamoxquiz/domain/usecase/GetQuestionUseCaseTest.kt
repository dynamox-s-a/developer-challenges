package com.franckkumako.dynamoxquiz.domain.usecase

import com.franckkumako.dynamoxquiz.domain.model.Question
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Test

private class FakeQuizRepository : QuizRepository {
    override suspend fun getQuestion(): Question {
        return Question(
            id = "1",
            statement = "Fake question?",
            options = listOf("A", "B", "C", "D")
        )
    }

    override suspend fun submitAnswer(questionId: String, answer: String) =
        error("Not needed")

    override suspend fun saveScore(playerName: String, score: Int) { }

    override fun observeScores() = error("Not needed")
}

class GetQuestionUseCaseTest {

    @Test
    fun `should return question from repository`() = runBlocking {
        val repository = FakeQuizRepository()
        val useCase = GetQuestionUseCase(repository)

        val result = useCase()

        assertEquals("1", result.id)
        assertEquals("Fake question?", result.statement)
        assertEquals(4, result.options.size)
    }
}
