package org.kaelkill.quiz.domain.model.entities

import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class PlayerTest {

    @Test
    fun `should create a valid player with a generated ID`() {
        val result = Player.create("John")

        assertTrue(result.isSuccess)
        val player = result.getOrThrow()

        assertEquals("John", player.name.value)
        assertTrue(player.id.value.isNotEmpty())
    }

    @Test
    fun `should fail to create player with invalid name`() {
        val result = Player.create("   ")

        assertTrue(result.isFailure)
    }

    @Test
    fun `should generate different IDs for different players`() {
        val player1 = Player.create("Player1").getOrThrow()
        val player2 = Player.create("Player2").getOrThrow()

        assertNotEquals(player1.id.value, player2.id.value)
    }

    @Test
    fun `should restore player from persistence ensuring ID and Name are preserved`() {
        val originalId = "existing-uuid-123"
        val originalName = "ReturnedPlayer"

        val result = Player.restore(id = originalId, name = originalName)

        assertTrue(result.isSuccess)
        val player = result.getOrThrow()

        assertEquals(originalId, player.id.value)
        assertEquals(originalName, player.name.value)
    }
}