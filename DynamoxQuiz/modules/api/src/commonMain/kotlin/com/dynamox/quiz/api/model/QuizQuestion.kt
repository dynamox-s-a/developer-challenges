package com.dynamox.quiz.api.model

import kotlinx.serialization.Serializable

@Serializable
data class QuizQuestion(
    val id: String,
    val statement: String,
    val options: List<String>,
)