package com.romulofer.kotlinMultiplatform.di

import app.cash.sqldelight.driver.jdbc.sqlite.JdbcSqliteDriver
import assertk.assertThat
import assertk.assertions.isNotNull
import assertk.assertions.isNotSameInstanceAs
import assertk.assertions.isSameInstanceAs
import com.romulofer.kotlinMultiplatform.data.local.QuizDatabase
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import com.romulofer.kotlinMultiplatform.domain.usecase.LoadQuestionUseCase
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase
import com.romulofer.kotlinMultiplatform.presentation.app.AppViewModel
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizViewModel
import com.romulofer.kotlinMultiplatform.presentation.registration.RegistrationViewModel
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardViewModel
import com.romulofer.kotlinMultiplatform.presentation.settings.SettingsViewModel
import com.romulofer.kotlinMultiplatform.ui.FakeQuizServer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.koin.core.Koin
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.core.parameter.parametersOf
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

@OptIn(ExperimentalCoroutinesApi::class)
class PresentationModuleTest {

    private lateinit var koin: Koin

    @BeforeTest
    fun setUp() {
        Dispatchers.setMain(StandardTestDispatcher())
        val driver = { JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY).also { QuizDatabase.Schema.create(it) } }
        koin = startKoin { modules(FakeQuizServer().platformModule(driver), dataModule, presentationModule) }.koin
    }

    @AfterTest
    fun tearDown() {
        stopKoin()
        Dispatchers.resetMain()
    }

    @Test
    fun `resolves every view model`() {
        assertThat(koin.get<AppViewModel>()).isNotNull()
        assertThat(koin.get<RegistrationViewModel>()).isNotNull()
        assertThat(koin.get<ScoreboardViewModel>()).isNotNull()
        assertThat(koin.get<SettingsViewModel>()).isNotNull()
    }

    @Test
    fun `resolves the quiz view model for a player`() {
        val viewModel = koin.get<QuizViewModel> { parametersOf(Player(id = 1, name = "Ana")) }

        assertThat(viewModel).isNotNull()
    }

    @Test
    fun `resolves the use cases and settings`() {
        assertThat(koin.get<RegisterPlayerUseCase>()).isNotNull()
        assertThat(koin.get<LoadQuestionUseCase>()).isNotNull()
        assertThat(koin.get<SettingsRepository>()).isNotNull()
    }

    @Test
    fun `shares a single navigator between screens`() {
        assertThat(koin.get<Navigator>()).isSameInstanceAs(koin.get<Navigator>())
    }

    @Test
    fun `creates a new view model each time`() {
        assertThat(koin.get<RegistrationViewModel>()).isNotSameInstanceAs(koin.get<RegistrationViewModel>())
    }
}
