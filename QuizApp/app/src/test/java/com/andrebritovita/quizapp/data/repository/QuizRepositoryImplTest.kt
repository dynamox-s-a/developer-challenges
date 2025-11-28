package com.andrebritovita.quizapp.data.repository

import com.andrebritovita.quizapp.data.local.LocalDataSource
import com.andrebritovita.quizapp.data.remote.RemoteDataSource
import com.andrebritovita.quizapp.data.remote.dto.AnswerResponse
import com.andrebritovita.quizapp.data.remote.dto.QuestionDto
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class QuizRepositoryImplTest {
    private val remote = mockk<RemoteDataSource>()
    private val local = mockk<LocalDataSource>(relaxed = true) // relaxed=true para métodos void (save)
    private lateinit var repository: QuizRepositoryImpl

    @Before
    fun setup() {
        repository = QuizRepositoryImpl(remote, local)
    }

    @Test
    fun `getQuestion deve mapear DTO para Domain corretamente quando API retorna sucesso`() = runTest {
        val dto = QuestionDto(
            id = "100",
            statement = "Pergunta Teste",
            options = listOf("A", "B")
        )

        coEvery { remote.getQuestion() } returns dto
        val result = repository.getQuestion()
        assertTrue(result.isSuccess)

        val question = result.getOrNull()!!
        assertEquals("100", question.id)
        assertEquals("Pergunta Teste", question.statement)
        assertEquals(2, question.options.size)
    }

    @Test
    fun `getQuestion deve capturar erro e retornar Result failure quando API falha`() = runTest {
        val erroApi = RuntimeException("Erro de Rede")
        coEvery { remote.getQuestion() } throws erroApi

        val result = repository.getQuestion()

        assertTrue(result.isFailure)
        assertEquals(erroApi, result.exceptionOrNull())
    }

    @Test
    fun `submitAnswer deve retornar booleano puro extraido da resposta da API`() = runTest {
        val response = AnswerResponse(result = true)
        coEvery { remote.submitAnswer("1", "Resposta") } returns response

        val result = repository.submitAnswer("1", "Resposta")

        assertTrue(result.isSuccess)
        assertEquals(true, result.getOrNull())
    }

    @Test
    fun `saveScore deve chamar insertScore no localDataSource`() = runTest {
        repository.saveScore("Andre", 10)
        coVerify(exactly = 1) { local.insertScore(any()) }
    }
}