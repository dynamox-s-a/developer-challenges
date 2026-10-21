package com.romulofer.kotlinMultiplatform.data.local

import app.cash.sqldelight.coroutines.asFlow
import app.cash.sqldelight.coroutines.mapToOneOrNull
import com.romulofer.kotlinMultiplatform.domain.model.Language
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

private const val LANGUAGE_KEY = "language"

class SettingsRepositoryImpl(
    private val database: QuizDatabase,
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default,
) : SettingsRepository {

    override fun observeLanguage(): Flow<Language> =
        database.settingQueries
            .selectValue(LANGUAGE_KEY)
            .asFlow()
            .mapToOneOrNull(dispatcher)
            .map { Language.fromCode(it) }

    override suspend fun setLanguage(language: Language) {
        withContext(dispatcher) {
            database.settingQueries.upsert(LANGUAGE_KEY, language.code)
        }
    }
}
