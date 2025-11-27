package com.andrebritovita.quizapp.data.remote.dto

import com.google.gson.annotations.SerializedName

/**
 * Corpo enviado no POST /answer.
 *
 * Representa a resposta escolhida pelo usuário. O Retrofit serializa automaticamente
 * para o formato JSON esperado pela API:
 *
 * { "answer": "String escolhida pelo usuário" }
 */
data class AnswerRequest(
    @SerializedName("answer") val answer: String
)
