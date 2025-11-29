package com.andrebritovita.quizapp.ui.screens.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.andrebritovita.quizapp.R
import com.andrebritovita.quizapp.domain.usecase.GetNewQuestionUseCase
import com.andrebritovita.quizapp.domain.usecase.SaveScoreUseCase
import com.andrebritovita.quizapp.domain.usecase.SubmitAnswerUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.io.IOException
import javax.inject.Inject

@HiltViewModel
class QuizViewModel @Inject constructor(
    private val getNewQuestionUseCase: GetNewQuestionUseCase,
    private val submitAnswerUseCase: SubmitAnswerUseCase,
    private val saveScoreUseCase: SaveScoreUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    init {
        loadNextQuestion()
    }

    private fun loadNextQuestion() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorResId = null) }

            val result = getNewQuestionUseCase()

            if (result.isSuccess) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        question = result.getOrNull(),
                        selectedOption = null,
                        isAnswerCorrect = null
                    )
                }
            } else {
                //val errorId = R.string.error_generic
                val errorId = if (result.exceptionOrNull() is IOException) {
                    R.string.error_network
                } else {
                    R.string.error_generic
                }
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorResId = errorId
                    )
                }
            }
        }
    }
}