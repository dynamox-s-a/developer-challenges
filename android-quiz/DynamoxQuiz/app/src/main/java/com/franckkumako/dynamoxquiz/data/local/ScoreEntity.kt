package com.franckkumako.dynamoxquiz.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "scores")
data class ScoreEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0L,
    val playerName: String,
    val score: Int,
    val createdAt: Long
)
