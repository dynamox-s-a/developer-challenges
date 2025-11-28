package com.andrebritovita.quizapp.data.remote

import com.andrebritovita.quizapp.data.remote.dto.AnswerResponse
import com.andrebritovita.quizapp.data.remote.dto.QuestionDto



/**
 * Fonte de dados remota da aplicação.
 *
 * Abstrai o uso do Retrofit, impedindo que camadas superiores dependam
 * diretamente da API ou de detalhes de transporte.
 *
 * Papel na arquitetura:
 * - Expõe apenas as operações que o domínio precisa.
 * - Oculta detalhes de requisição (DTOs, endpoints, Retrofit).
 */
interface RemoteDataSource {
    suspend fun getQuestion(): QuestionDto
    suspend fun submitAnswer(questionId: String, answer: String): AnswerResponse
}