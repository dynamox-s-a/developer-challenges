package com.romulofer.kotlinMultiplatform.di

import app.cash.sqldelight.db.SqlDriver
import com.romulofer.kotlinMultiplatform.data.local.PlayerRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.local.QuizDatabase
import com.romulofer.kotlinMultiplatform.data.local.ScoreRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.local.SettingsRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.remote.QuizApi
import com.romulofer.kotlinMultiplatform.data.remote.QuizRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.remote.createHttpClient
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import io.ktor.client.HttpClient
import org.koin.dsl.module
import kotlin.time.Clock


private const val QUIZ_API_BASE_URL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app"

val dataModule = module {
    single<Clock> { Clock.System }
    single<HttpClient> { createHttpClient(engine = get(), baseUrl = QUIZ_API_BASE_URL) }
    single { QuizApi(get()) }
    single<QuizRepository> { QuizRepositoryImpl(get()) }

    single { QuizDatabase(get<SqlDriver>()) }
    single<PlayerRepository> { PlayerRepositoryImpl(get()) }
    single<ScoreRepository> { ScoreRepositoryImpl(get(), get()) }
    single<SettingsRepository> { SettingsRepositoryImpl(get()) }
}