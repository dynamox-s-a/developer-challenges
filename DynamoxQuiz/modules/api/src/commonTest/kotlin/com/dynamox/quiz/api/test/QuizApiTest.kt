package com.dynamox.quiz.api.test

import com.dynamox.quiz.api.QuizApi
import com.dynamox.quiz.api.koin.apiKoinModule
import io.ktor.http.Url
import kotlinx.coroutines.test.runTest
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.test.KoinTest
import org.koin.test.inject
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Ignore
import kotlin.test.Test
import kotlin.test.assertTrue

/**
 * These tests require the API to be running and accessible at the specified URL.
 * They are ignored by default to avoid failures in environments where the API is not available.
 * Remove the @Ignore annotation to run these tests.
 */
@Ignore
class QuizApiTest : KoinTest {

    private val quizApi: QuizApi by inject()

    @BeforeTest
    fun setup() {
        startKoin {
            modules(apiKoinModule(apiUrl = Url("https://quiz-api-bwi5hjqyaq-uc.a.run.app")))
        }
    }

    @AfterTest
    fun tearDown() {
        stopKoin()
    }

    @Test
    fun `request a random question to api should succeed`() = runTest {
        val result = quizApi.getRandomQuestion()
        println("Result: $result")
        assertTrue(result.isSuccess)
    }

    @Test
    fun `submit an correct answer to api should succeed with true as result`() = runTest {
        val result = quizApi.submitAnswer(
            questionId = "11",
            answer = "Lenda",
        )
        println("Result: $result")
        assertTrue(result.isSuccess)
        val quizResult = result.getOrThrow()
        assertTrue(quizResult.result)
    }

    @Test
    fun `submit an incorrect answer to api should succeed with false as result`() = runTest {
        val result = quizApi.submitAnswer(
            questionId = "11",
            answer = "Legenda",
        )
        println("Result: $result")
        assertTrue(result.isSuccess)
        val quizResult = result.getOrThrow()
        assertTrue(!quizResult.result)
    }
}