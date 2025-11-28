package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.domain.repository.QuizRepository
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SubmitAnswerUseCaseTest {
    private val repository = mockk<QuizRepository>()
    private val useCase = SubmitAnswerUseCase(repository)

    @Test
    fun `invoke deve retornar sucesso com true quando repositorio validar a resposta`() = runTest {
        coEvery { repository.submitAnswer("1", "Paris") } returns Result.success(true)

        val result = useCase("1", "Paris")
        assertTrue(result.isSuccess)
        assertEquals(true, result.getOrNull())
    }

    @Test
    fun `invoke deve repassar erro quando repositorio falhar`() = runTest {
        val error = Exception("Erro de conexão")
        coEvery { repository.submitAnswer("1", "Paris") } returns Result.failure(error)

        val result = useCase("1", "Paris")

        assertTrue(result.isFailure)
        assertEquals(error, result.exceptionOrNull())
    }
}