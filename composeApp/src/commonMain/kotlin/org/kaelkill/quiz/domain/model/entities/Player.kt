package org.kaelkill.quiz.domain.model.entities

import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName

data class Player(
    val id: PlayerId,
    val name: PlayerName
) {
    companion object {
        fun create(name: String): Result<Player> {
            return runCatching {
                val playerName = PlayerName.create(name).getOrThrow()
                val playerId = PlayerId.generate()
                Player(playerId, playerName)
            }
        }

        fun restore(id: String, name: String): Result<Player> {
            return runCatching {
                val playerId = PlayerId.create(id).getOrThrow()
                val playerName = PlayerName.create(name).getOrThrow()
                Player(playerId, playerName)
            }
        }
    }

}