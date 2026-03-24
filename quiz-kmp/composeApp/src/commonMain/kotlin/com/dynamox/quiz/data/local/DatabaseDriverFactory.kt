package com.dynamox.quiz.data.local

import app.cash.sqldelight.db.SqlDriver
import com.dynamox.quiz.database.QuizDatabase

interface DatabaseDriverFactory {
    fun createDriver(): SqlDriver
}

fun createDatabase(driverFactory: DatabaseDriverFactory): QuizDatabase {
    return QuizDatabase(driverFactory.createDriver())
}
