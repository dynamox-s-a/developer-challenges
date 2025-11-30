package com.andrebritovita.quizapp.data.local

import com.andrebritovita.quizapp.data.local.dao.ScoreDao
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

/**
 * Implementação de [LocalDataSource] usando Room.
 *
 * Esta classe atua como a camada de acesso local aos dados do aplicativo,
 * delegando operações ao [ScoreDao].
 *
 * Responsabilidades:
 * - Inserir novas pontuações no banco local.
 * - Mostrar as pontuações salvas (expõe como um Flow).
 *
 * Observação:
 * Nenhuma lógica adicional é aplicada aqui — a classe apenas orquestra
 * o acesso ao DAO, mantendo o repositório desacoplado de Room.
 */
class LocalDataSourceImpl @Inject constructor(
    private val scoreDao: ScoreDao
) : LocalDataSource {

    override suspend fun insertScore(score: ScoreEntity) {
        scoreDao.insertScore(score)
    }

    override fun getAllScores(): Flow<List<ScoreEntity>> {
        return scoreDao.getAllScores()
    }
}