package com.abel.dynamoxquiz.presentation.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.abel.dynamoxquiz.domain.repository.QuizRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.abel.dynamoxquiz.data.local.ScoreDao
import com.abel.dynamoxquiz.data.local.ScoreEntity

class QuizViewModel(
    private val repository: QuizRepository,
    private val scoreDao: ScoreDao
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        QuizUiState()
    )

    val uiState: StateFlow<QuizUiState> =
        _uiState.asStateFlow()

    private val _nickname =
        MutableStateFlow("")

    val nickname: StateFlow<String> =
        _nickname.asStateFlow()

    private val _isCorrect =
        MutableStateFlow<Boolean?>(null)

    private val _currentQuestion = MutableStateFlow(1)

    val currentQuestion: StateFlow<Int> = _currentQuestion.asStateFlow()

    private val _score = MutableStateFlow(0)

    private val _scores =
        MutableStateFlow<List<ScoreEntity>>(
            emptyList()
        )

    val scores: StateFlow<List<ScoreEntity>> =
        _scores.asStateFlow()
    val score: StateFlow<Int> = _score.asStateFlow()
    private val _quizFinished = MutableStateFlow(false)
    val quizFinished: StateFlow<Boolean> = _quizFinished.asStateFlow()
    val isCorrect: StateFlow<Boolean?> =
        _isCorrect.asStateFlow()
    init {

        loadScores()
    }
    fun setNickname(
        nickname: String
    ) {
        _nickname.value = nickname
    }

    fun loadScores() {
        viewModelScope.launch {
            _scores.value =
                scoreDao.getAllScores()
        }
    }
    fun loadQuestion() {
        viewModelScope.launch {
            _uiState.value = QuizUiState(
                isLoading = true
            )
            try {
                val question = repository.getQuestion()

                _uiState.value = QuizUiState(
                    question = question
                )
            } catch (exception: Exception) {

                _uiState.value = QuizUiState(
                    error = exception.message
                )
            }
        }
    }

    fun sendAnswer(answer: String) {

        _isCorrect.value = null

        val questionId =
            _uiState.value.question?.id ?: return

        viewModelScope.launch {
            try {
                val response =
                    repository.sendAnswer(
                        questionId = questionId,
                        answer = answer
                    )
                _isCorrect.value =
                    response.result
                if (response.result) {
                    _score.value++
                }
                if (_currentQuestion.value >= 10) {

                    finishQuiz()
                } else {

                    _currentQuestion.value++
                }
            } catch (exception: Exception) {

                _uiState.value = QuizUiState(
                    error = exception.message
                )
            }
        }
    }

    fun restartQuiz() {

        _score.value = 0
        _currentQuestion.value = 1
        _quizFinished.value = false
        _isCorrect.value = null
        loadQuestion()
    }
    fun nextQuestion() {

        _isCorrect.value = null

        loadQuestion()
    }
    fun finishQuiz() {

        viewModelScope.launch {
            scoreDao.insertScore(
                ScoreEntity(
                    nickname =
                        _nickname.value,
                    score =
                        _score.value
                )
            )

            _scores.value =
                scoreDao.getAllScores()
            _quizFinished.value = true
        }
    }
}
