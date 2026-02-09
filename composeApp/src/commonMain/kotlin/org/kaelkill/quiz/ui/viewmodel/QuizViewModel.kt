package org.kaelkill.quiz.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.kaelkill.quiz.application.usecases.AnswerQuestionUseCase
import org.kaelkill.quiz.application.usecases.FillSessionUseCase
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

enum class Screen {
    LOGIN, QUIZ, RESULT, HISTORY
}

data class QuizUiState(
    val screen: Screen = Screen.LOGIN,
    val isLoading: Boolean = false,
    val error: String? = null,
    val canRetry: Boolean = false,

    // Login
    val playerName: String = "",

    // Quiz
    val player: Player? = null,
    val session: QuizSession? = null,
    val currentQuestionIndex: Int = 0,
    val selectedOption: String? = null,
    val answerResult: Boolean? = null,
    val isLoadingQuestions: Boolean = false,

    // History
    val allPlayers: List<Player> = emptyList()
) {
    val currentQuestion: Question?
        get() = session?.questions?.getOrNull(currentQuestionIndex)

    val isWaitingForQuestion: Boolean
        get() = currentQuestion == null && isLoadingQuestions

    val progress: String
        get() = "${currentQuestionIndex + 1}/10"

    val isLastQuestion: Boolean
        get() = currentQuestionIndex >= 9
}

class QuizViewModel(
    private val answerQuestionUseCase: AnswerQuestionUseCase,
    private val fillSessionUseCase: FillSessionUseCase,
    private val sessionRepository: QuizSessionRepository,
    private val playerRepository: PlayerRepository
) : ViewModel() {

    private val _state = MutableStateFlow(QuizUiState())
    val state: StateFlow<QuizUiState> = _state.asStateFlow()

    private var fillJob: Job? = null
    private var pollJob: Job? = null

    fun onPlayerNameChanged(name: String) {
        _state.value = _state.value.copy(playerName = name, error = null, canRetry = false)
    }

    fun onStartQuiz() {
        val name = _state.value.playerName.trim()
        if (name.isBlank()) {
            _state.value = _state.value.copy(error = "Digite seu nome")
            return
        }

        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null, canRetry = false)

            runCatching {
                val playerName = PlayerName.create(name).getOrThrow()
                val existing = playerRepository.getByName(playerName).getOrThrow()
                if (existing != null) existing
                else {
                    val player = Player.create(name).getOrThrow()
                    playerRepository.save(player).getOrThrow()
                    player
                }
            }
                .onSuccess { player ->
                    val session = QuizSession.create(player.id)
                    sessionRepository.save(session).getOrThrow()

                    _state.value = _state.value.copy(
                        screen = Screen.QUIZ,
                        isLoading = false,
                        isLoadingQuestions = true,
                        player = player,
                        session = session,
                        currentQuestionIndex = 0,
                        selectedOption = null,
                        answerResult = null
                    )

                    startFillingQuestions(session.id.value)
                }
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = formatError(error),
                        canRetry = true
                    )
                }
        }
    }

    private fun startFillingQuestions(sessionIdStr: String) {
        fillJob = viewModelScope.launch {
            fillSessionUseCase.execute(sessionIdStr)
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        isLoadingQuestions = false,
                        error = formatError(error),
                        canRetry = true
                    )
                }
                .onSuccess {
                    _state.value = _state.value.copy(isLoadingQuestions = false)
                }
        }

        pollJob = viewModelScope.launch {
            while (true) {
                delay(300)
                val currentState = _state.value
                val session = currentState.session ?: break
                if (currentState.screen != Screen.QUIZ) break

                sessionRepository.getById(session.id)
                    .onSuccess { updated ->
                        if (updated.questions.size > (currentState.session?.questions?.size ?: 0)) {
                            _state.value = _state.value.copy(session = updated)
                        }
                        if (updated.questions.size >= 10) {
                            _state.value = _state.value.copy(isLoadingQuestions = false)
                            return@launch
                        }
                    }
            }
        }
    }

    fun onRetry() {
        when (_state.value.screen) {
            Screen.LOGIN -> onStartQuiz()
            Screen.QUIZ -> {
                val session = _state.value.session
                if (session != null && session.questions.size < 10) {
                    _state.value = _state.value.copy(error = null, canRetry = false, isLoadingQuestions = true)
                    startFillingQuestions(session.id.value)
                } else {
                    onSubmitAnswer()
                }
            }
            else -> {}
        }
    }

    fun onSelectOption(option: String) {
        if (_state.value.answerResult != null) return
        _state.value = _state.value.copy(selectedOption = option)
    }

    fun onSubmitAnswer() {
        val currentState = _state.value
        val session = currentState.session ?: return
        val question = currentState.currentQuestion ?: return
        val selected = currentState.selectedOption ?: return

        viewModelScope.launch {
            _state.value = currentState.copy(isLoading = true, error = null, canRetry = false)

            answerQuestionUseCase.execute(
                session.id.value,
                question.id.value,
                selected
            )
                .onSuccess { updatedSession ->
                    val wasCorrect = updatedSession.score.value > session.score.value

                    _state.value = _state.value.copy(
                        isLoading = false,
                        session = updatedSession,
                        answerResult = wasCorrect
                    )
                }
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = formatError(error),
                        canRetry = true
                    )
                }
        }
    }

    fun onNextQuestion() {
        val currentState = _state.value

        if (currentState.isLastQuestion) {
            viewModelScope.launch {
                saveScore()
                _state.value = _state.value.copy(
                    screen = Screen.RESULT,
                    selectedOption = null,
                    answerResult = null
                )
            }
            stopPolling()
        } else {
            _state.value = currentState.copy(
                currentQuestionIndex = currentState.currentQuestionIndex + 1,
                selectedOption = null,
                answerResult = null
            )
        }
    }

    fun onRestartQuiz() {
        stopPolling()
        _state.value = _state.value.copy(
            screen = Screen.LOGIN,
            session = null,
            currentQuestionIndex = 0,
            selectedOption = null,
            answerResult = null,
            error = null,
            canRetry = false,
            isLoadingQuestions = false
        )
    }

    fun onShowHistory() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)

            playerRepository.getAll()
                .onSuccess { players ->
                    _state.value = _state.value.copy(
                        screen = Screen.HISTORY,
                        isLoading = false,
                        allPlayers = players.filter { it.scores.isNotEmpty() }
                    )
                }
                .onFailure {
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = "Erro ao carregar histórico"
                    )
                }
        }
    }

    fun onBackFromHistory() {
        _state.value = _state.value.copy(screen = Screen.RESULT)
    }

    fun onBackToLogin() {
        stopPolling()
        _state.value = _state.value.copy(screen = Screen.LOGIN)
    }

    private suspend fun saveScore() {
        val currentState = _state.value
        val player = currentState.player ?: return
        val session = currentState.session ?: return

        val updated = player.addScore(session.score.value)
        playerRepository.save(updated)
        _state.value = _state.value.copy(player = updated)
    }

    private fun stopPolling() {
        fillJob?.cancel()
        pollJob?.cancel()
    }

    private fun formatError(error: Throwable): String {
        return when {
            error.message?.contains("Unable to resolve host", ignoreCase = true) == true ->
                "Sem conexão com a internet. Verifique sua rede."
            error.message?.contains("timeout", ignoreCase = true) == true ->
                "O servidor demorou para responder. Tente novamente."
            error.message?.contains("connect", ignoreCase = true) == true ->
                "Não foi possível conectar ao servidor. Tente novamente."
            else -> "Erro inesperado: ${error.message}"
        }
    }
}