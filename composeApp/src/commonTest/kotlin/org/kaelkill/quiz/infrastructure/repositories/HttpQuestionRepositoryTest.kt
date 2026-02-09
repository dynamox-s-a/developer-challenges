package org.kaelkill.quiz.infrastructure.repositories

import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class HttpQuestionRepositoryTest {

    private fun createMockClient(
        questionResponse: String = DEFAULT_QUESTION_RESPONSE,
        answerResponse: String = DEFAULT_ANSWER_RESPONSE
    ): HttpClient {
        return HttpClient(MockEngine { request ->
            when {
                request.url.encodedPath == "/question" && request.method == HttpMethod.Get -> {
                    respond(
                        content = questionResponse,
                        status = HttpStatusCode.OK,
                        headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    )
                }
                request.url.encodedPath.startsWith("/answer") && request.method == HttpMethod.Post -> {
                    respond(
                        content = answerResponse,
                        status = HttpStatusCode.OK,
                        headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    )
                }
                else -> respond("Not found", HttpStatusCode.NotFound)
            }
        }) {
            install(ContentNegotiation) { json() }
        }
    }


    @Test
    fun `should fetch a random question`() = runTest {
        val repo = HttpQuestionRepository(createMockClient())

        val result = repo.getRandomQuestion()

        assertTrue(result.isSuccess)
        val question = result.getOrThrow()
        assertEquals("22", question.id.value)
        assertEquals("What is the name of the coolest company in the world?", question.statement.value)
        assertEquals(5, question.options.size)
    }

    @Test
    fun `should fail when api returns error for question`() = runTest {
        val client = HttpClient(MockEngine {
            respond("Server error", HttpStatusCode.InternalServerError)
        }) {
            install(ContentNegotiation) { json() }
        }
        val repo = HttpQuestionRepository(client)

        val result = repo.getRandomQuestion()

        assertTrue(result.isFailure)
    }

    @Test
    fun `should return true for correct answer`() = runTest {
        val repo = HttpQuestionRepository(createMockClient(answerResponse = """{"result": true}"""))

        val result = repo.checkAnswer("22", "Dynamox")

        assertTrue(result.isSuccess)
        assertTrue(result.getOrThrow())
    }

    @Test
    fun `should return false for wrong answer`() = runTest {
        val repo = HttpQuestionRepository(createMockClient(answerResponse = """{"result": false}"""))

        val result = repo.checkAnswer("22", "Google")

        assertTrue(result.isSuccess)
        assertEquals(false, result.getOrThrow())
    }

    @Test
    fun `should fail when api returns error for answer`() = runTest {
        val client = HttpClient(MockEngine {
            respond("Server error", HttpStatusCode.InternalServerError)
        }) {
            install(ContentNegotiation) { json() }
        }
        val repo = HttpQuestionRepository(client)

        val result = repo.checkAnswer("22", "Dynamox")

        assertTrue(result.isFailure)
    }

    companion object {
        private val DEFAULT_QUESTION_RESPONSE = """
            {
                "id": "22",
                "statement": "What is the name of the coolest company in the world?",
                "options": ["Google", "Microsoft", "Dynamox", "Spotify", "Amazon"]
            }
        """.trimIndent()

        private val DEFAULT_ANSWER_RESPONSE = """{"result": true}"""
    }
}