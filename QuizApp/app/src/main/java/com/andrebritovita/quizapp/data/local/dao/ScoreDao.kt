package com.andrebritovita.quizapp.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ScoreDao {
    @Insert
    suspend fun insertScore(scoreEntity: ScoreEntity)

    @Query("SELECT * FROM scores")
    fun getAllScores() : Flow<List<ScoreEntity>>

}
