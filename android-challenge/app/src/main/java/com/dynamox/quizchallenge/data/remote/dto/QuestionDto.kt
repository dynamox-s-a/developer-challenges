package com.dynamox.quizchallenge.data.remote.dto

import com.dynamox.quizchallenge.domain.model.Question
import kotlinx.serialization.Serializable

@Serializable
data class QuestionDto(
    val id: String,
    val statement: String,
    val options: List<String>,
)

fun QuestionDto.toDomain(): Question = Question(id = id, statement = statement, options = options)
