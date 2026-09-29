package com.dynamox.quizchallenge.fakes

import com.dynamox.quizchallenge.domain.model.PlayerScore
import com.dynamox.quizchallenge.domain.repository.ScoreRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/** In-memory [ScoreRepository] test double backed by a StateFlow, no Room involved. */
class FakeScoreRepository : ScoreRepository {
    private val _scores = MutableStateFlow<List<PlayerScore>>(emptyList())
    val savedScores: List<PlayerScore> get() = _scores.value

    override suspend fun saveScore(score: PlayerScore) {
        _scores.value = _scores.value + score
    }

    override fun observeScoreHistory() = _scores.asStateFlow()
}
