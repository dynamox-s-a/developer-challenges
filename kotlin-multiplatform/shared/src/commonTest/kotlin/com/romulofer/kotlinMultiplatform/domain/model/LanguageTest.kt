package com.romulofer.kotlinMultiplatform.domain.model

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import kotlin.test.Test

class LanguageTest {

    @Test
    fun `finds a language by its code`() {
        assertThat(Language.fromCode("en")).isEqualTo(English)
        assertThat(Language.fromCode("pt")).isEqualTo(Portuguese)
    }

    @Test
    fun `falls back to english for an unknown code`() {
        assertThat(Language.fromCode("fr")).isEqualTo(English)
    }

    @Test
    fun `falls back to english when there is no code`() {
        assertThat(Language.fromCode(null)).isEqualTo(English)
    }

    @Test
    fun `gives every language its own code`() {
        assertThat(Language.entries.map { it.code }.toSet().size).isEqualTo(Language.entries.size)
    }
}
