package br.com.govanidebastiani.dynamoxquiz.player.data

import br.com.govanidebastiani.dynamoxquiz.player.domain.Player
import br.com.govanidebastiani.dynamoxquiz.player.domain.repository.PlayerRepository

class FakePlayerRepositoryImpl : PlayerRepository{
    val savedPlayers = mutableListOf<Player>()

    override suspend fun createPlayer(player: Player) {
        savedPlayers.add(player)
    }

    override suspend fun fetchPlayerByNickname(playerNickname: String): String? {
        return savedPlayers.firstOrNull { player ->
            player.nickname == playerNickname
        }?.nickname
    }
}