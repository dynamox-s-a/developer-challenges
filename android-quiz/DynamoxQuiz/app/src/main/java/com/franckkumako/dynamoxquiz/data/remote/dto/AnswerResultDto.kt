package com.franckkumako.dynamoxquiz.data.remote.dto

import com.franckkumako.dynamoxquiz.domain.model.AnswerResult

data class AnswerResultDto(
    val result: Boolean
) {

    fun toDomain(): AnswerResult = AnswerResult(isCorrect = result)
}
