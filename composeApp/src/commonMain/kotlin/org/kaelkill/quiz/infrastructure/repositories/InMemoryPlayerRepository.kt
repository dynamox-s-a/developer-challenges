package org.kaelkill.quiz.infrastructure.repositories

import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository

class InMemoryPlayerRepository : PlayerRepository {

    private val players = mutableMapOf<String, Player>()

    override suspend fun save(player: Player): Result<Unit> {
        return runCatching {
            players[player.name.value] = player
        }
    }

    override suspend fun getByName(name: PlayerName): Result<Player?> {
        return runCatching {
            players[name.value]
        }
    }

    override suspend fun getAll(): Result<List<Player>> {
        return runCatching {
            players.values.toList()
        }
    }
}