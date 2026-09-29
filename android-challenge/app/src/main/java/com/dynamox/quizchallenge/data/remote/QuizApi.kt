package com.dynamox.quizchallenge.data.remote

import com.dynamox.quizchallenge.data.remote.dto.AnswerRequestDto
import com.dynamox.quizchallenge.data.remote.dto.AnswerResponseDto
import com.dynamox.quizchallenge.data.remote.dto.QuestionDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

/** Dynamox quiz backend: https://quiz-api-bwi5hjqyaq-uc.a.run.app */
interface QuizApi {

    @GET("question")
    suspend fun getQuestion(): QuestionDto

    @POST("answer")
    suspend fun submitAnswer(
        @Query("questionId") questionId: String,
        @Body body: AnswerRequestDto,
    ): AnswerResponseDto
}
