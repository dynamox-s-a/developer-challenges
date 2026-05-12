package com.abel.dynamoxquiz.data.remote

data class QuestionDto(
    val id: String,
    val statement: String,
    val options: List<String>
)