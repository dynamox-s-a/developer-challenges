package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AnswerOptionTest {

    @Test
    fun `should create valid option`() {
        val text = "Blue"
        val result = AnswerOption.create(text)

        assertTrue(result.isSuccess)
        assertEquals(text, result.getOrNull()?.value)
    }

    @Test
    fun `should fail when option is empty`() {
        val result = AnswerOption.create("")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when option is blank`() {
        val result = AnswerOption.create("   ")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should trim leading and trailing whitespace`() {
        val result = AnswerOption.create("  Green  ")

        assertTrue(result.isSuccess)
        assertEquals("Green", result.getOrNull()?.value)
    }
}