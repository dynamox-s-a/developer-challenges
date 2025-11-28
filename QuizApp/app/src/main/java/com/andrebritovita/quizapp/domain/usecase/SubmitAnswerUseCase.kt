package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.domain.repository.QuizRepository
import javax.inject.Inject

/**
 * Envia a resposta selecionada para validação no servidor.
 * Retorna true se a resposta estiver correta.
 */
class SubmitAnswerUseCase @Inject constructor(
    private val repository: QuizRepository
) {
    suspend operator fun invoke (
        questionId: String,
        answer: String
    ): Result<Boolean> {
        return repository.submitAnswer(questionId, answer)
    }
}