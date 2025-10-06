package com.dynamox.quiz.api.models

import kotlinx.serialization.Serializable

@Serializable
data class QuizResult(
    val result: Boolean,
)