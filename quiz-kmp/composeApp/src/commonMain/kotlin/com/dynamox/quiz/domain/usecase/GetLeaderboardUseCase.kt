package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.QuizScore
import com.dynamox.quiz.domain.repository.QuizRepository

/**
 *
 * Retorna as pontuações salvas localmente no banco SQLite, ordenadas
 * da maior para a menor. Usado na tela de Leaderboard.
 *
 */
class GetLeaderboardUseCase(private val repository: QuizRepository) {
    suspend operator fun invoke(): Result<List<QuizScore>> = repository.getLeaderboard()
}
