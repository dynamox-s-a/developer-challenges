package com.franckkumako.dynamoxquiz.domain.usecase

import com.franckkumako.dynamoxquiz.domain.model.AnswerResult
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository

class SubmitAnswerUseCase(
    private val repository: QuizRepository
) {

    suspend operator fun invoke(questionId: String, answer: String): AnswerResult {
        return repository.submitAnswer(questionId, answer)
    }
}
