package br.com.govanidebastiani.dynamoxquiz.quiz.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class QuestionAnswerResponseDto(
    @SerialName("result") val isCorrect: Boolean
)