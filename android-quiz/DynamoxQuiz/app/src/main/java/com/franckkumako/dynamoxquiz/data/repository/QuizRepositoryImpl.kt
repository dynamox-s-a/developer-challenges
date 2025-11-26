package com.franckkumako.dynamoxquiz.data.repository

import com.franckkumako.dynamoxquiz.data.local.PlayerEntity
import com.franckkumako.dynamoxquiz.data.local.QuizDao
import com.franckkumako.dynamoxquiz.data.local.ScoreEntity
import com.franckkumako.dynamoxquiz.data.remote.AnswerBody
import com.franckkumako.dynamoxquiz.data.remote.QuizApi
import com.franckkumako.dynamoxquiz.domain.model.AnswerResult
import com.franckkumako.dynamoxquiz.domain.model.Question
import com.franckkumako.dynamoxquiz.domain.model.Score
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class QuizRepositoryImpl(
    private val api: QuizApi,
    private val dao: QuizDao
) : QuizRepository {

    override suspend fun getQuestion(): Question {

        return api.getQuestion().toDomain()
    }

    override suspend fun submitAnswer(questionId: String, answer: String): AnswerResult {
        val dto = api.submitAnswer(
            questionId = questionId,
            body = AnswerBody(answer = answer)
        )
        return dto.toDomain()
    }

    override suspend fun saveScore(playerName: String, score: Int) {

        dao.insertPlayer(PlayerEntity(name = playerName))

        val entity = ScoreEntity(
            playerName = playerName,
            score = score,
            createdAt = System.currentTimeMillis()
        )
        dao.insertScore(entity)
    }

    override fun observeScores(): Flow<List<Score>> {
        return dao.observeScores().map { list ->
            list.map {
                Score(
                    id = it.id,
                    playerName = it.playerName,
                    score = it.score,
                    createdAt = it.createdAt
                )
            }
        }
    }
}
