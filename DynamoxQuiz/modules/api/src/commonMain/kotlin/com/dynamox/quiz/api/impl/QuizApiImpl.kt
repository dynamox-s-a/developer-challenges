package com.dynamox.quiz.api.impl

import com.dynamox.quiz.api.QuizApi
import com.dynamox.quiz.api.model.ApiResult
import com.dynamox.quiz.api.model.QuizAnswer
import com.dynamox.quiz.api.model.QuizQuestion
import com.dynamox.quiz.api.model.QuizResult
import com.dynamox.quiz.api.util.callApiParseResponse
import com.dynamox.quiz.api.util.configureKtorClient
import com.dynamox.quiz.api.util.div
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.Url
import io.ktor.http.contentType

class QuizApiImpl(
    client: HttpClient,
    val apiUrl: Url,
) : QuizApi {

    val client = configureKtorClient(client)

    override suspend fun getRandomQuestion(): ApiResult<QuizQuestion> {
        return callApiParseResponse {
            client.get(apiUrl / "question")
        }
    }

    override suspend fun submitAnswer(
        questionId: String,
        answer: String
    ): ApiResult<QuizResult> {
        val answer = QuizAnswer(answer)
        return callApiParseResponse {
            client.post(apiUrl / "answer") {
                contentType(ContentType.Application.Json)
                parameter("questionId", questionId)
                setBody(answer)
            }
        }
    }
}