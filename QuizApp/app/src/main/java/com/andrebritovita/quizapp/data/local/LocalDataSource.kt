package com.andrebritovita.quizapp.data.local

import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.Flow

/**
 * Fonte de dados local da aplicação.
 *
 * Responsável por encapsular o acesso ao banco de dados Room, evitando que
 * camadas superiores conheçam diretamente DAOs ou entidades internas.
 *
 * Papel na arquitetura:
 * - Abstrai o Room para o Repository.
 * - Define operações locais disponíveis (salvar e listar históricos).
 */
interface LocalDataSource {
    suspend fun insertScore (score: ScoreEntity)
    fun getAllScores() : Flow<List<ScoreEntity>>
}