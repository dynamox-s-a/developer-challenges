package com.romulofer.kotlinMultiplatform.data.local

import app.cash.turbine.test
import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

@OptIn(ExperimentalCoroutinesApi::class)
class SettingsRepositoryImplTest {

    private fun TestScope.repository() =
        SettingsRepositoryImpl(createTestDatabase(), UnconfinedTestDispatcher(testScheduler))

    @Test
    fun `defaults to english when nothing was saved`() = runTest {
        val result = repository().observeLanguage().first()

        assertThat(result).isEqualTo(English)
    }

    @Test
    fun `returns the saved language`() = runTest {
        val repository = repository()
        repository.setLanguage(Portuguese)

        val result = repository.observeLanguage().first()

        assertThat(result).isEqualTo(Portuguese)
    }

    @Test
    fun `overwrites the previous language`() = runTest {
        val repository = repository()
        repository.setLanguage(Portuguese)
        repository.setLanguage(English)

        val result = repository.observeLanguage().first()

        assertThat(result).isEqualTo(English)
    }

    @Test
    fun `emits again when the language changes`() = runTest {
        val repository = repository()

        repository.observeLanguage().test {
            assertThat(awaitItem()).isEqualTo(English)

            repository.setLanguage(Portuguese)

            assertThat(awaitItem()).isEqualTo(Portuguese)
            cancelAndIgnoreRemainingEvents()
        }
    }
}
