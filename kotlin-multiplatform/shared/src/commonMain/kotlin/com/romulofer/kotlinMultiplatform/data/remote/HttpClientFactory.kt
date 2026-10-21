package com.romulofer.kotlinMultiplatform.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.ContentType
import io.ktor.serialization.kotlinx.json.json

private const val CONNECT_TIMEOUT_MILLIS = 10_000L
private const val REQUEST_TIMEOUT_MILLIS = 30_000L

private val TextApplicationJson = ContentType("text", "application-json")

internal fun createHttpClient(engine: HttpClientEngine, baseUrl: String): HttpClient =
    HttpClient(engine) {
        expectSuccess = true

        install(ContentNegotiation){
            json(apiJson)
            json(apiJson, contentType = ContentType.Text.Html)
            json(apiJson, contentType = TextApplicationJson)
        }

        install(HttpTimeout) {
            connectTimeoutMillis = CONNECT_TIMEOUT_MILLIS
            requestTimeoutMillis = REQUEST_TIMEOUT_MILLIS
        }

        defaultRequest {
            url(baseUrl)
        }
    }