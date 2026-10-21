package com.romulofer.kotlinMultiplatform.di

import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.usecase.LoadQuestionUseCase
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase
import com.romulofer.kotlinMultiplatform.presentation.app.AppViewModel
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizViewModel
import com.romulofer.kotlinMultiplatform.presentation.registration.RegistrationViewModel
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardViewModel
import com.romulofer.kotlinMultiplatform.presentation.settings.SettingsViewModel
import org.koin.core.module.dsl.viewModel
import org.koin.dsl.module

val presentationModule = module {
    single { Navigator() }

    factory { RegisterPlayerUseCase(get()) }
    factory { LoadQuestionUseCase(get()) }

    viewModel { AppViewModel(get(), get()) }
    viewModel { RegistrationViewModel(get(), get()) }
    viewModel { (player: Player) -> QuizViewModel(player, get(), get(), get(), get()) }
    viewModel { ScoreboardViewModel(get(), get()) }
    viewModel { SettingsViewModel(get(), get()) }
}
