package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.repository.QuizRepository

/** Responsável por salvar a pontuação ao final do quiz.*/
class SaveQuizScoreUseCase(private val repository: QuizRepository) {
    suspend operator fun invoke(
        playerId: Long,
        playerName: String,
        score: Int,
        totalQuestions: Int
    ): Result<Unit> = repository.saveQuizScore(playerId, playerName, score, totalQuestions)
}
