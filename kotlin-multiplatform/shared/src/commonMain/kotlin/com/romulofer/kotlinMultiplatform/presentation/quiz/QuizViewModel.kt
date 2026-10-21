package com.romulofer.kotlinMultiplatform.presentation.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Failure
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Success
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession.Companion.TOTAL_QUESTIONS
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import com.romulofer.kotlinMultiplatform.domain.usecase.LoadQuestionUseCase
import com.romulofer.kotlinMultiplatform.domain.util.catching
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Answered
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Asking
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Finished
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.LoadFailed
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Loading
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class QuizViewModel(
    private val player: Player,
    private val loadQuestion: LoadQuestionUseCase,
    private val quizRepository: QuizRepository,
    private val scoreRepository: ScoreRepository,
    private val navigator: Navigator,
) : ViewModel() {

    private var session = QuizSession()
    private var scoreSaved = true

    private val _state = MutableStateFlow(QuizUiState(session, Loading))
    val state: StateFlow<QuizUiState> = _state.asStateFlow()

    init {
        loadNextQuestion()
    }

    fun onOptionSelected(option: String) {
        val step = _state.value.step as? Asking ?: return
        if (step.isSubmitting) return
        show(step.copy(selected = option, submitError = null))
    }

    fun onSubmit() {
        val step = _state.value.step as? Asking ?: return
        val selected = step.selected ?: return
        if (step.isSubmitting) return
        show(step.copy(isSubmitting = true, submitError = null))
        viewModelScope.launch {
            when (val result = quizRepository.submitAnswer(step.question.id, selected)) {
                is Success -> onAnswered(step.question, selected, result.value)
                is Failure -> show(step.copy(isSubmitting = false, submitError = result.error))
            }
        }
    }

    fun onNext() {
        if (_state.value.step !is Answered) return
        if (session.isFinished) show(Finished(scoreSaved)) else loadNextQuestion()
    }

    fun onRetry() {
        if (_state.value.step is LoadFailed) loadNextQuestion()
    }

    fun onRestart() {
        if (_state.value.step !is Finished) return
        session = QuizSession()
        scoreSaved = true
        loadNextQuestion()
    }

    fun onChangePlayer() = navigator.backToRegistration()

    fun onScoreboardClick() = navigator.showScoreboard()

    fun onBack() = navigator.back()

    private fun loadNextQuestion() {
        show(Loading)
        viewModelScope.launch {
            when (val result = loadQuestion(session.seenQuestionIds)) {
                is Success -> {
                    session = session.withQuestionSeen(result.value.id)
                    show(Asking(result.value))
                }
                is Failure -> show(LoadFailed(result.error))
            }
        }
    }

    private suspend fun onAnswered(question: Question, selected: String, isCorrect: Boolean) {
        session = session.withAnswer(isCorrect)
        if (session.isFinished) {
            scoreSaved = catching { scoreRepository.save(player.id, session.correct, TOTAL_QUESTIONS) }.isSuccess
        }
        show(Answered(question, selected, isCorrect, isLastQuestion = session.isFinished))
    }

    private fun show(step: QuizStep) {
        _state.value = QuizUiState(session, step)
    }
}
