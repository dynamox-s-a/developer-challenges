package com.romulofer.kotlinMultiplatform.presentation.scoreboard

import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry

sealed interface ScoreboardUiState {
    data object Loading : ScoreboardUiState
    data object Empty : ScoreboardUiState
    data object Failed : ScoreboardUiState
    data class Content(val entries: List<ScoreboardEntry>) : ScoreboardUiState
}
