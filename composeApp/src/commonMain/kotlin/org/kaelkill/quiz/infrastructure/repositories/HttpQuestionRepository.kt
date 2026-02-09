package org.kaelkill.quiz.infrastructure.repositories

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlinx.serialization.Serializable
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.QuestionId
import org.kaelkill.quiz.domain.model.valueobjects.QuestionStatement
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository

class HttpQuestionRepository(
    private val client: HttpClient,
    private val baseUrl: String = "https://quiz-api-bwi5hjqyaq-uc.a.run.app"
) : QuestionRepository {

    override suspend fun getRandomQuestion(): Result<Question> {
        return runCatching {
            val response = client.get("$baseUrl/question").body<QuestionResponse>()
            response.toDomain()
        }
    }

    override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> {
        return runCatching {
            val response = client.post("$baseUrl/answer?questionId=$questionId") {
                contentType(ContentType.Application.Json)
                setBody(AnswerRequest(answer))
            }.body<AnswerResponse>()
            response.result
        }
    }

    @Serializable
    private data class QuestionResponse(
        val id: String,
        val statement: String,
        val options: List<String>
    ) {
        fun toDomain(): Question {
            val questionId = QuestionId.create(id).getOrThrow()
            val questionStatement = QuestionStatement.create(statement).getOrThrow()
            val answerOptions = options.map { AnswerOption.create(it).getOrThrow() }
            return Question(questionId, questionStatement, answerOptions)
        }
    }

    @Serializable
    private data class AnswerRequest(val answer: String)

    @Serializable
    private data class AnswerResponse(val result: Boolean)
}