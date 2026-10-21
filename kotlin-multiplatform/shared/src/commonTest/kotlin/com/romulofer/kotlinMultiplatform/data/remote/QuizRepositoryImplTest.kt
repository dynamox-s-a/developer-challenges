package com.romulofer.kotlinMultiplatform.data.remote

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.AppError
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Failure
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Success
import com.romulofer.kotlinMultiplatform.domain.model.Question
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.MockRequestHandleScope
import io.ktor.client.engine.mock.respond
import io.ktor.client.request.HttpRequestData
import io.ktor.client.request.HttpResponseData
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlinx.io.IOException
import kotlin.test.Test

class QuizRepositoryImplTest {

    private fun repositoryWith(
        handler: suspend MockRequestHandleScope.(HttpRequestData) -> HttpResponseData,
    ): QuizRepositoryImpl = QuizRepositoryImpl(
        QuizApi(createHttpClient(MockEngine(handler), baseUrl = "https://example.test")),
    )

    private fun MockRequestHandleScope.json(
        content: String,
        status: HttpStatusCode = HttpStatusCode.OK,
    ): HttpResponseData = respond(
        content = content,
        status = status,
        headers = headersOf(HttpHeaders.ContentType, "application/json"),
    )

    @Test
    fun `getQuestion maps dto to domain on success`() = runTest {
        val repository =
            repositoryWith { json("""{"id":"44","statement":"Q","options":["A","B"]}""") }

        val result = repository.getQuestion()

        assertThat(result).isEqualTo(
            Success(Question(id = "44", statement = "Q", options = listOf("A", "B"))),
        )
    }

    @Test
    fun `submitAnswer returns true for correct answer`() = runTest {
        val repository = repositoryWith { json("""{"result":true}""") }

        assertThat(repository.submitAnswer("44", "A")).isEqualTo(Success(true))
    }

    @Test
    fun `submitAnswer returns false for wrong answer`() = runTest {
        val repository = repositoryWith { json("""{"result":false}""") }

        assertThat(repository.submitAnswer("44", "B")).isEqualTo(Success(false))
    }

    @Test
    fun `maps 4xx to server error with code`() = runTest {
        val repository = repositoryWith { json("Question not found.", HttpStatusCode.BadRequest) }

        assertThat(repository.getQuestion()).isEqualTo(Failure(AppError.Server(400)))
    }

    @Test
    fun `maps 5xx to server error with code`() = runTest {
        val repository = repositoryWith { json("boom", HttpStatusCode.InternalServerError) }

        assertThat(repository.submitAnswer("44", "A"))
            .isEqualTo(Failure(AppError.Server(500)))
    }

    @Test
    fun `maps io failure to no connection`() = runTest {
        val repository = repositoryWith { throw IOException("offline") }

        assertThat(repository.getQuestion()).isEqualTo(Failure(AppError.NoConnection))
    }

    @Test
    fun `maps malformed body to unknown`() = runTest {
        val repository = repositoryWith { json("not json at all") }

        assertThat(repository.getQuestion()).isEqualTo(Failure(AppError.Unknown))
    }

    @Test
    fun `maps unexpected exception to unknown`() = runTest {
        val repository = repositoryWith { throw IllegalStateException("bug") }

        assertThat(repository.getQuestion()).isEqualTo(Failure(AppError.Unknown))
    }

}