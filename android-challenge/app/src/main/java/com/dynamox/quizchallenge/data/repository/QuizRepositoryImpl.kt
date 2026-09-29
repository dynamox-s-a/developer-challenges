package com.dynamox.quizchallenge.data.repository

import com.dynamox.quizchallenge.data.remote.QuizApi
import com.dynamox.quizchallenge.data.remote.dto.AnswerRequestDto
import com.dynamox.quizchallenge.data.remote.dto.toDomain
import com.dynamox.quizchallenge.data.remote.safeApiCall
import com.dynamox.quizchallenge.domain.model.AppError
import com.dynamox.quizchallenge.domain.model.Question
import com.dynamox.quizchallenge.domain.repository.QuizRepository
import javax.inject.Inject

private const val MIN_OPTIONS = 2

class QuizRepositoryImpl @Inject constructor(
    private val api: QuizApi,
) : QuizRepository {

    override suspend fun fetchQuestion(): Result<Question> = safeApiCall {
        api.getQuestion().toDomain()
    }.mapCatching { question -> question.requireValidOptions() }

    override suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean> =
        safeApiCall {
            api.submitAnswer(questionId, AnswerRequestDto(answer)).result
        }

    /**
     * Guards against a structurally valid but unusable response (e.g. an empty or single-option
     * `options` list), which would otherwise render a question the player can never answer,
     * silently soft-locking the quiz screen instead of surfacing a visible, retryable error.
     */
    private fun Question.requireValidOptions(): Question {
        if (options.size < MIN_OPTIONS) {
            throw AppError.Unknown("Question '$id' returned ${options.size} option(s), expected at least $MIN_OPTIONS")
        }
        return this
    }
}
