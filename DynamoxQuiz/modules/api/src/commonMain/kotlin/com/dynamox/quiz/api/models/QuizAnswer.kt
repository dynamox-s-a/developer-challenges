package com.dynamox.quiz.api.models

import kotlinx.serialization.Serializable

@Serializable
data class QuizAnswer(
    val answer: String,
)