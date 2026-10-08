package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.quiz.data.FakeQuizRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class FetchAllQuizzesUseCaseTest {
    private lateinit var fakeQuizRepositoryImpl: FakeQuizRepositoryImpl
    private lateinit var fetchAllQuizzesUseCase: FetchAllQuizzesUseCase

    @BeforeTest
    fun setup() {
        fakeQuizRepositoryImpl = FakeQuizRepositoryImpl()
        fetchAllQuizzesUseCase = FetchAllQuizzesUseCase(fakeQuizRepositoryImpl)
    }

    @Test
    fun `deve retornar todos os quizzes criados`() = runTest {
        val quiz1 = Quiz(
            playerNickname = "Geovani",
            createdAt = 1000L,
            amountCorrectAnswers = 8,
            amountQuestions = 10
        )

        val quiz2 = Quiz(
            playerNickname = "Pedro",
            createdAt = 1000L,
            amountCorrectAnswers = 5,
            amountQuestions = 10
        )

        fakeQuizRepositoryImpl.createQuiz(quiz1)
        fakeQuizRepositoryImpl.createQuiz(quiz2)

        val result = fetchAllQuizzesUseCase.invoke()

        assertEquals(2, result.size)
        assertEquals(quiz1.playerNickname, result.first().playerNickname)
        assertEquals(quiz2.playerNickname, result.last().playerNickname)
    }

    @Test
    fun `deve retornar uma lista vazia caso ainda nao exitam quizzes`() = runTest {
        val result = fetchAllQuizzesUseCase.invoke()
        assertTrue(result.isEmpty())
    }
}