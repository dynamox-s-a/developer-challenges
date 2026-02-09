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

    @Test
    fun `should start with empty scores`() {
        val player = Player.create("John").getOrThrow()

        assertTrue(player.scores.isEmpty())
    }

    @Test
    fun `should add score and return new player`() {
        val player = Player.create("John").getOrThrow()

        val updated = player.addScore(7)

        assertEquals(1, updated.scores.size)
        assertEquals(7, updated.scores.first())
    }

    @Test
    fun `should accumulate multiple scores`() {
        val player = Player.create("John").getOrThrow()

        val updated = player.addScore(7).addScore(10).addScore(3)

        assertEquals(3, updated.scores.size)
        assertEquals(listOf(7, 10, 3), updated.scores)
    }

    @Test
    fun `should not modify original player when adding score`() {
        val player = Player.create("John").getOrThrow()

        player.addScore(7)

        assertTrue(player.scores.isEmpty())
    }
}