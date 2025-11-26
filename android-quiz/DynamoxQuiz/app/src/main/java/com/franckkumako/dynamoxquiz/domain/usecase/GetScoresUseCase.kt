package com.franckkumako.dynamoxquiz.domain.usecase

import com.franckkumako.dynamoxquiz.domain.model.Score
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository
import kotlinx.coroutines.flow.Flow

class GetScoresUseCase(
    private val repository: QuizRepository
) {

    operator fun invoke(): Flow<List<Score>> = repository.observeScores()
}
