package com.andrebritovita.quizapp.ui.screens.quiz

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.andrebritovita.quizapp.R
import com.andrebritovita.quizapp.domain.usecase.GetNewQuestionUseCase
import com.andrebritovita.quizapp.domain.usecase.SaveScoreUseCase
import com.andrebritovita.quizapp.domain.usecase.SubmitAnswerUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.io.IOException
import javax.inject.Inject

@HiltViewModel
class QuizViewModel @Inject constructor(
    private val savedStateHandle: SavedStateHandle,
    private val getNewQuestionUseCase: GetNewQuestionUseCase,
    private val submitAnswerUseCase: SubmitAnswerUseCase,
    private val saveScoreUseCase: SaveScoreUseCase
) : ViewModel() {

    private val playerName: String = savedStateHandle["playerName"] ?: "Unknown"
    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    init {
        loadNextQuestion()
    }

    fun selectOption(option: String) {
        if (_uiState.value.isAnswerCorrect == null) {
            _uiState.update {
                it.copy(selectedOption = option)
            }
        }
    }

    fun submitAnswer() {
        val currentState = _uiState.value
        val currentQuestion = currentState.question
        val selectedOption = currentState.selectedOption

        if (currentQuestion == null || selectedOption == null) return

        viewModelScope.launch {
            _uiState.update {
                it.copy(isCheckingAnswer = true)
            }
            val result = submitAnswerUseCase(
                currentQuestion.id,
                selectedOption
            )
            if (result.isSuccess) {
                val isCorrect = result.getOrNull() == true
                _uiState.update {
                    it.copy(
                        isCheckingAnswer = false,
                        isAnswerCorrect = isCorrect,
                        score = if (isCorrect) {
                            it.score + 1
                        } else {
                            it.score
                        }
                    )
                }
                delay(1500)
                if (currentState.questionIndex >= currentState.totalQuestions) {
                    finishQuiz()
                } else {
                    _uiState.update {
                        it.copy(
                            questionIndex = it.questionIndex + 1
                        )
                    }
                    loadNextQuestion()
                }
            } else {
                _uiState.update {
                    it.copy(
                        isCheckingAnswer = false,
                        errorResId = R.string.error_generic
                    )
                }
            }
        }
    }

    private fun finishQuiz() {
        viewModelScope.launch {
            saveScoreUseCase(
                name = playerName,
                score = _uiState.value.score
            )
            _uiState.update { it.copy(isQuizFinished = true) }
        }
    }

    fun loadNextQuestion() {
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