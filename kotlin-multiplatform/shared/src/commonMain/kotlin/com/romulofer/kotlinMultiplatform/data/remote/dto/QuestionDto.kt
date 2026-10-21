package com.romulofer.kotlinMultiplatform.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
internal data class QuestionDto(
    val id: String,
    val statement: String,
    val options: List<String>
)
