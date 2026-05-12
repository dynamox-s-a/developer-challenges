package com.abel.dynamoxquiz.data.repository

import com.abel.dynamoxquiz.data.remote.AnswerRequest
import com.abel.dynamoxquiz.data.remote.AnswerResponse
import com.abel.dynamoxquiz.data.remote.QuestionDto
import com.abel.dynamoxquiz.data.remote.QuizApiService
import com.abel.dynamoxquiz.domain.repository.QuizRepository

class QuizRepositoryImpl(
    private val apiService: QuizApiService ) : QuizRepository {

    override suspend fun getQuestion(): QuestionDto {
        return apiService.getQuestion()
    }

    override suspend fun sendAnswer(
        questionId: String,
        answer: String ):
            AnswerResponse {



        return apiService.submitAnswer(
            questionId = questionId,
            request = AnswerRequest(answer)


    )
    }
}
