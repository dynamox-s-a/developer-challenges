package com.romulofer.kotlinMultiplatform.domain.model

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isFalse
import assertk.assertions.isTrue
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession.Companion.TOTAL_QUESTIONS
import kotlin.test.Test

class QuizSessionTest {

    @Test
    fun `starts empty`() {
        val session = QuizSession()

        assertThat(session.answered).isEqualTo(0)
        assertThat(session.correct).isEqualTo(0)
        assertThat(session.isFinished).isFalse()
    }

    @Test
    fun `counts a correct answer`() {
        val session = QuizSession().withAnswer(isCorrect = true)

        assertThat(session.answered).isEqualTo(1)
        assertThat(session.correct).isEqualTo(1)
    }

    @Test
    fun `counts a wrong answer without raising the score`() {
        val session = QuizSession().withAnswer(isCorrect = false)

        assertThat(session.answered).isEqualTo(1)
        assertThat(session.correct).isEqualTo(0)
    }

    @Test
    fun `remembers the questions it has seen`() {
        val session = QuizSession().withQuestionSeen("1").withQuestionSeen("2")

        assertThat(session.seenQuestionIds).isEqualTo(setOf("1", "2"))
    }

    @Test
    fun `is not finished before the last question`() {
        val session = (1 until TOTAL_QUESTIONS).fold(QuizSession()) { current, _ -> current.withAnswer(true) }

        assertThat(session.isFinished).isFalse()
    }

    @Test
    fun `is finished after the last question`() {
        val session = (1..TOTAL_QUESTIONS).fold(QuizSession()) { current, _ -> current.withAnswer(true) }

        assertThat(session.isFinished).isTrue()
    }
}
