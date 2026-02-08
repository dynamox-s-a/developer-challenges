package org.kaelkill.quiz.domain.model.valueobjects

data class PlayerName(val value: String) {
    companion object {
        fun create(value: String): Result<PlayerName> {
            val result = value.trim()
            if (isInvalid(result)) {
                return Result.failure(IllegalArgumentException("Invalid player name"))
            }
            return Result.success(PlayerName(result))
        }

        private fun isInvalid(input: String): Boolean {
            return input.isBlank() || input.length < 2 || input.length > 50
        }
    }
}