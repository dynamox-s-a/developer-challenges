package com.romulofer.kotlinMultiplatform.data.remote

import com.romulofer.kotlinMultiplatform.data.remote.dto.AnswerRequestDto
import com.romulofer.kotlinMultiplatform.data.remote.dto.AnswerResponseDto
import com.romulofer.kotlinMultiplatform.data.remote.dto.QuestionDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType

internal class QuizApi(private val client: HttpClient) {

    suspend fun getQuestion(): QuestionDto = client.get("/question").body()

    suspend fun submitAnswer(questionId: String, answer: String): AnswerResponseDto =
        client.post("/answer") {
            parameter("questionId", questionId)
            contentType(ContentType.Application.Json)
            setBody(AnswerRequestDto(answer = answer))
        }.body()
}