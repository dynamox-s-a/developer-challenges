package com.dynamox.quiz.data.api

import co.touchlab.kermit.Logger
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpRequestRetry
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.http.ContentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

private const val CONNECT_TIMEOUT_MS = 8_000L
private const val REQUEST_TIMEOUT_MS = 15_000L
private const val SOCKET_TIMEOUT_MS = 15_000L

fun createHttpClient(): HttpClient = HttpClient {

    // Configuração compartilhada de JSON usada em múltiplos content types
    val jsonConfig = Json {
        // Ignora campos desconhecidos no JSON (tolerante a mudanças na API)
        ignoreUnknownKeys = true
        // Aceita JSON malformado com aspas simples, valores sem aspas, etc.
        isLenient = true
        // Desativa formatação bonita para reduzir tamanho do payload
        prettyPrint = false
    }

    /**
     * Plugin ContentNegotiation: responsável por serializar objetos Kotlin
     * para JSON nas requisições e desserializar JSON para objetos Kotlin
     * nas respostas.
     *
     * Registramos múltiplos content types porque testando localmente a API retornou diferentes
     * valores no header Content-Type dependendo do endpoint:
     * - GET /question > "text/application-json"  (não-padrão)
     * - POST /answer > "text/html;charset=utf-8" (também não-padrão)
     * - ContentType.Any > curinga para cobrir qualquer outro caso futuro
     */
    install(ContentNegotiation) {
        json(jsonConfig)
        json(jsonConfig, contentType = ContentType("text", "application-json"))
        json(jsonConfig, contentType = ContentType.Text.Plain)
        json(jsonConfig, contentType = ContentType.Text.Html)
        json(jsonConfig, contentType = ContentType.Any)
    }

    install(HttpTimeout) {
        connectTimeoutMillis = CONNECT_TIMEOUT_MS
        requestTimeoutMillis = REQUEST_TIMEOUT_MS
        socketTimeoutMillis = SOCKET_TIMEOUT_MS
    }

    install(HttpRequestRetry) {
        retryOnServerErrors(maxRetries = 2)
        retryOnException(maxRetries = 2, retryOnTimeout = true)
        exponentialDelay(base = 1.5, maxDelayMs = 5_000L)
    }

    install(Logging) {
        level = LogLevel.INFO
        logger = object : io.ktor.client.plugins.logging.Logger {
            override fun log(message: String) {
                Logger.d("HttpClient") { message }
            }
        }
    }
}
