package com.romulofer.kotlinMultiplatform.domain.model

data class ScoreboardEntry(
    val playerName: String,
    val correctAnswers: Int,
    val totalQuestions: Int,
    val playedAtEpochMillis: Long
)
