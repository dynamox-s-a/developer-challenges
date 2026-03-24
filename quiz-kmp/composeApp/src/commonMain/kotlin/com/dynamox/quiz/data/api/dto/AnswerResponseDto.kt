package com.dynamox.quiz.data.api.dto

import kotlinx.serialization.Serializable

/**
 * DTO da resposta JSON do servidor.
 * Desserializado automaticamente do JSON retornado pelo endpoint POST /answer.
 */
@Serializable
data class AnswerResponseDto(
    val result: Boolean
)
