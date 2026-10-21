package com.romulofer.kotlinMultiplatform.data.local

import assertk.assertFailure
import assertk.assertThat
import assertk.assertions.isEmpty
import assertk.assertions.isEqualTo
import java.util.Map.entry
import kotlin.test.Test

class ScoreQueriesTest {
    private val database = createTestDatabase()
    private val players = database.playerQueries
    private val scores = database.scoreQueries

    private fun playerId(name: String): Long {
        players.insertIgnore(name)
        return players.selectByName(name).executeAsOne().id
    }

    private fun entry(
        playerName: String,
        correctAnswers: Long,
        playedAtEpochMillis: Long,
        totalQuestions: Long = 10,
    ) = SelectScoreboard(
        playerName = playerName,
        correctAnswers = correctAnswers,
        totalQuestions = totalQuestions,
        playedAtEpochMillis = playedAtEpochMillis,
    )

    @Test
    fun `scoreboard is empty before any score is saved`() {
        val result = scores.selectScoreboard().executeAsList()

        assertThat(result).isEmpty()
    }

    @Test
    fun `scoreboard joins player name with score data`() {
        scores.insert(playerId("Ana"), 7, 10, 1_000L)

        val result = scores.selectScoreboard().executeAsOne()

        val expectedResult = SelectScoreboard(
            playerName = "Ana",
            correctAnswers = 7,
            totalQuestions = 10,
            playedAtEpochMillis =1_000L
        )

        assertThat(result).isEqualTo(expectedResult)
    }

    @Test
    fun `scoreboard orders best score first then newest`() {
        val ana = playerId("Ana")
        val bia = playerId("Bia")
        scores.insert(ana, 5, 10, 1_000L)
        scores.insert(bia, 9, 10, 2_000L)
        scores.insert(ana, 9, 10, 3_000L)

        val result = scores.selectScoreboard().executeAsList()

        val expectedResult = listOf(
            entry(playerName = "Ana", correctAnswers = 9, playedAtEpochMillis = 3_000L),
            entry(playerName = "Bia", correctAnswers = 9, playedAtEpochMillis = 2_000L),
            entry(playerName = "Ana", correctAnswers = 5, playedAtEpochMillis = 1_000L),
        )
        assertThat(result).isEqualTo(expectedResult)
    }


    @Test
    fun `rejects more correct answers than questions`() {
        val ana = playerId("Ana")

        assertFailure { scores.insert(ana, 11, 10, 1_000L) }

        val result = scores.selectScoreboard().executeAsList()
        assertThat(result).isEmpty()
    }
}
