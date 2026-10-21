package com.romulofer.kotlinMultiplatform.presentation.strings

import assertk.assertThat
import assertk.assertions.contains
import assertk.assertions.isEqualTo
import assertk.assertions.isNotEmpty
import assertk.assertions.isNotEqualTo
import assertk.assertions.isSameInstanceAs
import com.romulofer.kotlinMultiplatform.domain.model.AppError.NoConnection
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Server
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Unknown
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import kotlin.test.Test

class StringsTest {

    private val languages = listOf(EnglishStrings, PortugueseStrings)

    @Test
    fun `picks the strings of the selected language`() {
        assertThat(English.strings()).isSameInstanceAs(EnglishStrings)
        assertThat(Portuguese.strings()).isSameInstanceAs(PortugueseStrings)
    }

    @Test
    fun `explains every name problem in both languages`() {
        InvalidNameReason.entries.forEach { reason ->
            languages.forEach { strings ->
                assertThat(strings.nameError(reason, 20)).isNotEmpty()
            }
            assertThat(EnglishStrings.nameError(reason, 20)).isNotEqualTo(PortugueseStrings.nameError(reason, 20))
        }
    }

    @Test
    fun `tells the name length limit`() {
        languages.forEach { strings ->
            assertThat(strings.nameError(InvalidNameReason.TooLong, 20)).contains("20")
        }
    }

    @Test
    fun `explains every error in both languages`() {
        listOf(NoConnection, Server(503), Unknown).forEach { error ->
            languages.forEach { strings -> assertThat(strings.errorMessage(error)).isNotEmpty() }
            assertThat(EnglishStrings.errorMessage(error)).isNotEqualTo(PortugueseStrings.errorMessage(error))
        }
    }

    @Test
    fun `shows the status code of a server error`() {
        languages.forEach { strings ->
            assertThat(strings.errorMessage(Server(503))).contains("503")
        }
    }

    @Test
    fun `formats the quiz progress and scores`() {
        assertThat(EnglishStrings.questionProgress(3, 10)).isEqualTo("Question 3 of 10")
        assertThat(PortugueseStrings.questionProgress(3, 10)).isEqualTo("Pergunta 3 de 10")
        assertThat(EnglishStrings.finalScore(7, 10)).isEqualTo("You scored 7 out of 10")
        assertThat(PortugueseStrings.finalScore(7, 10)).isEqualTo("Você acertou 7 de 10")
        assertThat(EnglishStrings.scoreValue(7, 10)).isEqualTo("7/10")
        assertThat(PortugueseStrings.scoreValue(7, 10)).isEqualTo("7/10")
        assertThat(PortugueseStrings.liveScore(4)).isEqualTo("Pontos: 4")
        assertThat(EnglishStrings.liveScore(4)).isEqualTo("Score: 4")
    }

    @Test
    fun `translates the main labels`() {
        assertThat(EnglishStrings.startQuiz).isNotEqualTo(PortugueseStrings.startQuiz)
        assertThat(EnglishStrings.scoreboardTitle).isEqualTo("Scoreboard")
        assertThat(PortugueseStrings.scoreboardTitle).isEqualTo("Placar")
        assertThat(EnglishStrings.languagePortuguese).isEqualTo(PortugueseStrings.languagePortuguese)
        assertThat(EnglishStrings.languageEnglish).isEqualTo(PortugueseStrings.languageEnglish)
    }
}
