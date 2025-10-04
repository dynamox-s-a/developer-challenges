package com.dynamox.quiz.database

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.native.NativeSqliteDriver
import co.touchlab.sqliter.DatabaseConfiguration
import co.touchlab.sqliter.NO_VERSION_CHECK

actual class DriverFactory {
    actual fun createDriver(): SqlDriver {
        return NativeSqliteDriver(DatabaseDynamoxQuiz.Schema, "DynamoxQuiz.db")
    }

    actual fun createInMemoryDriver(): SqlDriver {
        return NativeSqliteDriver(
            configuration = DatabaseConfiguration(
                name = null,
                version = NO_VERSION_CHECK,
                create = {},
                inMemory = true,
            )
        )
    }
}