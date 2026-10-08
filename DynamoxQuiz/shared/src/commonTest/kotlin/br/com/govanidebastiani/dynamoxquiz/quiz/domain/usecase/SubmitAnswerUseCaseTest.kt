package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.quiz.data.FakeQuizRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerResponseDto
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class SubmitAnswerUseCaseTest {
    private lateinit var fakeQuizRepositoryImpl: FakeQuizRepositoryImpl
    private lateinit var submitAnswerUseCase: SubmitAnswerUseCase

    @BeforeTest
    fun setup() {
        fakeQuizRepositoryImpl = FakeQuizRepositoryImpl()
        submitAnswerUseCase = SubmitAnswerUseCase(fakeQuizRepositoryImpl)
    }

    @Test
    fun `quando o a requisao der certo, deve retornar Result Success com o objeto`() = runTest {
        val questionId = "21"
        val option = "Kotlin"
        val expectedResponse = QuestionAnswerResponseDto(isCorrect = true)
        fakeQuizRepositoryImpl.submitAnswerResult = Result.Success(expectedResponse)

        val result = submitAnswerUseCase(questionId = questionId, option = option)

        assertTrue(result is Result.Success)
        assertEquals(expectedResponse, result.data)
    }

    @Test
    fun `quando ocorrer erro deve retornar Result Error com a mensagem`() = runTest {
        val questionId = "21"
        val option = "Java"
        fakeQuizRepositoryImpl.submitAnswerResult = Result.Error(DataError.Remote.NO_INTERNET)

        val result = submitAnswerUseCase(questionId = questionId, option = option)

        assertTrue(result is Result.Error)
        assertEquals(DataError.Remote.NO_INTERNET, result.error)
    }
}