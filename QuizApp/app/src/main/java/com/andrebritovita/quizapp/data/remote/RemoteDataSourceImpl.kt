package com.andrebritovita.quizapp.data.remote

import com.andrebritovita.quizapp.data.remote.dto.AnswerRequest
import com.andrebritovita.quizapp.data.remote.dto.AnswerResponse
import com.andrebritovita.quizapp.data.remote.dto.QuestionDto
import javax.inject.Inject

class RemoteDataSourceImpl @Inject constructor(
    private val api: QuizApi
): RemoteDataSource{

    override suspend fun getQuestion(): QuestionDto {
        return api.getQuestion()
    }

    override suspend fun submitAnswer(
        questionId: String,
        answer: String
    ): AnswerResponse {
        val request = AnswerRequest(answer = answer.trim())
        return api.sendAnswer(questionId = questionId, request = request)
    }
}