package com.romulofer.kotlinMultiplatform.di

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.jdbc.sqlite.JdbcSqliteDriver
import assertk.assertThat
import assertk.assertions.isNotNull
import com.romulofer.kotlinMultiplatform.data.local.QuizDatabase
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respondOk
import kotlin.test.AfterTest
import kotlin.test.Test
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.dsl.module
import org.koin.mp.KoinPlatformTools   // see note below

class DataModuleTest {

    private val fakePlatformModule = module {
        single<HttpClientEngine> { MockEngine { respondOk() } }
        single<SqlDriver> {
            JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY).also { QuizDatabase.Schema.create(it) }
        }
    }

    @AfterTest
    fun tearDown() = stopKoin()

    @Test
    fun `resolves every repository from the graph`() {
        val koin = startKoin { modules(fakePlatformModule, dataModule) }.koin

        assertThat(koin.get<QuizRepository>()).isNotNull()
        assertThat(koin.get<PlayerRepository>()).isNotNull()
        assertThat(koin.get<ScoreRepository>()).isNotNull()
    }
}
