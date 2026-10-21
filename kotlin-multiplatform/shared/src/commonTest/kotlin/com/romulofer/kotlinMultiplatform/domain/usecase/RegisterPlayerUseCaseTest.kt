package com.romulofer.kotlinMultiplatform.domain.usecase

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.Blank
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.TooLong
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.Invalid
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.Registered
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.StorageFailure
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase.Companion.MAX_NAME_LENGTH
import dev.mokkery.answering.returns
import dev.mokkery.answering.throws
import dev.mokkery.everySuspend
import dev.mokkery.matcher.any
import dev.mokkery.mock
import dev.mokkery.verify.VerifyMode.Companion.exactly
import dev.mokkery.verifySuspend
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

class RegisterPlayerUseCaseTest {

    private val players = mock<PlayerRepository>()
    private val registerPlayer = RegisterPlayerUseCase(players)

    @Test
    fun `rejects an empty name`() = runTest {
        val result = registerPlayer("")

        assertThat(result).isEqualTo(Invalid(Blank))
        verifySuspend(exactly(0)) { players.getOrCreate(any()) }
    }

    @Test
    fun `rejects a name with only spaces`() = runTest {
        val result = registerPlayer("   ")

        assertThat(result).isEqualTo(Invalid(Blank))
        verifySuspend(exactly(0)) { players.getOrCreate(any()) }
    }

    @Test
    fun `rejects a name longer than the limit`() = runTest {
        val result = registerPlayer("a".repeat(MAX_NAME_LENGTH + 1))

        assertThat(result).isEqualTo(Invalid(TooLong))
        verifySuspend(exactly(0)) { players.getOrCreate(any()) }
    }

    @Test
    fun `accepts a name exactly at the limit`() = runTest {
        val name = "a".repeat(MAX_NAME_LENGTH)
        val player = Player(id = 1, name = name)
        everySuspend { players.getOrCreate(name) } returns player

        val result = registerPlayer(name)

        assertThat(result).isEqualTo(Registered(player))
    }

    @Test
    fun `trims the name before saving it`() = runTest {
        val player = Player(id = 1, name = "Ana")
        everySuspend { players.getOrCreate("Ana") } returns player

        val result = registerPlayer("  Ana  ")

        assertThat(result).isEqualTo(Registered(player))
        verifySuspend { players.getOrCreate("Ana") }
    }

    @Test
    fun `reports a storage failure when the repository throws`() = runTest {
        everySuspend { players.getOrCreate("Ana") } throws IllegalStateException("disk full")

        val result = registerPlayer("Ana")

        assertThat(result).isEqualTo(StorageFailure)
    }
}
