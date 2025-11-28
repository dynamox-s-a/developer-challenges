package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.domain.model.Question
import com.andrebritovita.quizapp.domain.repository.QuizRepository
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
class GetNewQuestionUseCaseTest {
    private val repository = mockk<QuizRepository>()
    private lateinit var useCase: GetNewQuestionUseCase

    @Before
    fun setup() {
        useCase = GetNewQuestionUseCase(repository)
    }

    @Test
    fun `invoke deve ignorar IDs duplicados e retornar nova pergunta`() = runTest {
        val q1 = Question(id = "1", statement = "Pergunta 1", options = emptyList())
        val q2 = Question(id = "2", statement = "Pergunta 2", options = emptyList())

        coEvery { repository.getQuestion() } returnsMany listOf(
            Result.success(q1),
            Result.success(q1),
            Result.success(q2)
        )
        val resultado1 = useCase()
        val resultado2 = useCase()

        assertTrue(resultado1.isSuccess)
        assertEquals("1", resultado1.getOrNull()?.id)

        assertTrue(resultado2.isSuccess)
        assertEquals("2", resultado2.getOrNull()?.id)
    }

    @Test
    fun `invoke deve retornar erro se esgotar tentativas`() = runTest {
        val q1 = Question(id = "1", statement = "Pergunta 1", options = emptyList())
        coEvery { repository.getQuestion() } returns Result.success(q1)

        useCase()
        val resultado = useCase()

        assertTrue(resultado.isFailure)
    }

}