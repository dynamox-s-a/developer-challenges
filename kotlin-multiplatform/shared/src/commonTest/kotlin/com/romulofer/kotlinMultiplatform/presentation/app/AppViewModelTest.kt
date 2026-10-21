package com.romulofer.kotlinMultiplatform.presentation.app

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isNull
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.testutil.resetMainDispatcher
import com.romulofer.kotlinMultiplatform.testutil.useTestMainDispatcher
import dev.mokkery.answering.returns
import dev.mokkery.every
import dev.mokkery.mock
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.test.runTest
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

class AppViewModelTest {

    private val settings = mock<SettingsRepository>()
    private val navigator = Navigator()
    private val savedLanguage = MutableStateFlow(English)

    @BeforeTest
    fun setUp() {
        useTestMainDispatcher()
        every { settings.observeLanguage() } returns savedLanguage
    }

    @AfterTest
    fun tearDown() = resetMainDispatcher()

    @Test
    fun `follows the saved language`() = runTest {
        val viewModel = AppViewModel(navigator, settings)
        assertThat(viewModel.language.value).isEqualTo(English)

        savedLanguage.value = Portuguese

        assertThat(viewModel.language.value).isEqualTo(Portuguese)
    }

    @Test
    fun `exposes the navigation stack`() = runTest {
        val viewModel = AppViewModel(navigator, settings)

        navigator.showScoreboard()
        viewModel.onBack()

        assertThat(viewModel.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `has no language until the saved one is read`() = runTest {
        every { settings.observeLanguage() } returns MutableSharedFlow()

        val viewModel = AppViewModel(navigator, settings)

        assertThat(viewModel.language.value).isNull()
    }
}
