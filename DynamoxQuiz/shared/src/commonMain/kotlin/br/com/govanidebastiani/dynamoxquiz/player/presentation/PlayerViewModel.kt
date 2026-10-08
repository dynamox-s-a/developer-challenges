package br.com.govanidebastiani.dynamoxquiz.player.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.toStringResource
import br.com.govanidebastiani.dynamoxquiz.player.domain.usecase.CreatePlayerUseCase
import br.com.govanidebastiani.dynamoxquiz.player.domain.usecase.FetchPlayerByNicknameUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class PlayerViewModel(
    private val createPlayerUseCase: CreatePlayerUseCase,
    private val fetchPlayerByNicknameUseCase: FetchPlayerByNicknameUseCase
): ViewModel() {
    private val _state = MutableStateFlow(PlayerUIState())
    val state get() = _state.asStateFlow()

    fun onNicknameChanged(nickname: String) {
        _state.update {
            it.copy(playerNickname = nickname)
        }
    }

    fun onStartQuizClick() = viewModelScope.launch {
        val nickname = _state.value.playerNickname
        val playerExists = fetchPlayerByNicknameUseCase.invoke(nickname) != null

        if (playerExists) {
            _state.update {
                it.copy(isStartQuiz = true)
            }
            return@launch
        }

        val result = createPlayerUseCase.invoke(nickname)

        _state.update {
            if (result.isSuccess) {
                it.copy(isStartQuiz = true)
            } else {
                it.copy(
                    isStartQuiz = false,
                    errorMessage = DataError.Local.UNKNOWN.toStringResource()
                )
            }
        }
    }


    fun onNavigationToQuizFinished() {
        _state.update { it.copy(isStartQuiz = false) }
    }
}