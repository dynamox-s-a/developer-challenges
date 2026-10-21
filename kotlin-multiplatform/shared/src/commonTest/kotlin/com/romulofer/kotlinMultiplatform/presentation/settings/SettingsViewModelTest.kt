package com.romulofer.kotlinMultiplatform.presentation.settings

import app.cash.turbine.test
import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.testutil.resetMainDispatcher
import com.romulofer.kotlinMultiplatform.testutil.useTestMainDispatcher
import dev.mokkery.answering.returns
import dev.mokkery.answering.throws
import dev.mokkery.every
import dev.mokkery.everySuspend
import dev.mokkery.matcher.any
import dev.mokkery.mock
import dev.mokkery.verify.VerifyMode.Companion.exactly
import dev.mokkery.verifySuspend
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.test.runTest
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

class SettingsViewModelTest {

    private val settings = mock<SettingsRepository>()
    private val navigator = Navigator()
    private val savedLanguage = MutableStateFlow(English)

    @BeforeTest
    fun setUp() {
        useTestMainDispatcher()
        every { settings.observeLanguage() } returns savedLanguage
        everySuspend { settings.setLanguage(any()) } returns Unit
    }

    @AfterTest
    fun tearDown() = resetMainDispatcher()

    @Test
    fun `shows the saved language`() = runTest {
        savedLanguage.value = Portuguese
        val viewModel = SettingsViewModel(settings, navigator)

        viewModel.language.test {
            assertThat(expectMostRecentItem()).isEqualTo(Portuguese)
        }
    }

    @Test
    fun `saves the language the user picks`() = runTest {
        val viewModel = SettingsViewModel(settings, navigator)

        viewModel.onLanguageSelected(Portuguese)

        verifySuspend(exactly(1)) { settings.setLanguage(Portuguese) }
    }

    @Test
    fun `survives a failure while saving the language`() = runTest {
        everySuspend { settings.setLanguage(any()) } throws IllegalStateException("disk full")
        val viewModel = SettingsViewModel(settings, navigator)

        viewModel.onLanguageSelected(Portuguese)

        verifySuspend(exactly(1)) { settings.setLanguage(Portuguese) }
    }

    @Test
    fun `goes back`() = runTest {
        navigator.showSettings()
        val viewModel = SettingsViewModel(settings, navigator)

        viewModel.onBack()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }
}
