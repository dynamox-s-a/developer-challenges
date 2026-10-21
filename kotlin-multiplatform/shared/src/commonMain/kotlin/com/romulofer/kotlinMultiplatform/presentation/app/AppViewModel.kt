package com.romulofer.kotlinMultiplatform.presentation.app

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.romulofer.kotlinMultiplatform.domain.model.Language
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen
import kotlinx.coroutines.flow.SharingStarted.Companion.Eagerly
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn

class AppViewModel(
    private val navigator: Navigator,
    settings: SettingsRepository,
) : ViewModel() {

    val backStack: StateFlow<List<Screen>> = navigator.backStack

    val language: StateFlow<Language?> = settings.observeLanguage()
        .stateIn(viewModelScope, Eagerly, null)

    fun onBack() = navigator.back()
}
