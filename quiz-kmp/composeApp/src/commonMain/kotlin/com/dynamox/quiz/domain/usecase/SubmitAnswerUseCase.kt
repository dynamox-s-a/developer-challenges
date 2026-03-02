package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.AppError
import com.dynamox.quiz.domain.repository.QuizRepository

/** Responsável por validar e enviar a resposta do usuário */
class SubmitAnswerUseCase(private val repository: QuizRepository) {
    suspend operator fun invoke(questionId: String, answer: String): Result<Boolean> {
        // Regra de negócio: não permite submeter resposta vazia ou só com espaços
        if (answer.isBlank()) {
            return Result.failure(AppError.ValidationError("Answer cannot be empty"))
        }
        return repository.submitAnswer(questionId, answer)
    }
}
