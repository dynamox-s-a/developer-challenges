package com.dynamox.quizchallenge.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "player_scores")
data class PlayerScoreEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val playerName: String,
    val correctCount: Int,
    val totalQuestions: Int,
    val playedAtEpochMillis: Long,
)
