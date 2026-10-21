package com.romulofer.kotlinMultiplatform.presentation.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.romulofer.kotlinMultiplatform.domain.model.Language
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import com.romulofer.kotlinMultiplatform.domain.util.catching
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import kotlinx.coroutines.flow.SharingStarted.Companion.WhileSubscribed
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

private const val SUBSCRIPTION_TIMEOUT_MILLIS = 5_000L

class SettingsViewModel(
    private val settings: SettingsRepository,
    private val navigator: Navigator,
) : ViewModel() {

    val language: StateFlow<Language> = settings.observeLanguage()
        .stateIn(viewModelScope, WhileSubscribed(SUBSCRIPTION_TIMEOUT_MILLIS), English)

    fun onLanguageSelected(language: Language) {
        viewModelScope.launch { catching { settings.setLanguage(language) } }
    }

    fun onBack() = navigator.back()
}
