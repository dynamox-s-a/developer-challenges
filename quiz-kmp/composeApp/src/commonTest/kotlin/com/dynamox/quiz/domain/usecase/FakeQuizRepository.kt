package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.Player
import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.domain.model.QuizScore
import com.dynamox.quiz.domain.repository.QuizRepository

/**
 * Implementação falsa (fake/stub) do QuizRepository para uso em testes.
 *
 * Padrão de teste: Test Double (especificamente um "Fake")
 * - Fake: implementação simplificada que funciona, mas não usa infra real
 * - Stub: retorna valores pré-definidos (o que fazemos aqui com os Results)
 * - Mock: verifica chamadas (faremos isso manualmente via listas)
 *
 */
open class FakeQuizRepository(
    private val questionResult: Result<Question> = Result.failure(NotImplementedError()),
    private val answerResult: Result<Boolean> = Result.failure(NotImplementedError()),
    private val playerResult: Result<Player> = Result.failure(NotImplementedError()),
    private val saveScoreResult: Result<Unit> = Result.success(Unit),
    private val leaderboardResult: Result<List<QuizScore>> = Result.success(emptyList()),
    private val playerScoresResult: Result<List<QuizScore>> = Result.success(emptyList())
) : QuizRepository {

    /**
     * Registro de chamadas para verificação nos testes.
     * Permite checar: "submitAnswer foi chamado com os parâmetros corretos?"
     * Cada Pair contém (questionId, answer) da chamada.
     */
    val submittedAnswers = mutableListOf<Pair<String, String>>()

    /**
     * Registro de pontuações salvas: (playerId, score, totalQuestions).
     * Permite checar se saveQuizScore foi chamado corretamente.
     */
    val savedScores = mutableListOf<Triple<Long, Int, Int>>()

    /** Retorna o resultado pré-configurado para perguntas */
    override suspend fun getQuestion(): Result<Question> = questionResult

    /** Registra a chamada e retorna o resultado pré-configurado */
    override suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean> {
        submittedAnswers.add(questionId to answer)
        return answerResult
    }

    /** Retorna o jogador pré-configurado — pode ser sobrescrito por subclasse */
    override suspend fun getOrCreatePlayer(name: String): Result<Player> = playerResult

    /** Registra a chamada e retorna o resultado pré-configurado */
    override suspend fun saveQuizScore(
        playerId: Long,
        playerName: String,
        score: Int,
        totalQuestions: Int
    ): Result<Unit> {
        savedScores.add(Triple(playerId, score, totalQuestions))
        return saveScoreResult
    }

    /** Retorna a lista de scores pré-configurada */
    override suspend fun getLeaderboard(): Result<List<QuizScore>> = leaderboardResult

    /** Retorna os scores do jogador pré-configurados */
    override suspend fun getPlayerScores(playerId: Long): Result<List<QuizScore>> = playerScoresResult
}
