package org.kaelkill.quiz.application.usecases

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class RegisterOrLoginPlayerUseCaseTest {

    @Test
    fun `should create new player and save it when name does not exist`() = runTest {
        val repo = FakePlayerRepository()
        val useCase = RegisterOrLoginPlayerUseCase(repo)

        val result = useCase.execute("Novato")

        assertTrue(result.isSuccess)
        val player = result.getOrThrow()

        assertEquals("Novato", player.name.value)

        val savedPlayer = repo.getByName(player.name).getOrThrow()
        assertEquals(player.id, savedPlayer?.id)
    }

    @Test
    fun `should return existing player when name already exists (Login)`() = runTest {
        val repo = FakePlayerRepository()

        val existingPlayer = Player.create("Veterano").getOrThrow()
        repo.save(existingPlayer)

        val useCase = RegisterOrLoginPlayerUseCase(repo)

        val result = useCase.execute("Veterano")

        assertTrue(result.isSuccess)
        val retrievedPlayer = result.getOrThrow()

        assertEquals(existingPlayer.id.value, retrievedPlayer.id.value)
    }

    @Test
    fun `should fail if name is empty`() = runTest {
        val useCase = RegisterOrLoginPlayerUseCase(FakePlayerRepository())
        val result = useCase.execute("   ")

        assertTrue(result.isFailure)
    }

    @Test
    fun `should fail if repository fails to save`() = runTest {
        val repo = FakePlayerRepository(failOnSave = true)
        val useCase = RegisterOrLoginPlayerUseCase(repo)

        val result = useCase.execute("Azarado")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is Exception)
    }

    class FakePlayerRepository(private val failOnSave: Boolean = false) : PlayerRepository {
        private val players = mutableListOf<Player>()

        override suspend fun save(player: Player): Result<Unit> {
            if (failOnSave) return Result.failure(Exception("DB Error"))
            players.removeAll { it.id == player.id }
            players.add(player)
            return Result.success(Unit)
        }

        override suspend fun getByName(name: PlayerName): Result<Player?> {
            val found = players.find { it.name == name }
            return Result.success(found)
        }

        override suspend fun getAll(): Result<List<Player>> = Result.success(players)
    }
}