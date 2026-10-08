package br.com.govanidebastiani.dynamoxquiz.player.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.player.domain.Player
import br.com.govanidebastiani.dynamoxquiz.player.domain.exception.PlayerAlreadyExistsException
import br.com.govanidebastiani.dynamoxquiz.player.domain.repository.PlayerRepository
import kotlin.time.Clock

class CreatePlayerUseCase(
    private val playerRepository: PlayerRepository
) {
    suspend operator fun invoke(playerNickname: String): Result<Unit> {
        return try {
            val sanitizedNickname = playerNickname.trim()

            require(sanitizedNickname.isNotEmpty()) { "The nickname must not be empty" }

            if (playerRepository.fetchPlayerByNickname(sanitizedNickname) != null) {
                throw PlayerAlreadyExistsException(sanitizedNickname)
            }

            val player = Player(
                nickname = sanitizedNickname,
                createdAt = Clock.System.now().toEpochMilliseconds()
            )

            Result.success(playerRepository.createPlayer(player))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}