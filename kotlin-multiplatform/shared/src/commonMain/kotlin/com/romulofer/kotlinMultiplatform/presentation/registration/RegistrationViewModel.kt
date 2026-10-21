package com.romulofer.kotlinMultiplatform.presentation.registration

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.Invalid
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.Registered
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.StorageFailure
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class RegistrationViewModel(
    private val registerPlayer: RegisterPlayerUseCase,
    private val navigator: Navigator,
) : ViewModel() {

    private val _state = MutableStateFlow(RegistrationUiState())
    val state: StateFlow<RegistrationUiState> = _state.asStateFlow()

    fun onNameChange(name: String) {
        _state.update { it.copy(name = name, nameError = null, storageFailed = false) }
    }

    fun onStart() {
        if (_state.value.isLoading) return
        _state.update { it.copy(isLoading = true, nameError = null, storageFailed = false) }
        viewModelScope.launch {
            when (val result = registerPlayer(_state.value.name)) {
                is Registered -> {
                    _state.update { it.copy(isLoading = false) }
                    navigator.startQuiz(result.player)
                }
                is Invalid -> _state.update { it.copy(isLoading = false, nameError = result.reason) }
                StorageFailure -> _state.update { it.copy(isLoading = false, storageFailed = true) }
            }
        }
    }

    fun onScoreboardClick() = navigator.showScoreboard()

    fun onSettingsClick() = navigator.showSettings()
}
