package com.dynamox.quiz.app.quiz.viewModel.impl

import com.dynamox.quiz.api.QuizApi
import com.dynamox.quiz.app.quiz.model.QuestionState
import com.dynamox.quiz.app.quiz.model.QuizState
import com.dynamox.quiz.app.quiz.viewModel.QuizViewModel
import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.app.session.model.SessionState
import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.shared.systemEpochMilliseconds
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.failed_to_save_score_message
import dynamoxquiz.composeapp.generated.resources.failed_to_save_score_user_not_authenticated_message
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.getString
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.uuid.Uuid

class QuizViewModelImpl(
    private val repository: ClientDataRepository,
    private val sessionManager: SessionManager,
    private val quizApi: QuizApi,
) : QuizViewModel {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override val state = MutableStateFlow<QuizState>(QuizState.Answering)

    override val currentQuestionState = MutableStateFlow<QuestionState?>(null)

    private val answeredQuestionIds = MutableStateFlow<Set<String>>(emptySet())
    private var totalDuration: Duration = Duration.Companion.ZERO
    private var correctAnswersCount: Int = 0

    override val currentQuestionNumber = answeredQuestionIds.map { it.size + 1 }
        .stateIn(scope = scope, started = SharingStarted.Companion.Eagerly, initialValue = 1)

    override val isLastQuestion = answeredQuestionIds.map { it.size >= 9 }
        .stateIn(scope = scope, started = SharingStarted.Companion.Eagerly, initialValue = false)

    override val onSaved = MutableSharedFlow<Unit>()

    override fun loadNextQuestion() {
        if (answeredQuestionIds.value.size >= 10) {
            state.update {
                QuizState.Completed(
                    score = correctAnswersCount,
                    totalDuration = totalDuration
                )
            }
            currentQuestionState.update { null }
            return
        }

        val previousQuestionState = currentQuestionState.value ?: QuestionState.Fetching
        currentQuestionState.update { QuestionState.Fetching }

        scope.launch {
            quizApi.getRandomQuestion()
                .onSuccess { question ->
                    if (answeredQuestionIds.value.contains(question.id)) {
                        loadNextQuestion()
                        return@onSuccess
                    }
                    currentQuestionState.update {
                        QuestionState.Loaded(
                            question = question,
                            startTimestamp = systemEpochMilliseconds(),
                        )
                    }
                }
                .onFailure { error ->
                    currentQuestionState.update {
                        QuestionState.Error.Api(error = error, state = previousQuestionState)
                    }
                }
        }
    }

    override fun answerQuestion(questionId: String, answer: String) {
        val questionState = currentQuestionState.value ?: QuestionState.Fetching
        if (questionState !is QuestionState.Loaded || questionState.question.id != questionId) {
            currentQuestionState.update { QuestionState.Error.InvalidState(questionState) }
            return
        }

        val elapsed = (systemEpochMilliseconds() - questionState.startTimestamp).milliseconds
        totalDuration += elapsed

        val answeringState = QuestionState.Answering(
            questionId = questionId,
            answer = answer,
            duration = elapsed
        )
        currentQuestionState.update { answeringState }

        scope.launch {
            quizApi.submitAnswer(questionId, answer)
                .onSuccess { result ->
                    val correct = result.result
                    if (correct) correctAnswersCount++
                    answeredQuestionIds.update { it + questionId }
                    currentQuestionState.update {
                        QuestionState.Answered(
                            questionId = questionId,
                            correct = correct,
                            duration = elapsed
                        )
                    }
                }
                .onFailure { error ->
                    currentQuestionState.update {
                        QuestionState.Error.Api(error = error, state = answeringState)
                    }
                }
        }
    }

    override fun tryAgain(state: QuestionState) {
        when (state) {
            is QuestionState.Answering -> {
                val current = currentQuestionState.value
                val backingLoaded = when (current) {
                    is QuestionState.Error -> (current.state as? QuestionState.Loaded)
                    is QuestionState.Loaded -> current
                    else -> null
                }
                if (backingLoaded != null && backingLoaded.question.id == state.questionId) {
                    answerQuestion(state.questionId, state.answer)
                } else {
                    loadNextQuestion()
                }
            }
            is QuestionState.Error.Api -> {
                when (val prev = state.state) {
                    is QuestionState.Fetching, is QuestionState.Loaded, is QuestionState.Answered -> loadNextQuestion()
                    is QuestionState.Answering -> answerQuestion(prev.questionId, prev.answer)
                    is QuestionState.Error -> loadNextQuestion()
                }
            }
            is QuestionState.Fetching,
            is QuestionState.Loaded,
            is QuestionState.Answered,
            is QuestionState.Error.InvalidState -> loadNextQuestion()
        }
    }

    override fun saveScore() {
        val quizState = state.value
        if (quizState !is QuizState.Completed) return

        val authenticated = sessionManager.state.value
        val userId = (authenticated as? SessionState.Authenticated)?.user?.id
        scope.launch {
            if (userId == null) {
                state.update {
                    QuizState.Error(
                        errorMessage = getString(Res.string.failed_to_save_score_user_not_authenticated_message),
                        state = it,
                    )
                }
                return@launch
            }
            val score = QuizScore(
                id = Uuid.Companion.random(),
                userId = userId,
                score = quizState.score,
                timeTakenMs = quizState.totalDuration.inWholeMilliseconds,
                createdAt = systemEpochMilliseconds(),
                deleted = false,
                deletedAt = null
            )
            repository.saveQuizScore(score)
                .onSuccess {
                    onSaved.emit(Unit)
                }
                .onFailure {
                    state.update { QuizState.Error(getString(Res.string.failed_to_save_score_message), it) }
                }
        }
    }

    override fun restartQuiz() {
        answeredQuestionIds.update { emptySet() }
        totalDuration = Duration.Companion.ZERO
        correctAnswersCount = 0
        state.update { QuizState.Answering }
        currentQuestionState.update { null }
        loadNextQuestion()
    }
}