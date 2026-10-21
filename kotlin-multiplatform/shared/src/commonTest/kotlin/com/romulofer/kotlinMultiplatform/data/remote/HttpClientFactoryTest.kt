package com.romulofer.kotlinMultiplatform.data.remote

import assertk.assertFailure
import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isInstanceOf
import com.romulofer.kotlinMultiplatform.data.remote.dto.QuestionDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.request.get
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

class HttpClientFactoryTest{
    private val questionJson = """{"id":"44","statement":"Q","options":["A","B"]}"""
    private val expectedQuestion =
        QuestionDto(id = "44", statement = "Q", options = listOf("A", "B"))

    private fun clientResponding(
        content: String,
        status: HttpStatusCode = HttpStatusCode.OK,
        contentType: String = "application/json"
    ): HttpClient = createHttpClient(
        engine = MockEngine {
            respond(
                content = content,
                status = status,
                headers = headersOf(HttpHeaders.ContentType, contentType)
            )
        },
        baseUrl = "https://example.test"
    )

    @Test
    fun `parses json served as application json`() = runTest{
        val client = clientResponding(questionJson, contentType = "application/json")

        val dto: QuestionDto = client.get("/question").body()

        assertThat(dto).isEqualTo(expectedQuestion)
    }


    @Test
    fun `parses json served as text html`() = runTest {
        val client = clientResponding(questionJson, contentType = "text/html;charset=utf-8")

        val dto: QuestionDto = client.get("/question").body()

        assertThat(dto).isEqualTo(expectedQuestion)
    }

    @Test
    fun `parses json served as text application json`() = runTest {
        val client = clientResponding(questionJson, contentType = "text/application-json")

        val dto: QuestionDto = client.get("/question").body()

        assertThat(dto).isEqualTo(expectedQuestion)
    }

    @Test
    fun `throws on client error response`() = runTest {
        val client = clientResponding(
            content = "400 BAD REQUEST: Question not found.",
            status = HttpStatusCode.BadRequest,
            contentType = "text/html;charset=utf-8",
        )

        assertFailure { client.get("/question") }
            .isInstanceOf<ClientRequestException>()
    }

    @Test
    fun `resolves requests against base url`() = runTest {
        var requestedUrl: String? = null
        val client = createHttpClient(
            engine = MockEngine { request ->
                requestedUrl = request.url.toString()
                respond(questionJson, headers = headersOf(HttpHeaders.ContentType, "application/json"))
            },
            baseUrl = "https://example.test",
        )

        client.get("/question")

        assertThat(requestedUrl).isEqualTo("https://example.test/question")
    }
}