package com.dynamox.quizchallenge.domain.usecase

import com.dynamox.quizchallenge.domain.model.Question
import com.dynamox.quizchallenge.domain.repository.QuizRepository
import javax.inject.Inject

/**
 * Fetches the next question for a quiz session, avoiding immediate repeats when possible.
 *
 * The public quiz API returns a random question on every call and never excludes questions
 * that were already served, so within a single 10-question run the same question could be
 * returned twice. This use case retries a few times when that happens; if the question pool
 * turns out to be too small to avoid a repeat, it falls back to whatever the server last
 * returned instead of leaving the user stuck in a retry loop.
 */
class GetUniqueQuestionUseCase @Inject constructor(
    private val quizRepository: QuizRepository,
) {
    suspend operator fun invoke(seenQuestionIds: Set<String>): Result<Question> {
        var lastResult = quizRepository.fetchQuestion()
        repeat(MAX_ATTEMPTS - 1) {
            val question = lastResult.getOrNull()
            val isFailure = lastResult.isFailure
            if (isFailure || question == null || question.id !in seenQuestionIds) {
                return lastResult
            }
            lastResult = quizRepository.fetchQuestion()
        }
        return lastResult
    }

    private companion object {
        const val MAX_ATTEMPTS = 5
    }
}
