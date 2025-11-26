package com.franckkumako.dynamoxquiz.presentation.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.franckkumako.dynamoxquiz.domain.model.Question
import com.franckkumako.dynamoxquiz.domain.usecase.GetQuestionUseCase
import com.franckkumako.dynamoxquiz.domain.usecase.SaveScoreUseCase
import com.franckkumako.dynamoxquiz.domain.usecase.SubmitAnswerUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlinx.coroutines.delay

data class QuizUiState(
    val isLoading: Boolean = false,
    val currentQuestion: Question? = null,
    val questionIndex: Int = 0,
    val totalQuestions: Int = 10,
    val selectedOption: String? = null,
    val isAnswerCorrect: Boolean? = null,
    val errorMessage: String? = null,
    val score: Int = 0,
    val isFinished: Boolean = false
)

@HiltViewModel
class QuizViewModel @Inject constructor(
    private val getQuestionUseCase: GetQuestionUseCase,
    private val submitAnswerUseCase: SubmitAnswerUseCase,
    private val saveScoreUseCase: SaveScoreUseCase
) : ViewModel() {


    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState

    fun startQuiz(playerName: String) {
        _uiState.value = QuizUiState()
        loadNextQuestion()
    }

    fun loadNextQuestion() {
        val current = _uiState.value
        if (current.questionIndex >= current.totalQuestions) {
            _uiState.value = current.copy(isFinished = true)
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null,
                selectedOption = null,
                isAnswerCorrect = null
            )

            try {
                val question = getQuestionUseCase()
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    currentQuestion = question
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Unknown error"
                )
            }
        }
    }

    fun selectOption(option: String) {
        _uiState.value = _uiState.value.copy(selectedOption = option)
    }

    fun submitAnswer(playerName: String, onFinished: (Int) -> Unit) {
        val state = _uiState.value
        val question = state.currentQuestion ?: return
        val answer = state.selectedOption ?: return

        viewModelScope.launch {
            _uiState.value = state.copy(isLoading = true, errorMessage = null)

            try {
                val result = submitAnswerUseCase(question.id, answer)
                val newScore = if (result.isCorrect) state.score + 1 else state.score
                val newIndex = state.questionIndex + 1

                _uiState.value = state.copy(
                    isLoading = false,
                    isAnswerCorrect = result.isCorrect,
                    score = newScore,
                    questionIndex = newIndex
                )

                if (newIndex >= state.totalQuestions) {
                    delay(1500)
                    saveScoreUseCase(playerName, newScore)
                    _uiState.value = _uiState.value.copy(isFinished = true)
                    onFinished(newScore)
                } else {
                    delay(1500)

                    loadNextQuestion()
                }
            } catch (e: Exception) {
                _uiState.value = state.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Error submitting answer"
                )
            }
        }
    }
}
