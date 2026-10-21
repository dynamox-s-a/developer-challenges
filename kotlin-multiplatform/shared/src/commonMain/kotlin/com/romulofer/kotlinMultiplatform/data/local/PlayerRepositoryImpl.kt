package com.romulofer.kotlinMultiplatform.data.local

import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class PlayerRepositoryImpl(
    private val database: QuizDatabase,
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default,
) : PlayerRepository {

    override suspend fun getOrCreate(name: String): Player = withContext(dispatcher) {
        database.transactionWithResult {
            database.playerQueries.insertIgnore(name)
            database.playerQueries.selectByName(name).executeAsOne()
                .let { Player(id = it.id, name = it.name) }
        }
    }
}
