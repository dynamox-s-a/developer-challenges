package com.dynamox.quiz.api.utils

import com.dynamox.quiz.api.models.ApiError
import com.dynamox.quiz.api.models.ApiResult
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.compression.ContentEncoding
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLBuilder
import io.ktor.http.Url
import io.ktor.http.appendPathSegments
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

operator fun Url.div(s: String): Url = URLBuilder(this).appendPathSegments(s).build()

internal fun configureKtorClient(client: HttpClient): HttpClient = client.config {
    install(HttpTimeout) {
        requestTimeoutMillis = 30_000
        connectTimeoutMillis = 30_000
        socketTimeoutMillis = 30_000
    }
    install(ContentNegotiation) {
        val jsonConfig = Json {
            prettyPrint = true
            encodeDefaults = true
            explicitNulls = true
            ignoreUnknownKeys = true
        }
        json(jsonConfig, ContentType.Application.Json)
        json(jsonConfig, ContentType.Text.Html)
        json(jsonConfig, ContentType("text", "application-json"))
    }
    install(Logging) {
        logger = object : Logger {
            override fun log(message: String) {
                println("QuizApi: $message")
            }
        }
        level = LogLevel.ALL
    }
    ContentEncoding()
}

internal suspend inline fun <reified Success> callApiParseResponse(
    call: suspend () -> HttpResponse,
): ApiResult<Success> {
    try {
        val response = call()

        return if (response.status.isSuccess()) {
            ApiResult(success = response.body<Success>())
        } else {
            val error = when (response.status) {
                HttpStatusCode.Forbidden -> ApiError.Forbidden
                HttpStatusCode.NotFound -> ApiError.NotFound
                HttpStatusCode.Unauthorized -> ApiError.Unauthorized
                else -> ApiError.OtherError(response.bodyAsText())
            }
            ApiResult(error = error)
        }
    } catch (ex: Exception) {
        return if (ex.isCausedByNetworkError()) {
            ApiResult(error = ApiError.NetworkError)
        } else {
            println("API call or parsing failed. Exception: ${ex::class.simpleName}, Message: ${ex.message}")
            ex.printStackTrace()
            ApiResult(error = ApiError.ParseError)
        }
    }
}