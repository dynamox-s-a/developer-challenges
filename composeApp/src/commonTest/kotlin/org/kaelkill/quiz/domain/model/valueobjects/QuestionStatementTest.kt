package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class QuestionStatementTest {

    @Test
    fun `should create valid statement`() {
        val text = "What is Kotlin?"
        val result = QuestionStatement.create(text)

        assertTrue(result.isSuccess)
        assertEquals(text, result.getOrNull()?.value)
    }

    @Test
    fun `should trim whitespace`() {
        val text = "  What is Kotlin?  "
        val result = QuestionStatement.create(text)

        assertTrue(result.isSuccess)
        assertEquals("What is Kotlin?", result.getOrNull()?.value)
    }

    @Test
    fun `should fail when statement is empty`() {
        val result = QuestionStatement.create("")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when statement is blank`() {
        val result = QuestionStatement.create("   ")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }
}