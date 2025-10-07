package com.dynamox.quiz.database

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.native.NativeSqliteDriver
import app.cash.sqldelight.driver.native.inMemoryDriver
import co.touchlab.sqliter.DatabaseConfiguration
import co.touchlab.sqliter.NO_VERSION_CHECK

actual class DriverFactory {
    actual fun createDriver(): SqlDriver {
        return NativeSqliteDriver(
            schema = DatabaseDynamoxQuiz.Schema,
            name = "DynamoxQuiz.db",
            onConfiguration = { config ->
                config.copy(
                    extendedConfig = DatabaseConfiguration.Extended(foreignKeyConstraints = true)
                )
            }
        )
    }

    actual fun createInMemoryDriver(): SqlDriver {
        val driver = inMemoryDriver(DatabaseDynamoxQuiz.Schema)
        driver.execute(null, "PRAGMA foreign_keys=ON;", 0)
        return driver
    }
}