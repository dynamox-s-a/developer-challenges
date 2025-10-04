package com.dynamox.quiz.database

import app.cash.sqldelight.db.SqlDriver

expect class DriverFactory {
    fun createDriver(): SqlDriver

    fun createInMemoryDriver(): SqlDriver
}

fun createDatabase(driver: SqlDriver): DatabaseDynamoxQuiz {
    val database = DatabaseDynamoxQuiz(
        driver = driver,
        UserAdapter = User.Adapter(
            idAdapter = DatabaseAdapters.UuidAdapter,
        )
    )
    return database
}