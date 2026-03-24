package com.dynamox.quiz.presentation.screens.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.domain.usecase.GetQuestionUseCase
import com.dynamox.quiz.domain.usecase.SaveQuizScoreUseCase
import com.dynamox.quiz.domain.usecase.SubmitAnswerUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

private const val TOTAL_QUESTIONS = 10

/**
 * Sealed class que representa todos os estados possíveis da tela de Quiz.
 *
 * A Sealed class garante que ao fazer 'when(quizState)', o compilador exige que todos os
 * casos sejam tratados, sem risco de esqucer um estado.
 *
 */
sealed class QuizState {
    /** Aguardando resposta da API (requisição GET /question em andamento) */
    data object LoadingQuestion : QuizState()

     /** Pergunta carregada e exibida ao usuário */
    data class ShowQuestion(val question: Question) : QuizState()

    /** Resposta enviada à API (requisição POST /answer em andamento) */
    data class SubmittingAnswer(val question: Question) : QuizState()

    /** Resultado recebido — exibe feedback de acerto/erro ao usuário */
    data class ShowResult(
        val question: Question,
        val selectedAnswer: String,
        val isCorrect: Boolean
    ) : QuizState()

    /** Quiz concluído — 10 perguntas respondidas. Dispara navegação para Result. */
    data object Finished : QuizState()

    /** Erro ao carregar pergunta ou ao enviar resposta. Exibe botão "Tentar Novamente". */
    data class Error(val message: String) : QuizState()
}

data class QuizUiState(
    val playerId: Long = 0L,
    val playerName: String = "",
    val currentQuestionIndex: Int = 0,
    val score: Int = 0,
    val totalQuestions: Int = TOTAL_QUESTIONS,
    val selectedAnswer: String? = null,
    val quizState: QuizState = QuizState.LoadingQuestion
)

/**
 * Ciclo de vida de uma pergunta:
 *   LoadingQuestion > ShowQuestion > [usuário seleciona] > SubmittingAnswer
 *   > ShowResult > [usuário clica Próxima] > LoadingQuestion (próxima)
 *   (ou Finished se era a 10ª pergunta)
 */
class QuizViewModel(
    private val getQuestion: GetQuestionUseCase,
    private val submitAnswer: SubmitAnswerUseCase,
    private val saveQuizScore: SaveQuizScoreUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    fun initQuiz(playerId: Long, playerName: String) {
        _uiState.update {
            it.copy(
                playerId = playerId,
                playerName = playerName,
                currentQuestionIndex = 0,
                score = 0,
                selectedAnswer = null,
                quizState = QuizState.LoadingQuestion
            )
        }
        loadNextQuestion()
    }

    fun onAnswerSelected(answer: String) {
        val currentState = _uiState.value.quizState
        // Só permite seleção se a pergunta está sendo exibida (não enviando nem mostrando resultado)
        if (currentState is QuizState.ShowQuestion) {
            _uiState.update { it.copy(selectedAnswer = answer) }
        }
    }

    fun onSubmitAnswer() {
        val state = _uiState.value
        val question = (state.quizState as? QuizState.ShowQuestion)?.question ?: return
        val answer = state.selectedAnswer ?: return

        viewModelScope.launch {
            // Transição para loading — mantém a pergunta visível (sem flicker)
            _uiState.update { it.copy(quizState = QuizState.SubmittingAnswer(question)) }

            submitAnswer(question.id, answer)
                .onSuccess { isCorrect ->
                    // Incrementa score se acertou
                    val newScore = if (isCorrect) state.score + 1 else state.score
                    _uiState.update {
                        it.copy(
                            score = newScore,
                            quizState = QuizState.ShowResult(question, answer, isCorrect)
                        )
                    }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(quizState = QuizState.Error(error.message ?: "Falha ao enviar resposta"))
                    }
                }
        }
    }

    fun onNextQuestion() {
        val state = _uiState.value
        val nextIndex = state.currentQuestionIndex + 1

        if (nextIndex >= state.totalQuestions) {
            finishQuiz()
        } else {
            _uiState.update {
                it.copy(
                    currentQuestionIndex = nextIndex,
                    selectedAnswer = null,
                    quizState = QuizState.LoadingQuestion
                )
            }
            loadNextQuestion()
        }
    }

    fun onRetryLoad() {
        _uiState.update { it.copy(quizState = QuizState.LoadingQuestion, selectedAnswer = null) }
        loadNextQuestion()
    }

    private fun loadNextQuestion() {
        viewModelScope.launch {
            getQuestion()
                .onSuccess { question ->
                    _uiState.update { it.copy(quizState = QuizState.ShowQuestion(question)) }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(quizState = QuizState.Error(error.message ?: "Falha ao carregar pergunta"))
                    }
                }
        }
    }

    /**
     *
     * A pontuação é salva em background (sem bloquear a UI).
     * O estado Finished é definido sincronicamente — não espera o banco salvar.
     *
     */
    private fun finishQuiz() {
        val state = _uiState.value

        viewModelScope.launch {
            saveQuizScore(
                playerId = state.playerId,
                playerName = state.playerName,
                score = state.score,
                totalQuestions = state.totalQuestions
            )
        }

        _uiState.update { it.copy(quizState = QuizState.Finished) }
    }
}
