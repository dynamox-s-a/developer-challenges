package com.dynamox.quiz.data.repository

import co.touchlab.kermit.Logger
import com.dynamox.quiz.data.api.QuizApiService
import com.dynamox.quiz.database.QuizDatabase
import com.dynamox.quiz.domain.model.AppError
import com.dynamox.quiz.domain.model.Player
import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.domain.model.QuizScore
import com.dynamox.quiz.domain.repository.QuizRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.datetime.Clock

class QuizRepositoryImpl(
    private val apiService: QuizApiService,
    private val database: QuizDatabase
) : QuizRepository {

    private val logger = Logger.withTag("QuizRepository")

    override suspend fun getQuestion(): Result<Question> = withContext(Dispatchers.IO) {
        runCatching {
            val dto = apiService.getQuestion()
            // Mapeia DTO > modelo de domínio (separação de responsabilidades)
            Question(id = dto.id, statement = dto.statement, options = dto.options)
        }.mapNetworkError()
    }

    override suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean> =
        withContext(Dispatchers.IO) {
            runCatching {
                val dto = apiService.submitAnswer(questionId, answer)
                dto.result
            }.mapNetworkError()
        }

    override suspend fun getOrCreatePlayer(name: String): Result<Player> =
        withContext(Dispatchers.IO) {
            runCatching {
                val existing = database.playerQueries.getPlayerByName(name).executeAsOneOrNull()
                if (existing != null) {
                    // Jogador já existe: retorna sem criar duplicata
                    Player(id = existing.id, name = existing.name)
                } else {
                    // Novo jogador: insere e busca o ID gerado
                    database.playerQueries.insertPlayer(name)
                    val newId = database.playerQueries.lastInsertRowId().executeAsOne()
                    Player(id = newId, name = name)
                }
            }
        }

    override suspend fun saveQuizScore(
        playerId: Long,
        playerName: String,
        score: Int,
        totalQuestions: Int
    ): Result<Unit> = withContext(Dispatchers.IO) {
        runCatching {
            val timestamp = Clock.System.now().toString()
            database.quizScoreQueries.insertScore(
                player_id = playerId,
                player_name = playerName,
                score = score.toLong(),
                total_questions = totalQuestions.toLong(),
                created_at = timestamp
            )
        }
    }

    override suspend fun getLeaderboard(): Result<List<QuizScore>> =
        withContext(Dispatchers.IO) {
            runCatching {
                database.quizScoreQueries.getTopScores().executeAsList().map { row ->
                    QuizScore(
                        id = row.id,
                        playerId = row.player_id,
                        playerName = row.player_name,
                        score = row.score.toInt(),
                        totalQuestions = row.total_questions.toInt(),
                        createdAt = row.created_at
                    )
                }
            }
        }

    override suspend fun getPlayerScores(playerId: Long): Result<List<QuizScore>> =
        withContext(Dispatchers.IO) {
            runCatching {
                database.quizScoreQueries.getScoresByPlayerId(playerId).executeAsList().map { row ->
                    QuizScore(
                        id = row.id,
                        playerId = row.player_id,
                        playerName = row.player_name,
                        score = row.score.toInt(),
                        totalQuestions = row.total_questions.toInt(),
                        createdAt = row.created_at
                    )
                }
            }
        }


     /** Extensão de Result<T> que converte exceções genéricas em AppError.NetworkError.
      * Isso garante que as camadas superiores (Use Cases, ViewModels) sempre recebam um AppError, nunca uma exceção inesperada */

    private fun <T> Result<T>.mapNetworkError(): Result<T> = this.recoverCatching { error ->
        logger.e { error.message ?: "Unknown" }
        when (error) {
            is AppError -> throw error
            else -> {
                val isTimeout = error.message?.contains("timeout", ignoreCase = true) == true ||
                        error.message?.contains("timed out", ignoreCase = true) == true
                if (isTimeout) {
                    throw AppError.NetworkError(
                        "Não foi possível obter o Quiz. Verifique sua conexão e tente novamente."
                    )
                } else {
                    throw AppError.NetworkError(
                        error.message ?: "Erro de conexão. Tente novamente."
                    )
                }
            }
        }
    }
}
