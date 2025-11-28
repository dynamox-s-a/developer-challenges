package com.andrebritovita.quizapp.domain.repository


import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import com.andrebritovita.quizapp.domain.model.Question
import kotlinx.coroutines.flow.Flow
import kotlin.Result

/**
 * Contrato principal da camada de domínio para manipulação de dados do Quiz.
 *
 * Une operações locais (Room) e remotas (API), oferecendo uma interface
 * única para os casos de uso.
 *
 * Papel na arquitetura:
 * - Evita que os UseCases dependam de Retrofit ou Room.
 * - Centraliza regras de negócio relacionadas a dados.
 */
interface QuizRepository {
    suspend fun getQuestion(): Result<Question>
    suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean>
    suspend fun saveScore(name: String, score: Int)
    fun observeScores(): Flow<List<ScoreEntity>>
}