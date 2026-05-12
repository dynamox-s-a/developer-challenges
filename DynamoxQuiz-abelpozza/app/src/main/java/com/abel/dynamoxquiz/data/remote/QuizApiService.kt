package com.abel.dynamoxquiz.data.remote

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import retrofit2.http.Path
interface QuizApiService {
    @GET("question")
    suspend fun getQuestion(): QuestionDto
    @POST("answer")
    suspend fun submitAnswer(
        @Query("questionId") questionId: String,
        @Body request: AnswerRequest
    ): AnswerResponse
}