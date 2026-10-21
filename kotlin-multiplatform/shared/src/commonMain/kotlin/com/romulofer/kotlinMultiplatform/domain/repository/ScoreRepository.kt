package com.romulofer.kotlinMultiplatform.domain.repository

import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import kotlinx.coroutines.flow.Flow

interface ScoreRepository {
    suspend fun save(playerId: Long, correct: Int, total: Int)
    fun observeScoreboard(): Flow<List<ScoreboardEntry>>
}