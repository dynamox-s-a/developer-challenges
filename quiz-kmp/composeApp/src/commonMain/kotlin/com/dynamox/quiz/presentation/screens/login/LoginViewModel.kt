package com.dynamox.quiz.presentation.screens.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dynamox.quiz.domain.model.Player
import com.dynamox.quiz.domain.usecase.GetOrCreatePlayerUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Data class imutável que representa um "snapshot" do estado da tela em um dado momento.
 */
data class LoginUiState(
    val playerName: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val player: Player? = null
)

// getOrCreatePlayer Use Case injetado pelo Koin para registrar jogadores.
class LoginViewModel(
    private val getOrCreatePlayer: GetOrCreatePlayerUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onNameChanged(name: String) {
        _uiState.update { it.copy(playerName = name, error = null) }
    }

    fun onStartQuiz() {
        val name = _uiState.value.playerName.trim()
        if (name.isBlank()) {
            _uiState.update { it.copy(error = "Por favor, insira seu nome ou apelido") }
            return
        }

        // 'launch' inicia uma coroutine assíncrona no viewModelScope
        // Não bloqueia a thread principal enquanto aguarda o banco de dados
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            getOrCreatePlayer(name)
                .onSuccess { player ->
                    // Sucesso: preenche 'player' > a tela vai detectar e navegar
                    _uiState.update { it.copy(isLoading = false, player = player) }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = error.message ?: "Falha ao iniciar. Tente novamente."
                        )
                    }
                }
        }
    }

    fun onNavigated() {
        _uiState.update { it.copy(player = null) }
    }

    fun onErrorDismissed() {
        _uiState.update { it.copy(error = null) }
    }

    fun resetState() {
        _uiState.update { LoginUiState() }
    }
}
