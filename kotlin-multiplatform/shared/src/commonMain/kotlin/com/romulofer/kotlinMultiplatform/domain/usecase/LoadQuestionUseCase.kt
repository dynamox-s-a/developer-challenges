package com.romulofer.kotlinMultiplatform.domain.usecase

import com.romulofer.kotlinMultiplatform.domain.model.DataResult
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Success
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository

class LoadQuestionUseCase(private val quiz: QuizRepository) {

    suspend operator fun invoke(seenIds: Set<String>): DataResult<Question> {
        var result = quiz.getQuestion()
        var attempts = 1
        while (result is Success && result.value.id in seenIds && attempts < MAX_ATTEMPTS) {
            result = quiz.getQuestion()
            attempts++
        }
        return result
    }

    companion object {
        const val MAX_ATTEMPTS = 5
    }
}
