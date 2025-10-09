package com.dynamox.quiz.app.quiz.viewModel

import com.dynamox.quiz.app.quiz.model.QuestionState
import com.dynamox.quiz.app.quiz.model.QuizState
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow

interface QuizViewModel {
    val state: StateFlow<QuizState>

    val currentQuestionState: StateFlow<QuestionState?>
    val currentQuestionNumber: StateFlow<Int>

    val isLastQuestion: StateFlow<Boolean>

    val onSaved: Flow<Unit>

    fun loadNextQuestion()

    fun answerQuestion(questionId: String, answer: String)

    fun tryAgain(state: QuestionState)

    fun saveScore()

    fun restartQuiz()
}



