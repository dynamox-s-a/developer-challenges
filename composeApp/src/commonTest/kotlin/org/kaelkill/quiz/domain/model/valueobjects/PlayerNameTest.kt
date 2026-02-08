package org.kaelkill.quiz.domain.model.valueobjects

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class PlayerNameTest {

    @Test
    fun `should create valid player name with normal text`() {
        val result = PlayerName.create("John Doe")

        assertTrue(result.isSuccess)
        assertEquals("John Doe", result.getOrNull()?.value)
    }

    @Test
    fun `should create valid player name with minimum length`() {
        val result = PlayerName.create("AB")

        assertTrue(result.isSuccess)
        assertEquals("AB", result.getOrNull()?.value)
    }

    @Test
    fun `should create valid player name with maximum length`() {
        val input = "A".repeat(50)

        val result = PlayerName.create(input)

        assertTrue(result.isSuccess)
        assertEquals(50, result.getOrNull()?.value?.length)
    }

    @Test
    fun `should create valid player name with unicode characters`() {
        val result = PlayerName.create("José García")

        assertTrue(result.isSuccess)
        assertEquals("José García", result.getOrNull()?.value)
    }

    @Test
    fun `should create valid player name with emoji`() {
        val result = PlayerName.create("Player🎮")

        assertTrue(result.isSuccess)
        assertEquals("Player🎮", result.getOrNull()?.value)
    }

    @Test
    fun `should trim leading and trailing whitespace`() {
        val result = PlayerName.create("  John Doe  ")

        assertTrue(result.isSuccess)
        assertEquals("John Doe", result.getOrNull()?.value)
    }

    @Test
    fun `should fail when input is blank`() {
        val result = PlayerName.create("")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when input is only whitespace`() {
        val result = PlayerName.create("    ")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when input is only tabs and newlines`() {
        val result = PlayerName.create("\t\n\r")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when name is too short`() {
        val result = PlayerName.create("A")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when name is too long`() {
        val input = "A".repeat(51)

        val result = PlayerName.create(input)

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should fail when trimmed result is too short`() {
        val result = PlayerName.create(" A ")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
    }

    @Test
    fun `should have value equality`() {
        val name1 = PlayerName.create("John").getOrThrow()
        val name2 = PlayerName.create("John").getOrThrow()
        val name3 = PlayerName.create("Jane").getOrThrow()

        assertEquals(name1, name2)
        assertNotEquals(name1, name3)
    }

    @Test
    fun `should preserve case sensitivity`() {
        val lower = PlayerName.create("john").getOrThrow()
        val upper = PlayerName.create("JOHN").getOrThrow()
        val mixed = PlayerName.create("John").getOrThrow()

        assertEquals("john", lower.value)
        assertEquals("JOHN", upper.value)
        assertEquals("John", mixed.value)
        assertNotEquals(lower, upper)
        assertNotEquals(lower, mixed)
    }
}