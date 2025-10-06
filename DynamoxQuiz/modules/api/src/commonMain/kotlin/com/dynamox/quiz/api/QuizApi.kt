package com.dynamox.quiz.api

import com.dynamox.quiz.api.models.ApiResult
import com.dynamox.quiz.api.models.QuizQuestion
import com.dynamox.quiz.api.models.QuizResult

interface QuizApi {

    suspend fun getRandomQuestion(): ApiResult<QuizQuestion>

    suspend fun submitAnswer(questionId: String, answer: String): ApiResult<QuizResult>
}