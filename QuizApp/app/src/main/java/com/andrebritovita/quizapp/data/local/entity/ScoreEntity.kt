package com.andrebritovita.quizapp.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Entidade Room que representa o registro de um jogo finalizado.
 *
 * Campos:
 * name: Nome do jogador.
 * score: Pontuação obtida (0–10).
 * gameDate: Timestamp em milissegundos da data/hora em que o jogo foi concluído.
 *
 * Cada instância corresponde a uma linha da tabela de histórico,
 * exibida posteriormente em [HistoryScreen].
 */
@Entity(tableName = "scores")
data class ScoreEntity (
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val score: Int,
    val gameDate: Long
)

