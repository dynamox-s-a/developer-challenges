package com.andrebritovita.quizapp.data.repository

import com.andrebritovita.quizapp.data.local.LocalDataSource
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import com.andrebritovita.quizapp.data.remote.RemoteDataSource
import com.andrebritovita.quizapp.data.remote.dto.toDomainQuestion
import com.andrebritovita.quizapp.domain.model.Question
import com.andrebritovita.quizapp.domain.repository.QuizRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import javax.inject.Inject

/**
 * Implementação do QuizRepository.
 *
 * Combina RemoteDataSource e LocalDataSource para fornecer dados ao domínio.
 *
 * Responsabilidades:
 * - Converter DTOs em modelos de domínio.
 * - Tratar exceções e retornar Result<...>.
 * - Encapsular acesso ao banco e à API.
 *
 * Nenhuma camada acima precisa conhecer Retrofit, Room, DAOs ou DTOs.
 */
class QuizRepositoryImpl @Inject constructor(
    private val remote: RemoteDataSource,
    private val local: LocalDataSource
) : QuizRepository {

    override suspend fun getQuestion(): Result<Question> = withContext(Dispatchers.IO) {
        try {
            val dtoResult = remote.getQuestion()
            val mapperDtoToDomain = dtoResult.toDomainQuestion()
            Result.success(mapperDtoToDomain)
        } catch (t: Throwable) {
            Result.failure(t)
        }
    }


    override suspend fun submitAnswer(
        questionId: String,
        answer: String
    ): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val resp = remote.submitAnswer(questionId, answer)
            Result.success(resp.result)
        } catch (t: Throwable) {
            Result.failure(t)
        }
    }


    override suspend fun saveScore(name: String, score: Int) {
        val entity = ScoreEntity(
            name = name,
            score = score,
            gameDate = System.currentTimeMillis()
        )
        try {
            local.insertScore(entity)
        } catch (e: Exception) {
            e.printStackTrace()
        }

    }

    override fun observeScores(): Flow<List<ScoreEntity>> {
        return local.getAllScores()
    }
}