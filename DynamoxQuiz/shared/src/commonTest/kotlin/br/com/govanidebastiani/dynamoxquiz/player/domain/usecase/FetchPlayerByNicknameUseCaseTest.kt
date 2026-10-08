package br.com.govanidebastiani.dynamoxquiz.player.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.player.data.FakePlayerRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.player.domain.Player
import br.com.govanidebastiani.dynamoxquiz.player.domain.usecase.FetchPlayerByNicknameUseCase
import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class FetchPlayerByNicknameUseCaseTest {
    private lateinit var fakePlayerRepository: FakePlayerRepositoryImpl
    private lateinit var fetchPlayerByNicknameUseCase: FetchPlayerByNicknameUseCase

    @BeforeTest
    fun setup() {
        fakePlayerRepository = FakePlayerRepositoryImpl()
        fetchPlayerByNicknameUseCase = FetchPlayerByNicknameUseCase(fakePlayerRepository)
    }

    @Test
    fun `se o jogador existir, deve retornar o apelido`() = runTest {
        val nickname = "Geovani"
        fakePlayerRepository.createPlayer(Player(nickname = nickname, createdAt = 1000L))

        val result = fetchPlayerByNicknameUseCase(nickname)

        assertEquals(nickname, result)
    }

    @Test
    fun `quando o jogador nao existir deve retornar null`() = runTest {
        val result = fetchPlayerByNicknameUseCase("TestGeovani")

        assertNull(result)
    }

    @Test
    fun `quando o apelido possui espaços, os mesmos devem ser removidos`() = runTest {
        val nickname = "Geovani"
        fakePlayerRepository.createPlayer(Player(nickname = nickname, createdAt = 1000L))

        val result = fetchPlayerByNicknameUseCase("  Geovani  ")

        assertEquals(nickname, result)
    }

    @Test
    fun `se o apelido for vazio, deve retornar null`() = runTest {
        val result = fetchPlayerByNicknameUseCase("   ")

        assertNull(result)
    }
}