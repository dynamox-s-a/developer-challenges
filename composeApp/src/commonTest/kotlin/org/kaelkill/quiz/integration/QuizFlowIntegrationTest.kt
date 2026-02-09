package org.kaelkill.quiz.integration

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
import org.kaelkill.quiz.application.usecases.AnswerQuestionUseCase
import org.kaelkill.quiz.application.usecases.FillSessionUseCase
import org.kaelkill.quiz.application.usecases.RegisterOrLoginPlayerUseCase
import org.kaelkill.quiz.application.usecases.StartNewQuizSessionUseCase
import org.kaelkill.quiz.infrastructure.repositories.InMemoryPlayerRepository
import org.kaelkill.quiz.infrastructure.repositories.InMemoryQuizSessionRepository
import org.kaelkill.quiz.infrastructure.repositories.HttpQuestionRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class QuizFlowIntegrationTest {

    private var questionCounter = 0

    private fun createMockHttpClient(): HttpClient {
        questionCounter = 0
        return HttpClient(MockEngine { request ->
            when {
                request.url.encodedPath == "/question" && request.method == HttpMethod.Get -> {
                    questionCounter++
                    respond(
                        content = """
                            {
                                "id": "$questionCounter",
                                "statement": "Question $questionCounter?",
                                "options": ["A", "B", "C", "D", "E"]
                            }
                        """.trimIndent(),
                        status = HttpStatusCode.OK,
                        headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    )
                }
                request.url.encodedPath.startsWith("/answer") && request.method == HttpMethod.Post -> {
                    respond(
                        content = """{"result": true}""",
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

    private fun createDependencies(): TestDependencies {
        val playerRepository = InMemoryPlayerRepository()
        val sessionRepository = InMemoryQuizSessionRepository()
        val questionRepository = HttpQuestionRepository(createMockHttpClient())

        val registerOrLogin = RegisterOrLoginPlayerUseCase(playerRepository)
        val fillSession = FillSessionUseCase(sessionRepository, questionRepository)
        val startSession = StartNewQuizSessionUseCase(sessionRepository, registerOrLogin, fillSession)
        val answerQuestion = AnswerQuestionUseCase(sessionRepository, questionRepository)

        return TestDependencies(startSession, answerQuestion)
    }

    private data class TestDependencies(
        val startSession: StartNewQuizSessionUseCase,
        val answerQuestion: AnswerQuestionUseCase
    )

    // ==================== Fluxo completo ====================

    @Test
    fun `should complete full quiz flow - login, start, answer all, get score`() = runTest {
        val deps = createDependencies()

        // 1. Login + criar sessão + preencher com 10 perguntas
        val startResult = deps.startSession.execute("John")
        assertTrue(startResult.isSuccess)

        val session = startResult.getOrThrow()
        assertEquals(10, session.questions.size)
        assertEquals(0, session.answers.size)
        assertEquals(0, session.score.value)

        // 2. Responder todas as 10 perguntas
        var currentSession = session
        for (question in session.questions) {
            val answerResult = deps.answerQuestion.execute(
                currentSession.id.value,
                question.id.value,
                question.options.first().value
            )
            assertTrue(answerResult.isSuccess)
            currentSession = answerResult.getOrThrow()
        }

        // 3. Verificar resultado final
        assertEquals(10, currentSession.answers.size)
        assertTrue(currentSession.isFinished)
        assertEquals(10, currentSession.score.value) // todas corretas (mock retorna true)
    }

    @Test
    fun `should register player and reuse on second login`() = runTest {
        val playerRepository = InMemoryPlayerRepository()
        val registerOrLogin = RegisterOrLoginPlayerUseCase(playerRepository)

        // Primeiro login
        val first = registerOrLogin.execute("John").getOrThrow()

        // Segundo login com mesmo nome
        val second = registerOrLogin.execute("John").getOrThrow()

        assertEquals(first.id, second.id)
        assertEquals(first.name, second.name)
    }

    @Test
    fun `should have zero score when all answers are wrong`() = runTest {
        val playerRepository = InMemoryPlayerRepository()
        val sessionRepository = InMemoryQuizSessionRepository()

        // Mock que retorna sempre false para respostas
        val wrongClient = HttpClient(MockEngine { request ->
            var counter = 0
            when {
                request.url.encodedPath == "/question" && request.method == HttpMethod.Get -> {
                    counter++
                    respond(
                        content = """
                            {
                                "id": "${System.currentTimeMillis()}_$counter",
                                "statement": "Question?",
                                "options": ["A", "B", "C", "D", "E"]
                            }
                        """.trimIndent(),
                        status = HttpStatusCode.OK,
                        headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    )
                }
                request.url.encodedPath.startsWith("/answer") && request.method == HttpMethod.Post -> {
                    respond(
                        content = """{"result": false}""",
                        status = HttpStatusCode.OK,
                        headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    )
                }
                else -> respond("Not found", HttpStatusCode.NotFound)
            }
        }) {
            install(ContentNegotiation) { json() }
        }

        val questionRepository = HttpQuestionRepository(wrongClient)
        val registerOrLogin = RegisterOrLoginPlayerUseCase(playerRepository)
        val fillSession = FillSessionUseCase(sessionRepository, questionRepository)
        val startSession = StartNewQuizSessionUseCase(sessionRepository, registerOrLogin, fillSession)
        val answerQuestion = AnswerQuestionUseCase(sessionRepository, questionRepository)

        // Fluxo completo
        val session = startSession.execute("Jane").getOrThrow()

        var currentSession = session
        for (question in session.questions) {
            currentSession = answerQuestion.execute(
                currentSession.id.value,
                question.id.value,
                question.options.first().value
            ).getOrThrow()
        }

        assertEquals(10, currentSession.answers.size)
        assertTrue(currentSession.isFinished)
        assertEquals(0, currentSession.score.value)
    }
}