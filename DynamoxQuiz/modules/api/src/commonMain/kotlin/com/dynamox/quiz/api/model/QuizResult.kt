package com.dynamox.quiz.api.model

import kotlinx.serialization.Serializable

@Serializable
data class QuizResult(
    val result: Boolean,
)