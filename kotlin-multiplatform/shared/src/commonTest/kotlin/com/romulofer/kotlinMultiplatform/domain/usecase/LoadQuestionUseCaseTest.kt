package com.romulofer.kotlinMultiplatform.domain.usecase

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.AppError.NoConnection
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Failure
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Success
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository
import com.romulofer.kotlinMultiplatform.domain.usecase.LoadQuestionUseCase.Companion.MAX_ATTEMPTS
import dev.mokkery.answering.returns
import dev.mokkery.answering.sequentiallyReturns
import dev.mokkery.everySuspend
import dev.mokkery.mock
import dev.mokkery.verify.VerifyMode.Companion.exactly
import dev.mokkery.verifySuspend
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

class LoadQuestionUseCaseTest {

    private val quiz = mock<QuizRepository>()
    private val loadQuestion = LoadQuestionUseCase(quiz)

    private fun question(id: String) = Question(id = id, statement = "Q$id", options = listOf("A", "B"))

    @Test
    fun `returns the first question when it is new`() = runTest {
        everySuspend { quiz.getQuestion() } returns Success(question("1"))

        val result = loadQuestion(seenIds = setOf("2"))

        assertThat(result).isEqualTo(Success(question("1")))
        verifySuspend(exactly(1)) { quiz.getQuestion() }
    }

    @Test
    fun `asks again when the question was already seen`() = runTest {
        everySuspend { quiz.getQuestion() } sequentiallyReturns listOf(
            Success(question("1")),
            Success(question("2")),
        )

        val result = loadQuestion(seenIds = setOf("1"))

        assertThat(result).isEqualTo(Success(question("2")))
        verifySuspend(exactly(2)) { quiz.getQuestion() }
    }

    @Test
    fun `gives up after the maximum number of attempts`() = runTest {
        everySuspend { quiz.getQuestion() } returns Success(question("1"))

        val result = loadQuestion(seenIds = setOf("1"))

        assertThat(result).isEqualTo(Success(question("1")))
        verifySuspend(exactly(MAX_ATTEMPTS)) { quiz.getQuestion() }
    }

    @Test
    fun `returns the failure without retrying`() = runTest {
        everySuspend { quiz.getQuestion() } returns Failure(NoConnection)

        val result = loadQuestion(seenIds = setOf("1"))

        assertThat(result).isEqualTo(Failure(NoConnection))
        verifySuspend(exactly(1)) { quiz.getQuestion() }
    }
}
