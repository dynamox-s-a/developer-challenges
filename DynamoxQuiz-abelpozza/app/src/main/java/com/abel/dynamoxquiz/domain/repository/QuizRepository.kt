package com.abel.dynamoxquiz.domain.repository

import com.abel.dynamoxquiz.data.remote.AnswerResponse
import com.abel.dynamoxquiz.data.remote.QuestionDto

interface QuizRepository {

    suspend fun getQuestion(): QuestionDto

    suspend fun sendAnswer(
        questionId: String,
        answer: String
    ): AnswerResponse
}