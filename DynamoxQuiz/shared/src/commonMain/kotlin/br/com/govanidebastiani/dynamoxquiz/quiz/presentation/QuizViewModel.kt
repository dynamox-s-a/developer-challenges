package br.com.govanidebastiani.dynamoxquiz.quiz.presentation

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import br.com.govanidebastiani.dynamoxquiz.app.Route
import br.com.govanidebastiani.dynamoxquiz.core.domain.onError
import br.com.govanidebastiani.dynamoxquiz.core.domain.onSuccess
import br.com.govanidebastiani.dynamoxquiz.core.domain.toStringResource
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchNewQuestionUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.SaveQuizUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.SubmitAnswerUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.collections.copy
import kotlin.invoke
import kotlin.onSuccess

class QuizViewModel(
    savedStateHandle: SavedStateHandle,
    private val fetchNewQuestionUseCase: FetchNewQuestionUseCase,
    private val submitAnswerUseCase: SubmitAnswerUseCase,
    private val saveQuizUseCase: SaveQuizUseCase
): ViewModel() {
    val playerNickname = savedStateHandle.toRoute<Route.QuizScreen>().playerNickname
    val ignoreIds = savedStateHandle.toRoute<Route.QuizScreen>().ignoreIds.toMutableList()

    private val _state = MutableStateFlow(QuizUIState())
    val state get() = _state.asStateFlow()

    private var _questionIds: MutableList<String> = mutableListOf()
    private var _countCorrectAnswers: Long = 0
    private var _countAnsweredQuestions: Long = 0

    init {
        onNextQuestion()
    }

    fun checkSelectedOption(selectedOption: String) = viewModelScope.launch  {
        val result = submitAnswerUseCase.invoke(_state.value.currentQuestion!!.id, selectedOption)

        result.onSuccess { answerResponse ->
            if (answerResponse.isCorrect) {
                _countCorrectAnswers += 1
            }

            _state.update {
                it.copy(isCorrect = answerResponse.isCorrect, currentOption = selectedOption)
            }
        }.onError { error ->
            _state.update {
                it.copy(isLoading = false, currentQuestion = null, errorMessage = error.toStringResource())
            }
        }
    }

    fun onNextQuestion() = viewModelScope.launch {
        _state.update {
            it.copy(isLoading = true, currentOption = null, isCorrect = null)
        }

        val result = fetchNewQuestionUseCase.invoke(_questionIds)

        result.onSuccess { question ->
            ignoreIds.add(question.id)
            _countAnsweredQuestions += 1
            _state.update {
                it.copy(
                    isLoading = false,
                    currentQuestion = question,
                    isLastQuestion = _countAnsweredQuestions == 10L
                )
            }
        }.onError { error ->
            _state.update {
                it.copy(
                    isLoading = false,
                    currentQuestion = null,
                    errorMessage = error.toStringResource()
                )
            }
        }
    }

    fun onSaveQuiz() = viewModelScope.launch {
        val quizId = saveQuizUseCase.invoke(playerNickname = playerNickname, amountCorrectAnswers = _countCorrectAnswers)
        _state.update {
            it.copy(navigateToFinalScore = true, quizId = quizId, ignoreIds = _questionIds)
        }
    }

    fun navigateToFinalScoreHandled() {
        _state.update {
            it.copy(navigateToFinalScore = false)
        }
    }
}