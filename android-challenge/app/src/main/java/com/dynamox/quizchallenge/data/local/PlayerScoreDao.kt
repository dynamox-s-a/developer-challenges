package com.dynamox.quizchallenge.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface PlayerScoreDao {

    @Insert
    suspend fun insert(score: PlayerScoreEntity)

    @Query("SELECT * FROM player_scores ORDER BY playedAtEpochMillis DESC")
    fun observeAll(): Flow<List<PlayerScoreEntity>>
}
