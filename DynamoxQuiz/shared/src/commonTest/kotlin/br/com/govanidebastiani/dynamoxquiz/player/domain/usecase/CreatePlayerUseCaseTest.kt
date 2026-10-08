package br.com.govanidebastiani.dynamoxquiz.player.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.player.data.FakePlayerRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.player.domain.exception.PlayerAlreadyExistsException
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class CreatePlayerUseCaseTest {
    private lateinit var fakePlayerRepository: FakePlayerRepositoryImpl
    private lateinit var createPlayerUseCase: CreatePlayerUseCase

    @BeforeTest
    fun setUp() {
        fakePlayerRepository = FakePlayerRepositoryImpl()
        createPlayerUseCase = CreatePlayerUseCase(fakePlayerRepository)
    }

    @Test
    fun `quando o apelido for valido deve salvar no repositorio`() = runTest {
        val playerNickname =  "Geovani"
        val result = createPlayerUseCase(playerNickname = playerNickname)

        assertTrue(result.isSuccess)
        assertEquals(1, fakePlayerRepository.savedPlayers.size)
        assertEquals(playerNickname, fakePlayerRepository.fetchPlayerByNickname(playerNickname))
    }

    @Test
    fun `quando o apelido contiver espacos extras deve salvar sanitizado`() = runTest {
        val rawNickname = "  Geovani  "
        val expectedNickname = "Geovani"

        val result = createPlayerUseCase(playerNickname = rawNickname)

        assertTrue(result.isSuccess)
        assertEquals(1, fakePlayerRepository.savedPlayers.size)
        assertEquals(expectedNickname, fakePlayerRepository.savedPlayers.first().nickname)
    }

    @Test
    fun `quando o apelido for vazio deve retornar falha`() = runTest {
        val result = createPlayerUseCase(playerNickname = "   ")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is IllegalArgumentException)
        assertEquals(0, fakePlayerRepository.savedPlayers.size)
    }

    @Test
    fun `quando o jogador ja existir deve retornar falha com PlayerAlreadyExistsException`() = runTest {
        val playerNickname = "Geovani"
        createPlayerUseCase(playerNickname = playerNickname)

        val duplicateResult = createPlayerUseCase(playerNickname = playerNickname)

        assertTrue(duplicateResult.isFailure)
        assertTrue(duplicateResult.exceptionOrNull() is PlayerAlreadyExistsException)
        assertEquals(1, fakePlayerRepository.savedPlayers.size)
    }
}