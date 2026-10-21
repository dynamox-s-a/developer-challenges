package com.romulofer.kotlinMultiplatform.ui

import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

internal class StorageSwitches {
    var failRegistering = false
    var failSaving = false
    var failReading = false
}

internal class FlakyPlayers(
    private val delegate: PlayerRepository,
    private val switches: StorageSwitches,
) : PlayerRepository {

    override suspend fun getOrCreate(name: String): Player {
        check(!switches.failRegistering) { "disk full" }
        return delegate.getOrCreate(name)
    }
}

internal class FlakyScores(
    private val delegate: ScoreRepository,
    private val switches: StorageSwitches,
) : ScoreRepository {

    override suspend fun save(playerId: Long, correct: Int, total: Int) {
        check(!switches.failSaving) { "disk full" }
        delegate.save(playerId, correct, total)
    }

    override fun observeScoreboard(): Flow<List<ScoreboardEntry>> =
        if (switches.failReading) flow { error("disk error") } else delegate.observeScoreboard()
}
