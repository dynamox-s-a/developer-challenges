package org.kaelkill.quiz.domain.ports.repositories

import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName

interface PlayerRepository {
    suspend fun save(player: Player): Result<Unit>

    suspend fun getByName(name: PlayerName): Result<Player?>
    suspend fun getAll(): Result<List<Player>>
}