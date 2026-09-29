package com.dynamox.quizchallenge.domain.repository

import com.dynamox.quizchallenge.domain.model.PlayerScore
import kotlinx.coroutines.flow.Flow

/**
 * Local persistence for player names and their quiz scores (mandatory requirement).
 * Implemented by the data layer; the domain and UI layers only depend on this interface.
 */
interface ScoreRepository {

    /** Persists a finished quiz result. */
    suspend fun saveScore(score: PlayerScore)

    /** Every saved score for every player, most recent first. */
    fun observeScoreHistory(): Flow<List<PlayerScore>>
}
