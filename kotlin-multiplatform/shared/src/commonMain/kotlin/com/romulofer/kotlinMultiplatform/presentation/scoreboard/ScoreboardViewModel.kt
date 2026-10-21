package com.romulofer.kotlinMultiplatform.presentation.scoreboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Content
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Empty
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Failed
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Loading
import kotlinx.coroutines.flow.SharingStarted.Companion.WhileSubscribed
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

private const val SUBSCRIPTION_TIMEOUT_MILLIS = 5_000L

class ScoreboardViewModel(
    scoreRepository: ScoreRepository,
    private val navigator: Navigator,
) : ViewModel() {

    val state: StateFlow<ScoreboardUiState> = scoreRepository.observeScoreboard()
        .map<_, ScoreboardUiState> { entries -> if (entries.isEmpty()) Empty else Content(entries) }
        .catch { emit(Failed) }
        .stateIn(viewModelScope, WhileSubscribed(SUBSCRIPTION_TIMEOUT_MILLIS), Loading)

    fun onBack() = navigator.back()
}
