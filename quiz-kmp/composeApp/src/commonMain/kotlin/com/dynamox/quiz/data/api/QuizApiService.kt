package com.dynamox.quiz.data.api

import com.dynamox.quiz.data.api.dto.AnswerRequestDto
import com.dynamox.quiz.data.api.dto.AnswerResponseDto
import com.dynamox.quiz.data.api.dto.QuestionDto
import com.dynamox.quiz.domain.model.AppError
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType

/** Responsável por realizar as chamadas HTTP usando o cliente Ktor */
class QuizApiService(private val client: HttpClient) {

    private companion object {
        const val BASE_URL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app"
    }

    suspend fun getQuestion(): QuestionDto {
        val response: HttpResponse = client.get("$BASE_URL/question")
        return handleResponse(response)
    }

    suspend fun submitAnswer(questionId: String, answer: String): AnswerResponseDto {
        val response: HttpResponse = client.post("$BASE_URL/answer?questionId=$questionId") {
            contentType(ContentType.Application.Json)
            setBody(AnswerRequestDto(answer = answer))
        }
        return handleResponse(response)
    }

    private suspend inline fun <reified T> handleResponse(response: HttpResponse): T {
        return when (response.status) {
            HttpStatusCode.OK -> response.body()
            HttpStatusCode.BadRequest -> throw AppError.ValidationError(
                "Bad request: ${response.status.description}"
            )
            HttpStatusCode.NotFound -> throw AppError.NotFoundError("Requisição não encontrada")
            HttpStatusCode.InternalServerError -> throw AppError.ServerError(500, "Erro interno do servidor")
            else -> throw AppError.ServerError(
                response.status.value,
                "Unexpected error: ${response.status.description}"
            )
        }
    }
}
