package com.andrebritovita.quizapp.data.remote

import com.andrebritovita.quizapp.data.remote.dto.AnswerResponse
import com.andrebritovita.quizapp.data.remote.dto.QuestionDto



// Busca uma pergunta e envia uma resposta
interface RemoteDataSource {
    suspend fun getQuestion(): QuestionDto
    suspend fun submitAnswer(questionId: String, answer: String): AnswerResponse
}