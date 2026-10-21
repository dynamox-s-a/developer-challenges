package com.romulofer.kotlinMultiplatform.di

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.android.AndroidSqliteDriver
import com.romulofer.kotlinMultiplatform.data.local.QuizDatabase
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.engine.okhttp.OkHttp
import org.koin.android.ext.koin.androidContext
import org.koin.core.module.Module
import org.koin.dsl.module

actual val platformModule: Module = module {
    single<HttpClientEngine> { OkHttp.create() }
    single<SqlDriver> { AndroidSqliteDriver(QuizDatabase.Schema, androidContext(), "quiz.db") }
}
