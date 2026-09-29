package com.dynamox.quizchallenge.data.remote.dto

import kotlinx.serialization.Serializable

/** Body of `POST /answer?questionId=$id`. */
@Serializable
data class AnswerRequestDto(val answer: String)
