package com.dynamox.quiz.api

import com.dynamox.quiz.api.model.ApiResult
import com.dynamox.quiz.api.model.QuizQuestion
import com.dynamox.quiz.api.model.QuizResult

/**
 * Interface defining the Quiz API for fetching questions and submitting answers.
 */
interface QuizApi {

    /**
     * Fetches a random quiz question from the API.
     * @return An [ApiResult] containing a [QuizQuestion] on success or an error on failure.
     */
    suspend fun getRandomQuestion(): ApiResult<QuizQuestion>

    /**
     * Submits an answer for a specific question to the API.
     * @param questionId The ID of the question being answered.
     * @param answer The answer provided by the user.
     * @return An [ApiResult] containing a [QuizResult] on success or an error on failure.
     */
    suspend fun submitAnswer(questionId: String, answer: String): ApiResult<QuizResult>
}