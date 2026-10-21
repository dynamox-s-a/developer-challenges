package com.romulofer.kotlinMultiplatform.presentation.navigation

import com.romulofer.kotlinMultiplatform.domain.model.Player

sealed interface Screen {
    data object Registration : Screen
    data class Quiz(val player: Player, val runId: Int) : Screen
    data object Scoreboard : Screen
    data object Settings : Screen
}
