package com.romulofer.kotlinMultiplatform.ui

import app.cash.sqldelight.db.SqlDriver
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.MockRequestHandleScope
import io.ktor.client.engine.mock.respond
import io.ktor.client.request.HttpResponseData
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import org.koin.core.module.Module
import org.koin.dsl.module

internal class FakeQuizServer {

    var questionsServed = 0
    var failingQuestions = 0
    var failingAnswers = 0

    val engine = MockEngine { request ->
        when (request.url.encodedPath) {
            "/question" -> question()
            "/answer" -> answer(request.url.parameters["questionId"]!!.toInt())
            else -> respond("", HttpStatusCode.NotFound)
        }
    }

    fun platformModule(driver: () -> SqlDriver): Module = module {
        single<HttpClientEngine> { engine }
        single<SqlDriver> { driver() }
    }

    private fun MockRequestHandleScope.json(
        content: String,
        status: HttpStatusCode = HttpStatusCode.OK,
    ): HttpResponseData = respond(
        content = content,
        status = status,
        headers = headersOf(HttpHeaders.ContentType, "application/json"),
    )

    private fun MockRequestHandleScope.question(): HttpResponseData {
        if (failingQuestions > 0) {
            failingQuestions--
            return json("boom", HttpStatusCode.InternalServerError)
        }
        val id = ++questionsServed
        return json("""{"id":"$id","statement":"Statement $id","options":["Option A","Option B","Option C"]}""")
    }

    private fun MockRequestHandleScope.answer(questionId: Int): HttpResponseData {
        if (failingAnswers > 0) {
            failingAnswers--
            return json("boom", HttpStatusCode.InternalServerError)
        }
        return json("""{"result":${questionId % 2 == 1}}""")
    }
}
