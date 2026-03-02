package com.dynamox.quiz.data.api.dto

import kotlinx.serialization.Serializable

/**
 * DTO do body da requisição POST /answer.
 * É serializado para JSON pelo Ktor antes de enviar ao servidor. */
@Serializable
data class AnswerRequestDto(
    val answer: String
)
