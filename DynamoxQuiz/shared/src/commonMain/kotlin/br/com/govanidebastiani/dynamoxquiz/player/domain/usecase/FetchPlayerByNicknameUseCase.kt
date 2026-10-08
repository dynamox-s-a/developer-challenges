package br.com.govanidebastiani.dynamoxquiz.player.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.player.domain.repository.PlayerRepository

class FetchPlayerByNicknameUseCase(
    private val playerRepository: PlayerRepository
) {
    suspend operator fun invoke(playerNickname: String): String? {
        val sanitizedNickname = playerNickname.trim()

        if (sanitizedNickname.isEmpty()) {
            return null
        }

        return playerRepository.fetchPlayerByNickname(sanitizedNickname)
    }
}