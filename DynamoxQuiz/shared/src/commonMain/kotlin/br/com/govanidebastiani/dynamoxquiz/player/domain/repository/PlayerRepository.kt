package br.com.govanidebastiani.dynamoxquiz.player.domain.repository

import br.com.govanidebastiani.dynamoxquiz.player.domain.Player

interface PlayerRepository {
    suspend fun createPlayer(player: Player)

    suspend fun fetchPlayerByNickname(playerNickname: String): String?
}