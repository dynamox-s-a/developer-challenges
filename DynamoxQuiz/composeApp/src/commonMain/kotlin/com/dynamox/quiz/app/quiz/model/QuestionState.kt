package com.dynamox.quiz.app.quiz.model

import com.dynamox.quiz.api.model.ApiError
import com.dynamox.quiz.api.model.QuizQuestion
import kotlin.time.Duration

sealed interface QuestionState {
    data object Fetching : QuestionState
    data class Loaded(val question: QuizQuestion, val startTimestamp: Long) : QuestionState
    data class Answering(val questionId: String, val answer: String, val duration: Duration) : QuestionState
    data class Answered(val questionId: String, val correct: Boolean, val duration: Duration) : QuestionState
    sealed interface Error : QuestionState {
        val state: QuestionState
        data class Api(val error: ApiError, override val state: QuestionState) : Error
        data class InvalidState(override val state: QuestionState) : Error
    }
}