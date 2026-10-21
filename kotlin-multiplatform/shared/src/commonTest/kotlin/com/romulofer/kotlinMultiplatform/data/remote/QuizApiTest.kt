package com.romulofer.kotlinMultiplatform.data.remote

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.data.remote.dto.AnswerResponseDto
import com.romulofer.kotlinMultiplatform.data.remote.dto.QuestionDto
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.request.HttpRequestData
import io.ktor.content.TextContent
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

class QuizApiTest {

    private fun apiResponding(
        content: String,
        onRequest: (HttpRequestData) -> Unit = {}
    ): QuizApi = QuizApi(
        createHttpClient(
            engine = MockEngine { request ->
                onRequest(request)
                respond(
                    content = content,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            },
            baseUrl = "https://example.test"
        )
    )

    @Test
    fun `getQuestion sends GET to question and parses the body`() = runTest {
        var captured: HttpRequestData? = null
        val api = apiResponding("""{"id":"44","statement":"Q","options":["A","B"]}""") { captured = it }

        val dto = api.getQuestion()

        assertThat(dto).isEqualTo(QuestionDto(id = "44", statement = "Q", options = listOf("A", "B")))
        assertThat(captured?.method).isEqualTo(HttpMethod.Get)
        assertThat(captured?.url?.encodedPath).isEqualTo("/question")
    }

    @Test
    fun `submitAnswer sends POST with question id and json body`() = runTest {
        var captured: HttpRequestData? = null
        val api = apiResponding("""{"result":true}""") { captured = it }

        val dto = api.submitAnswer(questionId = "44", answer = "Dynamox")

        assertThat(dto).isEqualTo(AnswerResponseDto(result = true))
        assertThat(captured?.method).isEqualTo(HttpMethod.Post)
        assertThat(captured?.url?.encodedPath).isEqualTo("/answer")
        assertThat(captured?.url?.parameters?.get("questionId")).isEqualTo("44")
        assertThat((captured?.body as TextContent).text).isEqualTo("""{"answer":"Dynamox"}""")
    }

    @Test
    fun `submitAnswer parses a wrong answer result`() = runTest {
        val api = apiResponding("""{"result":false}""")

        val dto = api.submitAnswer(questionId = "44", answer = "Google")

        assertThat(dto).isEqualTo(AnswerResponseDto(result = false))
    }
}
