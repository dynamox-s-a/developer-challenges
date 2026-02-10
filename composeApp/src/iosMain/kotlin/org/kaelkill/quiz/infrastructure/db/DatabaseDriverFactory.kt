package org.kaelkill.quiz.infrastructure.db

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.native.NativeSqliteDriver

actual class DatabaseDriverFactory {
    actual fun createDriver(): SqlDriver {
        return NativeSqliteDriver(QuizDatabase.Schema, "quiz.db")
    }
}
