package br.com.govanidebastiani.dynamoxquiz.quiz.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class QuestionDto(
    @SerialName("id") val id: String,
    @SerialName("statement") val statement: String,
    @SerialName("options") val options: List<String>
)