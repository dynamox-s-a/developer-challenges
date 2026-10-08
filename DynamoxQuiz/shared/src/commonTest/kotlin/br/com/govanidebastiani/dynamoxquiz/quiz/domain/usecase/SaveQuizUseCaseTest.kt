package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.quiz.data.FakeQuizRepositoryImpl
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class SaveQuizUseCaseTest {
    private lateinit var fakeQuizRepositoryImpl: FakeQuizRepositoryImpl
    private lateinit var saveQuizUseCase: SaveQuizUseCase

    @BeforeTest
    fun setup() {
        fakeQuizRepositoryImpl = FakeQuizRepositoryImpl()
        saveQuizUseCase = SaveQuizUseCase(fakeQuizRepositoryImpl)
    }

    @Test
    fun  `deve retornar o id do quiz apos salvar`() = runTest {
        val firstQuizId = saveQuizUseCase.invoke(
            playerNickname = "Geovani",
            amountCorrectAnswers = 10
        )

        val secondQuizId = saveQuizUseCase.invoke(
            playerNickname = "Pedro",
            amountCorrectAnswers = 8
        )

        assertEquals(1, firstQuizId)
        assertEquals(2, secondQuizId)

        assertEquals(2, fakeQuizRepositoryImpl.savedQuizzes.size)
        assertEquals("Geovani", fakeQuizRepositoryImpl.savedQuizzes.first().playerNickname)
        assertEquals("Pedro", fakeQuizRepositoryImpl.savedQuizzes.last().playerNickname)
    }
 }