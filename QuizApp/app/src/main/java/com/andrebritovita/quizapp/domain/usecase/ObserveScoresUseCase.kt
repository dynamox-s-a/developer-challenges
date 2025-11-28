package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import com.andrebritovita.quizapp.domain.repository.QuizRepository
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow


/**
 * Mostra o histórico de pontuações.
 *
 * Retorna um fluxo contínuo (Flow) de dados do banco de dados local,
 * permitindo que a UI seja atualizada em tempo real quando novos jogos forem salvos.
 */
class ObserveScoresUseCase @Inject constructor(
    private val repository: QuizRepository
) {
    operator fun invoke() : Flow<List<ScoreEntity>> {
        return repository.observeScores()
    }
}