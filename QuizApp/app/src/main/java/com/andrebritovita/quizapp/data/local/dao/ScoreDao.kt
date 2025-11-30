package com.andrebritovita.quizapp.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.Flow

/**
 * DAO responsável pelo acesso à tabela de pontuações no banco local.
 *
 * Responsabilidades:
 * - Inserir uma nova pontuação após o término de um jogo.
 * - Observar continuamente todas as pontuações salvas.
 *
 * Todas as consultas retornam Flow, permitindo atualização reativa da UI.
 */
@Dao
interface ScoreDao {
    /**
     * Insere uma nova pontuação no banco.
     * Caso o ID já exista, a linha será substituída.
     */
    @Insert
    suspend fun insertScore(scoreEntity: ScoreEntity)

    /**
     * Retorna um fluxo com todas as pontuações salvas, ordenadas da mais recente para a mais antiga.
     */
    @Query("SELECT * FROM scores")
    fun getAllScores() : Flow<List<ScoreEntity>>

}
