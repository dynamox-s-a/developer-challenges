package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.AppError
import com.dynamox.quiz.domain.model.Player
import com.dynamox.quiz.domain.repository.QuizRepository

/**
 * Registrar ou recuperar um jogador pelo nome
 *
 * Implementa o padrão "Get or Create" (upsert simplificado)
 * - Se o nome já existe no banco > retorna o jogador existente
 * - Se o nome é novo > cria e retorna o novo jogador
 *
 */
class GetOrCreatePlayerUseCase(private val repository: QuizRepository) {

    suspend operator fun invoke(name: String): Result<Player> {
        val trimmedName = name.trim()

        if (trimmedName.isBlank()) {
            return Result.failure(AppError.ValidationError("O nome não pode ser vazio"))
        }

        if (trimmedName.length > 30) {
            return Result.failure(AppError.ValidationError("O nome não pode possuir mais de 30 caracteres"))
        }

        return repository.getOrCreatePlayer(trimmedName)
    }
}
