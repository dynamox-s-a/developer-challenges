package com.dynamox.quizchallenge.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dynamox.quizchallenge.domain.usecase.ObserveScoreHistoryUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class HistoryViewModel @Inject constructor(
    observeScoreHistory: ObserveScoreHistoryUseCase,
) : ViewModel() {

    val uiState: StateFlow<HistoryUiState> = observeScoreHistory()
        .map { scores -> if (scores.isEmpty()) HistoryUiState.Empty else HistoryUiState.Content(scores) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(STOP_TIMEOUT_MILLIS),
            initialValue = HistoryUiState.Loading,
        )

    private companion object {
        const val STOP_TIMEOUT_MILLIS = 5_000L
    }
}
