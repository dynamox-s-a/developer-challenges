package org.kaelkill.quiz.domain.model.valueobjects
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@ConsistentCopyVisibility
data class QuizSessionId private constructor(val value: String) {
    companion object {
        fun create(value: String): Result<QuizSessionId> {
            if (value.isBlank()) return Result.failure(IllegalArgumentException("QuizSessionId cannot be empty"))

            return Result.success(QuizSessionId(value))
        }

        @OptIn(ExperimentalUuidApi::class)
        fun generate(): QuizSessionId {
            return QuizSessionId(Uuid.random().toString())
        }
    }
}