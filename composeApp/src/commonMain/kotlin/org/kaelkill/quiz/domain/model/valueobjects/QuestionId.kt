package org.kaelkill.quiz.domain.model.valueobjects

data class QuestionId(val value: String) {
    companion object {
        fun create(value: String): Result<QuestionId> {
            if (value.isBlank()) return Result.failure(IllegalArgumentException("QuestionId cannot be empty"))

            return Result.success(QuestionId(value.trim()))
        }
    }
}