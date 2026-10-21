package com.romulofer.kotlinMultiplatform.data.local

import app.cash.turbine.test
import assertk.assertThat
import assertk.assertions.hasSize
import assertk.assertions.isEmpty
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import kotlin.test.Test
import kotlin.time.Instant
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest

@OptIn(ExperimentalCoroutinesApi::class)
class ScoreRepositoryImplTest {

    private val clock = FakeClock(Instant.fromEpochMilliseconds(1_000L))

    private data class Fixture(val players: PlayerRepositoryImpl, val scores: ScoreRepositoryImpl)

    private fun TestScope.fixture(): Fixture {
        val database = createTestDatabase()
        val dispatcher = UnconfinedTestDispatcher(testScheduler)
        return Fixture(
            players = PlayerRepositoryImpl(database, dispatcher),
            scores = ScoreRepositoryImpl(database, clock, dispatcher),
        )
    }

    @Test
    fun `saves a score stamped with the clock time`() = runTest {
        val (players, scores) = fixture()
        val ana = players.getOrCreate("Ana")
        clock.current = Instant.fromEpochMilliseconds(5_000L)

        scores.save(ana.id, correct = 7, total = 10)

        val result = scores.observeScoreboard().first()
        val expectedResult = listOf(
            ScoreboardEntry(
                playerName = "Ana",
                correctAnswers = 7,
                totalQuestions = 10,
                playedAtEpochMillis = 5_000L,
            ),
        )
        assertThat(result).isEqualTo(expectedResult)
    }

    @Test
    fun `ranks the newer score first when scores tie`() = runTest {
        val (players, scores) = fixture()
        val ana = players.getOrCreate("Ana")
        val bia = players.getOrCreate("Bia")

        clock.current = Instant.fromEpochMilliseconds(1_000L)
        scores.save(ana.id, correct = 9, total = 10)
        clock.current = Instant.fromEpochMilliseconds(2_000L)
        scores.save(bia.id, correct = 9, total = 10)

        val result = scores.observeScoreboard().first().map { it.playerName }

        assertThat(result).isEqualTo(listOf("Bia", "Ana"))
    }

    @Test
    fun `scoreboard emits again when a score is saved`() = runTest {
        val (players, scores) = fixture()
        val ana = players.getOrCreate("Ana")

        scores.observeScoreboard().test {
            assertThat(awaitItem()).isEmpty()

            scores.save(ana.id, correct = 3, total = 5)

            assertThat(awaitItem()).hasSize(1)
            cancelAndIgnoreRemainingEvents()
        }
    }
}