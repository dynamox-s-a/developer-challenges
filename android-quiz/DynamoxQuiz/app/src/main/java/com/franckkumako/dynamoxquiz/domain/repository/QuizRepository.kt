package com.franckkumako.dynamoxquiz.domain.repository

import com.franckkumako.dynamoxquiz.domain.model.AnswerResult
import com.franckkumako.dynamoxquiz.domain.model.Question
import com.franckkumako.dynamoxquiz.domain.model.Score
import kotlinx.coroutines.flow.Flow

interface QuizRepository {


    suspend fun getQuestion(): Question


    suspend fun submitAnswer(questionId: String, answer: String): AnswerResult


    suspend fun saveScore(playerName: String, score: Int)

    fun observeScores(): Flow<List<Score>>
}
