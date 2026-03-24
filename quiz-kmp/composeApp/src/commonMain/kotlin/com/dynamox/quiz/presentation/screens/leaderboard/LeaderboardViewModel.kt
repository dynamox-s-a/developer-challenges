package com.dynamox.quiz.presentation.screens.leaderboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dynamox.quiz.domain.model.QuizScore
import com.dynamox.quiz.domain.usecase.GetLeaderboardUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

sealed class LeaderboardState {
    data object Loading : LeaderboardState()
    data class Success(val scores: List<QuizScore>) : LeaderboardState()
    data class Empty(val message: String = "Nenhuma pontuação ainda. Seja o primeiro!") : LeaderboardState()
    data class Error(val message: String) : LeaderboardState()
}

// Carrega o ranking de pontuações do banco local assim que é criado (no init{}) e expõe o estado como StateFlow para a View
class LeaderboardViewModel(
    private val getLeaderboard: GetLeaderboardUseCase
) : ViewModel() {
    private val _state = MutableStateFlow<LeaderboardState>(LeaderboardState.Loading)

    val state: StateFlow<LeaderboardState> = _state.asStateFlow()
    init {
        loadLeaderboard()
    }

    fun loadLeaderboard() {
        viewModelScope.launch {
            _state.update { LeaderboardState.Loading }
            getLeaderboard()
                .onSuccess { scores ->
                    _state.update {
                        if (scores.isEmpty()) LeaderboardState.Empty()
                        else LeaderboardState.Success(scores)
                    }
                }
                .onFailure { error ->
                    _state.update {
                        LeaderboardState.Error(error.message ?: "Falha ao carregar a classificação")
                    }
                }
        }
    }
}
