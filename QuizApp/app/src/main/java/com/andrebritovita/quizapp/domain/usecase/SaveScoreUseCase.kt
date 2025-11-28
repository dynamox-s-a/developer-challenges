package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.domain.repository.QuizRepository
import javax.inject.Inject

/**
 * Salva a pontuação final de uma sessão de jogo.
 *
 * Salva o nome do jogador, a pontuação obtida e a data atual no banco de dados local.
 */
class SaveScoreUseCase @Inject constructor(
    private val repository: QuizRepository
){
    suspend operator fun invoke(name: String, score: Int){
        repository.saveScore(name, score)
    }
}