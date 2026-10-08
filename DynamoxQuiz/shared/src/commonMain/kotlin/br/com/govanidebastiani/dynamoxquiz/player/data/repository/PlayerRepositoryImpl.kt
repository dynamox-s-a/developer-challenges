package br.com.govanidebastiani.dynamoxquiz.player.data.repository

import br.com.govanidebastiani.dynamoxquiz.player.data.local.PlayerLocalDataSource
import br.com.govanidebastiani.dynamoxquiz.player.domain.Player
import br.com.govanidebastiani.dynamoxquiz.player.domain.repository.PlayerRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.withContext

internal class PlayerRepositoryImpl(
    private val playerDataSource: PlayerLocalDataSource
): PlayerRepository {
    override suspend fun createPlayer(player: Player) = withContext(Dispatchers.IO) {
        playerDataSource.createPlayer(player)
    }

    override suspend fun fetchPlayerByNickname(playerNickname: String): String? = withContext(Dispatchers.IO) {
        return@withContext playerDataSource.fetchPlayerByNickname(playerNickname)
    }
}