package com.dynamox.quiz.domain.repository

import com.dynamox.quiz.domain.model.Player
import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.domain.model.QuizScore

interface QuizRepository {
    suspend fun getQuestion(): Result<Question>

    suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean>

    suspend fun getOrCreatePlayer(name: String): Result<Player>

    suspend fun saveQuizScore(
        playerId: Long,
        playerName: String,
        score: Int,
        totalQuestions: Int
    ): Result<Unit>

    suspend fun getLeaderboard(): Result<List<QuizScore>>

    suspend fun getPlayerScores(playerId: Long): Result<List<QuizScore>>
}
