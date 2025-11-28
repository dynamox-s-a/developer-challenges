package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.domain.repository.QuizRepository
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Test

class SaveScoreUseCaseTest {
    private val repository = mockk<QuizRepository>(relaxed = true)
    private val useCase = SaveScoreUseCase(repository)

    @Test
    fun `invoke deve chamar repository saveScore com parametros corretos`() = runTest {
        useCase("Andre", 10)
        coVerify(exactly = 1) { repository.saveScore("Andre", 10) }
    }
}