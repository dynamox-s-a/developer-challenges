package com.romulofer.kotlinMultiplatform.domain.model

data class Question(
    val id: String,
    val statement: String,
    val options: List<String>
)
