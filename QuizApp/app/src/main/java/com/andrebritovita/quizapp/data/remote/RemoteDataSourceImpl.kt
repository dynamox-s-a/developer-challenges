package com.andrebritovita.quizapp.data.remote

import com.andrebritovita.quizapp.data.remote.dto.AnswerRequest
import com.andrebritovita.quizapp.data.remote.dto.AnswerResponse
import com.andrebritovita.quizapp.data.remote.dto.QuestionDto
import javax.inject.Inject

/**
 * Implementação de [RemoteDataSource] utilizando Retrofit.
 *
 * Encapsula o acesso à API remota,
 * garantindo que camadas superiores não dependam diretamente
 * de Retrofit ou detalhes HTTP.
 *
 * Responsabilidades:
 * - Buscar uma nova pergunta.
 * - Enviar a resposta selecionada pelo usuário para validação.
 *
 * Observação:
 * - Aqui ocorre apenas a montagem da requisição e delegação ao Retrofit.
 * - A conversão DTO → Question é feita na camada de repositório.
 */
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