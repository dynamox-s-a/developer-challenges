package com.romulofer.kotlinMultiplatform.domain.repository

import com.romulofer.kotlinMultiplatform.domain.model.Language
import kotlinx.coroutines.flow.Flow

interface SettingsRepository {
    fun observeLanguage(): Flow<Language>
    suspend fun setLanguage(language: Language)
}
