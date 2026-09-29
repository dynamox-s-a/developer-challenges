package com.dynamox.quizchallenge.domain.model

import java.time.Instant

/**
 * A single completed quiz result for a player, as shown in the score history screen.
 *
 * @param id Local database identifier; `0` for a result that has not been persisted yet.
 */
data class PlayerScore(
    val id: Long = 0,
    val playerName: String,
    val correctCount: Int,
    val totalQuestions: Int,
    val playedAt: Instant,
)
