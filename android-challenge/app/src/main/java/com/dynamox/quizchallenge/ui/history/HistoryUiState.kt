package com.dynamox.quizchallenge.ui.history

import com.dynamox.quizchallenge.domain.model.PlayerScore

sealed interface HistoryUiState {
    data object Loading : HistoryUiState
    data object Empty : HistoryUiState
    data class Content(val scores: List<PlayerScore>) : HistoryUiState
}
