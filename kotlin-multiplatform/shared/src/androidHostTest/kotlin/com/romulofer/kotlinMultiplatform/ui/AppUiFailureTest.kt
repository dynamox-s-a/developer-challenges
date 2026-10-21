package com.romulofer.kotlinMultiplatform.ui

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import com.romulofer.kotlinMultiplatform.data.local.PlayerRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.local.ScoreRepositoryImpl
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import kotlinx.coroutines.runBlocking
import org.junit.Test
import org.koin.core.module.Module
import org.koin.dsl.module
import org.koin.mp.KoinPlatform

internal class AppUiFailureTest : AppUiTestBase() {

    private val switches = StorageSwitches()

    override val overrides: List<Module> = listOf(
        module {
            single<PlayerRepository> { FlakyPlayers(PlayerRepositoryImpl(get()), switches) }
            single<ScoreRepository> { FlakyScores(ScoreRepositoryImpl(get(), get()), switches) }
        },
    )

    private fun saveScores(vararg scores: Pair<String, Int>) = runBlocking {
        val koin = KoinPlatform.getKoin()
        val players = PlayerRepositoryImpl(koin.get())
        val repository = ScoreRepositoryImpl(koin.get(), koin.get())
        scores.forEach { (name, correct) -> repository.save(players.getOrCreate(name).id, correct, 10) }
    }

    @Test
    fun warnsWhenTheNameCannotBeSaved() {
        switches.failRegistering = true

        register("Ana")

        awaitText("Could not save your data on this device. Try again.")
        rule.onNodeWithText("Start quiz").assertIsEnabled()
    }

    @Test
    fun warnsWhenTheScoreCannotBeSaved() {
        switches.failSaving = true
        register("Ana")

        playWholeQuiz()

        awaitText("Your score could not be saved on this device.")
        rule.onNodeWithText("5/10").assertIsDisplayed()
    }

    @Test
    fun showsAnErrorWhenTheScoreboardCannotBeRead() {
        switches.failReading = true

        rule.onNodeWithContentDescription("Scoreboard").performClick()

        awaitText("Could not save your data on this device. Try again.")
    }

    @Test
    fun ranksThePlayersFromTheBestScore() {
        saveScores("Ana" to 9, "Bia" to 7, "Caio" to 5, "Duda" to 3)

        rule.onNodeWithContentDescription("Scoreboard").performClick()

        awaitText("Ana")
        listOf("Ana", "Bia", "Caio", "Duda", "9/10", "7/10", "5/10", "3/10", "1", "2", "3", "4").forEach { text ->
            rule.onNodeWithText(text).assertIsDisplayed()
        }
    }
}
