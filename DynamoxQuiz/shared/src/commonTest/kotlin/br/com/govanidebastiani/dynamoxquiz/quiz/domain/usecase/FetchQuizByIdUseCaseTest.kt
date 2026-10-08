package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.quiz.data.FakeQuizRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.quizMock
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchQuizByIdUseCase
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class FetchQuizByIdUseCaseTest {
    private lateinit var fakeQuizRepositoryImpl: FakeQuizRepositoryImpl
    private lateinit var fetchQuizByIdUseCase: FetchQuizByIdUseCase

    @BeforeTest
    fun setup() {
        fakeQuizRepositoryImpl = FakeQuizRepositoryImpl()
        fetchQuizByIdUseCase = FetchQuizByIdUseCase(fakeQuizRepositoryImpl)
    }

    @Test
    fun `deve retornar o objeto do quiz ao passar um id valido`() = runTest {
        val quizId = fakeQuizRepositoryImpl.createQuiz(
            quiz = quizMock
        )

        val quiz = fetchQuizByIdUseCase.invoke(quizId)

        assertNotNull(quiz)
        assertEquals(quizId, quiz.id)
    }
}