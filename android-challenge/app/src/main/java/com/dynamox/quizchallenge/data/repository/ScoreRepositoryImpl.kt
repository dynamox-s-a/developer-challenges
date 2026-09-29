package com.dynamox.quizchallenge.data.repository

import com.dynamox.quizchallenge.data.local.PlayerScoreDao
import com.dynamox.quizchallenge.data.local.PlayerScoreEntity
import com.dynamox.quizchallenge.domain.model.PlayerScore
import com.dynamox.quizchallenge.domain.repository.ScoreRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.Instant
import javax.inject.Inject

class ScoreRepositoryImpl @Inject constructor(
    private val dao: PlayerScoreDao,
) : ScoreRepository {

    override suspend fun saveScore(score: PlayerScore) {
        dao.insert(
            PlayerScoreEntity(
                playerName = score.playerName,
                correctCount = score.correctCount,
                totalQuestions = score.totalQuestions,
                playedAtEpochMillis = score.playedAt.toEpochMilli(),
            ),
        )
    }

    override fun observeScoreHistory(): Flow<List<PlayerScore>> =
        dao.observeAll().map { entities -> entities.map(PlayerScoreEntity::toDomain) }
}

private fun PlayerScoreEntity.toDomain(): PlayerScore = PlayerScore(
    id = id,
    playerName = playerName,
    correctCount = correctCount,
    totalQuestions = totalQuestions,
    playedAt = Instant.ofEpochMilli(playedAtEpochMillis),
)
