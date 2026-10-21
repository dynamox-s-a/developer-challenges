package com.romulofer.kotlinMultiplatform.domain.repository

import com.romulofer.kotlinMultiplatform.domain.model.DataResult
import com.romulofer.kotlinMultiplatform.domain.model.Question

interface QuizRepository {
    suspend fun getQuestion(): DataResult<Question>
    suspend fun submitAnswer(questionId: String, answer:String): DataResult<Boolean>
}