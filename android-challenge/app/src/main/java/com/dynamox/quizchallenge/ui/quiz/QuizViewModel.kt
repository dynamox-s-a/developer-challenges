package com.dynamox.quizchallenge.ui.quiz

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dynamox.quizchallenge.domain.model.AppError
import com.dynamox.quizchallenge.domain.model.Question
import com.dynamox.quizchallenge.domain.model.QuizSession
import com.dynamox.quizchallenge.domain.usecase.GetUniqueQuestionUseCase
import com.dynamox.quizchallenge.domain.usecase.SaveScoreUseCase
import com.dynamox.quizchallenge.domain.usecase.SubmitAnswerUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class QuizViewModel @Inject constructor(
    private val savedStateHandle: SavedStateHandle,
    private val getUniqueQuestion: GetUniqueQuestionUseCase,
    private val submitAnswerUseCase: SubmitAnswerUseCase,
    private val saveScoreUseCase: SaveScoreUseCase,
) : ViewModel() {

    // Read the nav argument by its key (matches QuizDestination.Quiz.playerName) instead of
    // using SavedStateHandle.toRoute(), whose decoder goes through android.os.Bundle under the
    // hood -- that makes it work fine on a device, but throws "not mocked" in plain JVM unit
    // tests. A direct key lookup behaves identically at runtime and keeps the ViewModel testable
    // without Robolectric.
    //
    // Progress (answeredCount/correctCount/seenQuestionIds) is restored from SavedStateHandle and
    // re-persisted after every answer, so an in-progress quiz survives the OS killing the app's
    // process in the background (SavedStateHandle -- unlike a plain ViewModel field -- survives
    // that, whereas rotation alone would already be covered by the ViewModel itself). The current
    // question is intentionally not restored this way: init always fetches the next question for
    // the (possibly restored) session, which naturally continues the quiz where it left off.
    private var session = restoreSession()
    private var currentQuestion: Question? = null

    // Guards against overlapping network calls if the user manages to trigger loadNextQuestion()
    // twice before the first call resolves (e.g. a very fast double-tap on "next"/"retry"). Kept
    // separate from the exposed Loading state because the initial state is itself Loading.
    private var isFetchingQuestion = false

    private val _uiState = MutableStateFlow<QuizUiState>(QuizUiState.Loading)
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    init {
        loadNextQuestion()
    }

    fun onOptionSelected(option: String) {
        val state = _uiState.value as? QuizUiState.InProgress ?: return
        if (state.isAnswerRevealed) return
        _uiState.value = state.copy(selectedOption = option)
    }

    fun onSubmitAnswer() {
        val state = _uiState.value as? QuizUiState.InProgress ?: return
        // Guards against a fast double-tap submitting the same answer twice: isAnswerRevealed
        // alone isn't enough here since it only flips *after* the first network call resolves.
        if (state.isAnswerRevealed || state.isSubmitting) return
        val option = state.selectedOption ?: return
        val question = currentQuestion ?: return
        _uiState.value = state.copy(isSubmitting = true)
        viewModelScope.launch {
            submitAnswerUseCase(question.id, option).fold(
                onSuccess = { isCorrect -> onAnswerRevealed(state, isCorrect) },
                onFailure = { error -> _uiState.value = QuizUiState.Error(error.toAppError()) },
            )
        }
    }

    /** Called when the player taps "next question" (or "see result" on the last question). */
    fun onNextQuestion() {
        loadNextQuestion()
    }

    /** Called from the error state's retry button; simply attempts to load a question again. */
    fun onRetry() {
        loadNextQuestion()
    }

    private suspend fun onAnswerRevealed(state: QuizUiState.InProgress, isCorrect: Boolean) {
        session = session.withAnswer(state.question.id, isCorrect)
        persistSession()
        if (session.isFinished) {
            saveScoreUseCase(session.playerName, session.correctCount, session.totalQuestions)
        }
        _uiState.value = state.copy(
            isSubmitting = false,
            revealedCorrect = isCorrect,
            correctCountSoFar = session.correctCount,
        )
    }

    private fun loadNextQuestion() {
        if (isFetchingQuestion) return
        isFetchingQuestion = true
        _uiState.value = QuizUiState.Loading
        viewModelScope.launch {
            getUniqueQuestion(session.seenQuestionIds).fold(
                onSuccess = { question ->
                    currentQuestion = question
                    isFetchingQuestion = false
                    _uiState.value = QuizUiState.InProgress(
                        questionNumber = session.answeredCount + 1,
                        totalQuestions = session.totalQuestions,
                        question = question,
                    )
                },
                onFailure = { error ->
                    isFetchingQuestion = false
                    _uiState.value = QuizUiState.Error(error.toAppError())
                },
            )
        }
    }

    private fun restoreSession(): QuizSession {
        val playerName = checkNotNull(savedStateHandle.get<String>(PLAYER_NAME_ARG)) {
            "Missing '$PLAYER_NAME_ARG' navigation argument"
        }
        return QuizSession(
            playerName = playerName,
            answeredCount = savedStateHandle.get<Int>(KEY_ANSWERED_COUNT) ?: 0,
            correctCount = savedStateHandle.get<Int>(KEY_CORRECT_COUNT) ?: 0,
            seenQuestionIds = savedStateHandle.get<ArrayList<String>>(KEY_SEEN_QUESTION_IDS)?.toSet() ?: emptySet(),
        )
    }

    private fun persistSession() {
        savedStateHandle[KEY_ANSWERED_COUNT] = session.answeredCount
        savedStateHandle[KEY_CORRECT_COUNT] = session.correctCount
        savedStateHandle[KEY_SEEN_QUESTION_IDS] = ArrayList(session.seenQuestionIds)
    }

    private fun Throwable.toAppError(): AppError = this as? AppError ?: AppError.Unknown(message)

    private companion object {
        const val PLAYER_NAME_ARG = "playerName"
        const val KEY_ANSWERED_COUNT = "quiz_answeredCount"
        const val KEY_CORRECT_COUNT = "quiz_correctCount"
        const val KEY_SEEN_QUESTION_IDS = "quiz_seenQuestionIds"
    }
}
