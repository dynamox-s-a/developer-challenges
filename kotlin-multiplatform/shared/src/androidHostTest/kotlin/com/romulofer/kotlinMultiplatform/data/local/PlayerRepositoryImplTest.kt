package com.romulofer.kotlinMultiplatform.data.local

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isNotEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.Player
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlin.test.Test
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest

@OptIn(ExperimentalCoroutinesApi::class)
class PlayerRepositoryImplTest {

    private fun TestScope.repository() =
        PlayerRepositoryImpl(createTestDatabase(), UnconfinedTestDispatcher(testScheduler))

    @Test
    fun `creates a player when the name is new`() = runTest {
        val result = repository().getOrCreate("Ana")

        assertThat(result).isEqualTo(Player(id = 1, name = "Ana"))
    }

    @Test
    fun `returns the same player for the same name`() = runTest {
        val repository = repository()

        val first = repository.getOrCreate("Ana")
        val second = repository.getOrCreate("Ana")

        assertThat(second).isEqualTo(first)
    }

    @Test
    fun `returns the stored player when the name differs only by case`() = runTest {
        val repository = repository()

        val first = repository.getOrCreate("Ana")
        val second = repository.getOrCreate("ANA")

        assertThat(second).isEqualTo(first)
        assertThat(second.name).isEqualTo("Ana")
    }

    @Test
    fun `creates different players for different names`() = runTest {
        val repository = repository()

        val ana = repository.getOrCreate("Ana")
        val bia = repository.getOrCreate("Bia")

        assertThat(bia.id).isNotEqualTo(ana.id)
    }
}