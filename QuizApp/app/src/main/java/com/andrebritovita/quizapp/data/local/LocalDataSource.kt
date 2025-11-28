package com.andrebritovita.quizapp.data.local

import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.Flow

interface LocalDataSource {
    suspend fun insertScore (score: ScoreEntity)
    fun getAllScores() : Flow<List<ScoreEntity>>
}