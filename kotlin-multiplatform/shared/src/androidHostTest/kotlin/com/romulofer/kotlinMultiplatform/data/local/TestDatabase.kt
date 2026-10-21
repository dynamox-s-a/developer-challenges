package com.romulofer.kotlinMultiplatform.data.local

import app.cash.sqldelight.driver.jdbc.sqlite.JdbcSqliteDriver

internal fun createTestDatabase(): QuizDatabase {
    val driver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY)
    QuizDatabase.Schema.create(driver)
    return QuizDatabase(driver)
}