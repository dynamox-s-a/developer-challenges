package br.com.govanidebastiani.dynamoxquiz.quiz.presentation.finalscore

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import br.com.govanidebastiani.dynamoxquiz.app.Route
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchQuizByIdUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class FinalScoreViewModel(
    savedStateHandle: SavedStateHandle,
    private val fetchQuizByIdUseCase: FetchQuizByIdUseCase
): ViewModel() {
    val quizId = savedStateHandle.toRoute<Route.FinalScore>().quizId
    val ignoreIds = savedStateHandle.toRoute<Route.FinalScore>().ignoreIds

    private val _state = MutableStateFlow(FinalScoreUIState())
    val state get() = _state.asStateFlow()

    init {
        viewModelScope.launch {
            val quiz = fetchQuizByIdUseCase.invoke(quizId)
            _state.update {
                it.copy(
                    isLoading = false,
                    quiz = quiz,
                    ignoreIds = ignoreIds
                )
            }
        }
    }
}