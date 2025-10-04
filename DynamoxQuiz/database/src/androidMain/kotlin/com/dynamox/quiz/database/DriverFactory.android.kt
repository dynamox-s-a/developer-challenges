package com.dynamox.quiz.database

import android.content.Context
import androidx.sqlite.db.SupportSQLiteDatabase
import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.android.AndroidSqliteDriver

actual class DriverFactory(private val context: Context) {
    actual fun createDriver(): SqlDriver {
        val schema = DatabaseDynamoxQuiz.Schema
        return AndroidSqliteDriver(
            schema = schema,
            context = context,
            name = "DynamoxQuiz.db",
            callback = object : AndroidSqliteDriver.Callback(schema) {
                override fun onOpen(db: SupportSQLiteDatabase) {
                    db.execSQL("PRAGMA foreign_keys=ON;")
                }
            }
        )
    }

    actual fun createInMemoryDriver(): SqlDriver {
        val schema = DatabaseDynamoxQuiz.Schema
        return AndroidSqliteDriver(
            schema = schema,
            context = context,
            name = null,
            callback = object : AndroidSqliteDriver.Callback(schema) {
                override fun onOpen(db: SupportSQLiteDatabase) {
                    db.execSQL("PRAGMA foreign_keys=ON;")
                }
            }
        )
    }
}