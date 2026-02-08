package org.kaelkill.quiz.infrastructure.repositories

import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

class InMemoryPlayerRepositoryTest {

    private fun createRepository() = InMemoryPlayerRepository()

    private fun createPlayer(name: String): Player {
        return Player.Companion.create(name).getOrThrow()
    }

    @Test
    fun `should save a player`() = runTest {
        val repo = createRepository()
        val player = createPlayer("John")

        val result = repo.save(player)

        assertTrue(result.isSuccess)
    }

    @Test
    fun `should find player by name after saving`() = runTest {
        val repo = createRepository()
        val player = createPlayer("John")
        repo.save(player)

        val result = repo.getByName(PlayerName.Companion.create("John").getOrThrow())

        assertTrue(result.isSuccess)
        assertEquals("John", result.getOrThrow()?.name?.value)
    }

    @Test
    fun `should return null when player not found by name`() = runTest {
        val repo = createRepository()

        val result = repo.getByName(PlayerName.Companion.create("Nobody").getOrThrow())

        assertTrue(result.isSuccess)
        assertNull(result.getOrThrow())
    }
    
    @Test
    fun `should return empty list when no players`() = runTest {
        val repo = createRepository()

        val result = repo.getAll()

        assertTrue(result.isSuccess)
        assertEquals(0, result.getOrThrow().size)
    }

    @Test
    fun `should return all saved players`() = runTest {
        val repo = createRepository()
        repo.save(createPlayer("John"))
        repo.save(createPlayer("Jane"))

        val result = repo.getAll()

        assertTrue(result.isSuccess)
        assertEquals(2, result.getOrThrow().size)
    }

    @Test
    fun `should overwrite player with same name on save`() = runTest {
        val repo = createRepository()
        repo.save(createPlayer("John"))
        repo.save(createPlayer("John"))

        val result = repo.getAll()

        assertTrue(result.isSuccess)
        assertEquals(1, result.getOrThrow().size)
    }
}