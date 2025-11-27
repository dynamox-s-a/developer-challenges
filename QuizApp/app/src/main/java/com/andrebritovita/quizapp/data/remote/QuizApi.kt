package com.andrebritovita.quizapp.data.remote

import com.andrebritovita.quizapp.data.remote.dto.AnswerRequest
import com.andrebritovita.quizapp.data.remote.dto.AnswerResponse
import com.andrebritovita.quizapp.data.remote.dto.QuestionDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

/**
 * Interface que define a comunicação com a API REST do Quiz.
 *
 * Esta interface é utilizada pelo Retrofit para gerar automaticamente
 * a implementação concreta das chamadas HTTP.
 *
 * Responsabilidades:
 *  - Obter uma nova pergunta aleatória do servidor.
 *  - Enviar a resposta escolhida pelo usuário para validação.
 *
 * Observações importantes:
 * - A API não possui autenticação.
 * - O ID da pergunta deve ser enviado como query parameter em /answer.
 * - Todas as funções são `suspend`, devendo ser chamadas dentro de coroutines.
 */

interface QuizApi {

    /**
     * Obtém uma pergunta aleatória no formato definido pela API.
     *
     * Endpoint: GET /question
     *
     * Retorna: JSON representando id, enunciado e lista de opções.
     */

    @GET("question")
    suspend fun getQuestion(): QuestionDto


    /**
     * Envia a resposta escolhida pelo usuário para validação.
     *
     * Endpoint: POST /answer?questionId={id}
     * Body esperado: { "answer": "<texto da opção>" }
     *
     * @param questionId ID da pergunta retornado anteriormente pelo endpoint /question.
     * @param request Corpo JSON contendo o texto da resposta escolhida pelo usuário.
     * @return [AnswerResponse] Booleano indicando se a resposta estava correta.
     */

    @POST("answer")
    suspend fun sendAnswer(
        @Query("questionId") questionId: String,
        @Body request: AnswerRequest
    ): AnswerResponse

    companion object {
        const val BASE_URL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app/"
    }
}