package com.andrebritovita.quizapp.data.remote.dto

import com.andrebritovita.quizapp.domain.model.Question
import com.google.gson.annotations.SerializedName

/**
 * Representação do JSON retornado pela API.
 * Exemplo: { "id": "1", "statement": "...", "options": [...] }
 */
data class QuestionDto(
    @SerializedName("id") val id: String,
    @SerializedName("statement") val statement: String,
    @SerializedName("options") val options: List<String>
)

/**
 * Converte o DTO bruto recebido pela API para o modelo de domínio utilizado pela UI.
 *
 * Essa conversão desacopla o app do formato exato da API, permitindo testes e
 * evolução independente do backend.
 */

// Converte DTO em Domain
fun QuestionDto.toDomainQuestion(): Question {
    return Question(
        id = this.id,
        statement = this.statement,
        options = this.options
    )
}
