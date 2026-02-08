package org.kaelkill.quiz.domain.model.valueobjects

data class AnswerOption(val value: String) {
    companion object {
        fun create (value: String): Result<AnswerOption> {
            if (value.isBlank()) {
                return Result.failure(IllegalArgumentException("Invalid answer option"))
            }
            return Result.success(AnswerOption(value.trim()))
        }
    }
}