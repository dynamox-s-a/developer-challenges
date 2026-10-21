package com.romulofer.kotlinMultiplatform.presentation.quiz

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.AppError.NoConnection
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession.Companion.TOTAL_QUESTIONS
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Answered
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Asking
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Finished
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.LoadFailed
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Loading
import kotlin.test.Test

class QuizUiStateTest {

    private val question = Question(id = "1", statement = "Q", options = listOf("A", "B"))
    private val threeAnswered = QuizSession(answered = 3, correct = 2)

    @Test
    fun `numbers the question being asked after the answered ones`() {
        assertThat(QuizUiState(threeAnswered, Asking(question)).questionNumber).isEqualTo(4)
    }

    @Test
    fun `numbers a loading question after the answered ones`() {
        assertThat(QuizUiState(threeAnswered, Loading).questionNumber).isEqualTo(4)
        assertThat(QuizUiState(threeAnswered, LoadFailed(NoConnection)).questionNumber).isEqualTo(4)
    }

    @Test
    fun `keeps the number of an answered question`() {
        val state = QuizUiState(threeAnswered, Answered(question, "A", isCorrect = true, isLastQuestion = false))

        assertThat(state.questionNumber).isEqualTo(3)
    }

    @Test
    fun `keeps the last number when the quiz is finished`() {
        val state = QuizUiState(QuizSession(answered = TOTAL_QUESTIONS), Finished(scoreSaved = true))

        assertThat(state.questionNumber).isEqualTo(TOTAL_QUESTIONS)
    }

    @Test
    fun `fills the progress with the answered questions`() {
        assertThat(QuizUiState(QuizSession(), Loading).progress).isEqualTo(0f)
        assertThat(QuizUiState(QuizSession(answered = 5), Loading).progress).isEqualTo(0.5f)
        assertThat(QuizUiState(QuizSession(answered = TOTAL_QUESTIONS), Loading).progress).isEqualTo(1f)
    }
}
