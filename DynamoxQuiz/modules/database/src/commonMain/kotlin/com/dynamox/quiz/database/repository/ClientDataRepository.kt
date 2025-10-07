package com.dynamox.quiz.database.repository

import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserBestScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.models.User
import kotlinx.coroutines.flow.Flow
import kotlin.uuid.Uuid

interface ClientDataRepository {

    suspend fun loadUserEntity(id: Uuid): Result<UserEntity>

    suspend fun createUserEntity(user: UserEntity): Result<Unit>

    suspend fun updateUserEntity(user: UserEntity): Result<Unit>

    suspend fun loadUser(id: Uuid): Result<User>

    suspend fun deleteUser(id: Uuid): Result<Unit>

    suspend fun emailIsAvailable(email: String): Result<Boolean>

    suspend fun saveQuizScore(score: QuizScore): Result<Unit>

    suspend fun loadTopQuizScores(): Result<List<QuizScore>>

    suspend fun observeTopQuizScores(): Flow<List<UserBestScore>>

    suspend fun loadUserBestScore(userId: Uuid): Result<UserBestScore>

    suspend fun loadUserQuizScores(userId: Uuid): Result<List<QuizScore>>

    suspend fun observeUserQuizScores(userId: Uuid): Flow<List<QuizScore>>

    suspend fun deleteQuizScore(id: Uuid): Result<Unit>

    suspend fun loadQuizScore(id: Uuid): Result<QuizScore>
}