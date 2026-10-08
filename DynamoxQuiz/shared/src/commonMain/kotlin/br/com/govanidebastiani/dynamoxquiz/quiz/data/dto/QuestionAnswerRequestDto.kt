package br.com.govanidebastiani.dynamoxquiz.quiz.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class QuestionAnswerRequestDto(
    @SerialName("answer") val answer: String
)