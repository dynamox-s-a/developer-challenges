package com.andrebritovita.quizapp.ui.screens.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.andrebritovita.quizapp.domain.usecase.ObserveScoresUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class HistoryViewModel @Inject constructor(
    observeScoresUseCase: ObserveScoresUseCase
) : ViewModel() {

    val uiState: StateFlow<HistoryUiState> = observeScoresUseCase()
        .map { listaDoBanco ->
            HistoryUiState(isLoading = false, scores = listaDoBanco)
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = HistoryUiState(isLoading = true)
        )
}