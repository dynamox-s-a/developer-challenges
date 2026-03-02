package com.dynamox.quiz.presentation.screens.result

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dynamox.quiz.domain.model.QuizScore
import com.dynamox.quiz.domain.usecase.GetLeaderboardUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ResultUiState(
    val playerScores: List<QuizScore> = emptyList(),
    val isLoadingHistory: Boolean = false
)

 // getLeaderboard Use Case para buscar o ranking do banco local.
class ResultViewModel(
    private val getLeaderboard: GetLeaderboardUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(ResultUiState())
    val uiState: StateFlow<ResultUiState> = _uiState.asStateFlow()

    fun loadRecentScores() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingHistory = true) }
            getLeaderboard()
                .onSuccess { scores ->
                    _uiState.update {
                        it.copy(playerScores = scores.take(5), isLoadingHistory = false)
                    }
                }
                .onFailure {
                    _uiState.update { it.copy(isLoadingHistory = false) }
                }
        }
    }
}
