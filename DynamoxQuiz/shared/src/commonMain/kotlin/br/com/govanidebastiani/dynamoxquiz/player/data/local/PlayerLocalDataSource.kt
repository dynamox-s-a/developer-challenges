package br.com.govanidebastiani.dynamoxquiz.player.data.local

import br.com.geovanidebastiani.dynamoxquiz.db.PlayerQueries
import br.com.govanidebastiani.dynamoxquiz.player.domain.Player

internal class PlayerLocalDataSource(
    private val playerQueries: PlayerQueries
) {

    suspend fun createPlayer(player: Player) {
        playerQueries.insertPlayer(player.nickname)
    }

    suspend fun fetchPlayerByNickname(playerNickname: String): String? {
        return playerQueries.fetchPlayerByNickname(playerNickname).executeAsOneOrNull()
    }
}