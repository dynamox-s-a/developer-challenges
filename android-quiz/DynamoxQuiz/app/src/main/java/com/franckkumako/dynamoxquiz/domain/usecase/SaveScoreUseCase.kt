package com.franckkumako.dynamoxquiz.domain.usecase

import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository

class SaveScoreUseCase(
    private val repository: QuizRepository
) {
    suspend operator fun invoke(playerName: String, score: Int) {
        repository.saveScore(playerName, score)
    }
}
