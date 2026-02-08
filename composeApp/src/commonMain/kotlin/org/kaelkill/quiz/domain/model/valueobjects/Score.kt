package org.kaelkill.quiz.domain.model.valueobjects

data class Score(val value: Int) {
    companion object {
        fun create(value: Int): Result<Score> {

            return if (value < 0) {
                Result.failure(IllegalArgumentException("Score cannot be negative"))
            } else {
                Result.success(Score(value))
            }
        }
        fun zero(): Score = Score(0)
    }

    fun increment(): Score {
        return Score(value + 1)
    }
}