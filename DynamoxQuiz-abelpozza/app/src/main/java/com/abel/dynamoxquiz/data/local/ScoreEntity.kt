package com.abel.dynamoxquiz.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "scores")
data class ScoreEntity(

    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val nickname: String,
    val score: Int
)