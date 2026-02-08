package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class QuestionIdTest {

    @Test
    fun `should create valid id`() {
        val id = "123-abc"
        val result = QuestionId.       create(id)

        assertTrue(result.isSuccess)
        assertEquals(id, result.getOrNull()?.value)
    }

    @Test
    fun `should fail when id is empty`() {
        val result = QuestionId.create("")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when id is blank`() {
        val result = QuestionId.create("   ")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should trim leading and trailing whitespace`() {
        val result = QuestionId.create("  123-abc  ")

        assertTrue(result.isSuccess)
        assertEquals("123-abc", result.getOrNull()?.value)
    }
}