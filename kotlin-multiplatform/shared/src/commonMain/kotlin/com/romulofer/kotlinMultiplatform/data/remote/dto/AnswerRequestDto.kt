package com.romulofer.kotlinMultiplatform.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
internal data class AnswerRequestDto(
    val answer: String
)
