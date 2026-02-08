package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ScoreTest {

    @Test
    fun `should create valid score`() {
        val result = Score.create(10)
        assertTrue(result.isSuccess)
        assertEquals(10, result.getOrThrow().value)
    }

    @Test
    fun `should create zero score`() {
        val score = Score.zero()
        assertEquals(0, score.value)
    }

    @Test
    fun `should fail when creating negative score`() {
        val result = Score.create(-1)
        assertTrue(result.isFailure)
        assertEquals("Score cannot be negative", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should increment score correctly`() {
        val initial = Score.zero()
        val incremented = initial.increment()

        assertEquals(1, incremented.value)
    }
}