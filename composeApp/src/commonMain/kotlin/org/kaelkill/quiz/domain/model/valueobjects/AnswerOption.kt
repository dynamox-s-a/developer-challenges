package org.kaelkill.quiz.domain.model.valueobjects

data class AnswerOption(val value: String) {
    companion object {
        fun create (value: String): Result<AnswerOption> {
            if (value.isBlank()) {
                return Result.failure(IllegalArgumentException("AnswerOption cannot be empty"))
            }
            return Result.success(AnswerOption(value.trim()))
        }
    }
}