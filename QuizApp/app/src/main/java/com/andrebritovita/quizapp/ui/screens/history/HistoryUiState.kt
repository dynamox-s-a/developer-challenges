package com.andrebritovita.quizapp.ui.screens.history

import com.andrebritovita.quizapp.data.local.entity.ScoreEntity

data class HistoryUiState(
    val isLoading: Boolean = true,
    val scores: List<ScoreEntity> = emptyList()
)