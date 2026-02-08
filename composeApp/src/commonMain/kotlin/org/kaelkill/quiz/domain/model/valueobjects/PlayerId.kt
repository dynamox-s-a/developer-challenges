package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

data class PlayerId(val value: String) {
    companion object {
        fun create(value: String): Result<PlayerId> {
            val result = value.trim()
            if (result.isBlank()) return Result.failure(IllegalArgumentException("Invalid player ID"))
            return Result.success(PlayerId(result))
        }

        @OptIn(ExperimentalUuidApi::class)
        fun generate(): PlayerId {
            return PlayerId(Uuid.random().toString())
        }
    }
}