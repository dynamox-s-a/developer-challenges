package com.romulofer.kotlinMultiplatform.data.remote

import com.romulofer.kotlinMultiplatform.data.remote.dto.toDomain
import com.romulofer.kotlinMultiplatform.domain.model.DataResult
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository

internal class QuizRepositoryImpl(private val api: QuizApi): QuizRepository{
    override suspend fun getQuestion(): DataResult<Question> = apiCall {api.getQuestion().toDomain()}

    override suspend fun submitAnswer(questionId: String, answer: String): DataResult<Boolean> =
        apiCall { api.submitAnswer(questionId, answer).result }

}
