package com.franckkumako.dynamoxquiz.domain.model

data class Score(
    val id: Long = 0L,
    val playerName: String,
    val score: Int,
    val createdAt: Long
)
