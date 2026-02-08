package org.kaelkill.quiz.domain.model.valueobjects

data class QuestionId(val value: String) {
    companion object {
        fun create(value: String): Result<QuestionId> {
            if (value.isBlank()) return Result.failure(IllegalArgumentException("Invalid question id"))

            return Result.success(QuestionId(value.trim()))
        }
    }
}