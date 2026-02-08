package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class QuizSessionIdTest {

    @Test
    fun `should create valid quiz session id`() {
        val rawId = "session-123"
        val result = QuizSessionId.create(rawId)

        assertTrue(result.isSuccess)
        assertEquals(rawId, result.getOrThrow().value)
    }

    @Test
    fun `should generate valid random id`() {
        val id1 = QuizSessionId.generate()
        val id2 = QuizSessionId.generate()

        assertTrue(id1.value.isNotBlank())
        assertTrue(id2.value.isNotBlank())
        assertNotEquals(id1, id2)
    }

    @Test
    fun `should fail when id is empty`() {
        val result = QuizSessionId.create("")
        assertTrue(result.isFailure)
    }

    @Test
    fun `should fail when id is blank`() {
        val result = QuizSessionId.create("   ")
        assertTrue(result.isFailure)
    }

    @Test
    fun `should be equal when values are same`() {
        val id1 = QuizSessionId.create("123").getOrThrow()
        val id2 = QuizSessionId.create("123").getOrThrow()

        assertEquals(id1, id2)
    }
}