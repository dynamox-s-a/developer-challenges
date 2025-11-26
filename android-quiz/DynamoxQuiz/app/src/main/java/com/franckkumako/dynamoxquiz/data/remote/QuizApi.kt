package com.franckkumako.dynamoxquiz.data.remote

import com.franckkumako.dynamoxquiz.data.remote.dto.AnswerResultDto
import com.franckkumako.dynamoxquiz.data.remote.dto.QuestionDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import com.squareup.moshi.JsonClass
interface QuizApi {


    @GET("question")
    suspend fun getQuestion(): QuestionDto


    @POST("answer")
    suspend fun submitAnswer(
        @Query("questionId") questionId: String,
        @Body body: AnswerBody
    ): AnswerResultDto
}
@JsonClass(generateAdapter = true)
data class AnswerBody(
    val answer: String
)
