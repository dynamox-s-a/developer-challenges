package com.dynamox.quizchallenge.domain.usecase

import com.dynamox.quizchallenge.domain.repository.QuizRepository
import javax.inject.Inject

/** Submits the player's chosen answer for a question and reports whether it was correct. */
class SubmitAnswerUseCase @Inject constructor(
    private val quizRepository: QuizRepository,
) {
    suspend operator fun invoke(questionId: String, answer: String): Result<Boolean> =
        quizRepository.submitAnswer(questionId, answer)
}
