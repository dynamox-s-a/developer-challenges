package org.kaelkill.quiz.domain.model.valueobjects

data class QuestionStatement (val value: String) {
    companion object {
        fun create(value: String): Result<QuestionStatement> {
            if (value.isBlank()) {
                return Result.failure(IllegalArgumentException("QuestionStatement cannot be empty"))
            }
            return Result.success(QuestionStatement(value.trim()))
        }
    }
}