package com.abel.dynamoxquiz.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface ScoreDao {
    @Insert
    suspend fun insertScore(
        score: ScoreEntity
    )
    @Query(
        "SELECT * FROM scores ORDER BY score DESC"
    )
    suspend fun getAllScores():
            List<ScoreEntity>
}