package br.com.govanidebastiani.dynamoxquiz.quiz.presentation.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchAllQuizzesUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class HistoryScreenViewModel(
    private val fetchAllQuizzesUseCase: FetchAllQuizzesUseCase
): ViewModel() {
    private val _state = MutableStateFlow(HistoryScreenUIState())
    val state get() = _state.asStateFlow()

    init {
        viewModelScope.launch {
            _state.update {
                it.copy(quizzes = fetchAllQuizzesUseCase.invoke(), isLoading = false)
            }
        }
    }
}