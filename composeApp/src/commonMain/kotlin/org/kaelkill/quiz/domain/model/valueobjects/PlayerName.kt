package org.kaelkill.quiz.domain.model.valueobjects

data class PlayerName private constructor(val value: String) {
    companion object {
        fun create(input: String): Result<PlayerName> {
            val result = input.trim()
           return Result.success(PlayerName(result))
        }
    }
}