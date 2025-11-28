package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import com.andrebritovita.quizapp.domain.repository.QuizRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Test

class ObserveScoresUseCaseTest {
    private val repository = mockk<QuizRepository>()
    private val useCase = ObserveScoresUseCase(repository)

    @Test
    fun `invoke deve retornar fluxo de dados do repositorio`() = runTest {
        val listaMock = listOf(ScoreEntity(name = "Teste", score = 10, gameDate = 123L))
        every { repository.observeScores() } returns flowOf(listaMock)
        val result = useCase()

        val listaColetada = result.toList()
        assertEquals(listaMock, listaColetada.first())
        verify(exactly = 1) { repository.observeScores() }
    }
}