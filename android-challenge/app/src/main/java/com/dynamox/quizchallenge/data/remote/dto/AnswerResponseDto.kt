package com.dynamox.quizchallenge.data.remote.dto

import kotlinx.serialization.Serializable

/** Response of `POST /answer?questionId=$id`. */
@Serializable
data class AnswerResponseDto(val result: Boolean)
