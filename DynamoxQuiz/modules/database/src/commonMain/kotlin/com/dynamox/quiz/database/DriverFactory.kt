package com.dynamox.quiz.database

import app.cash.sqldelight.adapter.primitive.IntColumnAdapter
import app.cash.sqldelight.db.SqlDriver

expect class DriverFactory {
    fun createDriver(): SqlDriver

    fun createInMemoryDriver(): SqlDriver
}

fun createDatabase(driver: SqlDriver): DatabaseDynamoxQuiz {
    val database = DatabaseDynamoxQuiz(
        driver = driver,
        UserEntityAdapter = UserEntity.Adapter(
            idAdapter = DatabaseAdapters.UuidAdapter,
        ),
        QuizScoreAdapter = QuizScore.Adapter(
            idAdapter = DatabaseAdapters.UuidAdapter,
            userIdAdapter = DatabaseAdapters.UuidAdapter,
            scoreAdapter = IntColumnAdapter,
        ),
    )
    return database
}