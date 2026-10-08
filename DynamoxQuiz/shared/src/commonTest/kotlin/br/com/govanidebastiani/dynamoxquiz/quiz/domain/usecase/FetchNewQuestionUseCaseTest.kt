package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.quiz.data.FakeQuizRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class FetchNewQuestionUseCaseTest {
    private lateinit var fakeQuizRepositoryImpl: FakeQuizRepositoryImpl
    private lateinit var  fetchNewQuestionUseCase: FetchNewQuestionUseCase

    @BeforeTest
    fun setup() {
        fakeQuizRepositoryImpl = FakeQuizRepositoryImpl()
        fetchNewQuestionUseCase = FetchNewQuestionUseCase(fakeQuizRepositoryImpl)
    }

    @Test
    fun `quando a primeira pergunta estiver na lista de ignoradas deve buscar a proxima nao repetida`() = runTest {
        val repeatedQuestion = Question(id = "1", statement = "Pergunta 1", options = emptyList())
        val newQuestion = Question(id = "2", statement = "Pergunta 2", options = emptyList())

        fakeQuizRepositoryImpl.answeredQuestions.add(repeatedQuestion)
        fakeQuizRepositoryImpl.answeredQuestions.add(newQuestion)

        val ignoreIds = listOf("1")

        val result = fetchNewQuestionUseCase(ignoreIds = ignoreIds)

        assertTrue(result is Result.Success)
        assertEquals("2", result.data.id)
    }
}