package com.dynamox.quizchallenge.domain.usecase

import com.dynamox.quizchallenge.domain.model.PlayerScore
import com.dynamox.quizchallenge.domain.repository.ScoreRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

/** Observes every saved score for every player (user story 3.2: "visualize the score of every user"). */
class ObserveScoreHistoryUseCase @Inject constructor(
    private val scoreRepository: ScoreRepository,
) {
    operator fun invoke(): Flow<List<PlayerScore>> = scoreRepository.observeScoreHistory()
}
