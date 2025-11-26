package com.franckkumako.dynamoxquiz.domain.usecase

import com.franckkumako.dynamoxquiz.domain.model.Question
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository

class GetQuestionUseCase(
    private val repository: QuizRepository
) {

    suspend operator fun invoke(): Question = repository.getQuestion()
}
