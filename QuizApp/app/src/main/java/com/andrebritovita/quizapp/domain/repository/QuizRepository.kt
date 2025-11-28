package com.andrebritovita.quizapp.domain.repository


import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import com.andrebritovita.quizapp.domain.model.Question
import kotlinx.coroutines.flow.Flow
import kotlin.Result

interface QuizRepository {
    suspend fun getQuestion(): Result<Question>
    suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean>
    suspend fun saveScore(name: String, score: Int)
    fun observeScores(): Flow<List<ScoreEntity>>
}