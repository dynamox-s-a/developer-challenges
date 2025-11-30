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

/**
 * ViewModel da tela de histórico de pontuações.
 *
 * Responsável por:
 * - Observar continuamente as pontuações salvas no banco local através do [ObserveScoresUseCase].
 * - Transformar o fluxo de dados em um [StateFlow] de [HistoryUiState] utilizado pela UI.
 *
 * A ViewModel não armazena estado próprio; apenas repassa os valores emitidos pelo caso de uso,
 * mantendo a tela sempre atualizada conforme novos jogos são registrados.
 */
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