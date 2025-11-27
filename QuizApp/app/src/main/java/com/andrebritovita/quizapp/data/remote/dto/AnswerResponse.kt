package com.andrebritovita.quizapp.data.remote.dto

import com.google.gson.annotations.SerializedName

/**
 * Resposta da API indicando se a alternativa escolhida estava correta.
 *
 */
data class AnswerResponse(
    @SerializedName("result") val result: Boolean
)
