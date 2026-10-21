package com.romulofer.kotlinMultiplatform.data.local

import app.cash.sqldelight.coroutines.asFlow
import app.cash.sqldelight.coroutines.mapToList
import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers.Default
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import kotlin.time.Clock

class ScoreRepositoryImpl(
    private val database: QuizDatabase,
    private val clock: Clock,
    private val dispatcher: CoroutineDispatcher = Default
) : ScoreRepository{
    override suspend fun save(playerId: Long, correct: Int, total: Int){
        withContext(dispatcher){
            database.scoreQueries.insert(
                player_id = playerId,
                correct_answers = correct.toLong(),
                total_questions = total.toLong(),
                played_at = clock.now().toEpochMilliseconds()
            )
        }
    }

    override fun observeScoreboard(): Flow<List<ScoreboardEntry>> =
        database.scoreQueries
            .selectScoreboard{playerName, correctAnswers, totalQuestions, playedAt ->
                ScoreboardEntry(
                    playerName = playerName,
                    correctAnswers = correctAnswers.toInt(),
                    totalQuestions = totalQuestions.toInt(),
                    playedAtEpochMillis = playedAt
                )
            }
            .asFlow()
            .mapToList(dispatcher)
}
