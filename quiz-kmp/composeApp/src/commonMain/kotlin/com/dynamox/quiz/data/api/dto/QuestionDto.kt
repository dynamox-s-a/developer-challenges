package com.dynamox.quiz.data.api.dto

import kotlinx.serialization.Serializable

/** DTO da estrutura JSON de uma pergunta */
@Serializable
data class QuestionDto(
    val id: String,
    val statement: String,
    val options: List<String>
)
