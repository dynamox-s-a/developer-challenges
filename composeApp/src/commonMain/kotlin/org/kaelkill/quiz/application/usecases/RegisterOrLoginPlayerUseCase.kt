package org.kaelkill.quiz.application.usecases

import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository

class RegisterOrLoginPlayerUseCase(private val playerRepository: PlayerRepository) {
    suspend fun execute(playerName: String): Result<Player> {
        return runCatching {
            val playerName = PlayerName.create(playerName).getOrThrow()
            val playerId = PlayerId.generate()

            val existingPlayer = playerRepository.getByName(playerName).getOrThrow()
            if (existingPlayer != null) {
                existingPlayer
            } else {
                val player = Player(playerId, playerName)
                playerRepository.save(player).getOrThrow()
                player
            }
        }
    }
}