package com.dynamox.quiz.domain.model

data class QuizScore(
    val id: Long,
    val playerId: Long,
    val playerName: String,
    val score: Int,
    val totalQuestions: Int,
    val createdAt: String
)
