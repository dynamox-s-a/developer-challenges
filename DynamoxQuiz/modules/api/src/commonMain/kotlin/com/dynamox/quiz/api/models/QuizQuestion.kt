package com.dynamox.quiz.api.models

import kotlinx.serialization.Serializable

@Serializable
data class QuizQuestion(
    val id: String,
    val statement: String,
    val options: List<String>,
)