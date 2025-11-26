package com.franckkumako.dynamoxquiz.data.remote.dto

import com.franckkumako.dynamoxquiz.domain.model.Question
import com.squareup.moshi.JsonClass
@JsonClass(generateAdapter = true)
data class QuestionDto(
    val id: String,
    val statement: String,
    val options: List<String>
) {

    fun toDomain(): Question {
        return Question(
            id = id,
            statement = statement,
            options = options
        )
    }
}
