package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class PlayerIdTest {

    @Test
    fun `should create valid PlayerId from non-empty string`() {
        val result = PlayerId.create("valid-id-123")

        assertTrue(result.isSuccess)
        assertEquals("valid-id-123", result.getOrThrow().value)
    }

    @Test
    fun `should fail to create PlayerId from empty or blank string`() {
        assertTrue(PlayerId.create("").isFailure)
        assertTrue(PlayerId.create("   ").isFailure)
    }

    @Test
    fun `should generate non-empty unique IDs`() {
        val id1 = PlayerId.generate()
        val id2 = PlayerId.generate()

        assertTrue(id1.value.isNotEmpty())
        assertTrue(id2.value.isNotEmpty())
        assertNotEquals(id1.value, id2.value)
    }
}