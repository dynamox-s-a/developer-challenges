package org.kaelkill.quiz.infrastructure.repositories

import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository
import org.kaelkill.quiz.infrastructure.db.QuizDatabase

class SqlDelightPlayerRepository(
    private val database: QuizDatabase
) : PlayerRepository {

    private val queries = database.playerQueries

    override suspend fun save(player: Player): Result<Unit> {
        return runCatching {
            val scoresStr = player.scores.joinToString(",")
            queries.insert(player.id.value, player.name.value, scoresStr)
        }
    }

    override suspend fun getByName(name: PlayerName): Result<Player?> {
        return runCatching {
            queries.selectByName(name.value).executeAsOneOrNull()?.toDomain()
        }
    }

    override suspend fun getAll(): Result<List<Player>> {
        return runCatching {
            queries.selectAll().executeAsList().map { it.toDomain() }
        }
    }

    private fun org.kaelkill.quiz.infrastructure.db.PlayerEntity.toDomain(): Player {
        val scoresList = if (scores.isBlank()) emptyList()
            else scores.split(",").map { it.trim().toInt() }

        return Player(
            id = PlayerId.create(id).getOrThrow(),
            name = PlayerName.create(name).getOrThrow(),
            scores = scoresList
        )
    }
}
