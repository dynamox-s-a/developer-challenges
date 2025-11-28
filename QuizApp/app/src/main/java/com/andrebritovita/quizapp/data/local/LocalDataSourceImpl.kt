package com.andrebritovita.quizapp.data.local

import com.andrebritovita.quizapp.data.local.dao.ScoreDao
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class LocalDataSourceImpl @Inject constructor(
    private val scoreDao: ScoreDao
) : LocalDataSource {

    override suspend fun insertScore(score: ScoreEntity) {
        scoreDao.insertScore(score)
    }

    override fun getAllScores(): Flow<List<ScoreEntity>> {
        return scoreDao.getAllScores()
    }
}