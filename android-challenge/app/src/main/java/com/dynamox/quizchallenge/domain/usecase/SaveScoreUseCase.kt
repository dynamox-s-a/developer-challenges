package com.dynamox.quizchallenge.domain.usecase

import com.dynamox.quizchallenge.domain.model.PlayerScore
import com.dynamox.quizchallenge.domain.repository.ScoreRepository
import java.time.Instant
import javax.inject.Inject

/** Persists the result of a finished quiz run (user story 3.2). */
class SaveScoreUseCase @Inject constructor(
    private val scoreRepository: ScoreRepository,
) {
    suspend operator fun invoke(playerName: String, correctCount: Int, totalQuestions: Int) {
        scoreRepository.saveScore(
            PlayerScore(
                playerName = playerName,
                correctCount = correctCount,
                totalQuestions = totalQuestions,
                playedAt = Instant.now(),
            ),
        )
    }
}
