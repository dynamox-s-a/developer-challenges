package br.com.govanidebastiani.dynamoxquiz.player.presentation

import org.jetbrains.compose.resources.StringResource

data class PlayerUIState(
    val playerNickname: String = "",
    val isStartQuiz: Boolean = false,
    val errorMessage: StringResource? = null
)